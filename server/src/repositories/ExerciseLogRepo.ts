import { Pool } from "pg";
import { NOT_FOUND, NO_UPDATES, OK, RepoResult, UNAUTHORIZED } from "../constants/repoResults";
import { ExerciseLog } from "../types/exerciseLog";

export class ExerciseLogRepo {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAllByWorkoutId = async (workoutId: string): Promise<ExerciseLog[]> => {
    const query = `SELECT id, workout_id AS "workoutId", exercise_id as "exerciseId", order_index AS "orderIndex", notes FROM exercise_logs WHERE workout_id = $1`;
    const result = await this.pool.query(query, [workoutId]);
    return result.rows;
  };
  getByLogId = async (logId: string): Promise<ExerciseLog | undefined> => {
    const query = `SELECT id, workout_id AS "workoutId", exercise_id as "exerciseId", order_index AS "orderIndex", notes FROM exercise_logs WHERE id = $1`;
    const result = await this.pool.query(query, [logId]);
    return result.rows[0];
  };
  createLog = async (
    workoutId: string,
    exerciseId: string,
    orderIndex?: number,
    notes?: string,
  ): Promise<string> => {
    const query = `INSERT INTO exercise_logs (workout_id, exercise_id, order_index, notes) VALUES ($1, $2, $3, $4) RETURNING id`;
    const result = await this.pool.query(query, [workoutId, exerciseId, orderIndex, notes]);
    return result.rows[0].id;
  };
  updateLog = async (
    logId: string,
    userId: string,
    updates: Partial<Pick<ExerciseLog, "orderIndex" | "notes">>,
  ): Promise<ExerciseLog | RepoResult> => {
    if (Object.keys(updates).length === 0) {
      return NO_UPDATES;
    }
    const exerciseLog = await this.getByLogId(logId);
    if (!exerciseLog) {
      return NOT_FOUND;
    }
    const ownerCheck = await this.pool.query(
      `SELECT user_id AS "userId" FROM workouts WHERE id = $1`,
      [exerciseLog.workoutId],
    );
    if (ownerCheck.rows[0]?.userId !== userId) {
      return UNAUTHORIZED;
    }
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (updates.orderIndex !== undefined) {
      setClauses.push(`order_index = $${paramIndex++}`);
      params.push(updates.orderIndex);
    }
    if (updates.notes !== undefined) {
      setClauses.push(`notes = $${paramIndex++}`);
      params.push(updates.notes);
    }
    params.push(logId);
    const query = `UPDATE exercise_logs SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING id, workout_id AS "workoutId", exercise_id AS "exerciseId", order_index AS "orderIndex", notes`;
    const result = await this.pool.query(query, params);
    return result.rows[0];
  };
  deleteLog = async (logId: string, userId: string): Promise<RepoResult> => {
    const exerciseLog = await this.getByLogId(logId);
    if (!exerciseLog) {
      return NOT_FOUND;
    }
    const ownerCheck = await this.pool.query(
      `SELECT user_id AS "userId" FROM workouts WHERE id = $1`,
      [exerciseLog.workoutId],
    );
    if (ownerCheck.rows[0]?.userId !== userId) {
      return UNAUTHORIZED;
    }
    const query = `DELETE FROM exercise_logs WHERE id = $1`;
    await this.pool.query(query, [logId]);
    return OK;
  };
}
