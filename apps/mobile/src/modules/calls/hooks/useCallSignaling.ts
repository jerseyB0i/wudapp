import { useEffect } from 'react';
import { useSocketContext } from '../../../app/providers/SocketProvider';
import { useCallsStore } from '../store/calls.store';

export function useCallSignaling() {
  const { socket } = useSocketContext();
  const { setIncoming, setActive } = useCallsStore();

  useEffect(() => {
    if (!socket) return;

    socket.on('call:incoming', (call) => setIncoming(call as any));
    socket.on('call:accepted', () => {
      const incoming = useCallsStore.getState().incomingCall;
      if (incoming) { setActive(incoming); setIncoming(null); }
    });
    socket.on('call:ended', () => { setActive(null); setIncoming(null); });
    socket.on('call:declined', () => setIncoming(null));

    return () => {
      socket.off('call:incoming');
      socket.off('call:accepted');
      socket.off('call:ended');
      socket.off('call:declined');
    };
  }, [socket]);
}
