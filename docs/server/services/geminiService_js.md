# Masterclass: `server/services/geminiService.js`

## Purpose of this File
This file is the specific module that knows how to communicate with Google's Gemini AI. By extracting this into a "Service" file, we hide the complex API logic away from the `chatController.js`. The controller just says "Get me an AI answer", and this file handles the actual network negotiation with Google.

---

## The Code & Line-by-Line Breakdown

```javascript
const { GoogleGenAI } = require('@google/genai');
```
* **`const { GoogleGenAI } = ...`**: We import the official Google Gemini SDK (Software Development Kit). This library makes it much easier to talk to the AI compared to writing raw HTTP requests.

```javascript
const generateAssistantResponse = async (userMessage) => {
  try {
```
* **`generateAssistantResponse`**: The main function exported by this file. It takes the text the user typed (`userMessage`) as its only argument.

```javascript
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return "Hello! I am VoteWise AI. My AI capabilities are currently disabled because the Gemini API key is missing. Please configure it in the .env file.";
    }
```
* **The Missing Key Guard**: Before we even try to call Google, we check if the `GEMINI_API_KEY` exists in our environment variables. If someone clones this project from GitHub and forgets to add their key, this gracefully returns a helpful message instead of crashing the server.

```javascript
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```
* We initialize the Google SDK, passing it our secret password (API Key) so Google knows who is making the request (and who to bill).

```javascript
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMessage,
```
* **`model: 'gemini-2.5-flash'`**: We specify exactly which AI model we want. The `flash` model is heavily optimized for speed, making the chat feel instantaneous.
* **`contents: userMessage`**: We pass the user's question to the AI.

```javascript
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
```
* **`systemInstruction`**: This is arguably the most important string of text in the entire project. This is the "System Prompt". It programs the AI's personality and boundaries *before* it reads the user's message.
  * It forces the AI to stay non-partisan.
  * It forces the AI to refuse to answer questions about sports, movies, or coding.
  * It tells the AI to aggressively correct misinformation.
* **`temperature: 0.5`**: Temperature controls how "creative" the AI is (from 0.0 to 1.0). At 0.0, the AI is a robot that gives the exact same boring answer every time. At 1.0, the AI is highly creative but prone to hallucinating fake facts. We set it to `0.5` as a perfect balance—creative enough to sound conversational, but strict enough to stick to the facts.

```javascript
    return response.text;
```
* The function finishes and returns the plain text string of the AI's answer back to the `chatController`.

```javascript
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw new Error('Failed to generate AI response.');
  }
};
```
* If Google's API crashes or our key is invalid, this catches the error, logs it to our terminal so we can debug it, and throws a generic error back to the controller.
