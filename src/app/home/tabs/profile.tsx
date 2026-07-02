import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { TelegramColors } from '@/constants/telegram-theme';
import { updateMyProfile } from '@/lib/api/profiles';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfileScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;

  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [saving, setSaving] = useState(false);

  async function handleUpdateProfile() {
    if (!user?.id) {
      return;
    }

    setSaving(true);
    try {
      await updateMyProfile({ full_name: fullName.trim() });
      await refreshProfile();
      Alert.alert('Profile updated', 'Your display name was saved.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      Alert.alert('Could not update profile', message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          {user?.id ? (
            <Avatar
              userId={user.id}
              avatarPath={profile?.avatar_url}
              name={profile?.full_name}
              size={96}
              editable
              isDark={isDark}
              onUploaded={() => {
                refreshProfile();
              }}
            />
          ) : null}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            @{profile?.username ?? 'not set'}
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {profile?.contact_email ?? 'Not added'}
          </Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Display name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your name"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.secondaryBackground,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />
          <Pressable
            disabled={saving}
            onPress={handleUpdateProfile}
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.primaryButtonText}>{saving ? 'Saving…' : 'Update profile'}</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSignOut}
          style={[styles.signOutButton, { borderColor: colors.border }]}>
          <Text style={[styles.signOutText, { color: '#E53935' }]}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 4,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
