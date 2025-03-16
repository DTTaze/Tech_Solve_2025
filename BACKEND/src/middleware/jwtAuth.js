const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuth = (req, res, next) => {
  const white_lists = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/google",
    "/auth/google/callback",
  ];
  console.log(req.originalUrl);
  if (white_lists.find((item) => "/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers.authorization && req.headers) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          username: decoded.username,
        };
        console.log(decoded);
        next();
      } catch (e) {
        return res.status(401).json({
          message: "Token không hợp lệ/hết hạn",
        });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Chưa truyền hoặc hết hạn access token ở header" });
    }
  }
};
export default jwtAuth;
