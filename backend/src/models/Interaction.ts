import mongoose, { Document, Schema } from "mongoose";

// Tracks how a user interacts with listings (view, save, apply) so the
// AI recommendation engine can improve suggestions over time.
export interface IInteraction extends Document {
  user: mongoose.Types.ObjectId;
  university: mongoose.Types.ObjectId;
  type: "view" | "save" | "apply" | "dismiss";
  createdAt: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    university: { type: Schema.Types.ObjectId, ref: "University", required: true },
    type: { type: String, enum: ["view", "save", "apply", "dismiss"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IInteraction>("Interaction", InteractionSchema);
