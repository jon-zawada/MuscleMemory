import { z } from "zod";

export const createExerciseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  type: z.enum(["strength", "cardio", "bodyweight"]),
  muscleGroup: z
    .string()
    .min(1, "Muscle group cannot be empty")
    .max(50, "Muscle group must be under 50 characters")
    .optional(),
});

export const updateExerciseSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be under 100 characters")
    .optional(),
  type: z.enum(["strength", "cardio", "bodyweight"]).optional(),
  muscleGroup: z
    .string()
    .min(1, "Muscle group cannot be empty")
    .max(50, "Muscle group must be under 50 characters")
    .optional(),
});

export type CreateExerciseBody = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseBody = z.infer<typeof updateExerciseSchema>;
