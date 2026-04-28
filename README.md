# VoteWise AI — Smart Election Assistant

> **Hackathon Submission** · Powered by Google Gemini AI · Built on the MERN Stack

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://vote-wise-ai-rho.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Google%20Cloud%20Run-blue?style=flat-square&logo=googlecloud)](https://votewise-ai-hqyn.onrender.com)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange?style=flat-square&logo=google)](https://ai.google.dev)

VoteWise AI is a full-stack, production-ready web application that educates citizens about the election process with non-partisan AI-powered assistance. It integrates Google's **Gemini 2.5 Flash** model to deliver real-time, contextually accurate answers about voting, eligibility, and the democratic process.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Non-partisan, real-time election Q&A powered by Gemini AI with strict guardrails |
| 🗳️ **Voting Day Simulator** | Interactive scenario-based decision tree to test knowledge of the polling process |
| 📅 **Election Timeline** | Visual step-by-step guide from voter registration to result declaration |
| 🛡️ **Rate Limiting** | Global daily request cap + per-IP throttling to protect the free API tier |
| 💾 **Chat Persistence** | All conversations are logged to MongoDB Atlas for auditability and analytics |
| 🏠 **Home Navigation** | Dedicated Home link in the navbar with active-state highlighting for all routes |
| 🃏 **Clickable Feature Cards** | Home page feature cards navigate directly to their respective pages on click |

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Vercel)                       │
│         React.js + Vite · React Router DOM              │
│    react-markdown · Lucide Icons · Axios · CSS3         │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS (REST API)
┌─────────────────────▼───────────────────────────────────┐
│               BACKEND (Google Cloud Run)                 │
│          Node.js + Express.js · Dockerized              │
│   express-rate-limit · CORS · Mongoose · dotenv         │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐   ┌──────────▼──────────────────┐
│  MongoDB Atlas      │   │  Google Gemini API           │
│  Chat Persistence   │   │  gemini-2.5-flash model      │
└─────────────────────┘   └─────────────────────────────┘
```

---

## 🧠 Prompting Logic (Gemini AI)

The core intelligence of VoteWise AI is engineered through a carefully designed system prompt. This is not generic AI — it is a purpose-built, constrained election assistant.

**System Instruction sent to `gemini-2.5-flash`:**

```text
You are VoteWise AI, a highly knowledgeable and impartial election assistant expert.
Your primary objective is to educate citizens about the election process, voting
timelines, voter registration, eligibility, and the mechanics of voting.

Guidelines:
1. Always remain strictly non-partisan. Do not express political opinions, endorse
   any candidate, or criticize any political party.
2. Provide factual, concise, and easy-to-understand answers.
3. If the user asks about topics unrelated to elections, democracy, or voting,
   politely decline and guide them back to election-related topics.
4. If a user shares misinformation (e.g., "Can I vote online?" or "Can I vote
   twice?"), respectfully correct them with facts.
5. Emphasize the importance of verifying their name on the electoral roll.
```

**Why this prompt design works:**
- **Role Anchoring** — `"You are VoteWise AI"` locks the model into a consistent persona and tone.
- **Topical Guardrails** — Guideline 3 prevents the model from drifting into general knowledge or political commentary.
- **Misinformation Mitigation** — Guideline 4 instructs the model to actively detect and correct common election myths, reducing hallucination risk.
- **Civic Responsibility** — Guideline 5 ensures the model always reinforces the most critical step voters miss: verifying electoral roll registration.

---

## 🛡️ Security & Rate Limiting

To protect the free API quota and prevent abuse, the backend implements a **two-layer rate limiting strategy**:

```javascript
// Layer 1: Global daily cap — stops the entire app from exceeding free quota
const globalDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1000,                       // 1000 total requests per day (all users combined)
  keyGenerator: () => 'global_limit',
});

// Layer 2: Per-IP throttle — prevents individual spam
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,                    // 15 requests per IP per 10 minutes
});
```

---

## ⚙️ How It Works

1. User interacts with the React frontend (Chat, Timeline, or Simulator).
2. For Chat: frontend sends a `POST /api/chat` request with the user's message.
3. The Express backend passes the message to **Gemini 2.5 Flash** with the system prompt.
4. The AI response is returned, saved to **MongoDB Atlas**, and sent back to the frontend.
5. The frontend renders the response using `react-markdown` (bold, lists, links).

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or local MongoDB
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com)

### 1. Clone the repository
```bash
git clone https://github.com/SAPTARSHI-coder/VoteWise-Ai.git
cd VoteWise-Ai
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```
```bash
npm run dev
```
App runs at `http://localhost:5173`

---

## ☁️ Deployment

### Frontend → Vercel
1. Import repo into Vercel, set root directory to `client`.
2. Add environment variable: `VITE_API_URL=https://your-cloud-run-url.run.app`
3. Deploy. A `vercel.json` is included for React Router SPA routing.

### Backend → Google Cloud Run
A `Dockerfile` is included in the `server/` directory.

```bash
cd server
gcloud run deploy votewise-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000 \
  --set-env-vars GEMINI_API_KEY=your_key,MONGO_URI=your_uri,CLIENT_URL=your_frontend_url
```

---

## 🔑 Google Services Used

| Service | Usage |
|---|---|
| **Google Gemini API** (`gemini-2.5-flash`) | Powers the AI chat assistant with constrained, non-partisan election guidance |
| **Google Cloud Run** | Hosts the containerized Node.js backend at scale, with zero cold-start on free tier |
| **Google Cloud Build** | Automatically builds the Docker container on each git push for continuous deployment |

---

## 📁 Project Structure

```
vote-wise-ai/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ChatAssistant.jsx   # Gemini-powered chat UI
│   │   │   ├── Timeline.jsx        # Interactive election timeline
│   │   │   └── Simulator.jsx       # Voting day decision tree
│   │   ├── App.jsx                 # Router + Navbar
│   │   └── index.css               # Design system (tokens, components)
│   └── vercel.json                 # SPA routing config
└── server/                  # Node.js/Express backend
    ├── controllers/
    │   └── chatController.js       # Handles chat + MongoDB logging
    ├── services/
    │   └── geminiService.js        # Gemini API integration & system prompt
    ├── models/
    │   └── Chat.js                 # MongoDB chat schema
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── server.js                   # App entry + rate limiting
    └── Dockerfile                  # Cloud Run deployment config
```

---

*Built with ❤️ for hackathon submission · Powered by Google Gemini · Ready for production*
