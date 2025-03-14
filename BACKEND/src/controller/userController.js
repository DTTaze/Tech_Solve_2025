const userService = require("../service/userService");

const handleUserPage = async (req, res) => {
  try {
    let data = await userService.getUserList();
    return res.success("Get list of users success", data);
  } catch (error) {
    return res.error(500, "Failed to fetch user list", error.message);
  }
};

const handleCreateNewUser = async (req, res) => {
  try {
    let { email, password, username } = req.body;
    let data = await userService.createNewUser(email, password, username);
    return res.success("Create user success", data);
  } catch (error) {
    return res.error(500, "Failed to create user", error.message);
  }
};

const handleLoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let data = await userService.loginUser(email, password);
    return res.success("Login success", data);
  } catch (error) {
    return res.error(401, "Login failed", error.message);
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
    let id = req.params.id;
    let user = await userService.getUserByID(id);
    return res.success("Get update user page", user);
  } catch (error) {
    return res.error(500, "Failed to get user", error.message);
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    data.id = id;
    let result = await userService.updateUserInfor(data);
    return res.success("Update user success", result);
  } catch (error) {
    return res.error(500, "Failed to update user", error.message);
  }
};

module.exports = {
  handleUserPage,
  handleCreateNewUser,
  handleDeleteUser,
  handleGetUser,
  handleUpdateUser,
  handleLoginUser,
};
