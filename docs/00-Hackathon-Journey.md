# Building VoteWise AI — From Idea to Production (and a Security Scare)

> A full-stack MERN app powered by Google Gemini, deployed on Vercel + Cloud Run, built for a hackathon in days.

---

## The Idea

Elections are confusing. Voter registration deadlines, polling booth procedures, what ID to carry, what "indelible ink" even means — most first-time voters have no idea. I wanted to build something that could answer those questions instantly, without political bias, and without requiring any sign-up or friction.

That became **VoteWise AI** — a smart election assistant powered by Google's Gemini 2.5 Flash model.

---

## The Stack

I went with the MERN stack because I knew it well and it deploys cleanly:

- **Frontend**: React + Vite, hosted on **Vercel**
- **Backend**: Node.js + Express, containerized with Docker, hosted on **Google Cloud Run**
- **Database**: MongoDB Atlas (for chat persistence)
- **AI**: Google Gemini 2.5 Flash via the Gemini API

The architecture is straightforward — the React frontend talks to the Express backend over HTTPS REST, the backend calls Gemini, logs the conversation to MongoDB, and sends the response back. The frontend renders it with `react-markdown` so bold text, lists, and links all come through cleanly.

---

## The Three Features

### 1. AI Chat Assistant
The core of the app. Users type any election-related question and get a fast, accurate, non-partisan answer. The key engineering challenge here was the **system prompt** — without careful prompting, a general LLM will drift into political opinions or just hallucinate voting rules.

The final system prompt does four things:
- **Role anchors** the model as "VoteWise AI" — not a generic chatbot
- **Topical guardrails** reject off-topic questions politely
- **Misinformation correction** — the model is explicitly told to push back on myths like "I can vote twice" or "I can vote online"
- **Civic reinforcement** — every relevant answer reminds users to verify their name on the electoral roll, which is the single most common reason people can't vote

### 2. Election Timeline
An interactive, step-by-step visual guide through the entire electoral process — from voter registration all the way to result declaration. Built as a two-column layout with a sidebar for navigation and a detail panel. Clicking "Completed" on the final step returns you to the home page.

### 3. Voting Day Simulator
A scenario-based decision tree. Users make choices ("Do you have a Voter ID?" → "Yes / No / I lost it") and the simulator walks them through the consequences — what happens if you skip the queue, what IDs are valid alternates, why having a Voter ID isn't the same as being on the electoral roll. It ends with either a success screen or a corrective explanation.

---

## Protecting the Free API Tier

Gemini's free tier has rate limits. Without protection, a single spammer could exhaust the daily quota in minutes and kill the app for everyone. I implemented a **two-layer rate limiting strategy** using `express-rate-limit`:

```javascript
// Layer 1: Global daily cap — 1000 requests across ALL users per 24h
const globalDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1000,
  keyGenerator: () => 'global_limit',
});

// Layer 2: Per-IP throttle — 15 requests per IP per 10 minutes
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
});
```

Layer 1 prevents the app from ever exceeding the free quota globally. Layer 2 stops any single user from abusing it. Both return a clean error message that the frontend surfaces gracefully.

---

## The UI Design

I wanted the app to feel premium, not like a hackathon prototype. The design system is built entirely in vanilla CSS with:

- A dark base palette (`#060811`) with subtle blue/violet radial gradients baked into the `body` background
- Two fonts: **Sora** (headings — tight, modern) and **Inter** (body — clean, readable)
- A brand gradient (`#3b7fff → #8b5cf6`) used consistently across buttons, active states, the logo, and chat bubbles
- Glassmorphism-style navbar with `backdrop-filter: blur(24px)`
- Micro-animations (`fadeUp` on page load, bounce dots on typing indicator, pulse on the live status dot)

The home page feature cards were designed to be clickable — each one routes directly to its respective feature page, making the "what can this do?" section immediately actionable.

---

## Deployment

**Frontend → Vercel**
Pointed Vercel at the `client/` subdirectory, set `VITE_API_URL` to the Cloud Run URL, and included a `vercel.json` to handle React Router's client-side routing (without it, direct URL navigation returns 404s).

**Backend → Google Cloud Run**
The server ships with a `Dockerfile`. Cloud Run builds it automatically via Cloud Build on each push. The container runs on port 5000, environment variables are injected at deploy time, and the service scales to zero when idle — so there's no idle cost on the free tier.

---

## The Security Incident

This is the part I want to be transparent about, because it's a mistake anyone can make.

During Cloud Run setup, I generated an `env.yaml` file containing my live credentials — the Gemini API key and the MongoDB connection string (including the plaintext password). I accidentally committed and pushed it to the public GitHub repository.

**What I did to fix it:**

1. **Immediately removed** the file locally and from git tracking (`git rm --cached`)
2. **Added `env.yaml` and `*.yaml` to `.gitignore`** so it can never happen again
3. **Rewrote the entire git history** using `git filter-branch` to scrub the file from every single past commit (25 commits rewritten)
4. **Force-pushed** the clean history to GitHub
5. **Rotated both credentials** — deleted the old Gemini API key and generated a new one, changed the MongoDB Atlas user password
6. **Updated the live deployments** on Cloud Run and Render with the new credentials
7. **GitGuardian** (which auto-scans public GitHub repos for secrets) detected it and I marked it resolved after rotating

**The lesson:** Even if you think "nobody saw it," automated secret-scanning bots crawl GitHub in near real-time. The only correct response is to treat any exposed credential as compromised and rotate it immediately — regardless of how long it was visible. Rotation takes 3 minutes and fully closes the risk.

---

## What I Learned

- **System prompt engineering matters more than model choice.** A well-constrained prompt on a fast model (Flash) beats an unconstrained prompt on a slow one.
- **Rate limiting is not optional** for apps backed by free API tiers. Build it in from day one.
- **Never commit secrets, even temporarily.** Use `.env` files and add them to `.gitignore` before your first commit — not after.
- **`git filter-branch` is powerful but needs a clean working tree.** Commit or stash everything before running it.
- **Design tokens pay off immediately.** Building a CSS variable system upfront made every component consistent without extra effort.

---

## Links

- 🌐 **Live App**: [vote-wise-ai-rho.vercel.app](https://vote-wise-ai-rho.vercel.app)
- 💻 **GitHub**: [github.com/SAPTARSHI-coder/VoteWise-Ai](https://github.com/SAPTARSHI-coder/VoteWise-Ai)
- 🤖 **Powered by**: Google Gemini 2.5 Flash

---

*Built with ❤️ for a hackathon submission. If this helped you think about civic tech, AI guardrails, or just API security — share it.*
