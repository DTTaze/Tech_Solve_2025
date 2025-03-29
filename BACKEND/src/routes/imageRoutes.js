import express from "express";
import middlewareImage from "../middlewares/middlewareImage";
import imageController from "../controllers/imageController";

const router = express.Router();

router.post(
  "/upload",
  middlewareImage.single("image"),
  imageController.handleUploadImage
);

router.get("/", imageController.handleGetAllImages);
router.get("/:id", imageController.handleGetImageById);
router.put("/:id", middlewareImage.single("image"), imageController.handleUpdateImage);
router.delete("/:id",middlewareImage.single("image"), imageController.handleDeleteImage);

export default router;
