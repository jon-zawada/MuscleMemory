import { Router } from "express";
import ExerciseLogController from "../controllers/ExerciseLogController";
import pool from "../db";
import { jwtMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createExerciseLogSchema, updateExerciseLogSchema } from "../schemas/exerciseLog.schema";

const exerciseLogController = new ExerciseLogController(pool);
const router = Router();

const createMiddlewares = [jwtMiddleware, validate(createExerciseLogSchema)];
const updateMiddlewares = [jwtMiddleware, validate(updateExerciseLogSchema)];

router.get("/", jwtMiddleware, exerciseLogController.getExerciseLogs);
router.post("/", createMiddlewares, exerciseLogController.createExerciseLog);
router.patch("/:id", updateMiddlewares, exerciseLogController.updateExerciseLog);
router.delete("/:id", jwtMiddleware, exerciseLogController.deleteExerciseLog);

export default router;
