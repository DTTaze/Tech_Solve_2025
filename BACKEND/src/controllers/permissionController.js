const permissionService = require("../services/permissionService");

const handleCreatePermission = async (req, res) => {
  try {
    const { action, subject } = req.body;
    const result = await permissionService.createPermission(action, subject);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const handleGetPermission = async (req, res) => {
  try {
    const result = await permissionService.getPermissionById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const handleGetAllPermissions = async (req, res) => {
  try {
    const result = await permissionService.getAllPermissions();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const handleUpdatePermission = async (req, res) => {
  try {
    const result = await permissionService.updatePermission(
      req.params.id,
      req.body
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const handleDeletePermission = async (req, res) => {
  try {
    const result = await permissionService.deletePermission(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
module.exports = {
  handleCreatePermission,
  handleGetPermission,
  handleGetAllPermissions,
  handleUpdatePermission,
  handleDeletePermission,
};
