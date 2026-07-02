import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { TelegramColors } from '@/constants/telegram-theme';
import type { Profile } from '@/db/types';

type UserListItemProps = {
  user: Profile;
  isDark?: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function UserListItem({
  user,
  isDark = false,
  onPress,
  disabled = false,
}: UserListItemProps) {
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.secondaryBackground : colors.background,
          borderBottomColor: colors.border,
        },
      ]}>
      <Avatar
        userId={user.id}
        avatarPath={user.avatar_url}
        name={user.full_name}
        size={48}
        isDark={isDark}
      />
      <View style={styles.meta}>
        <Text style={[styles.name, { color: colors.text }]}>
          {user.full_name ?? user.username ?? 'Telechatty user'}
        </Text>
        {user.username ? (
          <Text style={[styles.username, { color: colors.textSecondary }]}>@{user.username}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  username: {
    fontSize: 14,
  },
});
