import express from "express";
import middlewareImage from "../middlewares/middlewareImage";
import imageController from "../controllers/imageController";

const router = express.Router();

router.post(
  "/upload",
  middlewareImage.single("image"),
  imageController.handleUploadImage
);

router.get("/getall", imageController.handleGetAllImages);
router.get("/get/:id", imageController.handleGetImageById);
router.put("/update/:id", middlewareImage.single("image"), imageController.handleUpdateImage);
router.delete("/delete/:id",middlewareImage.single("image"), imageController.handleDeleteImage);

export default router;
