import { useCallback, useMemo, useState } from 'react';

import { useChatStore } from '@/store/chat-store';
import type { ChatMessage } from '@/types/chat';

function createId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useAskCrewChat() {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const [inputValue, setInputValue] = useState('');

  const isStreaming = useMemo(() => messages.some((message) => message.status === 'streaming'), [messages]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming) return;

    const now = Date.now();
    const userMessage: ChatMessage = { id: createId(), role: 'user', content: trimmed, status: 'complete', createdAt: now };
    const assistantMessage: ChatMessage = { id: createId(), role: 'assistant', content: '', status: 'streaming', createdAt: now };

    addMessage(userMessage);
    addMessage(assistantMessage);
    setInputValue('');
  }, [inputValue, isStreaming, addMessage]);

  return { messages, inputValue, setInputValue, handleSend, isStreaming };
}
