import type { AuthSessionResponse } from '@/lib/auth/passkey-types';

export type { AuthSessionResponse } from '@/lib/auth/passkey-types';

function base64UrlToBuffer(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const base64 = padded + '='.repeat(padLength);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

type JsonWebAuthnOptions = {
  challenge: string;
  user?: { id: string; name: string; displayName: string };
  excludeCredentials?: { id: string; type: PublicKeyCredentialType }[];
  allowCredentials?: { id: string; type: PublicKeyCredentialType }[];
  [key: string]: unknown;
};

function decodeCreationOptions(options: JsonWebAuthnOptions): PublicKeyCredentialCreationOptions {
  const { challenge, user, excludeCredentials, ...rest } = options;

  return {
    ...rest,
    challenge: base64UrlToBuffer(challenge),
    user: {
      name: user?.name ?? '',
      displayName: user?.displayName ?? '',
      id: base64UrlToBuffer(user?.id ?? ''),
    },
    excludeCredentials: excludeCredentials?.map((credential) => ({
      ...credential,
      id: base64UrlToBuffer(credential.id),
    })),
  } as PublicKeyCredentialCreationOptions;
}

function decodeRequestOptions(options: JsonWebAuthnOptions): PublicKeyCredentialRequestOptions {
  const { challenge, allowCredentials, ...rest } = options;

  return {
    ...rest,
    challenge: base64UrlToBuffer(challenge),
    allowCredentials: allowCredentials?.map((credential) => ({
      ...credential,
      id: base64UrlToBuffer(credential.id),
    })),
  } as PublicKeyCredentialRequestOptions;
}

function encodeCredential(credential: PublicKeyCredential): Record<string, unknown> {
  const response = credential.response as
    | AuthenticatorAttestationResponse
    | AuthenticatorAssertionResponse;

  const encoded: Record<string, unknown> = {
    id: credential.id,
    rawId: bufferToBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64Url(response.clientDataJSON),
    },
    clientExtensionResults: credential.getClientExtensionResults(),
  };

  if ('attestationObject' in response) {
    (encoded.response as Record<string, unknown>).attestationObject = bufferToBase64Url(
      response.attestationObject,
    );
  }

  if ('authenticatorData' in response) {
    (encoded.response as Record<string, unknown>).authenticatorData = bufferToBase64Url(
      response.authenticatorData,
    );
  }

  if ('signature' in response) {
    (encoded.response as Record<string, unknown>).signature = bufferToBase64Url(response.signature);
  }

  if ('userHandle' in response && response.userHandle) {
    (encoded.response as Record<string, unknown>).userHandle = bufferToBase64Url(response.userHandle);
  }

  return encoded;
}

async function authFetch<T>(
  path: string,
  init: RequestInit & { accessToken?: string },
): Promise<T> {
  const { accessToken, ...request } = init;
  const headers = new Headers(request.headers);
  headers.set('apikey', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '');
  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}${path}`,
    { ...request, headers },
  );

  const body = (await response.json().catch(() => ({}))) as T & {
    error?: string;
    msg?: string;
    error_code?: string;
  };

  if (!response.ok) {
    const message = body.msg ?? body.error ?? response.statusText;
    const error = new Error(message) as Error & { code?: string };
    error.code = body.error_code;
    throw error;
  }

  return body;
}

export function isPasskeySupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined' &&
    typeof navigator.credentials !== 'undefined'
  );
}

export async function signInWithPasskey(): Promise<AuthSessionResponse> {
  if (!isPasskeySupported()) {
    throw new Error('Passkeys are not supported in this browser.');
  }

  const optionsResponse = await authFetch<{
    challenge_id: string;
    options: JsonWebAuthnOptions;
  }>('/auth/v1/passkeys/authentication/options', { method: 'POST', body: '{}' });

  const credential = (await navigator.credentials.get({
    publicKey: decodeRequestOptions(optionsResponse.options),
  })) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error('Passkey sign-in was cancelled.');
  }

  return authFetch<AuthSessionResponse>('/auth/v1/passkeys/authentication/verify', {
    method: 'POST',
    body: JSON.stringify({
      challenge_id: optionsResponse.challenge_id,
      credential: encodeCredential(credential),
    }),
  });
}

export async function registerPasskey(accessToken: string): Promise<{ id: string }> {
  if (!isPasskeySupported()) {
    throw new Error('Passkeys are not supported in this browser.');
  }

  const optionsResponse = await authFetch<{
    challenge_id: string;
    options: JsonWebAuthnOptions;
  }>('/auth/v1/passkeys/registration/options', {
    method: 'POST',
    accessToken,
    body: '{}',
  });

  const credential = (await navigator.credentials.create({
    publicKey: decodeCreationOptions(optionsResponse.options),
  })) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error('Passkey registration was cancelled.');
  }

  return authFetch<{ id: string }>('/auth/v1/passkeys/registration/verify', {
    method: 'POST',
    accessToken,
    body: JSON.stringify({
      challenge_id: optionsResponse.challenge_id,
      credential: encodeCredential(credential),
    }),
  });
}
