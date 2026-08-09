import { Pool } from "pg";
import { NOT_FOUND, NO_UPDATES, OK, RepoResult, UNAUTHORIZED } from "../constants/repoResults";
import { Workout, WorkoutStatus } from "../types/workout";

export class WorkoutRepo {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAllByUserId = async (userId: string): Promise<Workout[]> => {
    const query = `SELECT id, user_id AS "userId", name, notes, status, started_at AS "startedAt", completed_at AS "completedAt", assigned_by AS "assignedBy" FROM workouts WHERE user_id = $1`;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  };

  getWorkoutById = async (workoutId: string): Promise<Workout | undefined> => {
    const query = `SELECT id, user_id AS "userId", name, notes, status, started_at AS "startedAt", completed_at AS "completedAt", assigned_by AS "assignedBy" FROM workouts WHERE id = $1`;
    const result = await this.pool.query(query, [workoutId]);
    return result.rows[0];
  };

  createWorkout = async (
    userId: string,
    status: WorkoutStatus,
    name?: string,
    assignedBy?: string,
    notes?: string,
    completedAt?: string,
  ): Promise<string> => {
    const query = `INSERT INTO workouts (user_id, status, name, assigned_by, notes, completed_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const result = await this.pool.query(query, [
      userId,
      status,
      name,
      assignedBy,
      notes,
      completedAt,
    ]);
    return result.rows[0].id;
  };

  updateWorkoutById = async (
    workoutId: string,
    userId: string,
    updates: Partial<
      Pick<Workout, "name" | "notes" | "status" | "startedAt" | "completedAt" | "assignedBy">
    >,
  ): Promise<Workout | RepoResult> => {
    if (Object.keys(updates).length === 0) {
      return NO_UPDATES;
    }
    const workout = await this.getWorkoutById(workoutId);
    if (!workout) {
      return NOT_FOUND;
    }
    if (userId !== workout.userId) {
      return UNAUTHORIZED;
    }
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (updates.name) {
      setClauses.push(`name = $${paramIndex++}`);
      params.push(updates.name);
    }
    if (updates.notes) {
      setClauses.push(`notes = $${paramIndex++}`);
      params.push(updates.notes);
    }
    if (updates.status) {
      setClauses.push(`status = $${paramIndex++}`);
      params.push(updates.status);
    }
    if (updates.startedAt) {
      setClauses.push(`started_at = $${paramIndex++}`);
      params.push(updates.startedAt);
    }
    if (updates.completedAt) {
      setClauses.push(`completed_at = $${paramIndex++}`);
      params.push(updates.completedAt);
    }
    if (updates.assignedBy) {
      setClauses.push(`assigned_by = $${paramIndex++}`);
      params.push(updates.assignedBy);
    }
    params.push(workoutId);
    const query = `UPDATE workouts SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING id, user_id AS "userId", name, notes, status, started_at AS "startedAt", completed_at AS "completedAt", assigned_by AS "assignedBy"`;
    const result = await this.pool.query(query, params);
    return result.rows[0];
  };

  deleteWorkoutById = async (workoutId: string, userId: string): Promise<RepoResult> => {
    const workout = await this.getWorkoutById(workoutId);
    if (!workout) {
      return NOT_FOUND;
    }
    if (userId !== workout.userId) {
      return UNAUTHORIZED;
    }
    const query = `DELETE FROM workouts WHERE id = $1`;
    await this.pool.query(query, [workoutId]);
    return OK;
  };
}
