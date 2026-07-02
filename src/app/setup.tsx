import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SETUP_STEPS = [
  'Create a Stream Chat app at getstream.io and copy the API key.',
  'Create a Supabase project, run supabase/schema.sql, and make the avatars bucket public.',
  'Copy .env.example to .env and fill in your keys.',
  'Run npx expo run:ios or npx expo run:android (Stream Chat requires a dev build, not Expo Go).',
];

export default function SetupScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Configure Telechatty</Text>
        <Text style={styles.subtitle}>
          This Telegram-inspired chat app needs Stream Chat and Supabase credentials before it can
          connect users and sync messages.
        </Text>

        {SETUP_STEPS.map((step, index) => (
          <View key={step} style={styles.step}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}

        <Pressable
          onPress={() => Linking.openURL('https://getstream.io/chat/sdk/react-native/tutorial/expo/')}
          style={styles.linkButton}>
          <Text style={styles.linkButtonText}>Stream Chat Expo tutorial</Text>
        </Pressable>

        <Pressable
          onPress={() => Linking.openURL('https://supabase.com/docs/guides/getting-started/quickstarts/react-native')}
          style={styles.secondaryLinkButton}>
          <Text style={styles.secondaryLinkText}>Supabase Expo quickstart</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#17212B',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#707579',
  },
  step: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3390EC',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: '#17212B',
  },
  linkButton: {
    marginTop: 8,
    backgroundColor: '#3390EC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryLinkButton: {
    borderWidth: 1,
    borderColor: '#3390EC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryLinkText: {
    color: '#3390EC',
    fontWeight: '600',
    fontSize: 16,
  },
});
