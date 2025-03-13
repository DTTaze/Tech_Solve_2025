import express from "express";
import uploadImage from "../middleware/uploadImage";
import imageController from "../controller/imageController";

const router = express.Router();

router.post(
  "/upload",
  uploadImage.single("image"),
  imageController.uploadImage
);

export default router;
