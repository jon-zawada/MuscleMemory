import { Pool } from "pg";
import { NOT_FOUND, NO_UPDATES, OK, RepoResult, UNAUTHORIZED } from "../constants/repoResults";
import { Set } from "../types/set";

export class SetRepo {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAllByExerciseLogId = async (exerciseLogId: string): Promise<Set[]> => {
    const query = `SELECT id, exercise_log_id as "exerciseLogId", set_number AS "setNumber", weight_kg AS "weightKg", reps, duration_seconds AS "durationSeconds", distance_meters AS "distanceMeters", is_warmup AS "isWarmup", rpe, completed_at AS "completedAt" FROM sets WHERE exercise_log_id = $1`;
    const result = await this.pool.query(query, [exerciseLogId]);
    return result.rows;
  };

  getBySetId = async (setId: string): Promise<Set | undefined> => {
    const query = `SELECT id, exercise_log_id as "exerciseLogId", set_number AS "setNumber", weight_kg AS "weightKg", reps, duration_seconds AS "durationSeconds", distance_meters AS "distanceMeters", is_warmup AS "isWarmup", rpe, completed_at AS "completedAt" FROM sets WHERE id = $1`;
    const result = await this.pool.query(query, [setId]);
    return result.rows[0];
  };

  createSet = async (
    exerciseLogId: string,
    setNumber: number,
    isWarmup: boolean,
    weightKg?: number,
    reps?: number,
    durationSeconds?: number,
    distanceMeters?: number,
    rpe?: number,
    completedAt?: string,
  ): Promise<void> => {
    const query = `INSERT INTO sets (exercise_log_id, set_number, weight_kg, reps, duration_seconds, distance_meters, is_warmup, rpe, completed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    await this.pool.query(query, [
      exerciseLogId,
      setNumber,
      weightKg,
      reps,
      durationSeconds,
      distanceMeters,
      isWarmup,
      rpe,
      completedAt,
    ]);
  };

  updateSet = async (
    setId: string,
    userId: string,
    updates: Partial<
      Pick<
        Set,
        | "setNumber"
        | "weightKg"
        | "reps"
        | "durationSeconds"
        | "distanceMeters"
        | "isWarmup"
        | "rpe"
        | "completedAt"
      >
    >,
  ): Promise<Set | RepoResult> => {
    if (Object.keys(updates).length === 0) {
      return NO_UPDATES;
    }
    const set = await this.getBySetId(setId);
    if (!set) {
      return NOT_FOUND;
    }
    const ownerCheck = await this.pool.query(
      `SELECT w.user_id FROM workouts w JOIN exercise_logs el ON el.workout_id = w.id WHERE el.id = $1`,
      [set.exerciseLogId],
    );
    if (ownerCheck.rows[0]?.user_id !== userId) {
      return UNAUTHORIZED;
    }
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (updates.setNumber !== undefined) {
      setClauses.push(`set_number = $${paramIndex++}`);
      params.push(updates.setNumber);
    }
    if (updates.weightKg !== undefined) {
      setClauses.push(`weight_kg = $${paramIndex++}`);
      params.push(updates.weightKg);
    }
    if (updates.reps !== undefined) {
      setClauses.push(`reps = $${paramIndex++}`);
      params.push(updates.reps);
    }
    if (updates.durationSeconds !== undefined) {
      setClauses.push(`duration_seconds = $${paramIndex++}`);
      params.push(updates.durationSeconds);
    }
    if (updates.distanceMeters !== undefined) {
      setClauses.push(`distance_meters = $${paramIndex++}`);
      params.push(updates.distanceMeters);
    }
    if (updates.isWarmup !== undefined) {
      setClauses.push(`is_warmup = $${paramIndex++}`);
      params.push(updates.isWarmup);
    }
    if (updates.rpe !== undefined) {
      setClauses.push(`rpe = $${paramIndex++}`);
      params.push(updates.rpe);
    }
    if (updates.completedAt !== undefined) {
      setClauses.push(`completed_at = $${paramIndex++}`);
      params.push(updates.completedAt);
    }
    params.push(setId);
    const query = `UPDATE sets SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING id, exercise_log_id AS "exerciseLogId", set_number AS "setNumber", weight_kg AS "weightKg", reps, duration_seconds AS "durationSeconds", distance_meters AS "distanceMeters", is_warmup AS "isWarmup", rpe, completed_at AS "completedAt"`;
    const result = await this.pool.query(query, params);
    return result.rows[0];
  };
  deleteSet = async (setId: string, userId: string): Promise<RepoResult> => {
    const set = await this.getBySetId(setId);
    if (!set) {
      return NOT_FOUND;
    }
    const ownerCheck = await this.pool.query(
      `SELECT w.user_id as "userId" FROM workouts w JOIN exercise_logs el ON el.workout_id = w.id WHERE el.id = $1`,
      [set.exerciseLogId],
    );
    if (ownerCheck.rows[0]?.userId !== userId) {
      return UNAUTHORIZED;
    }
    const query = `DELETE FROM sets WHERE id = $1`;
    await this.pool.query(query, [setId]);
    return OK;
  };
}
