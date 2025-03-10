import jwt from "jsonwebtoken";
require("dotenv").config();

const jwtAuth = (req, res, next) => {
  const white_lists = ["/", "/api/auth/login", "/api/auth/register"];
  if (white_lists.find((item) => item === req.originalUrl)) {
    next();
  } else {
    if (req.headers.authorization && req.headers) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        next();
      } catch (e) {
        return res.status(401).json({
          message: "token không hợp lệ/hết hạn",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Chưa truyền hoặc hết hạn access token ở header" });
    }
  }
};
module.exports = jwtAuth;
