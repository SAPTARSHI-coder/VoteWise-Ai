# Masterclass: `server/server.js`

## Purpose of this File
This file is the "Ignition Switch" for the backend. Its entire purpose is to take the pre-configured Express application (from `app.js`), connect it to the MongoDB database, and turn the server "on" so it listens for incoming requests on a specific port.

---

## The Code & Line-by-Line Breakdown

```javascript
const app = require('./app');
const mongoose = require('mongoose');
```
* **`const app = require('./app');`**
  * `const`: Declares a variable that cannot be reassigned.
  * `app`: The name we give to the imported object.
  * `require()`: This is Node.js's way of importing files.
  * `'./app'`: We are telling Node to go to the exact same folder (`./`) and find the file named `app.js`. By requiring it, we import the fully configured Express application.
* **`const mongoose = require('mongoose');`**
  * `mongoose`: An external library (downloaded via npm) that makes it easy for Node.js to talk to a MongoDB database. Instead of writing complex database queries, Mongoose lets us interact with the database using simple JavaScript objects.

```javascript
const PORT = process.env.PORT || 5000;
```
* **`const PORT = ...`**: We are defining which "door" or "channel" our server will listen to on the computer. Think of an IP address as a street address, and a PORT as an apartment number.
* **`process.env.PORT`**: When we deploy this to Google Cloud Run or Render, the hosting provider assigns a random port number automatically. It passes this number into our application via an environment variable. We check this first.
* **`|| 5000`**: The `||` is the logical OR operator. It means: "Use `process.env.PORT` if it exists. If it doesn't exist (like when running locally on your laptop), default to port 5000."

```javascript
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
```
* **`mongoose.connect(...)`**: This is the command that reaches out across the internet to the MongoDB Atlas cluster to establish a persistent connection.
* **`process.env.MONGO_URI`**: The secret connection string URL hidden in our `.env` file. We NEVER hardcode this, otherwise hackers could delete our database.
* **`{ useNewUrlParser: true, useUnifiedTopology: true }`**: These are configuration flags. MongoDB updated how their connection engine works a few years ago. Passing these flags tells Mongoose to use the modern, stable connection engine instead of the old, deprecated one.
* **`.then(() => console.log('MongoDB Connected'))`**: `mongoose.connect` is an asynchronous action (it takes time to travel over the internet). It returns a "Promise". The `.then()` block executes *only if* the connection is 100% successful. If it works, it prints a success message to the terminal.
* **`.catch(err => console.log(err))`**: If the connection fails (wrong password, no internet), the Promise is "rejected". The `.catch()` block catches that error and prints it so the server doesn't crash silently.

```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
* **`app.listen(PORT, ...)`**: This is the exact moment the server turns "ON". We tell our imported Express app to start listening for HTTP traffic on the apartment number (`PORT`) we defined earlier.
* **`() => { ... }`**: This is a callback function. Once the server successfully starts listening, it triggers this function.
* **`console.log(\`Server running on port ${PORT}\`)`**: Prints a message to the terminal so the developer knows the server is alive and exactly which port to test on. The backticks `` ` `` allow us to inject the `PORT` variable directly into the string using `${PORT}`.
