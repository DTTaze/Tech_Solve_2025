const express = require("express");
const roleController = require("../controllers/roleController");
const rolePermissionController = require("../controllers/rolePermissionController");
const checkPermission = require("../middlewares/checkPermission");

const router = express.Router();

router.post(
  "/create",
  //   checkPermission("create", "Role"),
  roleController.handleCreateRole
);
router.get(
  "/",
  // checkPermission("read", "Role"),
  roleController.handleGetAllRoles
);
router.get(
  "/:id",
  // checkPermission("read", "Role"),
  roleController.handleGetRole
);
router.put(
  "/:id",
  //   checkPermission("update", "Role"),
  roleController.handleUpdateRole
);
router.delete(
  "/:id",
  //   checkPermission("delete", "Role"),
  roleController.handleDeleteRole
);
// ===================================
router.post(
  "/:role_id/permissions/assign",
  //   checkPermission("create", "Role"),
  rolePermissionController.handleAssignPermissionToRole
);
router.get(
  "/:role_id/permissions",
  // checkPermission("read", "Role"),
  rolePermissionController.handleGetAllPermissionsByRole
);
router.get(
  "/:role_id/permissions/:perm_id",
  // checkPermission("read", "Role"),
  rolePermissionController.handleGetPermissionByIdByRole
);
router.put(
  "/:role_id/permissions/:perm_id",
  //   checkPermission("update", "Role"),
  rolePermissionController.handleUpdatePermissionByRole
);
router.delete(
  "/:role_id/permissions/:perm_id",
  //   checkPermission("delete", "Role"),
  rolePermissionController.handleRemovePermissionFromRole
);

module.exports = router;
