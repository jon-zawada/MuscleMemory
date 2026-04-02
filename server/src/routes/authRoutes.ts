import { Router } from "express";
import AuthController from "../controllers/AuthController";
import pool from "../db";

const authController = new AuthController(pool);
const router = Router();

// POST /auth/signup
router.post("/signup", authController.signUp);

// POST /auth/login
router.post("/login", authController.login);

export default router;
