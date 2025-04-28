const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models/index.js");
const User = db.User;
const Role = db.Role;
const Coin = db.Coin;
const Rank = db.Rank;

const jwtAuth = async (req, res, next) => {
  const white_lists = [
    "/",
    "/auth/login",
    "/auth/login/google",
    "/auth/login/google/callback",
    "/auth/register",
    "/auth/forgot_password",
    "/auth/reset_password",
    "/auth/refresh_token",
  ];

  const requestPath = req.originalUrl.split("?")[0];

  if (white_lists.find((item) => "/api" + item === requestPath)) {
    return next();
  }
  let token = null;
  if (req.headers.authorization && req.headers) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    return res.error(401, "Access token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_AT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Role, as: "roles", attributes: ["id", "name"] },
        { model: Coin, as: "coins", attributes: ["id", "amount"] },
        { model: Rank, as: "ranks", attributes: ["id", "order"] },
      ],
    });
    if (!user) return res.error(401, "User not found");

    req.user = user;
    next();
  } catch (e) {
    return res.error(401, "Invalid or expired token", e.message);
  }
};

module.exports = jwtAuth;
