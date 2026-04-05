import { Request, Response } from "express";
import { Pool } from "pg";
import { NOT_FOUND, NO_UPDATES, UNAUTHORIZED } from "../constants/repoResults";
import { WorkoutRepo } from "../repositories/WorkoutRepo";
import { CreateWorkoutBody, UpdateWorkoutBody } from "../schemas/workout.schema";
import { logger } from "../utils/logger";

class WorkoutController {
  private workoutRepo: WorkoutRepo;
  constructor(pool: Pool) {
    this.workoutRepo = new WorkoutRepo(pool);
  }

  getWorkouts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const workouts = await this.workoutRepo.getAllByUserId(userId);
      res.status(200).json({ workouts });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  createWorkout = async (
    req: Request<object, object, CreateWorkoutBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const { name, status, assignedBy, notes, completedAt } = req.body;
      const userId = req.user!.id;
      await this.workoutRepo.createWorkout(userId, status, name, assignedBy, notes, completedAt);
      res.status(201).json({ message: "Workout created" });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  updateWorkout = async (
    req: Request<{ id: string }, object, UpdateWorkoutBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: workoutId } = req.params;
      const { status, name, assignedBy, notes, completedAt } = req.body;
      const updates = Object.fromEntries(
        Object.entries({ status, name, assignedBy, notes, completedAt }).filter(
          ([_, v]) => v !== undefined,
        ),
      );
      const result = await this.workoutRepo.updateWorkoutById(workoutId, userId, updates);
      if (result === NO_UPDATES) {
        res.status(400).json({ error: "Bad request" });
        return;
      }
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Workout not found" });
        return;
      }
      if (result === UNAUTHORIZED) {
        res.status(403).json({ error: "Invalid permission" });
        return;
      }
      res.status(200).json({ message: "Workout updated", workout: result });
    } catch (error) {
      logger.error("[SERVER]" + error);
      res.status(500).json({ error: "Internal Server error" });
    }
  };

  deleteWorkout = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id: workoutId } = req.params;
      const result = await this.workoutRepo.deleteWorkoutById(workoutId, userId);
      if (result === NOT_FOUND) {
        res.status(404).json({ error: "Workout not found" });
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

export default WorkoutController;
