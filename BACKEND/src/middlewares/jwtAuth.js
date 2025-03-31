const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models/index.js");
const User = db.User;

const jwtAuth = async (req, res, next) => {
  const white_lists = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/google",
    "/auth/google/callback",
    "/auth/forgot_password",
    "/auth/reset_password",
  ];
  if (white_lists.find((item) => "/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers.authorization && req.headers) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ["password"] },
        });
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user = user;
        next();
      } catch (e) {
        return res.status(401).json({
          message: "Invalid or expired token",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Access token is missing or expired in the header" });
    }
  }
};
export default jwtAuth;
