import type { ExerciseLog } from "../types/exerciseLog";
import apiClient from "./apiClient";

type CreateExerciseLogInput = {
  workoutId: string;
  exerciseId: string;
  orderIndex?: number;
};

export const getExerciseLogs = async (workoutId: string): Promise<ExerciseLog[]> => {
  const response = await apiClient.get(`/exercise-logs?workoutId=${workoutId}`);
  return response.data.exerciseLogs;
};

export const createExerciseLog = async (input: CreateExerciseLogInput): Promise<string> => {
  const response = await apiClient.post("/exercise-logs", input);
  return response.data.id;
};
