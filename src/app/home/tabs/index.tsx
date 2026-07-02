import { useMemo } from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import type { Channel as StreamChannel } from 'stream-chat';

import { TelegramColors } from '@/constants/telegram-theme';
import { hasStreamConfig } from '@/lib/env';
import { routes } from '@/lib/routes';
import { ChannelList } from '@/lib/stream-chat';
import { useAuth } from '@/providers/AuthProvider';

export default function ChatsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;

  const filters = useMemo(
    () => ({
      members: { $in: [user?.id ?? ''] },
      type: 'messaging',
    }),
    [user?.id],
  );

  const sort = useMemo(() => [{ last_message_at: -1 as const }], []);

  function handleChannelPress(channel: StreamChannel) {
    router.push(routes.channel(channel.cid));
  }

  if (!hasStreamConfig()) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chats',
          headerRight: () => (
            <Link href={routes.users} asChild>
              <Pressable style={styles.headerAction}>
                <FontAwesome5 name="user-plus" size={18} color={colors.headerText} />
              </Pressable>
            </Link>
          ),
        }}
      />
      <ChannelList
        filters={filters}
        sort={sort}
        onSelect={handleChannelPress}
        additionalFlatListProps={{
          contentContainerStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerAction: {
    marginRight: 16,
    padding: 4,
  },
});
