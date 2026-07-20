import dotenv from "dotenv";
dotenv.config();

import { IncomingMessage, ServerResponse } from "http";
import app from "../src/app";
import { connectDB } from "../src/config/db";

// Vercel serverless handler. Every invocation ensures a DB connection is
// available (connectDB reuses a cached connection on warm containers),
// then delegates the request to the same Express app used for local dev.
// Typed against plain Node http primitives (rather than @vercel/node) to
// avoid pulling in that package's outdated, vulnerable `undici` dependency —
// Vercel's platform passes objects compatible with this shape regardless.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await connectDB();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Database connection failed." }));
    return;
  }
  // Express apps are compatible with the (req, res) signature Vercel expects
  (app as any)(req, res);
}
