import { Response } from "express";
import { z } from "zod";
import { aiClient, AI_MODEL } from "../config/ai";
import University from "../models/University";
import Interaction from "../models/Interaction";
import ChatMessage from "../models/ChatMessage";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

/* -------------------------------------------------------------------------
 * FEATURE A: AI Smart Recommendation Engine
 * Context-aware: uses the student's profile + past interactions (views,
 * saves, applies) to narrow a candidate set, then asks the LLM to reason
 * about the best matches and explain WHY each one fits. Supports refinement
 * via free-text filters ("cheaper", "no IELTS requirement", etc).
 * ---------------------------------------------------------------------- */

const recommendSchema = z.object({
  ieltsScore: z.coerce.number().min(0).max(9).optional(),
  gpa: z.coerce.number().min(0).max(4).optional(),
  budgetUSD: z.coerce.number().positive().optional(),
  preferredCountries: z.array(z.string()).optional(),
  fieldOfInterest: z.string().optional(),
  refinement: z.string().optional(), // free-text, e.g. "prefer smaller cities"
});

export async function getRecommendations(req: AuthRequest, res: Response) {
  const parsed = recommendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const input = parsed.data;

  // 1. Build a candidate pool with hard filters (budget ceiling, min scores)
  const candidateQuery: any = {};
  if (input.budgetUSD) candidateQuery.tuitionUSD = { $lte: input.budgetUSD * 1.15 };
  if (input.ieltsScore) candidateQuery.minIELTS = { $lte: input.ieltsScore + 0.5 };
  if (input.preferredCountries?.length) candidateQuery.country = { $in: input.preferredCountries };

  let candidates = await University.find(candidateQuery).limit(25);
  if (candidates.length < 5) {
    // widen the pool if too restrictive
    candidates = await University.find({}).limit(25);
  }

  // 2. Pull recent interactions so the model learns from past behavior
  const recentInteractions = await Interaction.find({ user: req.userId })
    .sort({ createdAt: -1 })
    .limit(15)
    .populate("university", "name country tags");

  const interactionSummary = recentInteractions
    .map((i: any) => `${i.type}: ${i.university?.name} (${i.university?.country})`)
    .join("; ") || "No prior interactions yet.";

  // 3. Ask the LLM to reason over candidates and return structured JSON
  const systemPrompt = `You are StudyMatch's university matching engine. You receive a student profile,
their interaction history, and a candidate list of real universities. Select the best 6 matches and
return ONLY valid JSON (no markdown, no preamble) in this exact shape:
{"recommendations":[{"universityId":"...","matchScore":0-100,"reason":"1-2 sentence reason referencing the student's specific profile"}]}
Only use universityId values that appear in the candidate list. Prioritize fit on budget, academic
requirements, field of interest, preferred countries, and the refinement note if given.`;

  const userPrompt = `STUDENT PROFILE:
- IELTS: ${input.ieltsScore ?? "not provided"}
- GPA: ${input.gpa ?? "not provided"}
- Budget (USD/year): ${input.budgetUSD ?? "not provided"}
- Preferred countries: ${input.preferredCountries?.join(", ") || "any"}
- Field of interest: ${input.fieldOfInterest || "not specified"}
- Refinement request: ${input.refinement || "none"}

RECENT INTERACTIONS (for learning preferences over time):
${interactionSummary}

CANDIDATE UNIVERSITIES (JSON):
${JSON.stringify(
  candidates.map((c) => ({
    id: c._id,
    name: c.name,
    country: c.country,
    tuitionUSD: c.tuitionUSD,
    minIELTS: c.minIELTS,
    minGPA: c.minGPA,
    courses: c.courses,
    scholarshipAvailable: c.scholarshipAvailable,
    ranking: c.ranking,
  }))
)}`;

  try {
    const completion = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsedResult = JSON.parse(raw) as {
      recommendations: { universityId: string; matchScore: number; reason: string }[];
    };

    // Merge AI reasoning with full university documents for the frontend
    const byId = new Map(candidates.map((c) => [c._id.toString(), c]));
    const enriched = parsedResult.recommendations
      .filter((r) => byId.has(r.universityId))
      .map((r) => ({
        university: byId.get(r.universityId),
        matchScore: r.matchScore,
        reason: r.reason,
      }));

    res.json({ recommendations: enriched });
  } catch (err) {
    console.error("[ai] recommendation error", err);
    res.status(502).json({ message: "AI recommendation service is temporarily unavailable." });
  }
}

/* -------------------------------------------------------------------------
 * FEATURE B: AI Chat Assistant
 * Conversational, app-aware assistant. Persists history per session so it
 * can do follow-up reasoning, and returns 2-3 suggested follow-up prompts.
 * ---------------------------------------------------------------------- */

const chatSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
});

export async function chatWithAssistant(req: AuthRequest, res: Response) {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { sessionId, message } = parsed.data;

  const user = await User.findById(req.userId);
  const history = await ChatMessage.find({ user: req.userId, sessionId })
    .sort({ createdAt: 1 })
    .limit(20);

  await ChatMessage.create({ user: req.userId, sessionId, role: "user", content: message });

  const systemPrompt = `You are the StudyMatch AI assistant, embedded in a study-abroad matching platform.
You help students understand universities, admission requirements, scholarships, and how to use the app
(searching /explore, filtering, saving universities, applying via /items/add for admins, tracking listings
in /items/manage). Keep answers concise and practical. If the student mentions IELTS/GPA/budget, reason
about which countries or program types typically fit. Known student profile: ${JSON.stringify(user?.profile || {})}.`;

  const conversation = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
    { role: "user" as const, content: message },
  ];

  try {
    const completion = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: conversation,
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    await ChatMessage.create({ user: req.userId, sessionId, role: "assistant", content: reply });

    // Ask the model for quick follow-up suggestions (kept lightweight)
    const followUps = await aiClient.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Given the assistant's last reply, suggest exactly 3 short follow-up questions the student " +
            'might ask next. Return ONLY valid JSON: {"followUps":["...","...","..."]}',
        },
        { role: "user", content: reply },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(followUps.choices[0]?.message?.content || "{}").followUps || [];
    } catch {
      suggestions = [];
    }

    res.json({ reply, suggestedFollowUps: suggestions });
  } catch (err) {
    console.error("[ai] chat error", err);
    res.status(502).json({ message: "AI assistant is temporarily unavailable." });
  }
}

export async function getChatHistory(req: AuthRequest, res: Response) {
  const { sessionId } = req.params;
  const history = await ChatMessage.find({ user: req.userId, sessionId }).sort({ createdAt: 1 });
  res.json({ history });
}
