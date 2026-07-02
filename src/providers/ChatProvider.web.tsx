import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';
import { Chat, useCreateChatClient } from 'stream-chat-react';
import type { PropsWithChildren } from 'react';

import { env, hasStreamConfig } from '@/lib/env';
import { getAvatarPublicUrl } from '@/lib/supabase';
import { useStreamTokenProvider } from '@/lib/use-stream-token-provider';
import { useAuth } from '@/providers/AuthProvider';
import type { Profile } from '@/db/types';

function ConnectedChatProvider({
  profile,
  children,
}: PropsWithChildren<{ profile: Profile }>) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const userName = profile.full_name ?? profile.username ?? 'User';
  const userImage = getAvatarPublicUrl(profile.avatar_url);
  const tokenProvider = useStreamTokenProvider();
  const chatTheme = useMemo(
    () => (isDark ? 'str-chat__theme-dark' : 'str-chat__theme-light'),
    [isDark],
  );

  const chatClient = useCreateChatClient({
    apiKey: env.streamApiKey,
    tokenOrProvider: tokenProvider,
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
    <Chat client={chatClient} theme={chatTheme}>
      {children}
    </Chat>
  );
}

export function ChatProvider({ children }: PropsWithChildren) {
  const { profile, session } = useAuth();

  if (!hasStreamConfig()) {
    return <>{children}</>;
  }

  if (session && !profile) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3390EC" />
      </View>
    );
  }

  if (!profile) {
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
