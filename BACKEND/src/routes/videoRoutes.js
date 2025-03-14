import express from "express";
import uploadVideo from "../middleware/uploadVideo";
import videoController from "../controller/videoController";

const router = express.Router();

router.post(
  "/upload",
  uploadVideo.single("video"),
  videoController.uploadVideo
);

export default router;
