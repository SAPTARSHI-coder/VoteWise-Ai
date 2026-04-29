# Chapter 3: Backend Code Explained (Line by Line)

If you have never seen a backend written in Node.js before, it can look terrifying. But it’s actually very simple once you know what to look for.

The backend is built using a tool called **Express**. Express is just a library that makes it easy to say: *"When a user visits this URL, run this specific chunk of code."*

Let's break down the most important files.

---

## 1. The Engine (`server/app.js`)

This file is where we build the actual Express server and add all our security tools. Think of it like assembling a car on a factory line.

```javascript
// 1. IMPORTING TOOLS
require('dotenv').config();       // Loads our secret passwords from the .env file
const express = require('express'); // The main web framework
const cors = require('cors');     // Allows our React frontend to talk to this backend
const helmet = require('helmet'); // Adds invisible security shields
const rateLimit = require('express-rate-limit'); // The bouncer (stops spam)
const compression = require('compression'); // Zips up data to make it faster

// 2. CREATING THE APP
const app = express(); // We create a blank Express app

app.set('trust proxy', 1); // Tells the app to trust the hosting provider's IP address

// 3. MIDDLEWARE (The Assembly Line)
// "Middleware" is code that runs BEFORE the final response is sent.
app.use(compression()); // Zip the data
app.use(helmet());      // Put on the security shield
app.use(cors({ origin: process.env.CLIENT_URL })); // Only allow requests from our React URL
app.use(express.json()); // Allow the app to understand JSON data from the frontend

// 4. RATE LIMITING
// We define a rule: Max 15 requests every 10 minutes per IP address.
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 15,
  message: { error: 'Too many requests. Please wait a few minutes.' }
});

// 5. ROUTES (The Map)
// We tell the app: "If someone asks for /api/chat, go use the chatRoutes file."
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatLimiter, chatRoutes);

// Export the app so it can be turned on by server.js
module.exports = app;
```

---

## 2. The Traffic Cop (`server/controllers/chatController.js`)

When `app.js` passes the request to the `/api/chat` route, it eventually ends up here. This file contains the logic for what to actually *do* with the user's message.

```javascript
// Import the services that talk to Google
const { generateAssistantResponse } = require('../services/geminiService');
const { detectAndTranslate } = require('../services/translationService');

// Create our short-term memory cache
const cache = new Map();

// This function handles the chat request
const handleChat = async (req, res) => {
  // Extract the text message the user typed from the request body
  const { message } = req.body;

  // SAFETY CHECK: Did they actually send a message?
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // SAFETY CHECK: Is the message too long? (Prevents hackers from crashing the server)
  if (message.length > 1000) return res.status(400).json({ error: 'Message too long' });

  // EFFICIENCY WIN: The Cache
  // We make the message lowercase and trim spaces to use as a "key"
  const cacheKey = message.trim().toLowerCase();
  
  // If the memory (cache) already has this key...
  if (cache.has(cacheKey)) {
    // ...send it back instantly! Don't run the rest of the code.
    return res.status(200).json(cache.get(cacheKey));
  }

  try {
    // 1. Ask Gemini the question (This takes ~2 seconds)
    const aiResponse = await generateAssistantResponse(message);

    // 2. Ask Google Translate to check if it needs translating
    const { translatedResponse, detectedLang } = await detectAndTranslate(message, aiResponse);

    // 3. Prepare the final answer
    const responsePayload = {
      reply: translatedResponse,
      detectedLang,
      status: 'success'
    };

    // 4. Save the answer into our short-term memory for next time
    cache.set(cacheKey, responsePayload);

    // 5. Send the answer back to the React frontend
    return res.status(200).json(responsePayload);
    
  } catch (error) {
    // If anything breaks (e.g., Google is down), send an error code
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
```

### Why do we use `async / await`?
You see `async` and `await` a lot in the backend. 
When we ask Google Gemini a question, it takes a few seconds to reply. If we didn't use `await`, the server would just keep executing code without waiting for the answer! 
`await` literally tells Node.js: *"Stop and wait here until Google replies, then continue."*

In the next chapter, we will switch to the **Frontend** and see how React displays this data!
