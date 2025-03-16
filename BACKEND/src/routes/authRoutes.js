import express from "express";
import oauthController from "../controllers/oauthController";
import userController from "../controllers/userController";

const router = express.Router();

router.post("/register", userController.handleCreateUser);
router.post("/login", userController.handleLoginUser);
router.get("/login/google", oauthController.googleAuth);
router.get("/login/google/callback", oauthController.googleAuthCallback);

export default router;
