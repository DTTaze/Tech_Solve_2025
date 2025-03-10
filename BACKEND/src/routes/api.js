import express from "express";
import homeController from "../controller/homeController";
import oauthController from "../controller/oauthController";
import userController from "../controller/userController";
import jwtAuth from "../middleware/jwtAuth";

const router = express.Router();

const initWebRoutes = (app) => {
  router.all("*", jwtAuth);
  router.get("/", homeController.handleHome);

  router.get("/api/users", userController.handleUserPage);
  router.post("/api/auth/register", userController.handleCreateNewUser);
  router.post("/api/auth/login", userController.handleLoginUser);
  router.post("/delete-user/:id", userController.handleDeleteUser);
  router.post("/update-user/:id", userController.getUpdateUserPage);
  router.post("/users/user-update", userController.handleUpdateUser);

  router.get("/auth/google", oauthController.googleAuth);
  router.get("/auth/google/callback", oauthController.googleAuthCallback);

  return app.use("/", router);
};

export default initWebRoutes;
