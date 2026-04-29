# Masterclass: `server/app.js`

## Purpose of this File
This file is the "Middleware Conveyor Belt" of our backend. When a user requests data from our server, the request enters this file and travels through a series of checkpoints (middlewares) before finally reaching our logic. It handles security, compression, rate limiting, and routing. 

*Why is this separate from `server.js`?* Separating the "app setup" from the "server turn-on" allows us to easily test our Express app using automated testing tools like `supertest` without accidentally starting the live server.

---

## The Code & Line-by-Line Breakdown

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
```
* **`const express = require('express');`**: Imports Express, the core framework we use to build the backend.
* **`const cors = require('cors');`**: Imports Cross-Origin Resource Sharing. This prevents random websites from talking to our backend.
* **`const helmet = require('helmet');`**: Imports Helmet, a massive security boost that automatically adds 14 different security headers to protect against common web hacks (like XSS).
* **`const rateLimit = require('express-rate-limit');`**: Protects us from DDOS attacks and API spam.
* **`const compression = require('compression');`**: Compresses our server's text responses to make them up to 70% smaller and faster to download.

```javascript
const app = express();
app.set('trust proxy', 1);
```
* **`const app = express();`**: Creates the actual application.
* **`app.set('trust proxy', 1);`**: Because we deploy this to the cloud (like Render or Vercel), our app sits behind a "proxy" server. We tell Express to trust the proxy so it can accurately read the real IP addresses of our users for rate limiting.

```javascript
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```
* **`app.use(...)`**: This is how we attach a middleware to the conveyor belt. Every request that comes in goes through these functions.
* **`app.use(cors({...}))`**: We configure CORS to only allow requests originating from our actual frontend website (`CLIENT_URL`).

```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
* **`app.use(express.json());`**: This tells Express to intercept incoming network traffic, look for data formatted as JSON, and parse it into a neat JavaScript object that we can use in our code.

```javascript
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: { error: 'Too many requests. Please wait a few minutes before trying again.' },
});

const globalDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1000,
  keyGenerator: () => 'global_limit',
  message: { error: 'Hackathon Quota Exceeded! Daily limit reached.' },
});
```
* **`const chatLimiter = rateLimit(...)`**: This creates a rule: "If any single IP address makes more than 15 requests in 10 minutes, block them and send an error."
* **`const globalDailyLimiter = rateLimit(...)`**: This creates a rule for the *entire server*: "If the server receives 1,000 total requests in 24 hours, shut down the chat." This is crucial to protect the free tier limits of the Gemini AI API during a hackathon.

```javascript
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', globalDailyLimiter, chatLimiter, chatRoutes);
```
* **`app.use('/api/chat', ...)`**: This says, "If a request comes in aiming for `/api/chat`, first run it through the daily limiter, then the per-user limiter, and if it passes both, hand it over to the `chatRoutes` logic."

```javascript
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'VoteWise API is running!' });
});
```
* **`app.get('/api/health', ...)`**: A simple health check route. Ping this URL to quickly verify if the backend is alive without spending Gemini tokens.

```javascript
module.exports = app;
```
* **`module.exports = app;`**: Exports the fully configured conveyor belt so `server.js` can import it and turn it on.
