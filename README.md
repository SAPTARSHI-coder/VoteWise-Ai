# VoteWise AI - Smart Election Assistant

VoteWise AI is an intelligent, interactive assistant designed to help users understand the democratic election process. Built with the MERN stack and powered by Google Gemini, it serves as an educational tool for first-time and seasoned voters alike to navigate registration, verify facts, and simulate voting day scenarios.

## 🎯 Chosen Vertical
**Election Process Education**
The project focuses on civic tech, explicitly educating citizens about the election process. It aligns with hackathon expectations to build a smart, dynamic assistant providing context-aware guidance.

## 🧩 Approach and System Logic
VoteWise AI is built on a clean, scalable MERN (MongoDB, Express, React, Node.js) architecture.

1. **AI Chat Assistant (Google Gemini):** The core intelligence is driven by the Google Gemini API (`gemini-2.5-flash`). It is prompted with a strict "election assistant" persona to provide non-partisan, accurate, and concise information. It proactively corrects misinformation (e.g., "Can I vote twice?").
2. **Interactive UI (React):** The frontend uses a premium, glassmorphism-inspired design system. It uses functional components and React Router to separate concerns (Chat, Timeline, Simulator).
3. **Scenario Simulator:** A state-driven "choose your own adventure" React component that dynamically tests a user's knowledge based on their context (e.g., first-time voter vs. lost ID).
4. **Backend API (Express/Node):** A robust REST API handles requests from the client, securely communicates with the Gemini API (protecting secrets via `.env`), and connects to MongoDB via Mongoose.

## 🚀 How the Solution Works
* **Assistant:** Users can type questions in the Assistant tab. The React client sends the request to the Express backend, which formats the prompt and queries Gemini. The response is parsed and displayed in a chat-bubble UI.
* **Timeline Visualizer:** Users can click through a guided timeline (Registration -> Verification -> Voting -> Counting) to visually understand the prerequisites and steps.
* **Simulator:** Users interact with a branched-logic flow. Selecting incorrect options (like walking straight to an EVM) triggers immediate feedback and educational corrections.

## ⚙️ Assumptions Made
* The user has a stable internet connection to communicate with the Gemini API.
* The local environment has Node.js and MongoDB installed.
* Election rules used in the simulator are based on general democratic standards (e.g., age limits, ID verification, electoral rolls).

## 💻 Instructions to Run Locally

### 1. Clone the repository
\`\`\`bash
git clone <your-repository-url>
cd vote-wise-ai
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`
* Create a `.env` file in the `server` directory (or modify the existing one):
\`\`\`env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/votewise
GEMINI_API_KEY=your_actual_gemini_api_key_here
\`\`\`
* Start the backend server:
\`\`\`bash
npm start
\`\`\`
*(Make sure your local MongoDB instance is running).*

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
* Access the application at \`http://localhost:5173\`

## 🛡️ Evaluation Focus Areas Met
* **Code Quality:** Modular React components, clean Express MVC architecture, detailed \`.gitignore\`.
* **Security:** API keys hidden in \`.env\` (not exposed to frontend), robust input validation.
* **Efficiency:** Lightweight UI, optimized state management in the Simulator, and fast Gemini-flash responses.
* **Google Services Integration:** Integrated Google GenAI SDK for the core smart assistant logic.
