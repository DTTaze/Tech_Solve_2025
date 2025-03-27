const roleService = require("../services/roleService");

const handleCreateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await roleService.createRole(name, description);
    return res.success("Role created successfully", result);
  } catch (error) {
    return res.error(400, "Failed to create role", error.message);
  }
};

const handleGetRole = async (req, res) => {
  try {
    const role_id = Number(req.params.id);
    const result = await roleService.getRoleById(role_id);
    return res.success("Role retrieved successfully", result);
  } catch (error) {
    return res.error(500, "Failed to get role", error.message);
  }
};

const handleGetAllRoles = async (req, res) => {
  try {
    const result = await roleService.getAllRoles();
    return res.success("Roles retrieved successfully", result);
  } catch (error) {
    return res.error(500, "Failed to get roles", error.message);
  }
};

const handleUpdateRole = async (req, res) => {
  try {
    const role_id = Number(req.params.id);
    const result = await roleService.updateRole(role_id, req.body);
    return res.success("Role updated successfully", result);
  } catch (error) {
    return res.error(500, "Failed to update role", error.message);
  }
};

const handleDeleteRole = async (req, res) => {
  try {
    const role_id = Number(req.params.id);
    const result = await roleService.deleteRole(role_id);
    return res.success("Role deleted successfully", result);
  } catch (error) {
    return res.error(500, "Failed to delete role", error.message);
  }
};

module.exports = {
  handleCreateRole,
  handleGetRole,
  handleGetAllRoles,
  handleUpdateRole,
  handleDeleteRole,
};
