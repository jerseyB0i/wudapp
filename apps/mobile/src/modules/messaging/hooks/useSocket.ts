import { useEffect } from 'react';
import { useSocketContext } from '../../../app/providers/SocketProvider';
import { useMessagingStore } from '../store/messaging.store';

export function usePresenceSocket() {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    socket.on('typing:start', ({ conversationId, user }) => {
      useMessagingStore.getState().setTyping(conversationId, user.id, true);
    });
    socket.on('typing:stop', ({ conversationId, userId }) => {
      useMessagingStore.getState().setTyping(conversationId, userId, false);
    });
    return () => {
      socket.off('typing:start');
      socket.off('typing:stop');
    };
  }, [socket]);
}
