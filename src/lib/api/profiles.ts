import type { Profile, UpdateProfileInput } from '@/db/types';
import { apiFetch } from '@/lib/api/client';

export async function fetchMyProfile(): Promise<Profile> {
  const { profile } = await apiFetch<{ profile: Profile }>('/api/profiles');
  return profile;
}

export async function fetchProfileDirectory(): Promise<Profile[]> {
  const { profiles } = await apiFetch<{ profiles: Profile[] }>(
    '/api/profiles?scope=directory',
  );
  return profiles;
}

export async function updateMyProfile(input: UpdateProfileInput): Promise<Profile> {
  const { profile } = await apiFetch<{ profile: Profile }>('/api/profiles', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
  return profile;
}

export async function ensureMyProfile(input?: {
  username?: string;
  contact_email?: string | null;
  full_name?: string | null;
}): Promise<Profile> {
  const { profile } = await apiFetch<{ profile: Profile }>('/api/profiles', {
    method: 'POST',
    body: JSON.stringify(input ?? {}),
  });
  return profile;
}
