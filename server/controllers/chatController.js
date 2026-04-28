const { generateAssistantResponse } = require('../services/geminiService');
const Chat = require('../models/Chat'); // Import the Chat model

const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const aiResponse = await generateAssistantResponse(message);
    
    // Save user message and AI response to MongoDB
    try {
      const chatLog = new Chat({
        userMessage: message,
        aiResponse: aiResponse
      });
      await chatLog.save();
    } catch (dbError) {
      console.warn("⚠️ Could not save chat to database, but sending response anyway.", dbError.message);
    }

    return res.status(200).json({
      reply: aiResponse,
      status: 'success'
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({ error: 'Something went wrong processing your message.' });
  }
};

module.exports = {
  handleChat
};
