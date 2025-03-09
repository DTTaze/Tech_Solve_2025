import userService from "../service/userService";
const handleHome = (req, res) => {
  return res.render("home.ejs");
};
module.exports = {
  handleHome,
};
