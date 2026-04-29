# Masterclass: `server/server.js`

## Purpose of this File
This file is the "ignition switch" for the entire backend application. Its only job is to connect to the database, load the configuration, and start listening for incoming internet traffic.

---

## The Code & Line-by-Line Breakdown

```javascript
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
```
* **`require('dotenv').config();`**
  * This is the very first line of code that runs. It looks for the `.env` file in our `server` folder, reads all the secret keys (like `MONGO_URI` and `GEMINI_API_KEY`), and loads them into memory so the rest of the application can access them safely.
* **`const app = require('./app');`**
  * We import the Express application setup from `app.js`. By keeping `server.js` separate from `app.js`, our codebase stays clean and makes it easier to write automated tests later.
* **`const connectDB = require('./config/db');`**
  * We import the function that knows how to connect to our MongoDB database.

```javascript
// Connect to MongoDB
connectDB();
```
* **`connectDB();`**
  * We execute the function we just imported. This establishes the network connection to our cloud database (MongoDB Atlas).

```javascript
const PORT = process.env.PORT || 5000;
```
* **`const PORT = process.env.PORT || 5000;`**
  * We figure out which "port" (channel) our server should listen to. When we deploy to the cloud (like Render or Vercel), they will automatically provide a port in `process.env.PORT`. If we are running it locally on our own laptop, it defaults to `5000`.

```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
* **`app.listen(...)`**
  * The final step. We tell our Express application to turn on and start listening for incoming requests on the port we defined above.
* **`console.log(...)`**
  * Prints a message to our server terminal so we know it successfully turned on.
