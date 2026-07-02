import './load-env';

const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';

const projectRef = supabaseUrl.match(/^https:\/\/([^.]+)\.supabase\.co/i)?.[1];

if (!accessToken) {
  console.error(
    [
      'Missing SUPABASE_ACCESS_TOKEN.',
      '',
      '1. Create a token: https://supabase.com/dashboard/account/tokens',
      '2. Add to .env: SUPABASE_ACCESS_TOKEN=sbp_...',
      '3. Re-run: npm run auth:disable-email',
      '',
      'Or disable manually:',
      'Supabase Dashboard → Authentication → Providers → Email → turn OFF "Confirm email"',
    ].join('\n'),
  );
  process.exit(1);
}

if (!projectRef) {
  console.error('Could not read project ref from EXPO_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

async function main() {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mailer_autoconfirm: true,
      mailer_allow_unverified_email_sign_ins: true,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('Failed to update Supabase Auth config:', response.status, body);
    process.exit(1);
  }

  console.log('Supabase Auth updated for project:', projectRef);
  console.log('- mailer_autoconfirm: true (no confirmation emails on signup)');
  console.log('- mailer_allow_unverified_email_sign_ins: true');
  console.log('');
  console.log('Sign up with username + password should work immediately now.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
