import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { getSocket, disconnectSocket, type TypedSocket } from '../../infrastructure/socket.client';

interface SocketContextValue {
  socket: TypedSocket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export function SocketProvider({ token, children }: { token: string | null; children: ReactNode }) {
  const socketRef = useRef<TypedSocket | null>(null);

  useEffect(() => {
    if (!token) return;
    socketRef.current = getSocket(token);
    return () => {
      disconnectSocket();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
