import { Router, Request, Response } from "express";
import { upload } from "../config/upload";
import cloudinary from "../config/cloudinary";
import { requireAuth } from "../middleware/auth";

const router = Router();

function uploadBufferToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "studymatch", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload returned no result."));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// POST /api/uploads — protected: image upload for listings, stored on Cloudinary
router.post("/", requireAuth, (req: Request, res: Response) => {
  upload.single("image")(req, res, async (err: any) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload failed." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file was provided." });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({
        message: "Image hosting isn't configured yet. Set CLOUDINARY_* env vars, or paste an image URL instead.",
      });
    }

    try {
      const url = await uploadBufferToCloudinary(req.file.buffer);
      res.status(201).json({ url });
    } catch (uploadErr) {
      console.error("[upload] cloudinary error", uploadErr);
      res.status(502).json({ message: "Image upload service is temporarily unavailable." });
    }
  });
});

export default router;
