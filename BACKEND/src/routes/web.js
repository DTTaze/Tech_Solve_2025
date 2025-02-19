import express from "express";
import homeController from "../controller/homeController.js";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.handleHome);
  router.get("/user", homeController.handleUserPage);
  router.post("/users/create-user", homeController.handleCreateNewUser);
  router.post("/delete-user/:id", homeController.handleDeleteUser);
  router.post("/update-user/:id", homeController.getUpdateUserPage);
  router.post("/users/user-update", homeController.handleUpdateUser);

  return app.use("/", router);
};

export default initWebRoutes;
