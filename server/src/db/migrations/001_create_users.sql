CREATE TYPE user_role AS ENUM ('athlete', 'coach');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'athlete',
  created_at TIMESTAMPTZ DEFAULT NOW ()
);
