import express from "express";
import middlewareVideo from "../middlewares/middlewareVideo";
import videoController from "../controllers/videoController";

const router = express.Router();

router.post(
  "/upload",
  middlewareVideo.single("video"),
  videoController.handleUploadVideo
);
router.get("/", videoController.handleGetAllVideos);
router.get("/:idUser/:idVideo", videoController.handleGetVideoById);
router.put(
  "/:id",
  middlewareVideo.single("video"),
  videoController.handleUpdateVideo
);
router.delete("/:idUser/:idVideo", videoController.handleDeleteVideo);

export default router;
