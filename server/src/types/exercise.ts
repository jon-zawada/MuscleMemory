export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  muscleGroup: string;
  isCustom: boolean;
  createdBy: string;
}

export type ExerciseType = "strength" | "cardio" | "bodyweight";
