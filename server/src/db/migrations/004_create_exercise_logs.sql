CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
  order_index SMALLINT,
  notes TEXT
);