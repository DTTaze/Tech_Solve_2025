const express = require("express");
const permissionController = require("../controllers/permissionController");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

router.post(
  "/create",
  //   checkPermission("create", "Permission"),
  permissionController.handleCreatePermission
);
router.get(
  "/",
  // checkPermission("read", "Permission"),
  permissionController.handleGetAllPermissions
);
router.get(
  "/:id",
  // checkPermission("read", "Permission"),
  permissionController.handleGetPermission
);
router.put(
  "/:id",
  //   checkPermission("update", "Permission"),
  permissionController.handleUpdatePermission
);
router.delete(
  "/:id",
  //   checkPermission("delete", "Permission"),
  permissionController.handleDeletePermission
);

module.exports = router;
