import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { TelegramColors } from '@/constants/telegram-theme';

type LoadingScreenProps = {
  isDark?: boolean;
};

export function LoadingScreen({ isDark = false }: LoadingScreenProps) {
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
