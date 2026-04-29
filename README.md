# VoteWise AI — Smart Election Assistant

> **Hackathon Submission** · Powered by Google Gemini AI · Built on the MERN Stack

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://vote-wise-ai-rho.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Google%20Cloud%20Run-blue?style=flat-square&logo=googlecloud)](https://votewise-ai-hqyn.onrender.com)
[![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange?style=flat-square&logo=google)](https://ai.google.dev)
[![Tests](https://img.shields.io/badge/Tests-20%20passing-brightgreen?style=flat-square&logo=jest)](./server/tests)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-blue?style=flat-square)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> 📖 **Read the Developer Journey:** Check out [From Idea to Production (and a Security Scare)](./docs/00-Hackathon-Journey.md) for a behind-the-scenes look at how this was built.

VoteWise AI is a full-stack, production-ready web application that educates citizens about the election process with non-partisan AI-powered assistance. It integrates Google's **Gemini 2.5 Flash** model to deliver real-time, contextually accurate answers about voting, eligibility, and the democratic process — now with **multilingual support** via Google Cloud Translation API.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Non-partisan, real-time election Q&A powered by Gemini AI with strict guardrails |
| 🌐 **Multilingual Support** | Auto-detects user language (10 Indian languages) and translates responses via Google Cloud Translation API |
| 🗳️ **Voting Day Simulator** | Interactive scenario-based decision tree to test knowledge of the polling process |
| 📅 **Election Timeline** | Visual step-by-step guide from voter registration to result declaration |
| 🛡️ **Rate Limiting** | Global daily request cap + per-IP throttling to protect the free API tier |
| 🔐 **HTTP Security Headers** | Helmet.js middleware adds CSP, HSTS, X-Frame-Options, and more |
| ♿ **Accessibility (WCAG 2.1 AA)** | Skip links, ARIA live regions, aria-current, keyboard focus rings, screen reader support |
| 💾 **Chat Persistence** | All conversations are logged to MongoDB Atlas for auditability |
| ✅ **20 Automated Tests** | Jest + Supertest integration and unit tests covering all core services |

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                  FRONTEND (Vercel)                       │
│         React.js + Vite · React Router DOM              │
│    react-markdown · Lucide Icons · Axios · CSS3         │
│         WCAG 2.1 AA ARIA · Google Fonts API             │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS (REST API)
┌─────────────────────▼───────────────────────────────────┐
│               BACKEND (Google Cloud Run)                 │
│          Node.js + Express.js · Dockerized              │
│   Helmet · express-rate-limit · CORS · Mongoose         │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
┌──────────▼──────────┐   ┌──────────▼──────────────────┐
│  MongoDB Atlas      │   │  Google AI Services          │
│  Chat Persistence   │   │  · Gemini 2.5 Flash (chat)   │
└─────────────────────┘   │  · Cloud Translation API     │
                          │    (multilingual support)    │
                          └─────────────────────────────┘
```

---

## 🌐 Google Services Integrated

| Service | Usage |
|---|---|
| **Google Gemini API** (`gemini-2.5-flash`) | Powers the AI chat assistant with constrained, non-partisan election guidance |
| **Google Cloud Translation API** | Detects user message language; auto-translates AI responses into Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi |
| **Google Cloud Run** | Hosts the containerized Node.js backend at scale, zero cold-start on free tier |
| **Google Cloud Build** | Automatically builds the Docker container on each git push for CI/CD |
| **Google Fonts API** | Sora + Inter typefaces loaded via Google Fonts CDN for premium typography |

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

---

## ♿ Accessibility (WCAG 2.1 AA)

Full keyboard and screen reader support implemented across the app:

- **Skip Link** — First focusable element jumps keyboard users past the navbar to `#main-content`
- **ARIA Landmarks** — `role="navigation"`, `role="main"`, `role="log"` on chat messages
- **Live Regions** — `aria-live="polite"` on chat messages and timeline step changes; `role="status"` on typing indicator
- **`aria-current="page"`** — Active nav link announces current page to screen readers
- **`aria-label`** — Every button, input, and interactive element has a descriptive label
- **`aria-hidden="true"`** — All decorative icons and avatars are hidden from the accessibility tree
- **Focus Rings** — `*:focus-visible` outline using brand blue for keyboard-only users
- **Progressbar ARIA** — Simulator progress tracked with `role="progressbar"`, `aria-valuenow`, `aria-valuemax`

---

## ✅ Testing

**20 automated tests passing** across 4 test suites using **Jest** + **Supertest**:

```bash
cd server
npm test
```

| Test Suite | Tests | Coverage |
|---|---|---|
| `health.test.js` | GET /api/health — status, content-type | ✅ 2 passing |
| `chatController.test.js` | Valid message, missing, too-long, empty, lang detection, 500 error | ✅ 6 passing |
| `geminiService.test.js` | API key checks, model name, response text, error propagation | ✅ 5 passing |
| `translationService.test.js` | Language detection, translation, full pipeline | ✅ 7 passing |

---

## 🛡️ Security

| Layer | Implementation |
|---|---|
| **HTTP Headers** | `helmet.js` — CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| **Rate Limiting Layer 1** | Global 1000 req/day cap across all users (protects free API quota) |
| **Rate Limiting Layer 2** | 15 req/10min per IP (prevents individual abuse) |
| **Input Validation** | Message required + 1000 character max length guard |
| **Secrets Management** | `.env` gitignored; credentials never committed; history-scrubbed after incident |
| **Trust Proxy** | Configured for correct IP resolution behind Cloud Run/Render reverse proxy |

---

## ⚙️ How It Works

1. User interacts with the React frontend (Chat, Timeline, or Simulator).
2. For Chat: frontend sends `POST /api/chat` with the user's message.
3. Backend validates input, checks rate limits, then calls **Gemini 2.5 Flash** with the system prompt.
4. The AI response is passed to **Google Cloud Translation API** — language is auto-detected and the response is translated if the user wrote in a non-English Indian language.
5. The translated response is saved to **MongoDB Atlas** and returned to the frontend.
6. The frontend renders the response using `react-markdown` (bold, lists, links).

---

## 🚀 Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or local MongoDB
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com)
- Google Cloud Translation API Key from [Google Cloud Console](https://console.cloud.google.com)

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
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
```
```bash
npm run dev
```

### 3. Run Tests
```bash
cd server
npm test
```

### 4. Frontend Setup
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
  --set-env-vars GEMINI_API_KEY=your_key,MONGO_URI=your_uri,CLIENT_URL=your_frontend_url,GOOGLE_TRANSLATE_API_KEY=your_translate_key
```

---

## 📚 Masterclass Documentation

We've written comprehensive, file-by-file "Masterclass" documentation designed to explain **exactly** how this app was built from the ground up. If you are learning React, Node.js, or want to see how we structured the code, check out the `docs/` folder!

- [Backend Deep Dives (`docs/server/`)](./docs/server/)
- [Frontend Deep Dives (`docs/client/`)](./docs/client/)
- [Google APIs Explained](./docs/05-Google-APIs-Explained.md)

---

## 📁 Project Structure

```
vote-wise-ai/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ChatAssistant.jsx   # Gemini-powered chat UI (WCAG 2.1 AA)
│   │   │   ├── Timeline.jsx        # Interactive election timeline
│   │   │   └── Simulator.jsx       # Voting day decision tree
│   │   ├── App.jsx                 # Router + Navbar (ARIA landmarks)
│   │   └── index.css               # Design system (tokens, a11y, components)
│   └── vercel.json                 # SPA routing config
└── server/                  # Node.js/Express backend
    ├── app.js                      # Express app factory (testable)
    ├── server.js                   # Entry point (listen only)
    ├── controllers/
    │   └── chatController.js       # Chat handler + translation pipeline
    ├── services/
    │   ├── geminiService.js        # Gemini API integration & system prompt
    │   └── translationService.js   # Google Cloud Translation API
    ├── models/
    │   └── Chat.js                 # MongoDB chat schema
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── tests/
    │   ├── health.test.js          # Health endpoint tests
    │   ├── chatController.test.js  # Chat API integration tests
    │   ├── geminiService.test.js   # Gemini service unit tests
    │   └── translationService.test.js # Translation service unit tests
    └── Dockerfile                  # Cloud Run deployment config
```

---

## 🔒 Assumptions

- Multilingual translation is best-effort — if Translation API fails, the app gracefully falls back to the English response and never breaks the chat flow.
- The app is designed for Indian elections (ECI process), but the civic education framework is applicable globally.
- Free-tier API limits are protected by two-layer rate limiting; the app is designed to scale within zero-cost constraints.

---

*Built with ❤️ by **Saptarshi Sadhu** for hackathon submission · Powered by Google Gemini + Google Cloud Translation · WCAG 2.1 AA Accessible · 20 Tests Passing*
