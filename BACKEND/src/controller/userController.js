const userService = require("../service/userService");

const getAccount = async (req, res) => {
  return res.status(200).json(req.user);
};

const handleUserPage = async (req, res) => {
  let data = await userService.getUserList();
  //   return res.render("user.ejs", { userList });
  return res.status(200).json(data);
};

const handleCreateNewUser = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;
  let data = await userService.createNewUser(email, password, username);
  return res.status(200).json(data);
};

const handleLoginUser = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(password);
  // let username = req.body.username;
  let data = await userService.loginUser(email, password);
  return res.status(200).json(data);
};

const handleDeleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  return res.redirect("/api/users");
};

const getUpdateUserPage = async (req, res) => {
  let id = req.params.id;
  let user = await userService.getUserByID(id);
  console.log("Found user:", user);

  // Khi user được tìm thấy, user là một đối tượng, không phải mảng
  let userData = user || {};

  console.log("User data for rendering:", userData);
  return res.render("user-update.ejs", { userData });
};

let handleUpdateUser = async (req, res) => {
  let data = req.body;
  console.log(req.body.id);
  await userService.updateUserInfor(data);
  return res.redirect("/api/users");
};

module.exports = {
  handleUserPage,
  handleCreateNewUser,
  handleDeleteUser,
  getUpdateUserPage,
  handleUpdateUser,
  handleLoginUser,
  getAccount,
};
