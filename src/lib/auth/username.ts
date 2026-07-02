import { env } from '@/lib/env';

const USERNAME_PATTERN = /^[a-z0-9_]{3,32}$/;

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);

  if (!normalized) {
    return 'Username is required.';
  }

  if (!USERNAME_PATTERN.test(normalized)) {
    return 'Use 3–32 characters: lowercase letters, numbers, and underscores only.';
  }

  return null;
}

/** Maps a username to the internal Supabase Auth email (not shown to users). */
export function usernameToAuthEmail(username: string): string {
  const normalized = normalizeUsername(username);
  const projectRef =
    env.supabaseUrl.match(/^https:\/\/([^.]+)\.supabase\.co/i)?.[1] ?? 'telechatty';

  return `${normalized}@${projectRef}.auth.telechatty`;
}

export function validateOptionalEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'Enter a valid email address or leave it blank.';
  }

  return null;
}
