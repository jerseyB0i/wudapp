import { create } from 'zustand';
import type { Message, Conversation } from '@wudapp/types';

interface MessagingState {
  conversations:  Map<string, Conversation>;
  messages:       Map<string, Message[]>; // keyed by conversationId
  typingUsers:    Map<string, string[]>;  // conversationId → userIds
  setConversations: (convs: Conversation[]) => void;
  setMessages:      (conversationId: string, msgs: Message[]) => void;
  appendMessage:    (msg: Message) => void;
  updateMessage:    (messageId: string, conversationId: string, patch: Partial<Message>) => void;
  removeMessage:    (messageId: string, conversationId: string) => void;
  setTyping:        (conversationId: string, userId: string, isTyping: boolean) => void;
}

export const useMessagingStore = create<MessagingState>((set) => ({
  conversations: new Map(),
  messages:      new Map(),
  typingUsers:   new Map(),

  setConversations: (convs) =>
    set({ conversations: new Map(convs.map((c) => [c.id, c])) }),

  setMessages: (conversationId, msgs) =>
    set((s) => ({ messages: new Map(s.messages).set(conversationId, msgs) })),

  appendMessage: (msg) =>
    set((s) => {
      const prev = s.messages.get(msg.conversationId) ?? [];
      return { messages: new Map(s.messages).set(msg.conversationId, [...prev, msg]) };
    }),

  updateMessage: (messageId, conversationId, patch) =>
    set((s) => {
      const msgs = (s.messages.get(conversationId) ?? []).map((m) =>
        m.id === messageId ? { ...m, ...patch } : m,
      );
      return { messages: new Map(s.messages).set(conversationId, msgs) };
    }),

  removeMessage: (messageId, conversationId) =>
    set((s) => {
      const msgs = (s.messages.get(conversationId) ?? []).filter((m) => m.id !== messageId);
      return { messages: new Map(s.messages).set(conversationId, msgs) };
    }),

  setTyping: (conversationId, userId, isTyping) =>
    set((s) => {
      const prev = s.typingUsers.get(conversationId) ?? [];
      const next = isTyping ? [...new Set([...prev, userId])] : prev.filter((id) => id !== userId);
      return { typingUsers: new Map(s.typingUsers).set(conversationId, next) };
    }),
}));
