import express from "express";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import itemRoutes from "../routes/itemRoutes.js";
import videoRoutes from "../routes/videoRoutes.js";
import imageRoutes from "../routes/imageRoutes.js";
import jwtAuth from "../middleware/jwtAuth";
import responseFormatter from "../middleware/responseFormatter";
import homeController from "../controller/homeController.js";

const router = express.Router();

const initWebRoutes = (app) => {
  // app.use(jwtAuth);
  app.use(responseFormatter);

  router.get("/", homeController.handleHome);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/video", videoRoutes);
  app.use("/api/image", imageRoutes);
  // Video routes
  router.post("/video/upload", uploadVideo.single('video'), videoController.uploadVideo);
  router.get("/videos", videoController.getAllVideos);
  router.get("/video/:id", videoController.getVideoById);
  router.put("/video/:id", uploadVideo.single('video'), videoController.updateVideo);
  router.delete("/video/:id", videoController.deleteVideo);

  // Images routes
  router.post("/image/upload", uploadImage.single('image'),imageController.uploadImage);

  return app.use("/api", router);
};

export default initWebRoutes;
