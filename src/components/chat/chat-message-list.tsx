import { BottomSheetFlatList } from '@expo/ui/community/bottom-sheet';
import { useCallback } from 'react';
import { View } from 'react-native';

import { ChatBubble } from '@/components/chat/chat-bubble';
import type { ChatMessage } from '@/types/chat';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

interface RenderItemInfo {
  item: ChatMessage;
  index: number;
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const renderItem = useCallback(
    ({ item, index }: RenderItemInfo) => (
      <ChatBubble message={item} promptText={item.role === 'assistant' ? messages[index - 1]?.content : undefined} />
    ),
    [messages],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <BottomSheetFlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
}

function ItemSeparator() {
  return <View className="h-3" />;
}
