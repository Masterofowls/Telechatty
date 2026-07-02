import { eq, ne } from 'drizzle-orm';

import { getDb } from '@/db/client';
import { profiles } from '@/db/schema/profiles';
import {
  mapProfileRow,
  type CreateProfileInput,
  type Profile,
  type UpdateProfileInput,
} from '@/db/types';

export async function getProfileById(id: string): Promise<Profile | null> {
  const db = getDb();
  const [row] = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  return row ? mapProfileRow(row) : null;
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.username, username.toLowerCase()))
    .limit(1);

  return row ? mapProfileRow(row) : null;
}

export async function listProfilesExcept(userId: string): Promise<Profile[]> {
  const db = getDb();
  const rows = await db.select().from(profiles).where(ne(profiles.id, userId));
  return rows.map(mapProfileRow);
}

export async function createProfile(input: CreateProfileInput): Promise<Profile> {
  const db = getDb();
  const now = new Date().toISOString();
  const [row] = await db
    .insert(profiles)
    .values({
      id: input.id,
      username: input.username.toLowerCase(),
      contactEmail: input.contact_email ?? null,
      fullName: input.full_name ?? null,
      avatarUrl: input.avatar_url ?? null,
      updatedAt: now,
    })
    .onConflictDoNothing()
    .returning();

  if (row) {
    return mapProfileRow(row);
  }

  const existing = await getProfileById(input.id);
  if (!existing) {
    throw new Error('Failed to create profile');
  }

  return existing;
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<Profile | null> {
  const db = getDb();
  const patch: Partial<typeof profiles.$inferInsert> = {
    updatedAt: new Date().toISOString(),
  };

  if (input.full_name !== undefined) {
    patch.fullName = input.full_name;
  }
  if (input.username !== undefined && input.username !== null) {
    patch.username = input.username.toLowerCase();
  }
  if (input.contact_email !== undefined) {
    patch.contactEmail = input.contact_email;
  }
  if (input.avatar_url !== undefined) {
    patch.avatarUrl = input.avatar_url;
  }

  const [row] = await db
    .update(profiles)
    .set(patch)
    .where(eq(profiles.id, userId))
    .returning();

  return row ? mapProfileRow(row) : null;
}
