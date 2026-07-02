import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useChatContext } from 'stream-chat-expo';

import { UserListItem } from '@/components/UserListItem';
import { routes } from '@/lib/routes';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import type { Profile } from '@/types/database';

export default function UsersScreen() {
  const router = useRouter();
  const { client } = useChatContext();
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) {
      return;
    }

    let cancelled = false;

    async function loadUsers() {
      const { data, error } = await supabase.from('profiles').select('*').neq('id', userId);

      if (cancelled) {
        return;
      }

      if (error) {
        console.error('Failed to fetch users', error.message);
        return;
      }

      setUsers((data ?? []) as Profile[]);
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function startChat(target: Profile) {
    if (!user?.id) {
      return;
    }

    const channel = client.channel('messaging', {
      members: [user.id, target.id],
    });

    await channel.watch();
    router.replace(routes.channel(channel.cid));
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserListItem user={item} onPress={() => startChat(item)} />
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
