export type ChatRole = 'user' | 'assistant';
export type MessageStatus = 'pending' | 'streaming' | 'complete';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  /** Committed text only. Empty while status is 'streaming' — in-flight text lives in local component state. */
  content: string;
  status: MessageStatus;
  createdAt: number;
}

export interface ChatSessionState {
  sessionId: string;
  messages: ChatMessage[];
  sheetSnapIndex: 0 | 1;
}
