CREATE TABLE IF NOT EXISTS loy_seats (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  kind TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_user_id, email)
);
