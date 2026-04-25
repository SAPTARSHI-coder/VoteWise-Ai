const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');

// @route   POST /api/chat
// @desc    Get AI response from VoteWise Gemini Assistant
router.post('/', handleChat);

module.exports = router;
