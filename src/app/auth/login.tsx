import { useState } from 'react';
import {
  Alert,
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
import { routes } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginScreen() {
  const { session } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    return <Redirect href={routes.tabs} />;
  }

  async function handleAuth(mode: 'signIn' | 'signUp') {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const action =
        mode === 'signUp'
          ? supabase.auth.signUp({ email: email.trim(), password })
          : supabase.auth.signInWithPassword({ email: email.trim(), password });

      const { error } = await action;
      if (error) {
        throw error;
      }

      if (mode === 'signUp') {
        Alert.alert('Account created', 'You can now sign in with your credentials.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      Alert.alert('Authentication error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.hero}>
          <Text style={[styles.brand, { color: colors.primary }]}>Telechatty</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Telegram-inspired messaging powered by Stream Chat
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email"
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

          <Pressable
            disabled={loading}
            onPress={() => handleAuth('signIn')}
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.primaryButtonText}>{loading ? 'Please wait…' : 'Sign in'}</Text>
          </Pressable>

          <Pressable
            disabled={loading}
            onPress={() => handleAuth('signUp')}
            style={[styles.secondaryButton, { borderColor: colors.primary }]}>
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Create account</Text>
          </Pressable>
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
    gap: 32,
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
});
