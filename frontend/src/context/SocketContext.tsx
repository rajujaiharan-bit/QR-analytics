import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface LiveScanPayload {
  qrId: string;
  qrName: string;
  brandName: string;
  totalScans: number;
  city: string;
  country: string;
  device: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  lastScan: LiveScanPayload | null;
  liveScanCount: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastScan, setLastScan] = useState<LiveScanPayload | null>(null);
  const [liveScanCount, setLiveScanCount] = useState(0);

  useEffect(() => {
    const socketBase = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:5001';
    const newSocket = io(socketBase, {
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('[SocketContext] Connected to live scan stream');
    });

    newSocket.on('new_scan', (data: LiveScanPayload) => {
      setLastScan(data);
      setLiveScanCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, lastScan, liveScanCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
