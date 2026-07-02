import {
  createProfile,
  getProfileById,
  getProfileByUsername,
  listProfilesExcept,
  updateProfile,
} from '@/db/repositories/profiles';
import { getAuthUserFromRequest, unauthorizedResponse } from '@/db/auth/verify-request';

export async function GET(request: Request) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  if (url.searchParams.get('scope') === 'directory') {
    const profiles = await listProfilesExcept(user.id);
    return Response.json({ profiles });
  }

  const profile = await getProfileById(user.id);
  if (!profile) {
    const username =
      typeof user.user_metadata?.username === 'string'
        ? user.user_metadata.username
        : `user_${user.id.slice(0, 8)}`;

    const created = await createProfile({
      id: user.id,
      username,
      contact_email:
        typeof user.user_metadata?.contact_email === 'string'
          ? user.user_metadata.contact_email
          : null,
    });
    return Response.json({ profile: created });
  }

  return Response.json({ profile });
}

export async function POST(request: Request) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = (await request.json().catch(() => ({}))) as {
    username?: string;
    full_name?: string | null;
    contact_email?: string | null;
    avatar_url?: string | null;
  };

  const username =
    body.username ??
    (typeof user.user_metadata?.username === 'string' ? user.user_metadata.username : null);

  if (!username) {
    return Response.json({ error: 'Username is required' }, { status: 400 });
  }

  const existingUsername = await getProfileByUsername(username);
  if (existingUsername && existingUsername.id !== user.id) {
    return Response.json({ error: 'Username is already taken' }, { status: 409 });
  }

  const profile = await createProfile({
    id: user.id,
    username,
    full_name: body.full_name,
    contact_email: body.contact_email,
    avatar_url: body.avatar_url,
  });

  return Response.json({ profile }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return unauthorizedResponse();
  }

  const body = (await request.json()) as {
    full_name?: string | null;
    username?: string | null;
    contact_email?: string | null;
    avatar_url?: string | null;
  };

  if (body.username) {
    const existingUsername = await getProfileByUsername(body.username);
    if (existingUsername && existingUsername.id !== user.id) {
      return Response.json({ error: 'Username is already taken' }, { status: 409 });
    }
  }

  const profile = await updateProfile(user.id, body);
  if (!profile) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  return Response.json({ profile });
}
