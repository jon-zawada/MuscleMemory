import { Request, Response } from "express";
import { Pool } from "pg";
import { z } from "zod";
import { NOT_FOUND, NO_UPDATES, OK, RepoResult, UNAUTHORIZED } from "../constants/repoResults";
import { ExerciseLogRepo } from "../repositories/ExerciseLogRepo";
import { SetRepo } from "../repositories/SetRepo";
import { WorkoutRepo } from "../repositories/WorkoutRepo";
import { CreateSetBody, UpdateSetBody } from "../schemas/set.schema";
import { logger } from "../utils/logger";

class SetController {
  private setRepo: SetRepo;
  private exerciseLogRepo: ExerciseLogRepo;
  private workoutRepo: WorkoutRepo;
  constructor(pool: Pool) {
    this.setRepo = new SetRepo(pool);
    this.exerciseLogRepo = new ExerciseLogRepo(pool);
    this.workoutRepo = new WorkoutRepo(pool);
  }

  private canAccessExerciseLog = async (
    exerciseLogId: string,
    userId: string,
  ): Promise<RepoResult> => {
    const exerciseLog = await this.exerciseLogRepo.getByLogId(exerciseLogId);
    if (!exerciseLog) {
      return NOT_FOUND;
    }
    const workout = await this.workoutRepo.getWorkoutById(exerciseLog.workoutId);
    if (!workout || workout.userId !== userId) {
      return UNAUTHORIZED;
    }
    return OK;
  };

  getSets = async (
    req: Request<object, object, object, { exerciseLogId?: string }>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { exerciseLogId } = req.query;
      if (!exerciseLogId) {
        res.status(400).json({ error: "exerciseLogId query param is required" });
        return;
      }
      if (!z.uuid().safeParse(exerciseLogId).success) {
        res.status(400).json({ error: "exerciseLogId must be a valid UUID" });
        return;
      }
      const access = await this.canAccessExerciseLog(exerciseLogId, userId);
      if (access === NOT_FOUND) {
        res.status(404).json({ error: "Exercise log not found" });
        return;
      }
      if (access === UNAUTHORIZED) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      const sets = await this.setRepo.getAllByExerciseLogId(exerciseLogId);
      res.status(200).json({ sets });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  createSet = async (req: Request<object, object, CreateSetBody>, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const {
        exerciseLogId,
        setNumber,
        isWarmup,
        weightKg,
        reps,
        durationSeconds,
        distanceMeters,
        rpe,
        completedAt,
      } = req.body;
      const access = await this.canAccessExerciseLog(exerciseLogId, userId);
      if (access === NOT_FOUND) {
        res.status(404).json({ error: "Exercise log not found" });
        return;
      }
      if (access === UNAUTHORIZED) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      const id = await this.setRepo.createSet(
        exerciseLogId,
        setNumber,
        isWarmup,
        weightKg,
        reps,
        durationSeconds,
        distanceMeters,
        rpe,
        completedAt,
      );
      res.status(201).json({ message: "Set created", id });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  updateSet = async (
    req: Request<{ id: string }, object, UpdateSetBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: setId } = req.params;
      const { isWarmup, weightKg, reps, durationSeconds, distanceMeters, rpe, completedAt } =
        req.body;
      const updates = Object.fromEntries(
        Object.entries({
          isWarmup,
          weightKg,
          reps,
          durationSeconds,
          distanceMeters,
          rpe,
          completedAt,
        }).filter(([_, v]) => v !== undefined),
      );
      const result = await this.setRepo.updateSet(setId, userId, updates);
      if (result === NO_UPDATES) {
        res.status(400).json({ error: "Bad request" });
        return;
      }
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Set not found" });
        return;
      }
      if (result === UNAUTHORIZED) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      res.status(200).json({ message: "Set updated", set: result });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  deleteSet = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: setId } = req.params;
      const result = await this.setRepo.deleteSet(setId, userId);
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Set not found" });
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

export default SetController;
