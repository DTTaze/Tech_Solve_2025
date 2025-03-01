import userService from "../service/userService";

const handleHome = (req, res) => {
  return res.render("home.ejs");
};

const handleUserPage = async (req, res) => {
  let userList = await userService.getUserList();
  return res.render("user.ejs", { userList });
};

const handleCreateNewUser = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let username = req.body.username;
  userService.createNewUser(email, password, username);
  return res.redirect("/user");
};

const handleDeleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  return res.redirect("/user");
};

// const getUpdateUserPage = async (req, res) => {
//   let id = req.params.id;
//   let user = await userService.getUserByID(id);
//   console.log(user)
//   let userData = {};
//   if (user && user.length > 0) {
//     userData = user[0];
//   }
//   console.log(userData)
//   return res.render("user-update.ejs", { userData });
// };
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
  console.log(req.body.id)
  await userService.updateUserInfor(data);
  return res.redirect("/user");
};

module.exports = {
  handleHome,
  handleUserPage,
  handleCreateNewUser,
  handleDeleteUser,
  getUpdateUserPage,
  handleUpdateUser,
};
