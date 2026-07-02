import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Channel as StreamChannel } from 'stream-chat';

import {
  Channel,
  MessageComposer,
  MessageList,
  useChatContext,
} from '@/lib/stream-chat';

export default function ChannelScreen() {
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const { client } = useChatContext();
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    if (!cid) {
      return;
    }

    let active = true;

    async function loadChannel() {
      const response = await client.queryChannels({ cid: { $eq: cid } });
      if (!active) {
        return;
      }

      setChannel(response[0] ?? null);
    }

    loadChannel().catch((error) => {
      console.error('Failed to load channel', error);
    });

    return () => {
      active = false;
    };
  }, [cid, client]);

  if (!channel) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Channel channel={channel}>
        <MessageList />
        <MessageComposer />
      </Channel>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
