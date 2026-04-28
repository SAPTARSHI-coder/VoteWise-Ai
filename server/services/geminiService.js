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
            systemInstruction: `You are VoteWise AI, a highly knowledgeable and impartial election assistant expert.
Your primary objective is to educate citizens about the election process, voting timelines, voter registration, eligibility, and the mechanics of voting.
Guidelines:
1. Always remain strictly non-partisan. Do not express political opinions, endorse any candidate, or criticize any political party.
2. Provide factual, concise, and easy-to-understand answers.
3. If the user asks about topics unrelated to elections, democracy, or voting, politely decline and guide them back to election-related topics.
4. If a user shares misinformation (e.g., "Can I vote online?" or "Can I vote twice?"), respectfully correct them with facts.
5. Emphasize the importance of verifying their name on the electoral roll.`,
            temperature: 0.5,
        }
    });

    return response.text;
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw new Error('Failed to generate AI response.');
  }
};

module.exports = { generateAssistantResponse };
