import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ChatMessage } from '../types';
import { ChatLoadingIndicator } from './chat-loading-indicator';

type ChatMessageBubbleProps = { message: ChatMessage };

export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
}: ChatMessageBubbleProps) {
  const theme = useTheme();
  const isUser = message.role === 'user';
  const showLoading = message.isStreaming && message.content.length === 0;

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
          { backgroundColor: isUser ? theme.bubbleUser : theme.bubbleAssistant },
        ]}>
        {showLoading ? (
          <ChatLoadingIndicator />
        ) : (
          <ThemedText
            type="default"
            style={{ color: isUser ? theme.bubbleUserText : theme.bubbleAssistantText }}>
            {message.content}
          </ThemedText>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  rowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  bubbleUser: {
    borderBottomRightRadius: Spacing.half,
  },
  bubbleAssistant: {
    borderBottomLeftRadius: Spacing.half,
  },
});
