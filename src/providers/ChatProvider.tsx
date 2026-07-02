import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';
import { Chat, OverlayProvider, useCreateChatClient } from 'stream-chat-expo';
import { StreamChat } from 'stream-chat';
import type { PropsWithChildren } from 'react';

import { getTelegramStreamTheme } from '@/constants/telegram-theme';
import { env, hasStreamConfig } from '@/lib/env';
import { getAvatarPublicUrl } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import type { Profile } from '@/types/database';

function ConnectedChatProvider({
  profile,
  children,
}: PropsWithChildren<{ profile: Profile }>) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useMemo(() => getTelegramStreamTheme(isDark), [isDark]);
  const userName = profile.full_name ?? profile.username ?? 'User';
  const userImage = getAvatarPublicUrl(profile.avatar_url);
  const devToken = StreamChat.getInstance(env.streamApiKey).devToken(profile.id);

  const chatClient = useCreateChatClient({
    apiKey: env.streamApiKey,
    tokenOrProvider: devToken,
    userData: {
      id: profile.id,
      name: userName,
      image: userImage,
    },
  });

  if (!chatClient) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={isDark ? '#8774E1' : '#3390EC'} />
      </View>
    );
  }

  return (
    <OverlayProvider value={{ style: theme }}>
      <Chat client={chatClient}>{children}</Chat>
    </OverlayProvider>
  );
}

export function ChatProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();

  if (!hasStreamConfig() || !profile) {
    return <>{children}</>;
  }

  return <ConnectedChatProvider profile={profile}>{children}</ConnectedChatProvider>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
