CREATE TYPE exercise_type AS ENUM ('strength', 'cardio', 'bodyweight');

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  name VARCHAR(100) NOT NULL,
  type exercise_type NOT NULL,
  muscle_group VARCHAR(50),
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES users (id)
);
