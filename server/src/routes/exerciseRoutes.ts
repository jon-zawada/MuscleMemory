import { Router } from "express";
import ExerciseController from "../controllers/ExerciseController";
import pool from "../db";
import { jwtMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createExerciseSchema, updateExerciseSchema } from "../schemas/exercise.schema";

const exerciseController = new ExerciseController(pool);
const router = Router();

const createMiddlewares = [jwtMiddleware, validate(createExerciseSchema)];
const updateMiddlewares = [jwtMiddleware, validate(updateExerciseSchema)];

router.get("/", jwtMiddleware, exerciseController.getExercises);
router.post("/", createMiddlewares, exerciseController.createExercise);
router.patch("/:id", updateMiddlewares, exerciseController.updateExercise);
router.delete("/:id", jwtMiddleware, exerciseController.deleteExercise);

export default router;
