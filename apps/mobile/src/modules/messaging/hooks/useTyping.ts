import { useCallback, useRef } from 'react';
import { useSocketContext } from '../../../app/providers/SocketProvider';
import { useMessagingStore } from '../store/messaging.store';

export function useTyping(conversationId: string) {
  const { socket } = useSocketContext();
  const { setTyping } = useMessagingStore();
  const isTypingRef = useRef(false);
  const stopTimer = useRef<ReturnType<typeof setTimeout>>();

  const typingUsers = useMessagingStore((s) => s.typingUsers.get(conversationId) ?? []);

  const onType = useCallback(() => {
    if (!socket) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start', { conversationId });
    }
    clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('typing:stop', { conversationId });
    }, 3_000);
  }, [socket, conversationId]);

  return { typingUsers, onType };
}
