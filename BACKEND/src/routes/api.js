import express from "express";
import homeController from "../controller/homeController";
import oauthController from "../controller/oauthController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.handleHome);
  router.get("/user", homeController.handleUserPage);
  router.post("/api/auth/register", homeController.handleCreateNewUser);
  router.post("/api/auth/login", homeController.handleLoginUser);
  router.post("/delete-user/:id", homeController.handleDeleteUser);
  router.post("/update-user/:id", homeController.getUpdateUserPage);
  router.post("/users/user-update", homeController.handleUpdateUser);

  router.get("/auth/google", oauthController.googleAuth);
  router.get("/auth/google/callback", oauthController.googleAuthCallback);

  return app.use("/", router);
};

export default initWebRoutes;
