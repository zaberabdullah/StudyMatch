import { Router } from "express";
import { listReviews, createReview, deleteReview } from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";

// Mounted at /api/universities/:id/reviews (mergeParams gives access to :id)
const router = Router({ mergeParams: true });

router.get("/", listReviews);
router.post("/", requireAuth, createReview);
router.delete("/:reviewId", requireAuth, deleteReview);

export default router;
