import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import universityRoutes from "./routes/universityRoutes";
import aiRoutes from "./routes/aiRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import { notFound, errorHandler } from "./middleware/errorHandler";

const app = express();

// Supports a comma-separated list so both localhost (dev) and the deployed
// Vercel domain can be allowed at once, e.g. CLIENT_URL="http://localhost:3000,https://studymatch.vercel.app"
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "studymatch-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
