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
  ];

  const requestPath = req.originalUrl.split('?')[0];

  if (white_lists.find((item) => "/api" + item === requestPath)) {
    next();
  } else {
    if (req.headers.authorization && req.headers) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id, {
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: Role,
              as: "roles",
              attributes: ["id", "name"],
            },
            {
              model: Coin,
              as: "coins",
              attributes: ["id", "amount"],
            },
            {
              model: Rank,
              as: "ranks",
              attributes: ["id", "order"],
            },
          ],
        });
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user = user;
        next();
      } catch (e) {
        return res.status(401).json({
          message: "Invalid or expired token",
          error: e.message,
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Access token is missing or expired in the header" });
    }
  }
};

module.exports = jwtAuth;
