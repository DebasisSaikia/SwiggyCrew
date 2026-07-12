import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

import { ChatMessage } from '../types';
import { ChatMessageBubble } from './chat-message-bubble';

type ChatMessageListProps = { messages: ChatMessage[] };

const renderItem = ({ item }: { item: ChatMessage }) => <ChatMessageBubble message={item} />;
const keyExtractor = (item: ChatMessage) => item.id;

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const listRef = useRef<BottomSheetFlatListMethods>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <View style={styles.empty}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
          Ask about destinations, budgets, or what to pack — Crew will help you plan.
        </ThemedText>
      </View>
    );
  }

  return (
    <BottomSheetFlatList
      ref={listRef}
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.content}
    />
  );
}

// Leaves room for the footer input (see ask-crew-sheet.tsx), which floats
// above the scrollable content rather than participating in its flex layout.
const FOOTER_CLEARANCE = 88;

const styles = StyleSheet.create({
  content: {
    paddingTop: Spacing.three,
    paddingBottom: FOOTER_CLEARANCE,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.five,
  },
  emptyText: {
    textAlign: 'center',
  },
});
