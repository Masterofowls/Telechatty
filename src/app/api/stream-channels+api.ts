import { getAuthUserFromRequest, unauthorizedResponse } from '@/db/auth/verify-request';
import { getProfileById } from '@/db/repositories/profiles';
import { getStreamServerClient, upsertStreamUsers } from '@/lib/stream/server';

export async function POST(request: Request) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = (await request.json().catch(() => ({}))) as { targetUserId?: string };
  if (!body.targetUserId) {
    return Response.json({ error: 'targetUserId is required' }, { status: 400 });
  }

  if (body.targetUserId === user.id) {
    return Response.json({ error: 'Cannot start a chat with yourself' }, { status: 400 });
  }

  try {
    const [currentProfile, targetProfile] = await Promise.all([
      getProfileById(user.id),
      getProfileById(body.targetUserId),
    ]);

    if (!currentProfile || !targetProfile) {
      return Response.json({ error: 'User profile not found' }, { status: 404 });
    }

    const serverClient = getStreamServerClient();
    await upsertStreamUsers(serverClient, [currentProfile, targetProfile]);

    const channel = serverClient.channel('messaging', {
      members: [user.id, body.targetUserId],
    });

    try {
      await channel.create();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (!message.toLowerCase().includes('already exists')) {
        throw error;
      }

      await channel.query({ state: true });
    }

    return Response.json({ cid: channel.cid });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create channel';
    return Response.json({ error: message }, { status: 500 });
  }
}
