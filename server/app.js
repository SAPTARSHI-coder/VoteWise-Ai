/**
 * app.js — Express app factory (no server.listen)
 * Exported separately so Jest/Supertest can import it without starting a server.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const app = express();

app.set('trust proxy', 1);

// Compression
app.use(compression());

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Per-IP rate limiter
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: { error: 'Too many requests. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global daily limiter
const globalDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1000,
  keyGenerator: () => 'global_limit',
  message: { error: 'Hackathon Quota Exceeded! Daily limit reached.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', globalDailyLimiter, chatLimiter, chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'VoteWise API is running!' });
});

module.exports = app;
