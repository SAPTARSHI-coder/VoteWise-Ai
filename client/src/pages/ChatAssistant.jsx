import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, ArrowDown } from 'lucide-react';

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SUGGESTED_QUESTIONS = [
  "Am I eligible to vote?",
  "How do I register as a first-time voter?",
  "What ID do I need to bring on election day?",
  "How does the EVM machine work?",
];

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m VoteWise AI, your non-partisan election assistant. Ask me anything about voting, registration, eligibility, or the election process.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    const userMessage = text.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/chat`, { message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      const errMsg = error.response?.data?.error || 'I\'m having trouble connecting right now. Please try again in a moment.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="chat-layout animate-fade-in">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-avatar"><BotIcon /></div>
        <div className="chat-header-info">
          <h3>VoteWise AI</h3>
          <p>Online — Non-partisan election assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg-row ${msg.role === 'user' ? 'user' : ''}`}>
            <div className={`msg-icon ${msg.role === 'user' ? 'user-icon' : 'ai'}`}>
              {msg.role === 'user' ? <User size={14} color="var(--text-secondary)" /> : <BotIcon />}
            </div>
            <div className={`msg-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="msg-row">
            <div className="msg-icon ai"><BotIcon /></div>
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {showSuggestions && !isLoading && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                style={{
                  padding: '0.5rem 0.9rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '99px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  fontFamily: 'inherit',
                }}
                onMouseOver={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-bright)'; }}
                onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          className="input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about voting, registration, eligibility…"
          disabled={isLoading}
          autoFocus
        />
        <button type="submit" className="chat-send-btn" disabled={isLoading || !input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatAssistant;
