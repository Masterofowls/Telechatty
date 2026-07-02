import { StreamChat } from 'stream-chat';

import type { Profile } from '@/db/types';

export function getStreamServerClient() {
  const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('STREAM_API_SECRET and EXPO_PUBLIC_STREAM_API_KEY are required');
  }

  return StreamChat.getInstance(apiKey, apiSecret);
}

export function getAvatarPublicUrl(path: string | null | undefined): string | undefined {
  if (!path) {
    return undefined;
  }

  const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!baseUrl) {
    return undefined;
  }

  return `${baseUrl}/storage/v1/object/public/avatars/${path}`;
}

export function profileToStreamUser(profile: Profile) {
  return {
    id: profile.id,
    name: profile.full_name ?? profile.username ?? 'User',
    image: getAvatarPublicUrl(profile.avatar_url),
  };
}

export async function upsertStreamUsers(
  serverClient: StreamChat,
  profiles: Profile[],
): Promise<void> {
  const users = profiles.map(profileToStreamUser);
  if (users.length === 1) {
    await serverClient.upsertUser(users[0]);
    return;
  }

  if (users.length > 1) {
    await serverClient.upsertUsers(users);
  }
}
