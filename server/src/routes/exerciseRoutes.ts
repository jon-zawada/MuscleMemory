import { Router } from "express";
import ExerciseController from "../controllers/ExerciseController";
import pool from "../db";
import { jwtMiddleware } from "../middleware/auth.middleware";

const exerciseController = new ExerciseController(pool);
const router = Router();

router.get("/", jwtMiddleware, exerciseController.getExercises);
router.post("/", jwtMiddleware, exerciseController.createExercise);
router.patch("/:id", jwtMiddleware, exerciseController.updateExercise);
router.delete("/:id", jwtMiddleware, exerciseController.deleteExercise);

export default router;
