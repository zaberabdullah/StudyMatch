import { Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import Review from "../models/Review";
import University from "../models/University";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

// Recompute a university's aggregate rating + review count from actual reviews
async function recomputeRating(universityId: string) {
  const stats = await Review.aggregate([
    { $match: { university: new mongoose.Types.ObjectId(universityId) } },
    { $group: { _id: "$university", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const avgRating = stats[0]?.avgRating ?? 0;
  const count = stats[0]?.count ?? 0;

  await University.findByIdAndUpdate(universityId, {
    rating: avgRating ? Math.round(avgRating * 10) / 10 : 0,
    reviewCount: count,
  });
}

// GET /api/universities/:id/reviews
export async function listReviews(req: AuthRequest, res: Response) {
  const reviews = await Review.find({ university: req.params.id }).sort({ createdAt: -1 });
  res.json({ reviews });
}

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(5, "Review must be at least 5 characters").max(1000),
});

// POST /api/universities/:id/reviews — protected, one per student per university
export async function createReview(req: AuthRequest, res: Response) {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ message: "University not found." });

  const existing = await Review.findOne({ university: req.params.id, user: req.userId });
  if (existing) {
    return res.status(409).json({ message: "You've already reviewed this university. Edit or delete your existing review instead." });
  }

  const user = await User.findById(req.userId);

  const review = await Review.create({
    university: req.params.id,
    user: req.userId,
    userName: user?.name || "Anonymous student",
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });

  await recomputeRating(req.params.id);

  res.status(201).json({ review });
}

// DELETE /api/universities/:id/reviews/:reviewId — protected, own review only
export async function deleteReview(req: AuthRequest, res: Response) {
  const review = await Review.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ message: "Review not found." });

  if (review.user.toString() !== req.userId && req.userRole !== "admin") {
    return res.status(403).json({ message: "You can only delete your own review." });
  }

  await review.deleteOne();
  await recomputeRating(req.params.id);

  res.json({ message: "Review deleted." });
}
