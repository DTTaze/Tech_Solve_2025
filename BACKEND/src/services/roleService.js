const db = require("../models/index.js");
const Role = db.Role;
const { getCache, setCache, deleteCache } = require("../utils/cache");

// Global cache keys
const cacheKeyId = (id) => `role:id:${id}`;
const cacheKeyAll = "role:all";

const createRole = async (name, description) => {
  try {
    if (!name) throw new Error("Role name is required");

    const newRole = await Role.create({ name, description });

    // Invalidate cache
    await deleteCache(cacheKeyAll);

    return newRole;
  } catch (e) {
    throw e;
  }
};

const getRoleById = async (id) => {
  try {
    if (!id) throw new Error("Role ID is required");

    const key = cacheKeyId(id);
    const cached = await getCache(key);
    if (cached) return JSON.parse(cached);

    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");

    await setCache(key, JSON.stringify(role));
    return role;
  } catch (e) {
    throw e;
  }
};

const getAllRoles = async () => {
  try {
    const cached = await getCache(cacheKeyAll);
    if (cached) return JSON.parse(cached);

    const roles = await Role.findAll();
    await setCache(cacheKeyAll, JSON.stringify(roles));
    return roles;
  } catch (e) {
    throw new Error("Failed to fetch roles");
  }
};

const updateRole = async (id, data) => {
  try {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");

    await role.update(data);

    // Invalidate related cache
    await deleteCache(cacheKeyId(id));
    await deleteCache(cacheKeyAll);

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

    // Invalidate related cache
    await deleteCache(cacheKeyId(id));
    await deleteCache(cacheKeyAll);

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
