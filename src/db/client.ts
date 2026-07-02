import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '@/db/schema';

type Database = ReturnType<typeof createDrizzle>;

let db: Database | null = null;

function createDrizzle(connectionString: string) {
  const client = postgres(connectionString, {
    prepare: false,
    max: 1,
    ssl: 'require',
    connect_timeout: 30,
  });
  return drizzle(client, { schema });
}

/** Server-only Drizzle client (API routes, migration scripts). */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required for database access');
  }

  if (!db) {
    db = createDrizzle(url);
  }

  return db;
}
