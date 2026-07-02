import { getAuthUserFromRequest, unauthorizedResponse } from '@/db/auth/verify-request';
import { getProfileById } from '@/db/repositories/profiles';
import {
  getStreamServerClient,
  profileToStreamUser,
  upsertStreamUsers,
} from '@/lib/stream/server';

export async function GET(request: Request) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return unauthorizedResponse();
  }

  try {
    const serverClient = getStreamServerClient();
    const profile = await getProfileById(user.id);

    if (profile) {
      await serverClient.upsertUser(profileToStreamUser(profile));
    }

    const token = serverClient.createToken(user.id);

    return Response.json({ token });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create Stream token';
    return Response.json({ error: message }, { status: 500 });
  }
}
