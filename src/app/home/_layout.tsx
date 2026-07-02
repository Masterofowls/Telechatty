import { Redirect, Stack } from 'expo-router';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { routes } from '@/lib/routes';
import { ChatProvider } from '@/providers/ChatProvider';
import { useAuth } from '@/providers/AuthProvider';

export default function HomeLayout() {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href={routes.login} />;
  }

  return (
    <ErrorBoundary title="Chat failed to load">
      <ChatProvider>
        <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen
          name="channel/[cid]"
          options={{
            title: 'Chat',
            headerBackTitle: 'Chats',
          }}
        />
        <Stack.Screen
          name="users"
          options={{
            title: 'New chat',
            presentation: 'modal',
          }}
        />
      </Stack>
      </ChatProvider>
    </ErrorBoundary>
  );
}
