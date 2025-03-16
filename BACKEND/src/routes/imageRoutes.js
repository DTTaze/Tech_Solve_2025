import express from "express";
import middlewareImage from "../middlewares/middlewareImage";
import imageController from "../controllers/imageController";

const router = express.Router();

router.post(
  "/upload",
  middlewareImage.single("image"),
  imageController.uploadImage
);

export default router;
