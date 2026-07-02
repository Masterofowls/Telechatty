import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { UserListItem } from '@/components/UserListItem';
import type { Profile } from '@/db/types';
import { fetchProfileDirectory } from '@/lib/api/profiles';
import { createDirectChannel } from '@/lib/api/stream';
import { routes } from '@/lib/routes';
import { showMessage } from '@/lib/show-message';
import { useAuth } from '@/providers/AuthProvider';

export default function UsersScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [startingChatId, setStartingChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let cancelled = false;

    async function loadUsers() {
      try {
        const profiles = await fetchProfileDirectory();
        if (!cancelled) {
          setUsers(profiles);
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function startChat(target: Profile) {
    if (!user?.id || startingChatId) {
      return;
    }

    setStartingChatId(target.id);
    try {
      const cid = await createDirectChannel(target.id);
      router.replace(routes.channel(cid));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start chat';
      showMessage('Chat error', message);
    } finally {
      setStartingChatId(null);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            onPress={() => startChat(item)}
            disabled={startingChatId === item.id}
          />
        )}
        ListEmptyComponent={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
