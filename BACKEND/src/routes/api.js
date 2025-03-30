import express from "express";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import itemRoutes from "../routes/itemRoutes.js";
import videoRoutes from "../routes/videoRoutes.js";
import imageRoutes from "../routes/imageRoutes.js";
import avatarRoutes from "../routes/avatarRoutes.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import responseFormatter from "../middlewares/responseFormatter.js";
import homeController from "../controllers/homeController.js";
import roleRoutes from "./roleRoutes.js";
import permissionRoutes from "./permissionRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
const router = express.Router();

const initWebRoutes = (app) => {
  app.use(jwtAuth);
  app.use(responseFormatter);

  router.get("/", homeController.handleHome);

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/permissions", permissionRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/videos", videoRoutes);
  app.use("/api/avatars", avatarRoutes);
  app.use("/api/images", imageRoutes);
  app.use("/api/transactions", transactionRoutes);

  return app.use("/api", router);
};

export default initWebRoutes;
