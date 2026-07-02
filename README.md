# Telechatty

Telegram-inspired messaging app built with **Expo**, **React Native**, **TypeScript**, **Stream Chat**, **Supabase Auth**, and **Drizzle ORM**.

Runs on **iOS**, **Android**, and **Web**.

## Architecture

| Layer | Technology |
|-------|------------|
| UI / navigation | Expo Router |
| Auth | Supabase Auth (client) |
| Data | Drizzle ORM → Supabase Postgres (server API routes) |
| Chat | `stream-chat-expo` (native) / `stream-chat-react` (web) |
| Storage | Supabase Storage (avatars) |

```
Client (Expo) ──► /api/profiles ──► Drizzle repositories ──► Postgres
              └──► Supabase Auth / Storage
              └──► Stream Chat
```

## Features

- Email/password auth
- Type-safe profiles via Drizzle schema + repositories
- Real-time 1:1 chat (Stream)
- Avatar upload, user directory, Telegram-inspired theme
- Web support with `stream-chat-react`

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill in Stream + Supabase keys, `STREAM_API_SECRET` (server), and `DATABASE_URL` (Supabase → Settings → Database → Connection string, use **Transaction** pooler port `6543`).

### 3. Database (Drizzle)

```bash
npm run db:migrate
```

This applies SQL from `drizzle/migrations/`. Schema is defined in `src/db/schema/`.

### 4. Supabase Auth (no email confirmation)

Telechatty uses **username + password**; email is optional. Disable Supabase email confirmation so signup works instantly:

**Option A — script (recommended)**

```bash
# Add SUPABASE_ACCESS_TOKEN to .env (https://supabase.com/dashboard/account/tokens)
npm run auth:disable-email
```

**Option B — dashboard**

Supabase → **Authentication** → **Providers** → **Email** → turn **off** **Confirm email**

### 5. Run

**Web** (API routes + Drizzle work out of the box):

```bash
npm run web
```

**iOS / Android** (requires dev build for Stream native SDK):

```bash
npx expo run:ios
# or
npx expo run:android
npm start
```

Set `EXPO_PUBLIC_API_URL` to your machine IP when testing on a physical device (e.g. `http://192.168.1.10:8081`).

## Drizzle workflow

Drizzle Kit is installed as a dev dependency. Set `DATABASE_URL` in `.env`, then:

```bash
npm run db:generate      # create migration SQL from src/db/schema
npm run db:migrate       # apply migrations to Postgres
npm run db:studio        # open Drizzle Studio at http://127.0.0.1:4983
npm run db:push          # push schema directly (dev only)
npm run db:check         # validate migrations vs schema
```

Full CLI reference: `npm run db -- --help` or see [drizzle/README.md](./drizzle/README.md).

Repositories live in `src/db/repositories/`. The app never writes raw SQL — only Drizzle queries.

## Project structure

```
src/
  db/
    schema/           # Drizzle table definitions
    repositories/     # Typed query layer
    auth/             # API request verification
  app/
    api/              # Expo API routes (Drizzle server)
    auth/             # Login
    home/             # Chats, channel, profile, users
  lib/
    api/              # Client fetch wrappers
    stream-chat.*     # Platform-specific Stream SDK
    supabase.*        # Platform-specific Supabase client
drizzle/migrations/   # SQL migrations
```

## Notes

- Stream tokens are issued by `/api/stream-token` using `STREAM_API_SECRET` (dev tokens are disabled on most Stream apps).
- `DATABASE_URL` is server-only; never expose it in client code.
- Video calling can be added with `@stream-io/video-react-native-sdk`.

## License

See [LICENSE](./LICENSE).
