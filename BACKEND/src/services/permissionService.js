const db = require("../models/index.js");
const Permission = db.Permission;

const createPermission = async (action, subject) => {
  try {
    if (!action) throw new Error("Permission action is required");
    return await Permission.create({ action, subject });
  } catch (e) {
    throw e;
  }
};

const getPermissionById = async (id) => {
  try {
    if (!id) throw new Error("Permission ID is required");

    const result = await Permission.findByPk(id);
    if (!result) throw new Error("Permission not found");

    return result;
  } catch (e) {
    throw e;
  }
};

const getAllPermissions = async () => {
  try {
    return await Permission.findAll();
  } catch (e) {
    throw new Error("Failed to fetch permissions");
  }
};

const updatePermission = async (id, data) => {
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) throw new Error("Permission not found");

    await permission.update(data);
    return permission;
  } catch (e) {
    throw e;
  }
};

const deletePermission = async (id) => {
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) throw new Error("Permission not found");

    await permission.destroy();
    return { message: "Permission deleted successfully" };
  } catch (e) {
    throw e;
  }
};
module.exports = {
  createPermission,
  getPermissionById,
  getAllPermissions,
  updatePermission,
  deletePermission,
};
