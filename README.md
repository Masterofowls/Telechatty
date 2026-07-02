# Telechatty

Telegram-inspired messaging app built with **Expo**, **React Native**, **TypeScript**, **Stream Chat**, and **Supabase**.

Based on the [NotJustDev Telegram clone tutorial](https://www.youtube.com/) workflow: Supabase handles auth and profiles, Stream Chat powers real-time messaging with reactions, replies, media, and threads.

## Features

- Email/password auth with Supabase
- User profiles with avatar upload
- Real-time chat list and 1:1 conversations via Stream Chat
- Start new chats from a user directory
- Telegram-inspired light/dark styling on Stream components
- Expo Router file-based navigation

## Prerequisites

- Node.js 20+
- [Stream Chat](https://getstream.io/) app (API key)
- [Supabase](https://supabase.com/) project
- **Development build** — `stream-chat-expo` does not run in Expo Go

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill in `.env`:

```env
EXPO_PUBLIC_STREAM_API_KEY=...
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

4. In Supabase SQL Editor, run `supabase/schema.sql`.

5. In Supabase Auth → Providers → Email, disable **Confirm email** for local development.

6. Make the `avatars` storage bucket public (the schema sets this on insert).

## Run

Create a native dev build (required for Stream Chat):

```bash
npx expo run:ios
# or
npx expo run:android
```

Start the dev server:

```bash
npx expo start --dev-client
```

## Project structure

```
src/
  app/                 # Expo Router screens
    auth/login.tsx     # Sign in / sign up
    home/tabs/         # Chats + Profile tabs
    home/channel/      # Active conversation
    home/users.tsx     # Pick a user to message
  components/          # Avatar, user list, loading
  providers/           # Auth + Stream Chat providers
  lib/                 # Supabase client, env helpers
  constants/           # Telegram theme tokens
supabase/schema.sql    # Profiles + avatar storage
```

## Notes

- Dev tokens (`client.devToken`) are used for Stream auth during development. Use a backend token endpoint before production.
- Web is not supported by `stream-chat-expo`; use iOS/Android dev builds.
- Video calling from the tutorial can be added next with `@stream-io/video-react-native-sdk`.

## License

See [LICENSE](./LICENSE).
