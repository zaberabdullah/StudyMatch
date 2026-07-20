import OpenAI from "openai";

// Works with any OpenAI-compatible endpoint: OpenAI, Groq, Together AI,
// Ollama (local), etc. Just change AI_BASE_URL and AI_MODEL in .env
export const aiClient = new OpenAI({
  apiKey: process.env.AI_API_KEY || "",
  baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
});

export const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
