console.log("\x1b[33m%s\x1b[0m", "/routes/api.js");
import express from "express";
import homeController from "../controller/homeController";
import oauthController from "../controller/oauthController";

import videoController from "../controller/videoController";
import profileController from "../controller/profileController";

import userController from "../controller/userController";
import jwtAuth from "../middleware/jwtAuth";

const router = express.Router();

const initWebRoutes = (app) => {
  // router.all("*", jwtAuth);
  router.get("/", homeController.handleHome);

  router.post("/auth/register", userController.handleCreateNewUser);
  router.post("/auth/login", userController.handleLoginUser);
  router.get("/auth/login/google", oauthController.googleAuth);
  router.get("/auth/login/google/callback", oauthController.googleAuthCallback);

  router.get("/users", userController.handleUserPage);
  router.post("/delete-user/:id", userController.handleDeleteUser);
  router.post("/update-user/:id", userController.getUpdateUserPage);
  router.post("/users/user-update", userController.handleUpdateUser);
  router.get("/api/account", userController.getAccount);

  // Profile route
  router.get("/profile", profileController.handleProfilePage);

  // Video routes
  router.post("/video/add", videoController.addVideo);
  router.get("/video/list", videoController.getVideos);

  return app.use("/api", router);
};

export default initWebRoutes;
