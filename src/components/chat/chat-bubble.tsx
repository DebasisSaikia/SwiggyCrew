import { memo } from 'react';
import { Text, View } from 'react-native';

import { SparkleAvatar } from '@/components/chat/sparkle-avatar';
import { StreamingText } from '@/components/chat/streaming-text';
import type { ChatMessage } from '@/types/chat';

interface ChatBubbleProps {
  message: ChatMessage;
  /** The preceding user message's text — only used while `message` is streaming. */
  promptText?: string;
}

function ChatBubbleComponent({ message, promptText }: ChatBubbleProps) {
  if (message.role === 'user') {
    return (
      <View className="flex-row justify-end">
        <View className="max-w-[268px] rounded-tl-bubble rounded-tr-bubble rounded-bl-bubble rounded-br-[4px] bg-primary px-3 py-[10px]">
          <Text className="text-crew-body text-primary-foreground">{message.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-2">
      <SparkleAvatar />
      {message.status === 'streaming' ? (
        <StreamingText messageId={message.id} prompt={promptText ?? ''} />
      ) : (
        <View className="max-w-[268px] rounded-tl-bubble rounded-tr-bubble rounded-br-bubble rounded-bl-[4px] bg-surface-muted px-3 py-[10px]">
          <Text className="text-crew-body text-text-primary">{message.content}</Text>
        </View>
      )}
    </View>
  );
}

export const ChatBubble = memo(ChatBubbleComponent);
