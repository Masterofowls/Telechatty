import './load-env';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  const client = postgres(url, {
    max: 1,
    prepare: false,
    ssl: 'require',
    connect_timeout: 30,
  });
  const db = drizzle(client);

  console.log('Running Drizzle migrations…');
  await migrate(db, { migrationsFolder: './drizzle/migrations' });
  await client.end({ timeout: 5 });
  console.log('Migrations complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
