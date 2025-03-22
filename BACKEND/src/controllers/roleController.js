const roleService = require("../services/roleService");

const handleCreateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await roleService.createRole(name, description);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const handleGetRole = async (req, res) => {
  try {
    const result = await roleService.getRoleById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const handleGetAllRoles = async (req, res) => {
  try {
    const result = await roleService.getAllRoles();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const handleUpdateRole = async (req, res) => {
  try {
    const result = await roleService.updateRole(req.params.id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const handleDeleteRole = async (req, res) => {
  try {
    const result = await roleService.deleteRole(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  handleCreateRole,
  handleGetRole,
  handleGetAllRoles,
  handleUpdateRole,
  handleDeleteRole,
};
