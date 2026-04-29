# Masterclass: `server/app.js`

## Purpose of this File
If `server.js` is the ignition switch, `app.js` is the engine itself. This file configures the Express application. It is completely dedicated to defining the "Middleware Pipeline". Think of this pipeline as a factory conveyor belt: an HTTP request enters the building, gets checked by security, gets compressed, and is finally handed off to the correct department (the Routes).

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
* **`require('dotenv').config();`**
  * `dotenv` is a library. By calling `.config()`, it searches your folder for a file literally named `.env`. It reads all the secret keys inside that file and injects them into the global Node environment (`process.env`). We do this first so all subsequent code has access to the secrets.
* **`const express = require('express');`**
  * Imports the core Express library, which provides the tools to build a web server.
* **`const cors = require('cors');`**
  * Imports CORS (Cross-Origin Resource Sharing). By default, web browsers block a frontend on one URL from requesting data from a backend on a completely different URL (for security). CORS allows us to whitelist our specific frontend URL.
* **`const helmet = require('helmet');`**
  * Imports Helmet, a collection of 15 smaller middleware functions that set secure HTTP headers. It prevents things like Cross-Site Scripting (XSS) and Clickjacking.
* **`const rateLimit = require('express-rate-limit');`**
  * Imports a tool to limit how many times a user can ask our server for data in a specific time frame.
* **`const compression = require('compression');`**
  * Imports a tool that automatically zips (compresses) JSON and HTML responses using Gzip or Deflate before sending them over the internet, saving bandwidth and making the app feel incredibly fast.

```javascript
const app = express();
app.set('trust proxy', 1);
```
* **`const app = express();`**
  * We execute the `express` function we imported. This creates a brand new, blank application object called `app`. We will now attach tools to this object.
* **`app.set('trust proxy', 1);`**
  * Because this backend is deployed on a cloud provider (like Render or Cloud Run), requests from users don't hit our server directly; they hit the cloud provider's proxy server first. If we don't "trust the proxy", our rate limiter will think every single request is coming from the proxy's IP address, rather than the individual users' IP addresses. This line fixes that.

```javascript
app.use(compression());
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
```
* **`app.use(...)`**: This is how we attach middleware to the conveyor belt. Every incoming request must pass through these functions in order.
* **`app.use(compression());`**: Shrinks outgoing responses.
* **`app.use(helmet());`**: Slaps security headers onto outgoing responses.
* **`app.use(cors({ origin: process.env.CLIENT_URL }));`**: Configures CORS. `origin` means "Who is allowed to ask us for data?". We pull the allowed URL (e.g., `https://votewise.vercel.app`) from our secret `.env` file so we can change it later without editing the code.
* **`app.use(express.json());`**: A built-in tool that parses (reads) incoming requests that contain a JSON body. Without this, if the React frontend sent `{ "message": "hello" }`, the backend wouldn't know how to read it.

```javascript
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 15,
  message: { error: 'Too many requests from this IP, please try again after 10 minutes' }
});
```
* **`const chatLimiter = rateLimit({ ... })`**: We configure a specific bouncer for our chat API.
* **`windowMs: 10 * 60 * 1000`**: Time frame in milliseconds. (10 minutes * 60 seconds * 1000 milliseconds = 10 minutes total).
* **`max: 15`**: The maximum number of times a single IP address can hit the route within that 10-minute window.
* **`message: { ... }`**: If they hit request #16, this is the exact JSON error they receive instead of a chat response.

```javascript
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatLimiter, chatRoutes);
```
* **`const chatRoutes = require('./routes/chatRoutes');`**: We import our route map for chat features.
* **`app.use('/api/chat', ...)`**: We tell the conveyor belt: "If the URL starts with `/api/chat`, apply these specific rules."
* **`chatLimiter`**: First, pass them through the rate limiter.
* **`chatRoutes`**: If the rate limiter allows them through, hand the request to the `chatRoutes` file to figure out what to do.

```javascript
module.exports = app;
```
* **`module.exports = app;`**: This exposes our fully configured `app` object so that other files (specifically `server.js`) can import it using `require('./app')`.
