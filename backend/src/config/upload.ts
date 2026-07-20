import multer from "multer";
import path from "path";

// Memory storage: files are held in RAM as a buffer, then streamed straight
// to Cloudinary. No local disk writes — required for serverless (Vercel)
// where the filesystem is read-only/ephemeral outside of /tmp.
const storage = multer.memoryStorage();

const allowedTypes = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedTypes.has(ext)) {
      return cb(new Error("Only JPG, PNG, WEBP, or GIF images are allowed."));
    }
    cb(null, true);
  },
});
