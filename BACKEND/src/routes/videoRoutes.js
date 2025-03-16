import express from "express";
import uploadVideo from "../middlewares/uploadVideo";
import videoController from "../controllers/videoController";

const router = express.Router();

router.post(
  "/upload",
  uploadVideo.single("video"),
  videoController.handleUploadVideo
);
router.get("/", videoController.handleGetAllVideos);
router.get("/:idUser/:idVideo", videoController.handleGetVideoById);
router.put(
  "/:id",
  uploadVideo.single("video"),
  videoController.handleUpdateVideo
);
router.delete("/:idUser/:idVideo", videoController.handleDeleteVideo);

export default router;
