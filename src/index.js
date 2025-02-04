import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import path from 'path';

import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { app, server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Define allowed origins for CORS
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://hillaryschattyapp.netlify.app']
    : ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Start server
server.listen(PORT, () => {
  console.log('server is running on PORT:' + PORT);
  connectDB();
});
