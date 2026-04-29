const { generateAssistantResponse } = require('../services/geminiService');
const { detectAndTranslate } = require('../services/translationService');
const Chat = require('../models/Chat');

const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Input length guard
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long. Please keep it under 1000 characters.' });
  }

  try {
    // 1. Generate AI response (always in English for accuracy)
    const aiResponse = await generateAssistantResponse(message);

    // 2. Detect user language and translate response if needed (Google Cloud Translation)
    const { translatedResponse, detectedLang } = await detectAndTranslate(message, aiResponse);

    // 3. Save to MongoDB (save the English response for consistency)
    try {
      const chatLog = new Chat({
        userMessage: message,
        aiResponse: aiResponse
      });
      await chatLog.save();
    } catch (dbError) {
      console.warn('⚠️ Could not save chat to database, but sending response anyway.', dbError.message);
    }

    return res.status(200).json({
      reply: translatedResponse,
      detectedLang,
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
