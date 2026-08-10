import { useRef, useCallback } from 'react';
import { WebRTCClient } from '../../../infrastructure/webrtc.client';
import { useSocketContext } from '../../../app/providers/SocketProvider';

export function useWebRTC() {
  const { socket } = useSocketContext();
  const clientRef = useRef<WebRTCClient | null>(null);

  const getClient = useCallback(() => {
    if (!socket) throw new Error('Socket not connected');
    if (!clientRef.current) clientRef.current = new WebRTCClient(socket);
    return clientRef.current;
  }, [socket]);

  const startCall = async (peerId: string, callId: string, video: boolean) => {
    const client = getClient();
    await client.startLocalStream(video);
    await client.createOffer(peerId, callId);
  };

  const endCall = () => {
    clientRef.current?.endCall();
    clientRef.current = null;
  };

  return { startCall, endCall };
}
