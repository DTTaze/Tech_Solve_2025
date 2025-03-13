console.log("\x1b[33m%s\x1b[0m", "/routes/api.js");
import express from "express";
import homeController from "../controller/homeController";
const oauthController = require("../controller/oauthController");
const imageController = require("../controller/imageController");
const videoController = require("../controller/videoController");
// import profileController from "../controller/profileController";
const uploadImage = require("../middleware/uploadImage");
const uploadVideo = require("../middleware/uploadVideo");
const userController = require("../controller/userController");
import jwtAuth from "../middleware/jwtAuth";
import responseFormatter from "../middleware/responseFormatter";

const router = express.Router();

const initWebRoutes = (app) => {
  // router.all("*", jwtAuth);
  router.all("*", responseFormatter);
  router.get("/", homeController.handleHome);

  router.post("/auth/register", userController.handleCreateNewUser);
  router.post("/auth/login", userController.handleLoginUser);
  router.get("/auth/login/google", oauthController.googleAuth);
  router.get("/auth/login/google/callback", oauthController.googleAuthCallback);

  router.get("/users", userController.handleUserPage);
  router.get("/users/:id", userController.handleGetUser);
  router.put("/users/:id", userController.handleUpdateUser);
  router.delete("/users/:id", userController.handleDeleteUser);

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
