import mongoose from "mongoose";

// In serverless environments (Vercel), each function invocation can reuse a
// warm container. Caching the connection on `global` avoids exhausting
// MongoDB's connection limit by reconnecting on every request.
declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  if (mongoose.connection.readyState === 1) {
    return; // already connected (warm serverless container)
  }

  if (!global.__mongooseConn) {
    global.__mongooseConn = mongoose.connect(uri);
  }

  try {
    await global.__mongooseConn;
    console.log("[db] MongoDB connected successfully");
  } catch (err) {
    global.__mongooseConn = undefined;
    console.error("[db] MongoDB connection failed:", err);
    throw err;
  }
}
