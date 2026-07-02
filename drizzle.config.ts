import './scripts/load-env';

import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is missing. Copy .env.example to .env and set your Supabase Postgres URL.',
  );
}

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
  migrations: {
    prefix: 'index',
    table: '__drizzle_migrations',
    schema: 'public',
  },
});
