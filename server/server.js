require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Basic route to verify server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'VoteWise API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
