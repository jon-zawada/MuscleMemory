export interface Workout {
  id: string;
  userId: string;
  name: string;
  status: WorkoutStatus;
  startedAt: string;
  assignedBy?: string | null;
  completedAt?: string;
  notes?: string;
}

export type WorkoutStatus = "assigned" | "in_progress" | "completed";
