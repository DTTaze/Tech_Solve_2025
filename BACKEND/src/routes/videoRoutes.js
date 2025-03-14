import express from "express";
import uploadVideo from "../middleware/uploadVideo";
import videoController from "../controller/videoController";

const router = express.Router();

router.post(
  "/upload",
  uploadVideo.single("video"),
  videoController.uploadVideo
);
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);
router.put(
  "/:id",
  uploadVideo.single("video"),
  videoController.updateVideo
);
router.delete("/:id", videoController.deleteVideo);

export default router;
