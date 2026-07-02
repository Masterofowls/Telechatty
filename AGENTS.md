## Learned User Preferences

- Prefer Drizzle ORM over direct SQL; integrate Drizzle deeply (schema, migrations, repositories, API routes).
- Use Drizzle Kit CLI and `drizzle-kit studio` for database workflow.
- Primary auth fields are username and password; contact email is optional.
- Include passkey sign-in on web when implementing auth.
- Base Telegram-inspired features on `yt_transcript.txt` and existing repo patterns.

## Learned Workspace Facts

- Telechatty is an Expo (React Native + TypeScript) Telegram-style chat app for iOS, Android, and Web.
- Data layer: Drizzle ORM to Supabase Postgres via Expo API routes (`src/app/api/`); schema and repos under `src/db/`.
- Auth uses Supabase; usernames map to internal auth emails via `usernameToAuthEmail()` in `src/lib/auth/username.ts`.
- Chat SDKs: `stream-chat-expo` (native) and `stream-chat-react` (web); CSS from `stream-chat-react/dist/css/index.css`.
- Web Metro config must include `css` in `sourceExts` (`metro.config.js`) for Stream Chat styles on web.
- `DATABASE_URL` uses the Supabase Transaction pooler (port `6543`); server-only, never expose to the client.
- Disable Supabase email confirmation for dev (`mailer_autoconfirm`); run `npm run auth:disable-email` with `SUPABASE_ACCESS_TOKEN`.
- Windows web dev: bundle errors may appear as `/.expo%5Cstatic-tmp%5C_error.bundle` 404s; Expo web favicon must not be SVG.
- Native Stream Chat requires a dev build (`npx expo run:ios` / `run:android`); web runs with `npm run web`.
