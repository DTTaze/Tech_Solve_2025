const passport = require("passport");

const oauthController = {
  googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

  googleAuthCallback: passport.authenticate("google", { failureRedirect: "/" }),

  //   handleAuthSuccess: (req, res) => {
  //     res.redirect("/profile");
  //   },
};

module.exports = oauthController;
