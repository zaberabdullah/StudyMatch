import { Response } from "express";
import { z } from "zod";
import University from "../models/University";
import Interaction from "../models/Interaction";
import { AuthRequest } from "../middleware/auth";

// GET /api/universities  — search, filter (>=2 fields), sort, pagination
export async function listUniversities(req: AuthRequest, res: Response) {
  const {
    search,
    country,
    maxTuition,
    minRating,
    scholarshipAvailable,
    field,
    sortBy = "ranking",
    order = "asc",
    page = "1",
    limit = "12",
  } = req.query as Record<string, string>;

  const query: any = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (country) {
    query.country = country; // filter field 1
  }
  if (maxTuition) {
    query.tuitionUSD = { $lte: Number(maxTuition) }; // filter field 2
  }
  if (minRating) {
    query.rating = { ...(query.rating || {}), $gte: Number(minRating) };
  }
  if (scholarshipAvailable === "true") {
    query.scholarshipAvailable = true;
  }
  if (field) {
    query.courses = { $regex: field, $options: "i" };
  }

  const sortableFields = ["ranking", "tuitionUSD", "rating", "applicationDeadline"];
  const sortField = sortableFields.includes(sortBy) ? sortBy : "ranking";
  const sortOrder = order === "desc" ? -1 : 1;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    University.find(query).sort({ [sortField]: sortOrder }).skip(skip).limit(limitNum),
    University.countDocuments(query),
  ]);

  res.json({
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

// GET /api/universities/:id — public details page + related items
export async function getUniversity(req: AuthRequest, res: Response) {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ message: "University not found." });

  if (req.userId) {
    await Interaction.create({ user: req.userId, university: uni._id, type: "view" });
  }

  const related = await University.find({
    _id: { $ne: uni._id },
    country: uni.country,
  }).limit(4);

  res.json({ university: uni, related });
}

const universitySchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  city: z.string().min(2),
  shortDescription: z.string().min(10).max(200),
  fullDescription: z.string().min(20),
  imageUrl: z.string().url().optional().or(z.literal("")),
  tuitionUSD: z.coerce.number().positive(),
  livingCostUSD: z.coerce.number().nonnegative().optional(),
  ranking: z.coerce.number().positive().optional(),
  courses: z.array(z.string()).optional(),
  minIELTS: z.coerce.number().min(0).max(9).optional(),
  minGPA: z.coerce.number().min(0).max(4).optional(),
  scholarshipAvailable: z.boolean().optional(),
  applicationDeadline: z.coerce.date(),
  intakeSeasons: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// POST /api/universities — protected: add item
export async function createUniversity(req: AuthRequest, res: Response) {
  const parsed = universitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  const uni = await University.create({
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
    createdBy: req.userId,
  });

  res.status(201).json({ university: uni });
}

// GET /api/universities/mine — protected: manage page
export async function listMyUniversities(req: AuthRequest, res: Response) {
  const items = await University.find({ createdBy: req.userId }).sort({ createdAt: -1 });
  res.json({ items });
}

// DELETE /api/universities/:id — protected: only owner or admin
export async function deleteUniversity(req: AuthRequest, res: Response) {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ message: "University not found." });

  if (uni.createdBy.toString() !== req.userId && req.userRole !== "admin") {
    return res.status(403).json({ message: "You can only delete listings you created." });
  }

  await uni.deleteOne();
  res.json({ message: "Listing deleted successfully." });
}
