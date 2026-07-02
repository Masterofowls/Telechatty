import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import { TelegramColors } from '@/constants/telegram-theme';

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.headerText,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="comment" color={color} size={size - 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" color={color} size={size - 2} />
          ),
        }}
      />
    </Tabs>
  );
}
