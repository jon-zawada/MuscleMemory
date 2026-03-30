CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  exercise_log_id UUID NOT NULL REFERENCES exercise_logs (id) ON DELETE CASCADE,
  set_number SMALLINT NOT NULL,
  weight_kg NUMERIC(6, 2),
  reps SMALLINT,
  duration_seconds INTEGER,
  distance_meters NUMERIC(8, 2),
  is_warmup BOOLEAN NOT NULL DEFAULT false,
  rpe SMALLINT,
  completed_at TIMESTAMPTZ
);
