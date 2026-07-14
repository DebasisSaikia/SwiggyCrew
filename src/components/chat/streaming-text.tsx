import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { TypingIndicator } from '@/components/chat/typing-indicator';
import { streamAssistantReply } from '@/services/mock-ai';
import { useChatStore } from '@/store/chat-store';

interface StreamingTextProps {
  messageId: string;
  prompt: string;
}

/**
 * Owns the growing token buffer in LOCAL state (CLAUDE.md non-negotiable
 * rule #3) — chatStore is only written once, via `completeMessage`, when the
 * generator finishes. Every intermediate chunk stays inside this component,
 * so a streaming reply never triggers a chatStore-driven re-render of the
 * message list.
 */
export function StreamingText({ messageId, prompt }: StreamingTextProps) {
  const [text, setText] = useState('');
  const completeMessage = useChatStore((state) => state.completeMessage);

  useEffect(() => {
    let cancelled = false;
    let full = '';

    (async () => {
      for await (const chunk of streamAssistantReply(prompt)) {
        if (cancelled) return;
        full += chunk;
        setText(full);
      }
      if (!cancelled) completeMessage(messageId, full);
    })();

    return () => {
      cancelled = true;
    };
  }, [messageId, prompt, completeMessage]);

  if (text.length === 0) {
    return (
      <View className="rounded-tl-bubble rounded-tr-bubble rounded-br-bubble rounded-bl-[4px] bg-surface-muted px-[14px] py-3">
        <TypingIndicator />
      </View>
    );
  }

  return (
    <View className="max-w-[268px] rounded-tl-bubble rounded-tr-bubble rounded-br-bubble rounded-bl-[4px] bg-surface-muted px-3 py-[10px]">
      <Text className="text-crew-body text-text-primary">
        {text}
        <Text className="text-text-tertiary opacity-60"> ▌</Text>
      </Text>
    </View>
  );
}
