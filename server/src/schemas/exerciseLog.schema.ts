import { z } from "zod";

export const createExerciseLogSchema = z.object({
  workoutId: z.uuid("workoutId must be a valid UUID"),
  exerciseId: z.uuid("exerciseId must be a valid UUID"),
  orderIndex: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export const updateExerciseLogSchema = z.object({
  orderIndex: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

export type CreateExerciseLogBody = z.infer<typeof createExerciseLogSchema>;
export type UpdateExerciseLogBody = z.infer<typeof updateExerciseLogSchema>;
