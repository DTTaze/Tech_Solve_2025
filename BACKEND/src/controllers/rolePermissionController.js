const rolePermissionService = require("../services/rolePermissionService");

const handleAssignPermissionToRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { permission_id } = req.body;
    const result = await rolePermissionService.assignPermissionToRole(
      role_id,
      permission_id
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const handleGetPermissionByIdByRole = async (req, res) => {
  try {
    const { role_id, perm_id } = req.params;
    const result = await rolePermissionService.getPermissionByIdByRole(
      role_id,
      perm_id
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// 🟢 Lấy danh sách permission của role
const handleGetAllPermissionsByRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const result = await rolePermissionService.getPermissionsByRole(role_id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 🟢 Cập nhật danh sách permission của role
const handleUpdatePermissionByRole = async (req, res) => {
  try {
    const { role_id, perm_id } = req.params;
    const { new_perm_id } = req.body;

    const result = await rolePermissionService.updatePermissionByRole(
      role_id,
      perm_id,
      new_perm_id
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 🟢 Xóa permission khỏi role
const handleRemovePermissionFromRole = async (req, res) => {
  try {
    const { role_id, perm_id } = req.params;
    const result = await rolePermissionService.removePermissionFromRole(
      role_id,
      perm_id
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  handleAssignPermissionToRole,
  handleGetPermissionByIdByRole,
  handleGetAllPermissionsByRole,
  handleUpdatePermissionByRole,
  handleRemovePermissionFromRole,
};
