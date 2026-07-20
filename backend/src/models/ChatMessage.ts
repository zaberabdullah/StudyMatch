import mongoose, { Document, Schema } from "mongoose";

export interface IChatMessage extends Document {
  user: mongoose.Types.ObjectId;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
