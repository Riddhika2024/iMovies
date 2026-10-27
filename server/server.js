import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Routes
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import theatreRoutes from './routes/theatreRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Services & Utilities
import { cleanupExpiredSeatLocks } from './services/cleanupService.js';
import { checkUpcomingShowsAndRemind } from './services/reminderService.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Real-Time Connection
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_show', (showId) => {
    socket.join(`show_${showId}`);
    console.log(`[Socket.io] ${socket.id} joined show room: show_${showId}`);
  });

  socket.on('leave_show', (showId) => {
    socket.leave(`show_${showId}`);
    console.log(`[Socket.io] ${socket.id} left show room: show_${showId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/theatre', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'iMovies Backend API',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Setup Cron Jobs
// 1. Sweep expired seat locks every minute
cron.schedule('* * * * *', () => {
  cleanupExpiredSeatLocks(io);
});

// 2. Check upcoming shows and send email reminders every hour
cron.schedule('0 * * * *', () => {
  checkUpcomingShowsAndRemind();
});

// Database Connection with In-Memory fallback for zero setup
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/imovies';

const connectDB = async () => {
  try {
    console.log('[Database] Connecting to MongoDB at', MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log('[Database] MongoDB Connected successfully.');
  } catch (err) {
    console.warn('[Database Warning] Local MongoDB connection failed:', err.message);
    console.log('[Database] Initializing isolated In-Memory MongoDB Server...');
    try {
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      console.log(`[Database] In-Memory MongoDB running at: ${memUri}`);
      await mongoose.connect(memUri);
      console.log('[Database] In-Memory MongoDB Connected.');
    } catch (memErr) {
      console.error('[Database Fatal] In-memory MongoDB failed:', memErr.message);
    }
  }

  // Seed default data (Admin, Movies, Theatres, Shows)
  await seedDatabase();
};

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🍿 iMovies API Server running on port ${PORT}`);
    console.log(`=========================================`);
  });
};

startServer();
