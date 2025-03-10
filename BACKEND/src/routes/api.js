console.log("\x1b[33m%s\x1b[0m", "/routes/api.js");
import express from "express";
import homeController from "../controller/homeController";
import oauthController from "../controller/oauthController";

import videoController from "../controller/videoController";
import profileController from "../controller/profileController"; 

import userController from "../controller/userController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.handleHome);

  router.get("/api/users", userController.handleUserPage);
  router.post("/api/auth/register", userController.handleCreateNewUser);
  router.post("/api/auth/login", userController.handleLoginUser);
  router.post("/delete-user/:id", userController.handleDeleteUser);
  router.post("/update-user/:id", userController.getUpdateUserPage);
  router.post("/users/user-update", userController.handleUpdateUser);

  // Google Auth
  router.get("/auth/google", oauthController.googleAuth);
  router.get("/auth/google/callback", oauthController.googleAuthCallback);

  // Profile route
  router.get("/profile", profileController.handleProfilePage);

  // Video routes
  router.post("/video/add", videoController.addVideo);
  router.get("/video/list", videoController.getVideos);

  return app.use("/", router);
};

export default initWebRoutes;
