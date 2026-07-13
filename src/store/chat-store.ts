import { create } from 'zustand';

import type { ChatMessage } from '@/types/chat';

interface ChatState {
  sessionId: string;
  messages: ChatMessage[];
  sheetSnapIndex: 0 | 1;
  addMessage: (message: ChatMessage) => void;
  /**
   * Commit final text once, when a streaming assistant message completes.
   * Never called per-token — in-flight text lives in local component state
   * inside StreamingText (see CLAUDE.md non-negotiable rule #3).
   */
  completeMessage: (id: string, content: string) => void;
  setSnapIndex: (index: 0 | 1) => void;
}

const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useChatStore = create<ChatState>((set) => ({
  sessionId,
  messages: [],
  sheetSnapIndex: 0,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  completeMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, content, status: 'complete' } : message,
      ),
    })),
  setSnapIndex: (sheetSnapIndex) => set({ sheetSnapIndex }),
}));
