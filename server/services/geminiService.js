const { GoogleGenAI } = require('@google/genai');

const generateAssistantResponse = async (userMessage) => {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return "Hello! I am VoteWise AI. My AI capabilities are currently disabled because the Gemini API key is missing. Please configure it in the .env file.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
        config: {
            systemInstruction: `You are VoteWise AI, a smart, interactive election assistant.
Your goal is to help users understand the election process, timelines, eligibility, and voting steps.
You must respond with accurate, non-partisan, and helpful information.
If the user shares misinformation (e.g., "Can I vote twice?"), politely correct them with facts.
Keep responses concise, clear, and easy to read.`,
            temperature: 0.7,
        }
    });

    return response.text;
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw new Error('Failed to generate AI response.');
  }
};

module.exports = { generateAssistantResponse };
