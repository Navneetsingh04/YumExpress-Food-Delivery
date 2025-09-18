import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import adminAuthMiddleware from "../middleware/adminAuth.js";
import fs from "fs";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";

const foodRouter = express.Router();

const upload = multer({ dest: "uploads/" });

foodRouter.post("/add", adminAuthMiddleware, upload.single("image"), async (req, res, next) => {
  try {
    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "YumExpress/images",
    });

    fs.unlinkSync(filePath);
    req.body.imageUrl = result.secure_url;
    req.body.publicId = result.public_id;

    next(); // pass control to addFood
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}, addFood);

foodRouter.get("/list", listFood);
foodRouter.post("/remove", adminAuthMiddleware, removeFood);

export default foodRouter;
