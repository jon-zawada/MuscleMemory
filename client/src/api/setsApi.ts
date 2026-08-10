import type { Set } from "../types/set";
import apiClient from "./apiClient";

export const getSets = async (exerciseLogId: string): Promise<Set[]> => {
  const response = await apiClient.get(`/sets?exerciseLogId=${exerciseLogId}`);
  return response.data.sets;
};

type CreateSetInput = {
  exerciseLogId: string;
  setNumber: number;
  isWarmup: boolean;
  weightKg?: number;
  reps?: number;
  rpe?: number;
};

export const createSet = async (input: CreateSetInput): Promise<string> => {
  const response = await apiClient.post("/sets", input);
  return response.data.id;
};

export const completeSet = async (setId: string): Promise<Set> => {
  const response = await apiClient.patch(`/sets/${setId}`, {
    completedAt: new Date().toISOString(),
  });
  return response.data.set;
};

type UpdateSetInput = Partial<{
  weightKg: number;
  reps: number;
  rpe: number;
  isWarmup: boolean;
  completedAt: string;
}>;

export const updateSet = async (setId: string, updates: UpdateSetInput): Promise<Set> => {
  const response = await apiClient.patch(`/sets/${setId}`, updates);
  return response.data.set;
};
