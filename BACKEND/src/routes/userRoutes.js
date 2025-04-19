const express = require("express");
const userController = require("../controllers/userController");
const checkPermission = require("../middlewares/checkPermission");
const router = express.Router();

router.get(
  "/",
  checkPermission("read", "user"),
  userController.handleGetAllUsers
);
router.get("/me", userController.handleGetProfile);//for user
router.get("/:id", userController.handleGetUser);//for admin
router.get("/task/completed/:id", userController.handleGetTaskCompleted);//for admin
router.put("/:id", userController.handleUpdateUser);//for admin
router.delete("/:id", userController.handleDeleteUser);//for admin
router.post("/task/all/:id", userController.handleGetAllTaskById);//for admin
router.get("/items/:user_id", userController.handleGetItemByIdUser);//for admin

module.exports = router;
