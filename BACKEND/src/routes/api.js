const express = require("express");
const authRoutes = require("../routes/authRoutes.js");
const userRoutes = require("../routes/userRoutes.js");
const taskRoutes = require("../routes/taskRoutes.js");
const itemRoutes = require("../routes/itemRoutes.js");
const videoRoutes = require("../routes/videoRoutes.js");
const imageRoutes = require("../routes/imageRoutes.js");
const avatarRoutes = require("../routes/avatarRoutes.js");
const jwtAuth = require("../middlewares/jwtAuth.js");
const responseFormatter = require("../middlewares/responseFormatter.js");
const homeController = require("../controllers/homeController.js");
const roleRoutes = require("./roleRoutes.js");
const permissionRoutes = require("./permissionRoutes.js");
const transactionRoutes = require("./transactionRoutes.js");
const coinRoutes = require("./coinRoutes.js");
const rankRoutes = require("./rankRoutes.js");
const router = express.Router();
const serverAdapter = require("../services/bullboard.js");

const initWebRoutes = (app) => {
  app.use("/admin/queues", serverAdapter.getRouter());
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
  app.use("/api/coins", coinRoutes);
  app.use("/api/ranks", rankRoutes);

  return app.use("/api", router);
};

module.exports = initWebRoutes;
