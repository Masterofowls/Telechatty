import { AuthError, isAuthError } from '@supabase/supabase-js';

import { ApiError } from '@/lib/api/client';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  over_email_send_rate_limit:
    'Supabase stopped sending emails because the project hit its email rate limit. ' +
    'Wait about an hour, or for local dev disable Auth → Email → Confirm email in the Supabase dashboard.',
  email_address_invalid:
    'That email address was rejected. Use a real address (avoid example.com and disposable domains).',
  invalid_credentials:
    'Wrong username or password. Create an account first, or check your credentials.',
  user_already_exists: 'That username is already taken. Try signing in instead.',
  signup_disabled: 'Sign-ups are disabled for this project in Supabase Auth settings.',
  passkey_disabled:
    'Passkeys are not enabled. In Supabase go to Authentication → Passkeys and enable them for localhost.',
  webauthn_verification_failed: 'Passkey verification failed. Try again or use your password.',
  '23502':
    'Account setup failed because the profile was missing a username. Run npm run db:migrate and try again.',
  '23505': 'That username is already taken. Choose a different username.',
};

function readObjectMessage(error: Record<string, unknown>): string | null {
  for (const key of ['msg', 'message', 'error', 'error_description', 'description']) {
    const value = error[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  const code = error.code ?? error.error_code;
  if (typeof code === 'string' && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  return null;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.message.trim()) {
      return error.message;
    }

    return AUTH_ERROR_MESSAGES['23502'] ?? `Request failed (${error.status})`;
  }

  if (isAuthError(error) || error instanceof AuthError) {
    const code = error.code ?? '';
    if (code && AUTH_ERROR_MESSAGES[code]) {
      return AUTH_ERROR_MESSAGES[code];
    }

    if (error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const message = readObjectMessage(error as Record<string, unknown>);
    if (message) {
      return message;
    }
  }

  return 'Authentication failed. Check your username and password, or try again in a moment.';
}
