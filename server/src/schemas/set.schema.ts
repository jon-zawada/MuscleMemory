import { z } from "zod";

export const createSetSchema = z.object({
  exerciseLogId: z.uuid("exerciseLogId must be a valid UUID"),
  setNumber: z.number().int().min(1, "setNumber must be at least 1"),
  isWarmup: z.boolean({ error: "isWarmup is required" }),
  weightKg: z.number().min(0).optional(),
  reps: z.number().int().min(0).optional(),
  durationSeconds: z.number().int().min(0).optional(),
  distanceMeters: z.number().min(0).optional(),
  rpe: z.number().min(0).max(10, "rpe must be between 0 and 10").optional(),
  completedAt: z.iso.datetime({ message: "completedAt must be a valid ISO datetime" }).optional(),
});

export const updateSetSchema = z.object({
  isWarmup: z.boolean().optional(),
  weightKg: z.number().min(0).optional(),
  reps: z.number().int().min(0).optional(),
  durationSeconds: z.number().int().min(0).optional(),
  distanceMeters: z.number().min(0).optional(),
  rpe: z.number().min(0).max(10, "rpe must be between 0 and 10").optional(),
  completedAt: z.iso.datetime({ message: "completedAt must be a valid ISO datetime" }).optional(),
});

export type CreateSetBody = z.infer<typeof createSetSchema>;
export type UpdateSetBody = z.infer<typeof updateSetSchema>;
