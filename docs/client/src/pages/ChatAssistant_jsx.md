# Masterclass: `client/src/pages/ChatAssistant.jsx`

## Purpose of this File
This is the most complex and important file in the frontend. It is a complete State Machine. It manages what the user types, sends it over the internet to our Node.js backend (`server.js`), waits for the response, renders complex Markdown text, and even has Text-to-Speech capabilities.

---

## The Code & Line-by-Line Breakdown

### 1. Setup and Imports
```jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, User, Volume2 } from 'lucide-react';
```
* **`useState`, `useRef`, `useEffect`**: Essential React Hooks.
  * `useState` remembers data (like the chat history).
  * `useRef` lets us physically grab elements on the screen (like forcing the chat to scroll to the bottom).
  * `useEffect` lets us run side-effects (like triggering that scroll action every time a new message appears).
* **`axios`**: The tool we use to make the HTTP POST request to our backend server.
* **`ReactMarkdown`**: Gemini AI returns text formatted with Markdown (e.g., `**bold**`). This library converts that raw markdown into beautifully styled HTML paragraphs and lists.

### 2. State Management
```jsx
export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm **VoteWise AI**..." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
```
* We initialize three pieces of State:
  1. **`messages`**: An array that holds the entire conversation history. It starts with one initial greeting from the AI.
  2. **`input`**: Holds whatever the user is currently typing in the textbox.
  3. **`loading`**: A boolean (`true`/`false`). When `true`, it means we are waiting for the AI to reply. We use this to disable the text box and show a typing animation.

### 3. Text-to-Speech Feature
```jsx
  const speak = (text) => {
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };
```
* We use the built-in browser API `window.speechSynthesis`. 
* First, we use a Regular Expression (`/[*_#`]/g`) to strip out Markdown formatting characters so the robot voice doesn't literally say "Asterisk Asterisk Hello Asterisk Asterisk".
* We set the language to Indian English (`en-IN`).

### 4. Auto-Scrolling
```jsx
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);
```
* This `useEffect` watches the `messages` and `loading` variables. If either changes, it instantly smoothly scrolls the user's screen down to `bottomRef` (an invisible `<div>` we placed at the very bottom of the chat list).

### 5. The "Send" Function (The Core Logic)
```jsx
  const send = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;
    
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
```
* When the user hits send:
  1. We ignore empty messages.
  2. We add the user's message to the `messages` array so it appears on screen.
  3. We clear the input box.
  4. We turn on the `loading` state to trigger the bouncing dots animation.

```jsx
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.post(`${apiUrl}/api/chat`, { message: msg });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
```
* We look for the Backend URL (either a live URL or `localhost` for testing).
* We use Axios to `POST` the user's message to our backend endpoint (`/api/chat`).
* When the backend replies, we take `data.reply` and add it to the `messages` array, assigning it the role of `'assistant'`.

```jsx
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Connection error. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };
```
* If the API fails or rate limits us, the `catch` block catches the error and displays it beautifully in the chat interface instead of crashing the app.
* `finally` guarantees that whether the API succeeded or failed, we turn off the loading animation and put the user's typing cursor back in the input box.

### 6. Dynamic Rendering (The UI)
```jsx
  {messages.map((msg, i) => (
    <div key={i} style={{
      display: 'flex',
      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
```
* We loop over the `messages` array using `.map()`.
* **The Magic trick**: If the message is from the user, we set `flexDirection: 'row-reverse'`. This pushes the chat bubble to the right side of the screen. If it's the AI, it stays on the left.

```jsx
  {msg.role === 'user'
    ? <span style={{ color: '#fff', fontWeight: 500 }}>{msg.content}</span>
    : (
      <div style={{ position: 'relative' }}>
        <ReactMarkdown components={mdComponents}>{msg.content}</ReactMarkdown>
        <button onClick={() => speak(msg.content)}>
          <Volume2 size={14} aria-hidden="true" /> Listen
        </button>
      </div>
    )
  }
```
* For user messages, we just render plain text.
* For AI messages, we pass the text through `<ReactMarkdown>`. We also render the "Listen" button directly below the AI's response, which triggers the `speak()` function we defined earlier.
