const passport = require("../config/passport"); // Đường dẫn tới passport.js
const oauthService = require("../services/oauthService");

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

const handleForgotPassword = async (req, res) => {
  try {
    const { mail } = req.body;
    const sendResetEmail = await oauthService.sendResetEmail(mail);
    res.success("Send successful from Controller",sendResetEmail);
  } catch (error) {
    return res.error(500, "Failed to upload item", error.message);
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const { token } = req.query; // Lấy token từ URL
    const { newPassword } = req.body; // Lấy mật khẩu mới từ body
    const email = await oauthService.resetPassword(token,newPassword)
    res.success("Reset password successful",email);
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  handleForgotPassword,
  handleResetPassword
};
