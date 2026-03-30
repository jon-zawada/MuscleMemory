CREATE TYPE workout_status AS ENUM ('assigned', 'in_progress', 'completed');

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  user_id UUID NOT NULL REFERENCES users (id),
  assigned_by UUID REFERENCES users (id),
  name VARCHAR(100),
  notes TEXT,
  status workout_status NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT NOW (),
  completed_at TIMESTAMPTZ
);
