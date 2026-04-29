# Masterclass: `server/services/geminiService.js`

## Purpose of this File
This file isolates all the logic for talking to Google's Generative AI. In professional software development, we use "Services" to keep our code clean. Instead of putting 100 lines of Google API code inside the `chatController.js`, we put it here, export a single clean function, and let the controller call it. This makes the codebase modular and easy to read.

---

## The Code & Line-by-Line Breakdown

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
```
* **`const { GoogleGenerativeAI } = ...`**
  * We use object destructuring `{ }` to import the exact class we need from the official Google SDK (Software Development Kit). The SDK is a pre-written library of code by Google that makes calling their servers much easier than writing raw HTTP requests.

```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```
* **`const genAI = new GoogleGenerativeAI(...)`**
  * We "instantiate" (create an active working copy of) the Google Generative AI client.
* **`process.env.GEMINI_API_KEY`**
  * We pass our secret password to the client. Without this, Google would immediately reject our request with a `401 Unauthorized` error.

```javascript
const SYSTEM_PROMPT = `You are VoteWise AI, an expert, non-partisan Indian election assistant.
Keep answers under 3 sentences. Be completely neutral. Do not mention political parties.`;
```
* **`const SYSTEM_PROMPT = \`...\`;`**
  * This is the "System Prompt" or "Instructions". LLMs (Large Language Models) are essentially extremely smart autocomplete engines. If a user asks "Who should I vote for?", a raw LLM might give a biased answer.
  * By defining a strict persona ("non-partisan", "neutral", "under 3 sentences"), we build guardrails. This is crucial for a civic tech application to ensure no political bias is accidentally generated.

```javascript
exports.generateAssistantResponse = async (userMessage) => {
```
* **`exports.generateAssistantResponse = ...`**
  * We attach this function to `exports` so `chatController.js` can import it.
* **`async (userMessage) => {`**
  * This function expects one argument: the exact string the user typed in the frontend. It is marked `async` because talking to Google takes time.

```javascript
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```
* **`try {`**
  * Always wrap external API calls in a `try/catch` block. If Google's servers crash, our app shouldn't crash with them.
* **`const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });`**
  * We tell the Google client *which* brain to use. 
  * Why `gemini-2.5-flash`? Google offers multiple models. "Pro" is for highly complex reasoning (like writing code), but it is slower and costs more. "Flash" is optimized for speed and cost-efficiency, making it the absolute best choice for a fast chat assistant.

```javascript
    const prompt = `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}`;
```
* **`const prompt = ...`**
  * We concatenate (glue together) our strict rules with the user's specific question. 
  * `\n\n` adds two line breaks.
  * The AI never actually sees just "How do I vote?". It sees: *"You are VoteWise AI... User Question: How do I vote?"*

```javascript
    const result = await model.generateContent(prompt);
    return result.response.text();
```
* **`const result = await model.generateContent(prompt);`**
  * This is the actual network call to Google. We `await` (pause) until Google finishes generating the response and sends it back over the internet.
* **`return result.response.text();`**
  * The `result` object that comes back from Google is massive. It contains metadata, safety ratings, token counts, etc. We don't care about any of that. We dig into the object (`result.response.text()`) to extract just the raw string of text the AI generated, and we `return` it back to the `chatController.js`.

```javascript
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response');
  }
};
```
* **`} catch (error) {`**
  * If the `await` call fails, execution jumps here.
* **`console.error(...)`**
  * We log the exact technical error to the terminal for debugging.
* **`throw new Error(...)`**
  * We "throw" a new error up the chain. The `chatController.js` has its own `try/catch` block, which will catch this thrown error and send a clean `500 Server Error` back to the user instead of leaking Google's raw error messages.
