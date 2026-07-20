import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";
import User from "../models/User";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(id: string, role: string) {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id, role }, secret, { expiresIn } as jwt.SignOptions);
}

function sanitizeUser(user: any) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    profile: user.profile,
  };
}

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = signToken(user._id.toString(), user.role);
  res.status(201).json({ token, user: sanitizeUser(user) });
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(user._id.toString(), user.role);
  res.json({ token, user: sanitizeUser(user) });
}

// Demo login: seeds/uses a fixed demo account so reviewers can log in instantly
export async function demoLogin(req: Request, res: Response) {
  const demoEmail = "demo@studymatch.ai";
  let user = await User.findOne({ email: demoEmail });

  if (!user) {
    const hashed = await bcrypt.hash("Demo@1234", 10);
    user = await User.create({
      name: "Demo Student",
      email: demoEmail,
      password: hashed,
      profile: {
        ieltsScore: 6.5,
        gpa: 3.4,
        budgetUSD: 25000,
        preferredCountries: ["Canada", "Germany", "Australia"],
        fieldOfInterest: "Computer Science",
        educationLevel: "Master",
      },
    });
  }

  const token = signToken(user._id.toString(), user.role);
  res.json({ token, user: sanitizeUser(user) });
}

export async function googleLogin(req: Request, res: Response) {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: "Missing Google credential token." });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Could not verify Google account." });
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name || "Google User",
        email: payload.email,
        googleId: payload.sub,
        avatarUrl: payload.picture,
      });
    }

    const token = signToken(user._id.toString(), user.role);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(401).json({ message: "Google authentication failed." });
  }
}

export async function getMe(req: Request & { userId?: string }, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user: sanitizeUser(user) });
}
