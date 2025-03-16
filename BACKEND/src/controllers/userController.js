const userService = require("../services/userService");

const handleGetAllUsers = async (req, res) => {
  try {
    let result = await userService.getAllUsers();
    return res.success("Get list of users success", result);
  } catch (error) {
    return res.error(500, "Failed to fetch user list", error.message);
  }
};

const handleCreateUser = async (req, res) => {
  try {
    let result = await userService.createUser(req.body);
    return res.success("Create user success", result);
  } catch (error) {
    return res.error(500, "Failed to create user", error.message);
  }
};

const handleLoginUser = async (req, res) => {
  try {
    let result = await userService.loginUser(req.body);
    return res.success("Login success", result);
  } catch (error) {
    return res.error(401, "Failed to login user", error.message);
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    let result = await userService.deleteUser(req.params.id);
    return res.success("Delete user success", result);
  } catch (error) {
    return res.error(500, "Failed to delete user", error.message);
  }
};

const handleGetUser = async (req, res) => {
  try {
    let result = await userService.getUserByID(req.params.id);
    return res.success("Get user by ID success", result);
  } catch (error) {
    return res.error(500, "Failed to get user by ID", error.message);
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    let result = await userService.updateUser(req.params.id, req.body);
    return res.success("Update user success", result);
  } catch (error) {
    return res.error(500, "Failed to update user", error.message);
  }
};

const handleGetProfile = async (req, res) => {
  return res.status(200).json(req.user);
};
module.exports = {
  handleGetAllUsers,
  handleCreateUser,
  handleDeleteUser,
  handleGetUser,
  handleUpdateUser,
  handleLoginUser,
  handleGetProfile,
};
