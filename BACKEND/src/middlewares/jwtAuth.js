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
  if (white_lists.find((item) => "/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers.authorization && req.headers) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
        };
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
