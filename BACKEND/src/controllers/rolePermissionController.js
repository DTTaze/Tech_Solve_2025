const rolePermissionService = require("../services/rolePermissionService");

const handleAssignPermissionToRole = async (req, res) => {
  try {
    const result = await rolePermissionService.assignPermissionToRole(
      req.params.role_id,
      req.body.permission_id
    );
    return res.success("Permission assigned to role successfully", result);
  } catch (error) {
    return res.error(500, "Failed to assign permission to role", error.message);
  }
};

const handleGetPermissionByIdByRole = async (req, res) => {
  try {
    const result = await rolePermissionService.getPermissionByIdByRole(
      req.params.role_id,
      req.params.perm_id
    );
    return res.success("Permission retrieved successfully", result);
  } catch (error) {
    return res.error(500, "Failed to get permission by role", error.message);
  }
};

const handleGetAllPermissionsByRole = async (req, res) => {
  try {
    const result = await rolePermissionService.getPermissionsByRole(
      req.params.role_id
    );
    return res.success("Permissions retrieved successfully", result);
  } catch (error) {
    return res.error(500, "Failed to get permissions by role", error.message);
  }
};

const handleUpdatePermissionByRole = async (req, res) => {
  try {
    const result = await rolePermissionService.updatePermissionByRole(
      req.params.role_id,
      req.params.perm_id,
      req.body.new_perm_id
    );
    return res.success("Permission updated successfully", result);
  } catch (error) {
    return res.error(500, "Failed to update permission by role", error.message);
  }
};

const handleRemovePermissionFromRole = async (req, res) => {
  try {
    const result = await rolePermissionService.removePermissionFromRole(
      req.params.role_id,
      req.params.perm_id
    );
    return res.success("Permission removed from role successfully", result);
  } catch (error) {
    return res.error(
      500,
      "Failed to remove permission from role",
      error.message
    );
  }
};

module.exports = {
  handleAssignPermissionToRole,
  handleGetPermissionByIdByRole,
  handleGetAllPermissionsByRole,
  handleUpdatePermissionByRole,
  handleRemovePermissionFromRole,
};
