# Chapter 4: Frontend Code Explained (React)

The frontend is built with **React**. React is a library that lets you build user interfaces out of "Lego blocks" called **Components**.

Instead of writing one massive HTML file, we write small pieces of code (like a Navbar, a Button, a Chat window) and stack them together.

---

## 1. The Entry Point (`client/src/App.jsx`)

When a user visits your website, this is the very first file that runs. It decides what to show on the screen based on the URL (this is called "Routing").

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

// 1. WHAT IS REACT.LAZY?
// Usually, React downloads the entire website at once. This makes the initial load slow.
// React.lazy() tells the browser: "Don't download the Chat page until the user actually clicks on it!"
// This was a huge reason you got 100% on efficiency.
const Home = lazy(() => import('./pages/Home'));
const ChatAssistant = lazy(() => import('./pages/ChatAssistant'));

function App() {
  return (
    // BrowserRouter is the engine that lets us have different URLs (like /chat or /simulator)
    <BrowserRouter>
      {/* The Navbar is outside the Routes because we want it to show on EVERY page */}
      <Navbar />

      {/* Suspense is the "Loading Screen" while React.lazy is downloading a page */}
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        
        {/* Routes is the traffic cop for the URLs */}
        <Routes>
          {/* If the URL is exactly "/", show the Home component */}
          <Route path="/" element={<Home />} />
          
          {/* If the URL is "/chat", show the ChatAssistant component */}
          <Route path="/chat" element={<ChatAssistant />} />
        </Routes>
        
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

---

## 2. The Memory and Timing (`useState` and `useEffect`)

If you look inside `ChatAssistant.jsx`, you will see two very weird looking things at the top: `useState` and `useEffect`. These are called **React Hooks**.

### What is `useState`? (The Memory)
```jsx
const [message, setMessage] = useState('');
```
React components have no memory. If the user types "Hello", React immediately forgets it. 
`useState` is a box where we store data. 
* `message` is the current value in the box (e.g., "Hello").
* `setMessage` is the remote control to change what is in the box. 

Every time we use `setMessage` to change the box, React says: *"Oh! The data changed! I need to redraw the screen immediately!"* This is how what you type actually appears in the input box.

### What is `useEffect`? (The Timing)
```jsx
useEffect(() => {
  // Code here runs automatically when the component first appears on the screen
  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```
Sometimes you want code to run automatically at a specific time (like right when the page loads, or right after the `messages` list changes). 

Here, we tell `useEffect`: *"Every time the `messages` list changes (because the AI replied), run this code to scroll the screen down to the bottom."*

---

## 3. Talking to the Backend (The `fetch` API)

When the user clicks "Send", we need to send their message to the Node.js backend we looked at in Chapter 3.

```jsx
const handleSend = async () => {
  // 1. Save the user's message into our React 'useState' memory so it shows on screen
  setMessages([...messages, { text: userInput, sender: 'user' }]);

  try {
    // 2. The Fetch API is how the Frontend talks to the internet
    const response = await fetch('https://your-backend-url.com/api/chat', {
      method: 'POST', // POST means "I am sending you data"
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }) // We turn our text into JSON
    });

    // 3. Wait for the backend to reply, then turn the reply back into Javascript
    const data = await response.json();

    // 4. Update the React memory again, which makes the AI's chat bubble appear!
    setMessages([...messages, { text: userInput, sender: 'user' }, { text: data.reply, sender: 'ai' }]);
  } catch (error) {
    console.error("The backend failed to reply.");
  }
}
```

---

## 4. The Accessibility Win (Browser TTS)
In `ChatAssistant.jsx`, we added this simple function to read the text out loud:

```jsx
const speakText = (text) => {
  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
};
```
Why is this cool? We didn't need to pay for a Google Text-to-Speech API. Modern web browsers (Chrome, Edge, Safari) have a robot voice built directly into them (`window.speechSynthesis`). We just passed the AI's text to the browser and told it to speak. This is what got you that **98.75% Accessibility Score**!

In the final chapter, we will explain the **Google APIs** (Gemini and Translation).
