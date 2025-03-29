import express from "express";
const oauthController = require("../controllers/oauthController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.handleCreateUser);
router.post("/login", userController.handleLoginUser);
router.get("/login/google", oauthController.googleAuth);
router.get("/login/google/callback", oauthController.googleAuthCallback);
router.post("/forgot_password",oauthController.handleForgotPassword)
router.post("/reset_password",oauthController.handleResetPassword)

export default router;
