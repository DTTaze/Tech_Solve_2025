const db = require("../models/index.js");
const Role = db.Role;

const createRole = async (name, description) => {
  try {
    if (!name) throw new Error("Role name is required");
    return await Role.create({ name, description });
  } catch (e) {
    throw e;
  }
};
const getRoleById = async (id) => {
  try {
    if (!id) throw new Error("Role ID is required");

    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");

    return role;
  } catch (e) {
    throw e;
  }
};
const getAllRoles = async () => {
  try {
    return await Role.findAll();
  } catch (e) {
    throw new Error("Failed to fetch roles");
  }
};
const updateRole = async (id, data) => {
  try {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");

    await role.update(data);
    return role;
  } catch (e) {
    throw e;
  }
};
const deleteRole = async (id) => {
  try {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");

    await role.destroy();
    return { message: "Role deleted successfully" };
  } catch (e) {
    throw e;
  }
};

module.exports = {
  createRole,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
};
