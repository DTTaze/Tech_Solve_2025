const permissionService = require("../services/permissionService");

const handleCreatePermission = async (req, res) => {
  try {
    const result = await permissionService.createPermission(
      req.body.action,
      req.body.subject
    );
    return res.success("Permission created successfully", result);
  } catch (error) {
    return res.error(500, "Failed to create permission", error.message);
  }
};

const handleGetPermission = async (req, res) => {
  try {
    const result = await permissionService.getPermissionById(req.params.id);
    return res.success("Permission retrieved successfully", result);
  } catch (error) {
    return res.error(500, "Failed to get permission", error.message);
  }
};

const handleGetAllPermissions = async (req, res) => {
  try {
    const result = await permissionService.getAllPermissions();
    return res.success("Permissions retrieved successfully", result);
  } catch (error) {
    return res.error(500, "Failed to get permissions", error.message);
  }
};

const handleUpdatePermission = async (req, res) => {
  try {
    const result = await permissionService.updatePermission(
      req.params.id,
      req.body
    );
    return res.success("Permission updated successfully", result);
  } catch (error) {
    return res.error(500, "Failed to update permission", error.message);
  }
};

const handleDeletePermission = async (req, res) => {
  try {
    const result = await permissionService.deletePermission(req.params.id);
    return res.success("Permission deleted successfully", result);
  } catch (error) {
    return res.error(500, "Failed to delete permission", error.message);
  }
};

module.exports = {
  handleCreatePermission,
  handleGetPermission,
  handleGetAllPermissions,
  handleUpdatePermission,
  handleDeletePermission,
};
