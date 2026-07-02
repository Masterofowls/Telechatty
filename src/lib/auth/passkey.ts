import type { AuthSessionResponse } from '@/lib/auth/passkey-types';

export type { AuthSessionResponse } from '@/lib/auth/passkey-types';

export function isPasskeySupported(): boolean {
  return false;
}

export async function signInWithPasskey(): Promise<AuthSessionResponse> {
  throw new Error('Passkeys are available on web only. Use username and password here.');
}

export async function registerPasskey(_accessToken: string): Promise<{ id: string }> {
  throw new Error('Passkeys are available on web only.');
}
