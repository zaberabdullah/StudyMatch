import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getRecommendations, chatWithAssistant, getChatHistory } from "../controllers/aiController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// AI calls cost money — rate limit to prevent abuse
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: "Too many AI requests. Please wait a moment and try again." },
});

router.use(requireAuth, aiLimiter);

router.post("/recommendations", getRecommendations);
router.post("/chat", chatWithAssistant);
router.get("/chat/:sessionId", getChatHistory);

export default router;
