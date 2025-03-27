import express from "express";
import middlewareVideo from "../middlewares/middlewareVideo";
const videoController = require("../controllers/videoController");

const router = express.Router();

router.post(
  "/upload",
  middlewareVideo.single("video"),
  videoController.handleUploadVideo
);
router.get("/", videoController.handleGetAllVideos);
router.get("/:user_id/:video_id", videoController.handleGetVideoById);
router.put(
  "/:id",
  middlewareVideo.single("video"),
  videoController.handleUpdateVideo
);
router.delete("/:user_id/:video_id", videoController.handleDeleteVideo);

export default router;
