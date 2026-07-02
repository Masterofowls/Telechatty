import { apiFetch } from '@/lib/api/client';

export async function fetchStreamToken(): Promise<string> {
  const { token } = await apiFetch<{ token: string }>('/api/stream-token');
  return token;
}

export async function createDirectChannel(targetUserId: string): Promise<string> {
  const { cid } = await apiFetch<{ cid: string }>('/api/stream-channels', {
    method: 'POST',
    body: JSON.stringify({ targetUserId }),
  });

  return cid;
}
