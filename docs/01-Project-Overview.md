# Chapter 1: Project Overview & How Everything Connects

Welcome to your code! If you feel like you don't understand a single word of what was built, **don't panic**. This is extremely common when moving fast in a hackathon. By the end of this folder, you will understand exactly how your app works.

This chapter is a high-level overview. We won't look at complex code yet; we are just going to look at the "blocks" that make up your project and how they talk to each other.

---

## What did we build?
We built **VoteWise AI**. It is a web application that helps citizens learn about voting. 
The app is split into two completely separate halves:
1. **The Frontend (`client/` folder):** This is the visual part the user sees on their screen (buttons, chat bubbles, colors). We built this with **React**.
2. **The Backend (`server/` folder):** This is the invisible brain running on a remote computer. It handles the heavy lifting, talks to the AI, and saves things to a database. We built this with **Node.js** and **Express**.

This two-part structure is called the **Client-Server Architecture**. Because we used MongoDB, Express, React, and Node.js, this is known as a **MERN Stack** application.

---

## The Master Folder Structure
Here is a map of your entire project folder. Think of it like the blueprint of a house.

```text
VoteWise-Ai/
│
├── client/                 <-- The Frontend (React)
│   ├── src/                <-- Where all the UI code lives
│   │   ├── components/     <-- Reusable UI pieces (like the Navbar)
│   │   ├── pages/          <-- The main screens (Home, Chat, Timeline, Simulator)
│   │   ├── App.jsx         <-- The main entry point that decides which page to show
│   │   └── index.css       <-- The styling/colors for the whole app
│   └── package.json        <-- List of frontend dependencies (like React)
│
├── server/                 <-- The Backend (Node.js/Express)
│   ├── config/             <-- Setup files (like connecting to the database)
│   ├── controllers/        <-- The "Traffic Cops". They take a request and decide what to do
│   ├── models/             <-- The "Blueprints" for how data looks in the database
│   ├── routes/             <-- The URL paths (e.g., /api/chat goes here)
│   ├── services/           <-- The heavy lifters (talking to Gemini AI, Translation)
│   ├── tests/              <-- Automated scripts to check if our code is broken
│   ├── app.js              <-- The core setup of the backend application
│   ├── server.js           <-- The file that actually "turns on" the server
│   └── package.json        <-- List of backend dependencies (like Express, Helmet)
│
└── docs/                   <-- You are here! The documentation folder.
```

---

## How Does a Chat Actually Work? (The Data Flow)
Let's walk through exactly what happens when a user types "How do I vote?" and presses Send.

### Step 1: The User acts on the Frontend (`client/`)
The user is on the `ChatAssistant.jsx` page. They type a message and hit "Send". 
React takes that text and makes an **HTTP POST Request** over the internet to your Backend. It basically shouts: *"Hey Backend! The user said 'How do I vote?'. Give me a reply!"*

### Step 2: The Backend receives the request (`server/`)
The request arrives at `server/server.js`, which passes it to `app.js`. 
1. **Security Guards:** The request goes through `helmet` (which checks security rules) and `rateLimit` (which checks if the user is spamming).
2. **Routing:** It goes to `routes/chatRoutes.js`, which sees it's for `/api/chat` and sends it to the Controller.

### Step 3: The Controller directs traffic (`controllers/chatController.js`)
The `chatController.js` is the manager. It says:
1. *"Hold on, let me check the **Cache** (Memory). Has someone asked this exact question recently? If yes, give them the saved answer instantly."*
2. If it's a new question, it calls the **Gemini Service**.

### Step 4: The Services do the heavy lifting (`services/`)
1. **Gemini Service:** Takes the user's question, attaches our secret "System Prompt" (which tells the AI to be non-partisan), and sends it to Google's servers. Google replies with the answer.
2. **Translation Service:** Takes Google's answer and checks if the user originally typed in a different language (like Hindi). If they did, it translates the English answer into Hindi.

### Step 5: Saving to the Database (`models/Chat.js`)
Before replying, the Controller says *"Hey MongoDB, save this conversation so we have a record of it."* It uses the blueprint in `models/Chat.js` to save the message and the AI's reply.

### Step 6: The Journey Back
The Backend takes the final answer, squishes it down to make it fast (using `compression`), and sends it back across the internet to the Frontend.

### Step 7: Displaying the result (`client/`)
React receives the answer. It updates the state (`useState`), which forces the screen to redraw, and the user suddenly sees a new chat bubble appear with the AI's response!

---

## Summary
* **React (`client/`)** is the beautiful face of the app. It only cares about *displaying* things and asking the backend for data.
* **Express (`server/`)** is the hidden brain. It does all the math, talks to external APIs (like Gemini), connects to the database, and enforces security.

In the next chapter, we will explain **Deployment and Infrastructure** (Vercel, Cloud Run, and Environment Variables).
