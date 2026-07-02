# Drizzle migrations

This folder is the **source of truth** for the Telechatty database schema.

## Files

| Migration | Purpose |
|-----------|---------|
| `0000_profiles.sql` | `profiles` table (generated from `src/db/schema`) |
| `0001_supabase_policies.sql` | Supabase RLS, auth trigger, avatar storage policies |

## Prerequisites

1. Copy `.env.example` → `.env`
2. Set `DATABASE_URL` (Supabase → Database → Connection string, **Transaction** pooler port `6543`)

Drizzle Kit reads `DATABASE_URL` from `.env` / `.env.local` automatically via `drizzle.config.ts`.

## Drizzle Kit CLI

All commands are available as npm scripts (or run `npx drizzle-kit <command>` directly):

| Command | Script | Description |
|---------|--------|-------------|
| `generate` | `npm run db:generate` | Generate SQL migration from `src/db/schema` changes |
| `migrate` | `npm run db:migrate` | Apply migrations (custom script, pooler-safe) |
| `migrate` | `npm run db:migrate:kit` | Apply migrations via Drizzle Kit |
| `push` | `npm run db:push` | Push schema directly to DB (dev only) |
| `introspect` | `npm run db:pull` | Pull existing DB schema into Drizzle |
| `check` | `npm run db:check` | Validate migrations against schema |
| `studio` | `npm run db:studio` | Open Drizzle Studio UI |
| `drop` | `npm run db:drop` | Drop migration metadata (use with care) |
| `export` | `npm run db:export` | Export schema diff as SQL |
| `up` | `npm run db:up` | Upgrade drizzle-kit metadata |

Shortcut for any subcommand:

```bash
npm run db -- --help
npm run db -- generate --name add_posts
```

## Drizzle Studio

Browse and edit database rows in a local web UI:

```bash
npm run db:studio
```

Opens at **http://127.0.0.1:4983** by default (configurable via `DRIZZLE_STUDIO_HOST` / `DRIZZLE_STUDIO_PORT` in `.env`).

Studio uses the same `DATABASE_URL` as migrations. Keep it server-side only — never commit or expose it in client code.

## Typical workflow

```bash
# 1. Edit TypeScript schema
#    src/db/schema/*.ts

# 2. Generate migration SQL
npm run db:generate

# 3. Review new file in drizzle/migrations/

# 4. Apply to Supabase Postgres
npm run db:migrate

# 5. Inspect data (optional)
npm run db:studio
```

## Schema definition

Edit TypeScript schema in `src/db/schema/` — not raw SQL in application code.
Repositories in `src/db/repositories/` use Drizzle query builder for all reads/writes.

After changing the schema, run `npm run db:generate` and review the new SQL before migrating.
