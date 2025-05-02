const userService = require("../services/userService");
const ms = require("ms");

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
    const user = req.user;
    const email = req.body.email;
    const password = req.body.password;
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown'; 
    let result = await userService.loginUser(user, email, password, clientIP, userAgent);
    res.cookie("access_token", result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ms(process.env.JWT_AT_EXPIRE),
      path: "/",
    });
    res.cookie("refresh_token", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ms(process.env.JWT_RF_EXPIRE),
    });
    return res.success("Login success", result);
  } catch (error) {
    return res.error(401, "Failed to login user", error.message);
  }
};

const handleRefreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    const newAccessToken = userService.refreshAccessToken(refreshToken);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ms(process.env.JWT_AT_EXPIRE),
    });

    res.json({ message: "Access token refreshed" });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

const handleLogoutUser = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res.success("Logout success");
  } catch (error) {
    return res.error(500, "Failed to logout user", error.message);
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

const handleUpdateUserById = async (req, res) => {
  try {
    let result = await userService.updateUserById(req.params.id, req.body);
    return res.success("Update user success", result);
  } catch (error) {
    return res.error(500, "Failed to update user", error.message);
  }
};

const handleGetProfile = async (req, res) => {
  return res.success("Get user profile success", req.user);
};

const handleGetTaskCompleted = async (req, res) => {
  try {
    let result = await userService.getTaskCompleted(req.user.id);
    return res.success("Get task completed success", result);
  } catch (error) {
    return res.error(500, "Failed to get task completed", error.message);
  }
};

const handleGetAllTasksById = async (req, res) => {
  try {
    let result = await userService.getAllTasksById(req.user.id);
    return res.success("Get all task by ID success", result);
  } catch (error) {
    return res.error(500, "Failed to get all task by ID", error.message);
  }
};

const handleGetItemByIdUser = async (req, res) => {
  try {
    let result = await userService.getItemByIdUser(req.params.user_id);
    return res.success("Get item by user ID success", result);
  } catch (error) {
    return res.error(500, "Failed to get item by user ID", error.message);
  }
};

const handleGetUserByPublicId = async (req, res) => {
  try {
    let result = await userService.getUserByPublicID(req.params.public_id);
    return res.success("Get user by public ID success", result);
  } catch (error) {
    return res.error(500, "Failed to get user by public ID", error.message);
  }
};

const handleUpdateUserByPublicId = async (req, res) => {
  try {
    let result = await userService.updateUserByPublicID(
      req.params.public_id,
      req.body
    );
    return res.success("Update user success", result);
  } catch (error) {
    return res.error(500, "Failed to update user", error.message);
  }
};

const handleDeleteUserByPublicId = async (req, res) => {
  try {
    let result = await userService.deleteUserByPublicID(req.params.public_id);
    return res.success("Delete user success", result);
  } catch (error) {
    return res.error(500, "Failed to delete user", error.message);
  }
};

module.exports = {
  handleGetAllUsers,
  handleCreateUser,
  handleLogoutUser,
  handleDeleteUser,
  handleGetUser,
  handleUpdateUserById,
  handleLoginUser,
  handleGetProfile,
  handleGetTaskCompleted,
  handleGetAllTasksById,
  handleGetItemByIdUser,
  handleGetUserByPublicId,
  handleUpdateUserByPublicId,
  handleDeleteUserByPublicId,
  handleRefreshAccessToken,
};
