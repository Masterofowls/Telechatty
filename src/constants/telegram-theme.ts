import type { DeepPartial } from 'stream-chat-react-native-core/lib/typescript/contexts/themeContext/ThemeContext';
import type { Theme } from 'stream-chat-react-native-core/lib/typescript/contexts/themeContext/utils/theme';

export const TelegramColors = {
  light: {
    primary: '#3390EC',
    background: '#FFFFFF',
    secondaryBackground: '#F4F4F5',
    headerBackground: '#3390EC',
    headerText: '#FFFFFF',
    sentBubble: '#EFFDDE',
    receivedBubble: '#FFFFFF',
    text: '#000000',
    textSecondary: '#707579',
    border: '#E5E5EA',
    online: '#4DCD5E',
  },
  dark: {
    primary: '#8774E1',
    background: '#17212B',
    secondaryBackground: '#0E1621',
    headerBackground: '#17212B',
    headerText: '#FFFFFF',
    sentBubble: '#2B5278',
    receivedBubble: '#182533',
    text: '#FFFFFF',
    textSecondary: '#8B98A5',
    border: '#242F3D',
    online: '#4DCD5E',
  },
} as const;

export function getTelegramStreamTheme(isDark: boolean): DeepPartial<Theme> {
  const colors = isDark ? TelegramColors.dark : TelegramColors.light;

  return {
    messageItemView: {
      content: {
        containerInner: {
          backgroundColor: colors.receivedBubble,
        },
      },
    },
    messageComposer: {
      container: {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      },
      inputBox: {
        color: colors.text,
      },
      sendButton: {
        backgroundColor: colors.primary,
      },
    },
    channelPreview: {
      container: {
        backgroundColor: colors.background,
      },
      title: {
        color: colors.text,
      },
      date: {
        color: colors.textSecondary,
      },
    },
    channelListView: {
      flatList: {
        backgroundColor: colors.background,
      },
    },
  };
}
