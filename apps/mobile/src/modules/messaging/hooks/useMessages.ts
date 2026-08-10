import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { apiClient } from '../../../infrastructure/api.client';
import { useMessagingStore } from '../store/messaging.store';
import { useSocketContext } from '../../../app/providers/SocketProvider';
import type { Message } from '@wudapp/types';

export function useMessages(conversationId: string) {
  const { socket } = useSocketContext();
  const { appendMessage, updateMessage, removeMessage, setMessages } = useMessagingStore();

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () =>
      apiClient
        .get<{ messages: Message[] }>(`/api/conversations/${conversationId}/messages`)
        .then((r) => r.data.messages),
    onSuccess: (msgs) => setMessages(conversationId, msgs),
  } as any);

  useEffect(() => {
    if (!socket) return;
    socket.emit('conversation:join', conversationId);

    socket.on('message:new', (msg) => {
      if (msg.conversationId === conversationId) appendMessage(msg);
    });
    socket.on('message:edited', ({ messageId, content, editedAt }) => {
      updateMessage(messageId, conversationId, { content, editedAt });
    });
    socket.on('message:deleted', ({ messageId, conversationId: cid }) => {
      if (cid === conversationId) removeMessage(messageId, conversationId);
    });

    return () => {
      socket.emit('conversation:leave', conversationId);
      socket.off('message:new');
      socket.off('message:edited');
      socket.off('message:deleted');
    };
  }, [socket, conversationId]);

  return query;
}
