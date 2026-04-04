import { Router } from "express";
import AuthController from "../controllers/AuthController";
import pool from "../db";

const authController = new AuthController(pool);
const router = Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
