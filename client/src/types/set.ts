export interface Set {
  id: string;
  exerciseLogId: string;
  setNumber: number;
  isWarmup: boolean;
  weightKg?: number | null;
  reps?: number | null;
  durationSeconds?: number | null;
  distanceMeters?: number | null;
  rpe?: number | null;
  completedAt?: string | null;
}
