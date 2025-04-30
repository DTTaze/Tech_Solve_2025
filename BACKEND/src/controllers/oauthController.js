const passport = require("../config/passport");
const oauthService = require("../services/oauthService");
const ms = require("ms");

const handleGoogleAuth = async (req, res, next) => {
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account"
  })(req, res, next);
};

const handleGoogleAuthCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "/" },
    async (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      try {
        const authResult = await oauthService.googleAuthCallback(user);

        res.cookie("access_token", authResult.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: ms(process.env.JWT_AT_EXPIRE),
          path: "/",
        });
        res.cookie("refresh_token", authResult.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: ms(process.env.JWT_RF_EXPIRE),
        });

        return res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
      } catch (error) {
        return next(error);
      }
    }
  )(req, res, next);
};

const handleForgotPassword = async (req, res) => {
  try {
    const { mail } = req.body;
    const sendResetEmail = await oauthService.sendResetEmail(mail);
    return res.success("Send successful ", sendResetEmail);
  } catch (error) {
    return res.error(500, "Send failed ", error.message);
  }
};

const handleResetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    const email = await oauthService.resetPassword(token, newPassword);
    return res.success("Reset password successful", email);
  } catch (error) {
    return res.error(500, "Reset password failed", error.message);
  }
};

module.exports = {
  handleGoogleAuth,
  handleGoogleAuthCallback,
  handleForgotPassword,
  handleResetPassword,
};
