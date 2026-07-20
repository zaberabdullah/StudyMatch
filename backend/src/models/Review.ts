import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  university: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    university: { type: Schema.Types.ObjectId, ref: "University", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// One review per student per university
ReviewSchema.index({ university: 1, user: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
