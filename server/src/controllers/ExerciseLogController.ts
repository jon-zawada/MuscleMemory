import { Request, Response } from "express";
import { Pool } from "pg";
import { NOT_FOUND, NO_UPDATES, UNAUTHORIZED } from "../constants/repoResults";
import { ExerciseLogRepo } from "../repositories/ExerciseLogRepo";
import { WorkoutRepo } from "../repositories/WorkoutRepo";
import { CreateExerciseLogBody, UpdateExerciseLogBody } from "../schemas/exerciseLog.schema";
import { logger } from "../utils/logger";

class ExerciseLogController {
  private exerciseLogRepo: ExerciseLogRepo;
  private workoutRepo: WorkoutRepo;
  constructor(pool: Pool) {
    this.exerciseLogRepo = new ExerciseLogRepo(pool);
    this.workoutRepo = new WorkoutRepo(pool);
  }

  getExerciseLogs = async (
    req: Request<object, object, object, { workoutId?: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { workoutId } = req.query;
      if (!workoutId) {
        res.status(400).json({ error: "workoutId query param is required" });
        return;
      }
      const workout = await this.workoutRepo.getWorkoutById(workoutId);
      if (!workout) {
        res.status(404).json({ error: "Workout not found" });
        return;
      }
      if (workout.userId !== userId) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      const exerciseLogs = await this.exerciseLogRepo.getAllByWorkoutId(workoutId);
      res.status(200).json({ exerciseLogs });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  createExerciseLog = async (
    req: Request<object, object, CreateExerciseLogBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { workoutId, exerciseId, orderIndex, notes } = req.body;
      const workout = await this.workoutRepo.getWorkoutById(workoutId);
      if (!workout) {
        res.status(404).json({ error: "Workout not found" });
        return;
      }
      if (workout.userId !== userId) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      await this.exerciseLogRepo.createLog(workoutId, exerciseId, orderIndex, notes);
      res.status(201).json({ message: "Exercise log created" });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  updateExerciseLog = async (
    req: Request<{ id: string }, object, UpdateExerciseLogBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: logId } = req.params;
      const { orderIndex, notes } = req.body;
      const updates = Object.fromEntries(
        Object.entries({ orderIndex, notes }).filter(([_, v]) => v !== undefined),
      );
      const result = await this.exerciseLogRepo.updateLog(logId, userId, updates);
      if (result === NO_UPDATES) {
        res.status(400).json({ error: "Bad request" });
        return;
      }
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Exercise log not found" });
        return;
      }
      if (result === UNAUTHORIZED) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      res.status(200).json({ message: "Exercise log updated", exerciseLog: result });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  deleteExerciseLog = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: logId } = req.params;
      const result = await this.exerciseLogRepo.deleteLog(logId, userId);
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Exercise log not found" });
        return;
      }
      if (result === UNAUTHORIZED) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };
}

export default ExerciseLogController;
