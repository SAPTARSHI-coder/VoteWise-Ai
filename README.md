# VoteWise AI — Smart Election Assistant

VoteWise AI is a modern, interactive web application built to educate citizens about the election process, voting timelines, and eligibility. It integrates Google's powerful Gemini AI to provide context-aware, non-partisan assistance.

This project is built as a complete full-stack solution (MERN + AI) to serve as a hackathon submission.

---

## 🌟 Features

- **AI Election Assistant**: A smart chatbot powered by Google Gemini AI that answers queries about voting, eligibility, and the democratic process while maintaining strict non-partisanship.
- **Voting Day Simulator**: An interactive, scenario-based simulator that tests users' knowledge of the polling booth process.
- **Election Timeline**: A visual step-by-step guide explaining the timeline from registration to result declaration.
- **Modern UI**: A responsive, glassmorphic design utilizing React, Lucide icons, and modern CSS practices.

---

## 🏗️ Architecture & Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- CSS3 (Custom Glassmorphism)
- Axios (API Communication)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database for future scale/history)
- `@google/genai` (Google Gemini SDK Integration)
- CORS & Dotenv

---

## 🧠 Prompting Logic (Gemini AI)

To ensure VoteWise AI provides accurate, non-partisan, and contextually relevant election information, we use a strictly engineered system prompt for the `gemini-2.5-flash` model.

**The System Instruction (Prompt):**
\`\`\`text
You are VoteWise AI, a highly knowledgeable and impartial election assistant expert.
Your primary objective is to educate citizens about the election process, voting timelines, voter registration, eligibility, and the mechanics of voting.
Guidelines:
1. Always remain strictly non-partisan. Do not express political opinions, endorse any candidate, or criticize any political party.
2. Provide factual, concise, and easy-to-understand answers.
3. If the user asks about topics unrelated to elections, democracy, or voting, politely decline and guide them back to election-related topics.
4. If a user shares misinformation (e.g., "Can I vote online?" or "Can I vote twice?"), respectfully correct them with facts.
5. Emphasize the importance of verifying their name on the electoral roll.
\`\`\`
**Why this logic works:**
- It uses **role-playing** ("You are VoteWise AI") to set a consistent tone.
- It includes **guardrails** (Guidelines 1 & 3) to prevent the AI from generating political opinions or going off-topic.
- It implements **hallucination mitigation & fact-checking** (Guideline 4) to automatically counter common election myths.

---

## ⚙️ How it Works

1. The user interacts with the React frontend (Assistant, Timeline, or Simulator).
2. For the Chat Assistant, the frontend sends a `POST` request to the Express.js backend.
3. The backend validates the request and forwards the prompt to the **Google Gemini API** using specific system instructions to ensure non-partisan, accurate information.
4. The Gemini response is returned to the backend, which forwards it to the frontend to be displayed cleanly in the chat UI.
5. Other features (Simulator, Timeline) are seamlessly handled by React state management on the client side.

---

## 🚀 Setup Instructions

To run this project locally, follow these steps:

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or a MongoDB Atlas URI)
- A Google Gemini API Key

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/vote-wise-ai.git
cd vote-wise-ai
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`
- Create a \`.env\` file in the `server` directory (you can copy `.env.example`):
\`\`\`env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/votewise
GEMINI_API_KEY=your_actual_gemini_api_key_here
CLIENT_URL=http://localhost:5173
\`\`\`
- Start the server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
\`\`\`
- Create a \`.env\` file in the `client` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000
\`\`\`
- Start the frontend:
\`\`\`bash
npm run dev
\`\`\`

The app will be running at \`http://localhost:5173\`.

---

## ☁️ Deployment Instructions

The project is structured to be easily deployed to modern cloud providers.

### Frontend Deployment (Vercel/Netlify)
1. Import the repository into Vercel or Netlify.
2. Set the root directory to `client`.
3. Set the Environment Variable: `VITE_API_URL=https://your-backend-url.com`
4. Deploy! (A `vercel.json` is included to handle React Router rewrites).

### Backend Deployment (Google Cloud Run / Render)
1. **Cloud Run:** A `Dockerfile` is included in the `server` folder. You can deploy it using the \`gcloud\` CLI:
   \`\`\`bash
   cd server
   gcloud run deploy votewise-api --source . --port 5000 --set-env-vars GEMINI_API_KEY=your_key,MONGO_URI=your_uri,CLIENT_URL=your_frontend_url
   \`\`\`
2. **Render/Heroku:** Connect your repository, set the root directory to `server`, build command to `npm install`, and start command to `npm start`. Ensure you add your Environment Variables in the provider's dashboard.

---

## 🛡️ Google Services Used
This project proudly utilizes the **Google Gemini API** (`@google/genai` SDK) to provide advanced, natural language processing capabilities for the Smart Election Assistant. The model (`gemini-2.5-flash`) was chosen for its fast response times and high accuracy, which is essential for a chat interface.

---

*Built for Hackathon Submission - Ready for Production!*
