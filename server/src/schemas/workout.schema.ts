import { z } from "zod";

export const createWorkoutSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be under 100 characters")
    .optional(),
  status: z.enum(["assigned", "in_progress", "completed"]),
  assignedBy: z.uuid("assignedBy must be a valid user ID").optional(),
  notes: z.string().optional(),
  completedAt: z.iso.datetime({ message: "completedAt must be a valid ISO datetime" }).optional(),
});

export const updateWorkoutSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be under 100 characters")
    .optional(),
  status: z.enum(["assigned", "in_progress", "completed"]).optional(),
  assignedBy: z.uuid("assignedBy must be a valid user ID").optional(),
  notes: z.string().optional(),
  completedAt: z.iso.datetime({ message: "completedAt must be a valid ISO datetime" }).optional(),
});

export type CreateWorkoutBody = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutBody = z.infer<typeof updateWorkoutSchema>;
