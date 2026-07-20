import mongoose, { Document, Schema } from "mongoose";

export interface IUniversity extends Document {
  name: string;
  country: string;
  city: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  gallery: string[];
  tuitionUSD: number;
  livingCostUSD: number;
  ranking: number;
  rating: number;
  reviewCount: number;
  courses: string[];
  minIELTS: number;
  minGPA: number;
  scholarshipAvailable: boolean;
  applicationDeadline: Date;
  intakeSeasons: string[];
  tags: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const UniversitySchema = new Schema<IUniversity>(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, index: true },
    city: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 200 },
    fullDescription: { type: String, required: true },
    imageUrl: { type: String, required: true },
    gallery: [{ type: String }],
    tuitionUSD: { type: Number, required: true, index: true },
    livingCostUSD: { type: Number, default: 0 },
    ranking: { type: Number, default: 9999 },
    rating: { type: Number, default: 4.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    courses: [{ type: String }],
    minIELTS: { type: Number, default: 6.0 },
    minGPA: { type: Number, default: 2.5 },
    scholarshipAvailable: { type: Boolean, default: false },
    applicationDeadline: { type: Date, required: true },
    intakeSeasons: [{ type: String }],
    tags: [{ type: String, index: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

UniversitySchema.index({ name: "text", country: "text", city: "text", tags: "text" });

export default mongoose.model<IUniversity>("University", UniversitySchema);
