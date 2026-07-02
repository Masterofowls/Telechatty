import { useMemo } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import type { Channel as StreamChannel } from 'stream-chat';
import { ChannelList, ChannelListItem } from 'stream-chat-react';

import { TelegramColors } from '@/constants/telegram-theme';
import { hasStreamConfig } from '@/lib/env';
import { routes } from '@/lib/routes';
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

  if (!hasStreamConfig() || !user?.id) {
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
      <View style={[styles.list, { backgroundColor: colors.background }]}>
        <ChannelList
          filters={filters}
          sort={sort}
          setActiveChannelOnMount={false}
          renderChannels={(channels: StreamChannel[]) =>
            channels.map((channel: StreamChannel) => (
              <ChannelListItem
                key={channel.cid}
                channel={channel}
                onSelect={() => handleChannelPress(channel)}
              />
            ))
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerAction: {
    marginRight: 16,
    padding: 4,
  },
  list: {
    flex: 1,
  },
});
