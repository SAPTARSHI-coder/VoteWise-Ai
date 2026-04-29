# Chapter 2: Deployment & Infrastructure (Outside the Codebase)

In this chapter, we will explain everything that happens *outside* of your local VS Code editor. 

How did this code get onto the internet? Why did we add certain security tools? What are those weird `.env` files?

---

## 1. Where does the code live on the Internet?

When you run `npm run dev` on your laptop, the code only exists on your laptop (localhost). To put it on the internet, we had to deploy it. 

Because we built a MERN stack app (two separate halves), we had to deploy it to two separate places:

### The Frontend (Vercel)
* **What is Vercel?** Vercel is a hosting platform specifically designed to make React apps extremely fast.
* **Why did we use it?** It automatically takes the React code from your GitHub repository, builds it, and serves it globally on a CDN (Content Delivery Network). This means if a user in India opens the site, it loads instantly from a server in India.
* **How was it added?** You connected your GitHub repo to Vercel. We also added a `vercel.json` file to tell Vercel how to handle page routing.

### The Backend (Google Cloud Run / Render)
* **What is it?** This is where your Node.js/Express server runs. 
* **Why did we use it?** Unlike the frontend which is just static HTML/CSS/JS, the backend needs a computer that is always "awake" to do math, handle secrets, and talk to MongoDB. 
* **How was it added?** We wrote a `Dockerfile` (which is like a recipe to build a mini-computer). The hosting platform reads that recipe, sets up the server, and runs your `app.js` file.

---

## 2. Environment Variables (`.env`)

You probably noticed files named `.env` that look like this:
```env
MONGO_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSy...
```

### What are they?
Environment variables are secret passwords that your app needs to function. 

### Why do we use them?
If you put your API keys directly into your code (like `server.js`) and pushed it to GitHub, anyone in the world could see your password and use your Gemini quota. By putting them in a `.env` file, and adding `.env` to `.gitignore`, Git ignores the file entirely. The file stays safely on your laptop.

### How did we deploy them?
Since GitHub doesn't have the `.env` file, when you deployed to Vercel and Cloud Run, the app crashed at first because it couldn't find the passwords! We had to manually go into the settings of Vercel and Cloud Run and type the passwords in there. 

---

## 3. High-Scoring Additions (What we added and why)

To get your score from 79% to 95.99%, we added specific "infrastructure" tools to the backend. Here is what they are and why the automated scorer loved them.

### `helmet.js` (Security)
* **What it is:** A middleware (a piece of code that runs in the middle of a request).
* **Why we used it:** It automatically hides the fact that your server is running Express, and it adds "HTTP Headers" that stop hackers from doing things like Clickjacking (putting your site in an invisible iframe).

### `express-rate-limit` (Security)
* **What it is:** A bouncer at the door of a club.
* **Why we used it:** We use free Google APIs. If someone maliciously spams your app with 10,000 messages a second, Google would ban you or charge you money. We added a global limit (1000 requests per day max) and a personal limit (15 requests per 10 minutes per IP address).

### `compression` (Efficiency)
* **What it is:** A tool that zips up your data before sending it over the internet.
* **Why we used it:** When the server sends the AI's reply to the frontend, `compression` shrinks the text file size by roughly 70%. The frontend receives it instantly and unzips it. This got you the 100% Efficiency score.

### Simple Map Cache (Efficiency)
* **What it is:** A short-term memory bank in the backend.
* **Why we used it:** Every time someone asks Gemini a question, it takes 2-3 seconds and uses your API quota. We added a `new Map()` object. If User A asks "How do I vote?", we ask Gemini and save the answer. If User B asks "How do I vote?", the server sees it in its memory and returns it instantly in 0.01 seconds without ever calling Gemini.

---

In the next chapter, we will dive into the exact lines of code in the **Backend** to see how these concepts are actually written in JavaScript!
