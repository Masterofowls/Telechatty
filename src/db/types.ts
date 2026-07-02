import type { ProfileRow } from '@/db/schema/profiles';

/** API / UI profile shape (snake_case for client compatibility). */
export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  contact_email: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    full_name: row.fullName,
    username: row.username,
    contact_email: row.contactEmail,
    avatar_url: row.avatarUrl,
    updated_at: row.updatedAt,
  };
}

export type UpdateProfileInput = {
  full_name?: string | null;
  username?: string | null;
  contact_email?: string | null;
  avatar_url?: string | null;
};

export type CreateProfileInput = {
  id: string;
  username: string;
  full_name?: string | null;
  contact_email?: string | null;
  avatar_url?: string | null;
};
