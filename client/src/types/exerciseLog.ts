export interface ExerciseLog {
  id: string;
  workoutId: string;
  exerciseId: string;
  orderIndex?: number | null;
  notes?: string | null;
}
