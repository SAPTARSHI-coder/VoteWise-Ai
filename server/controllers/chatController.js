const { generateAssistantResponse } = require('../services/geminiService');

const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const aiResponse = await generateAssistantResponse(message);
    
    // (Optional future addition: Save user message and AI response to MongoDB here)

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
