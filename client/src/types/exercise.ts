export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  muscleGroup: string;
  isCustom: boolean;
  createdBy: string | null;
}

export type ExerciseType = "strength" | "cardio" | "bodyweight";
