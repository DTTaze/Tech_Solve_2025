const passport = require("passport");

const oauthController = {
  googleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

  googleAuthCallback: (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect("/");

      req.logIn(user, (err) => {
        if (err) return next(err);

        req.session.user = user; // Lưu user vào session

        return res.redirect("/profile"); // Chuyển hướng đến Profile
      });
    })(req, res, next);
  },
};

module.exports = oauthController;
