CREATE TABLE IF NOT EXISTS "profiles" (
  "id" uuid PRIMARY KEY NOT NULL,
  "updated_at" timestamptz,
  "username" text UNIQUE,
  "full_name" text,
  "avatar_url" text,
  CONSTRAINT "username_length" CHECK ("username" IS NULL OR char_length("username") >= 3)
);
--> statement-breakpoint
ALTER TABLE "profiles"
  ADD CONSTRAINT "profiles_id_fkey"
  FOREIGN KEY ("id") REFERENCES auth.users(id) ON DELETE CASCADE;
