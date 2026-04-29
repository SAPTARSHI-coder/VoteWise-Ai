# Masterclass: `server/routes/chatRoutes.js`

## Purpose of this File
This file acts as a traffic cop. When a request enters our server, this file routes it to the correct controller logic. By keeping routing separate from the logic, our server remains incredibly organized, even if we added 50 new endpoints.

---

## The Code & Line-by-Line Breakdown

```javascript
const express = require('express');
const router = express.Router();
```
* **`const express = require('express');`**: Imports the Express framework.
* **`const router = express.Router();`**: Creates a mini-app inside our main app specifically dedicated to routing traffic.

```javascript
const { handleChat } = require('../controllers/chatController');
```
* We import the `handleChat` logic that we documented in `chatController.js`.

```javascript
// @route   POST /api/chat
// @desc    Get AI response from VoteWise Gemini Assistant
router.post('/', handleChat);
```
* **`router.post('/', handleChat);`**: This tells Express: "If someone sends a `POST` request to this router's base URL (`/`), immediately run the `handleChat` function." 
* Note: In `app.js`, we connected this router to `/api/chat`. So the actual full URL this listens to is `POST /api/chat`.

```javascript
module.exports = router;
```
* Exports the traffic cop so it can be wired up to the conveyor belt in `app.js`.
