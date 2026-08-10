import { useEffect, useState } from 'react';
import { useSocketContext } from '../../app/providers/SocketProvider';
import type { UserStatus } from '@wudapp/types';

export function usePresence(userId: string): { status: UserStatus; lastSeen: string } {
  const { socket } = useSocketContext();
  const [presence, setPresence] = useState<{ status: UserStatus; lastSeen: string }>({
    status: 'offline',
    lastSeen: '',
  });

  useEffect(() => {
    if (!socket) return;
    socket.on('presence:update', (payload) => {
      if (payload.userId === userId) {
        setPresence({ status: payload.status, lastSeen: payload.lastSeen });
      }
    });
    return () => { socket.off('presence:update'); };
  }, [socket, userId]);

  return presence;
}
