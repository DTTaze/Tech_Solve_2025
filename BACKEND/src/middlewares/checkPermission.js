import { defineAbilitiesFor } from "../utils/ability.js";

const checkPermission = (action, subject) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found in request" });
      }
      const ability = await defineAbilitiesFor(req.user);
      if (!ability) {
        return res.status(500).json({
          message: "Internal Server Error: Failed to define user abilities",
        });
      }
      if (ability.can(action, subject)) {
        return next();
      } else {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error: Failed to check user permission",
        error: error.message,
      });
    }
  };
};

module.exports = checkPermission;
