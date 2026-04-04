import { Pool } from "pg";
import { NOT_FOUND, NO_UPDATES, OK, RepoResult, UNAUTHORIZED } from "../constants/repoResults";
import { Exercise, ExerciseType } from "../types/exercise";

export class ExerciseRepo {
  private pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  getAllExercises = async (userId: string): Promise<Exercise[]> => {
    const query = `SELECT id, name, type, muscle_group AS "muscleGroup", is_custom AS "isCustom", created_by AS "createdBy" FROM exercises WHERE is_custom = false OR created_by = $1`;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  };

  getExerciseById = async (exerciseId: string): Promise<Exercise | undefined> => {
    const query = `SELECT id, name, type, muscle_group AS "muscleGroup", is_custom AS "isCustom", created_by AS "createdBy" FROM exercises WHERE id = $1`;
    const result = await this.pool.query(query, [exerciseId]);
    return result.rows[0];
  };

  createExercise = async (
    name: string,
    type: ExerciseType,
    muscleGroup: string,
    isCustom: boolean,
    userId: string,
  ): Promise<void> => {
    const query = `INSERT INTO exercises (name, type, muscle_group, is_custom, created_by) VALUES ($1, $2, $3, $4, $5)`;
    await this.pool.query(query, [name, type, muscleGroup, isCustom, userId]);
  };

  updateExercise = async (
    exerciseId: string,
    userId: string,
    updates: Partial<Pick<Exercise, "name" | "type" | "muscleGroup">>,
  ): Promise<RepoResult> => {
    if (Object.keys(updates).length === 0) {
      return NO_UPDATES;
    }
    const exercise = await this.getExerciseById(exerciseId);
    if (!exercise) {
      return NOT_FOUND;
    }
    if (userId !== exercise.createdBy) {
      return UNAUTHORIZED;
    }
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (updates.name) {
      setClauses.push(`name = $${paramIndex++}`);
      params.push(updates.name);
    }
    if (updates.type) {
      setClauses.push(`type = $${paramIndex++}`);
      params.push(updates.type);
    }
    if (updates.muscleGroup) {
      setClauses.push(`muscle_group = $${paramIndex++}`);
      params.push(updates.muscleGroup);
    }
    params.push(exerciseId);
    const query = `UPDATE exercises SET ${setClauses.join(", ")} WHERE id = $${paramIndex}`;
    await this.pool.query(query, params);
    return OK;
  };

  deleteExercise = async (exerciseId: string, userId: string): Promise<RepoResult> => {
    const exercise = await this.getExerciseById(exerciseId);
    if (!exercise) {
      return NOT_FOUND;
    }
    if (userId !== exercise.createdBy) {
      return UNAUTHORIZED;
    }
    const query = `DELETE FROM exercises WHERE id = $1`;
    await this.pool.query(query, [exerciseId]);
    return OK;
  };
}
