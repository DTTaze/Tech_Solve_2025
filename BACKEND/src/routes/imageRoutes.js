import express from "express";
import uploadImage from "../middlewares/uploadImage";
import imageController from "../controllers/imageController";

const router = express.Router();

router.post(
  "/upload",
  uploadImage.single("image"),
  imageController.uploadImage
);

export default router;
