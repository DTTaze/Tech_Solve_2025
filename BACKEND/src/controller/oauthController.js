const passport = require("passport");

const googleAuth = async (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const googleAuthCallback = async (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Authentication failed" });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Authentication success" });
    });
  })(req, res, next);
};

export default {
  googleAuth,
  googleAuthCallback,
};
