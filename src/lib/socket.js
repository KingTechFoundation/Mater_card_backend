import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

// Define allowed origins for Socket.IO
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://chatappbygael.netlify.app']
    : ['http://localhost:5173'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true, // Allow credentials for secure communication
  },
});

// Helper function to get the socket ID of a receiver
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Store online users { userId: socketId }
const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Emit the list of online users to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
