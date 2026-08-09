import { Request, Response } from "express";
import { Pool } from "pg";
import { NOT_FOUND, NO_UPDATES, UNAUTHORIZED } from "../constants/repoResults";
import { ExerciseRepo } from "../repositories/ExerciseRepo";
import { CreateExerciseBody, UpdateExerciseBody } from "../schemas/exercise.schema";
import { logger } from "../utils/logger";

class ExerciseController {
  private exerciseRepo: ExerciseRepo;
  constructor(pool: Pool) {
    this.exerciseRepo = new ExerciseRepo(pool);
  }

  getExercises = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const exercises = await this.exerciseRepo.getAllExercises(userId);
      res.status(200).json({ exercises });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  createExercise = async (
    req: Request<object, object, CreateExerciseBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const { name, type, muscleGroup } = req.body;
      const userId = req.user!.id;
      const exerciseId = await this.exerciseRepo.createExercise(
        name,
        type,
        true,
        userId,
        muscleGroup,
      );
      res.status(201).json({ message: "Exercise created", exerciseId });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  updateExercise = async (
    req: Request<{ id: string }, object, UpdateExerciseBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: exerciseId } = req.params;
      const { name, type, muscleGroup } = req.body;
      const updates = Object.fromEntries(
        Object.entries({ name, type, muscleGroup }).filter(([_, v]) => v !== undefined),
      );
      const result = await this.exerciseRepo.updateExercise(exerciseId, userId, updates);
      if (result === NO_UPDATES) {
        res.status(400).json({ error: "Bad request" });
        return;
      }
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Exercise not found" });
        return;
      }
      if (result === UNAUTHORIZED) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      res.status(200).json({ message: "Exercise updated", exercise: result });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  deleteExercise = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: exerciseId } = req.params;
      const result = await this.exerciseRepo.deleteExercise(exerciseId, userId);
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Exercise not found" });
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

export default ExerciseController;
