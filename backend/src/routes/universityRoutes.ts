import { Router } from "express";
import {
  listUniversities,
  getUniversity,
  createUniversity,
  listMyUniversities,
  deleteUniversity,
} from "../controllers/universityController";
import { requireAuth, optionalAuth } from "../middleware/auth";
import reviewRoutes from "./reviewRoutes";

const router = Router();

// Order matters: /mine must come before /:id so it isn't parsed as an id
router.get("/mine", requireAuth, listMyUniversities);
router.get("/", listUniversities);
router.get("/:id", optionalAuth, getUniversity);
router.post("/", requireAuth, createUniversity);
router.delete("/:id", requireAuth, deleteUniversity);

router.use("/:id/reviews", reviewRoutes);

export default router;
