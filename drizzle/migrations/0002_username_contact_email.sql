ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "contact_email" text;
--> statement-breakpoint
UPDATE "profiles" SET "username" = 'user_' || substr(replace("id"::text, '-', ''), 1, 8)
WHERE "username" IS NULL;
--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "username" SET NOT NULL;
