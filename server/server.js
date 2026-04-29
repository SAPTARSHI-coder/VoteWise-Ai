require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Trust the reverse proxy (Cloud Run / Render) so rate limiter uses the correct IP
app.set('trust proxy', 1);

// Security headers — sets X-Frame-Options, CSP, HSTS, X-Content-Type-Options, etc.
app.use(helmet());

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow specific origin in production, all in dev
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const chatRoutes = require('./routes/chatRoutes');

// Rate limiting specifically for the Gemini Chat API (Max 15 requests per 10 minutes per IP)
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15, // Limit each IP to 15 requests per `window` (here, per 10 minutes)
  message: { error: 'Too many requests. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// GLOBAL daily rate limiting (Protects your Gemini API Free Tier of 1500 req/day)
const globalDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000, // Limit ALL users combined to 1000 requests per day
  keyGenerator: () => 'global_limit', // Groups all requests into one single bucket
  message: { error: 'Hackathon Quota Exceeded! The app has reached its daily limit of 1000 messages to protect the developer API key. Please try again tomorrow.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/chat', globalDailyLimiter, chatLimiter, chatRoutes);

// Basic route to verify server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'VoteWise API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
