import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initializeSocket } from './config/socket.js';
import { authenticateUser } from './middleware/auth.js';

// Import routes
import gameRoutes from './routes/game.routes.js';
import userRoutes from './routes/user.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = initializeSocket(server);

// Make io accessible to routes
app.set("io", io);

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Authentication middleware
app.use(authenticateUser);

// Routes
app.use('/', gameRoutes);
app.use('/', userRoutes);
app.use('/', submissionRoutes);
app.use('/', aiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server with Socket.IO is listening on port ${PORT}`);
});
