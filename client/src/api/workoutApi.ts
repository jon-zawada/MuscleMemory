import type { Workout, WorkoutStatus } from "../types/workout";
import apiClient from "./apiClient";

type CreateWorkoutInput = {
  name?: string;
  status: WorkoutStatus;
  assignedBy?: string;
  notes?: string;
  completedAt?: string;
};

export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await apiClient.get("/workouts");
  return response.data.workouts;
};

export const createWorkout = async (input: CreateWorkoutInput): Promise<string> => {
  const response = await apiClient.post("/workouts", input);
  const { workoutId } = response.data;
  return workoutId;
};

export const updateWorkout = async (
  workoutId: string,
  updates: Partial<{ status: WorkoutStatus; completedAt: string; name: string; notes: string }>,
): Promise<Workout> => {
  const response = await apiClient.patch(`/workouts/${workoutId}`, updates);
  return response.data.workout;
};
