import express from "express";
import oauthController from "../controller/oauthController";
import userController from "../controller/userController";

const router = express.Router();

router.post("/register", userController.handleCreateNewUser);
router.post("/login", userController.handleLoginUser);
router.get("/login/google", oauthController.googleAuth);
router.get("/login/google/callback", oauthController.googleAuthCallback);

export default router;
