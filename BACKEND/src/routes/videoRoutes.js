import express from "express";
import uploadVideo from "../middleware/uploadVideo";
import videoController from "../controller/videoController";

const router = express.Router();

router.post(
  "/upload",
  uploadVideo.single("video"),
  videoController.handleUploadVideo
);
router.get("/", videoController.handleGetAllVideos);
router.get("/:id", videoController.handleGetVideoById);
router.put(
  "/:id",
  uploadVideo.single("video"),
  videoController.handleUpdateVideo
);
router.delete("/:id", videoController.handleDeleteVideo);

export default router;
