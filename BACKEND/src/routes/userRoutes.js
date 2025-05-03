const express = require("express");
const userController = require("../controllers/userController");
const checkPermission = require("../middlewares/checkPermission");
const router = express.Router();

router.get("/", userController.handleGetAllUsers);
router.get("/me", userController.handleGetProfile);
router.get(
  "/:id",
  // checkPermission("get", "user_id"),
  userController.handleGetUser
);
router.get("/task/completed", userController.handleGetTaskCompleted);
router.put(
  "/:id",
  // checkPermission("put", "user_id"),
  userController.handleUpdateUserById
);
router.delete(
  "/:id",
  // checkPermission("delete", "user_id"),
  userController.handleDeleteUser
);
router.get("/tasks/all/:id", userController.handleGetAllTasksById);
router.get("/items/:user_id", userController.handleGetItemByIdUser);

router.get("/public/:public_id", userController.handleGetUserByPublicId);
router.put("/public/:public_id", userController.handleUpdateUserByPublicId);
router.delete("/public/:public_id", userController.handleDeleteUserByPublicId);
module.exports = router;
