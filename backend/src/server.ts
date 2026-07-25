import express from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import router from './routes/index';
import { initSocketServer } from './sockets/scanSocket';
import User from './models/User';
import { seedDatabase } from './utils/seedData';

dotenv.config();

const app = express();

// Trust reverse proxy (Serveo, LocalTunnel, Cloudflare, Vercel, Render)
app.set('trust proxy', 1);

const server = http.createServer(app);

const PORT = process.env.PORT || 5001;

// Socket.io initialization
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
initSocketServer(io);

// Security & Dynamic CORS Middleware with Explicit OPTIONS Preflight Response
app.use(helmet({ contentSecurityPolicy: false }));

// Custom robust CORS middleware for cross-origin mobile browser compatibility
app.use((req, res, next) => {
  const origin = (req.headers.origin as string) || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiting with proxy validation bypass
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  validate: { xForwardedForHeader: false },
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Mount main router (contains /r/:shortCode, /api/auth, /api/qr, /api/campaigns, etc.)
app.use(router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), service: 'QR Advertising Platform API' });
});

// Serve frontend static dist assets directly from Express
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Client SPA Fallback Routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/r/')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Database connection & Auto-Seed on Startup
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is empty. Seeding initial demo data & campaigns...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('[Server] Auto-seed check error:', err);
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`
==========================================================
🚀 QR Advertising Analytics Platform Backend is Live!
📡 Server Port: ${PORT}
🌐 API Base: http://localhost:${PORT}/api
🔗 Dynamic QR Short URL Base: http://localhost:${PORT}/r/:shortCode
⚡ Real-time Socket.io Active
==========================================================
    `);
  });
});
