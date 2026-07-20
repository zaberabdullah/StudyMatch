import mongoose, { Document, Schema } from "mongoose";

export interface IUserProfile {
  ieltsScore?: number;
  gpa?: number;
  budgetUSD?: number;
  preferredCountries?: string[];
  fieldOfInterest?: string;
  educationLevel?: "Bachelor" | "Master" | "PhD" | "Diploma";
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatarUrl?: string;
  role: "student" | "admin";
  profile: IUserProfile;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    googleId: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    profile: {
      ieltsScore: { type: Number },
      gpa: { type: Number },
      budgetUSD: { type: Number },
      preferredCountries: [{ type: String }],
      fieldOfInterest: { type: String },
      educationLevel: {
        type: String,
        enum: ["Bachelor", "Master", "PhD", "Diploma"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
