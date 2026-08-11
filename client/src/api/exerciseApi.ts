import type { Exercise } from "../types/exercise";
import apiClient from "./apiClient";

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await apiClient.get("/exercises");
  return response.data.exercises;
};
