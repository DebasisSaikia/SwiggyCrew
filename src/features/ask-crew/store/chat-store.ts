import { create } from 'zustand';

import { streamAssistantReply } from '../services/mock-ai-service';
import { ChatMessage } from '../types';

type ChatState = {
  messages: ChatMessage[];
  isStreaming: boolean;
  sendMessage: (text: string) => Promise<void>;
};

let nextId = 0;
function generateId(): string {
  nextId += 1;
  return `msg-${nextId}-${Date.now()}`;
}

// Plain in-memory store (no persist middleware) is intentional: chat history only
// needs to survive open/close cycles for the session lifetime, not app restarts.
export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || get().isStreaming) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      isStreaming: false,
    };
    const assistantMessageId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    set((state) => ({
      messages: [...state.messages, userMessage, assistantMessage],
      isStreaming: true,
    }));

    for await (const token of streamAssistantReply(trimmed)) {
      set((state) => ({
        messages: state.messages.map((message) =>
          message.id === assistantMessageId
            ? { ...message, content: message.content + token }
            : message
        ),
      }));
    }

    set((state) => ({
      isStreaming: false,
      messages: state.messages.map((message) =>
        message.id === assistantMessageId ? { ...message, isStreaming: false } : message
      ),
    }));
  },
}));
