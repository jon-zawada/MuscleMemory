import { Router } from "express";
import WorkoutController from "../controllers/WorkoutController";
import pool from "../db";
import { jwtMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createWorkoutSchema, updateWorkoutSchema } from "../schemas/workout.schema";

const workoutController = new WorkoutController(pool);
const router = Router();

const createMiddlewares = [jwtMiddleware, validate(createWorkoutSchema)];
const updateMiddlewares = [jwtMiddleware, validate(updateWorkoutSchema)];

router.get("/", jwtMiddleware, workoutController.getWorkouts);
router.post("/", createMiddlewares, workoutController.createWorkout);
router.patch("/:id", updateMiddlewares, workoutController.updateWorkout);
router.delete("/:id", jwtMiddleware, workoutController.deleteWorkout);

export default router;
