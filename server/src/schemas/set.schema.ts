import {z} from 'zod';

export const createSetSchema = z.object({
  exerciseLogId: z.string().min(1, "Exercise log id is require"),
  setNumber: z.number().min(/*noidea*/),
  isWarmup: z.boolean(), //how do i put message here?
  weightKg: z.number().optional(),
  reps: z.number().optional(),
  durationSeconds: z.number().optional(),
  distanceMeters: z.number().optional(),
  rpe: z.number().optional(),
  completedAt: z.string().optional()
});

export const updateSetSchema = z.object({
  isWarmup: z.boolean(), //how do i put message here?
  weightKg: z.number().optional(),
  reps: z.number().optional(),
  durationSeconds: z.number().optional(),
  distanceMeters: z.number().optional(),
  rpe: z.number().optional(),
  completedAt: z.string().optional()
})

export type CreateSetBody = z.infer<typeof createSetSchema>;
export type UpdateSetBody = z.infer<typeof updateSetSchema>;