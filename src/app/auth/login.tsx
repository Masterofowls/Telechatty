import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TelegramColors } from '@/constants/telegram-theme';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { isPasskeySupported, registerPasskey, signInWithPasskey } from '@/lib/auth/passkey';
import {
  normalizeUsername,
  usernameToAuthEmail,
  validateOptionalEmail,
  validateUsername,
} from '@/lib/auth/username';
import { ensureMyProfile } from '@/lib/api/profiles';
import { routes } from '@/lib/routes';
import { showMessage } from '@/lib/show-message';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

type AuthMode = 'signIn' | 'signUp';

export default function LoginScreen() {
  const { session } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;
  const passkeyAvailable = Platform.OS === 'web' && isPasskeySupported();

  const [mode, setMode] = useState<AuthMode>('signIn');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Redirect href={routes.tabs} />;
  }

  async function offerPasskeyRegistration(accessToken: string) {
    if (!passkeyAvailable || typeof window === 'undefined') {
      return;
    }

    const shouldRegister = window.confirm(
      'Add a passkey for faster sign-in on this device?',
    );

    if (!shouldRegister) {
      return;
    }

    try {
      await registerPasskey(accessToken);
      showMessage('Passkey saved', 'You can sign in with your passkey next time.');
    } catch (error) {
      showMessage('Passkey setup skipped', getAuthErrorMessage(error));
    }
  }

  async function handlePasswordAuth() {
    const usernameError = validateUsername(username);
    if (usernameError) {
      showMessage('Invalid username', usernameError);
      return;
    }

    if (!password.trim()) {
      showMessage('Missing password', 'Enter your password.');
      return;
    }

    if (password.length < 6) {
      showMessage('Weak password', 'Use at least 6 characters.');
      return;
    }

    const emailError = validateOptionalEmail(email);
    if (emailError) {
      showMessage('Invalid email', emailError);
      return;
    }

    const normalizedUsername = normalizeUsername(username);
    const authEmail = usernameToAuthEmail(normalizedUsername);
    const contactEmail = email.trim() || null;

    setLoading(true);
    try {
      if (mode === 'signUp') {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              username: normalizedUsername,
              contact_email: contactEmail,
              display_name: normalizedUsername,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          await ensureMyProfile({
            username: normalizedUsername,
            contact_email: contactEmail,
          });

          if (data.session.access_token) {
            await offerPasskeyRegistration(data.session.access_token);
          }

          showMessage('Account created', `Welcome, @${normalizedUsername}.`);
          return;
        }

        showMessage(
          'Check Supabase settings',
          'Signup succeeded but no session was returned. Run npm run auth:disable-email or turn off Confirm email in Supabase → Auth → Email.',
        );
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session?.access_token) {
        await offerPasskeyRegistration(data.session.access_token);
      }
    } catch (error) {
      showMessage('Authentication error', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handlePasskeySignIn() {
    setLoading(true);
    try {
      const sessionData = await signInWithPasskey();
      const { error } = await supabase.auth.setSession({
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      showMessage('Passkey error', getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const isSignUp = mode === 'signUp';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.hero}>
          <Text style={[styles.brand, { color: colors.primary }]}>Telechatty</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in with your username, or use a passkey on web
          </Text>
        </View>

        <View style={styles.modeRow}>
          <Pressable
            onPress={() => setMode('signIn')}
            style={[
              styles.modeButton,
              {
                backgroundColor: !isSignUp ? colors.primary : colors.secondaryBackground,
                borderColor: colors.border,
              },
            ]}>
            <Text style={{ color: !isSignUp ? '#FFFFFF' : colors.text, fontWeight: '600' }}>
              Sign in
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('signUp')}
            style={[
              styles.modeButton,
              {
                backgroundColor: isSignUp ? colors.primary : colors.secondaryBackground,
                borderColor: colors.border,
              },
            ]}>
            <Text style={{ color: isSignUp ? '#FFFFFF' : colors.text, fontWeight: '600' }}>
              Register
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            autoComplete="username"
            placeholder="Username"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.secondaryBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            style={[
              styles.input,
              {
                backgroundColor: colors.secondaryBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email (optional)"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.secondaryBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={email}
            onChangeText={setEmail}
          />

          <Pressable
            disabled={loading}
            onPress={handlePasswordAuth}
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.primaryButtonText}>
              {loading ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            </Text>
          </Pressable>

          {passkeyAvailable ? (
            <Pressable
              disabled={loading}
              onPress={handlePasskeySignIn}
              style={[styles.secondaryButton, { borderColor: colors.primary }]}>
              <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
                Sign in with passkey
              </Text>
            </Pressable>
          ) : null}

          <Text style={[styles.devHint, { color: colors.textSecondary }]}>
            Usernames are public. Email is optional. For instant signup without confirmation emails,
            run npm run auth:disable-email once (needs SUPABASE_ACCESS_TOKEN in .env).
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  hero: {
    gap: 8,
  },
  brand: {
    fontSize: 40,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  devHint: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
});
