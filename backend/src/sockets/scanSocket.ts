import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const initSocketServer = (io: SocketIOServer): void => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

export const emitScanEvent = (scanData: any): void => {
  if (ioInstance) {
    ioInstance.emit('new_scan', scanData);
  }
};
