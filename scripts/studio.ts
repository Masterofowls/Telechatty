import './load-env';

import { spawnSync } from 'node:child_process';

const host = process.env.DRIZZLE_STUDIO_HOST ?? '127.0.0.1';
const port = process.env.DRIZZLE_STUDIO_PORT ?? '4983';

console.log(`Starting Drizzle Studio at http://${host}:${port}`);

const result = spawnSync(
  'drizzle-kit',
  ['studio', '--host', host, '--port', port, '--verbose'],
  { stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 1);
