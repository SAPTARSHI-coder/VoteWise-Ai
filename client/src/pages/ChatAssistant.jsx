import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, User, Volume2 } from 'lucide-react';

const BotIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SUGGESTED = [
  "Am I eligible to vote?",
  "How do I register as a first-time voter?",
  "What ID do I need on election day?",
  "How does the EVM machine work?",
];

const mdComponents = {
  p: ({ children }) => <p style={{ margin: '0 0 0.6em 0', lineHeight: 1.7 }}>{children}</p>,
  ul: ({ children }) => <ul style={{ paddingLeft: '1.3em', margin: '0.3em 0 0.6em' }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: '1.3em', margin: '0.3em 0 0.6em' }}>{children}</ol>,
  li: ({ children }) => <li style={{ margin: '0.25em 0', lineHeight: 1.65 }}>{children}</li>,
  strong: ({ children }) => <strong style={{ color: '#eef2ff', fontWeight: 600 }}>{children}</strong>,
  em: ({ children }) => <em style={{ color: '#94a3b8' }}>{children}</em>,
  h3: ({ children }) => <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.8em 0 0.3em', color: '#eef2ff' }}>{children}</h3>,
  code: ({ children }) => <code style={{ background: 'rgba(0,0,0,0.35)', padding: '0.1em 0.4em', borderRadius: '4px', fontSize: '0.85em', fontFamily: 'monospace' }}>{children}</code>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#3b7fff', textDecoration: 'underline' }}>{children}</a>,
};

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm **VoteWise AI**, your non-partisan election assistant.\n\nAsk me anything about voter registration, eligibility, election processes, or voting rights." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const speak = (text) => {
    // Strip markdown formatting before speaking
    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.post(`${apiUrl}/api/chat`, { message: msg });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Connection error. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errMsg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onSubmit = (e) => { e.preventDefault(); send(input); };
  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', background: '#060811' }}>

      {/* Chat Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(12px)', flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg,#3b7fff,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }} aria-hidden="true">
          <BotIcon />
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#eef2ff' }}>VoteWise AI</div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} aria-hidden="true" />
            Online — Non-partisan election assistant
          </div>
        </div>
      </div>

      {/* Messages — role="log" + aria-live so screen readers announce new messages */}
      <div
        id="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
        aria-busy={loading}
        style={{
          flex: 1, overflowY: 'auto', padding: '2rem 1rem',
          display: 'flex', flexDirection: 'column', gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start', gap: '0.75rem',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0, marginTop: 2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'user' ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#3b7fff,#8b5cf6)',
                border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.12)' : 'none',
              }} aria-hidden="true">
                {msg.role === 'user' ? <User size={15} color="#7f8ea3" /> : <BotIcon />}
              </div>

              <div
                style={{
                  maxWidth: '78%', padding: '0.9rem 1.15rem',
                  borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  fontSize: '0.92rem', lineHeight: 1.65,
                  color: msg.role === 'user' ? '#eef2ff' : '#c9d5e8',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #1e40af 0%, #4c1d95 100%)' : 'rgba(22, 27, 39, 0.95)',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: msg.role === 'user' ? '0 4px 20px rgba(59,127,255,0.2)' : '0 2px 12px rgba(0,0,0,0.3)',
                }}
                aria-label={msg.role === 'user' ? 'You said' : 'VoteWise AI said'}
              >
                {msg.role === 'user'
                  ? <span style={{ color: '#fff', fontWeight: 500 }}>{msg.content}</span>
                  : (
                    <div style={{ position: 'relative' }}>
                      <ReactMarkdown components={mdComponents}>{msg.content}</ReactMarkdown>
                      <button 
                        onClick={() => speak(msg.content)}
                        aria-label="Read message aloud"
                        style={{
                          background: 'none', border: 'none', color: '#7f8ea3', 
                          cursor: 'pointer', marginTop: '8px', display: 'flex', 
                          alignItems: 'center', gap: '5px', fontSize: '0.8rem',
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#eef2ff'}
                        onMouseOut={e => e.currentTarget.style.color = '#7f8ea3'}
                      >
                        <Volume2 size={14} aria-hidden="true" /> Listen
                      </button>
                    </div>
                  )
                }
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }} role="status" aria-label="VoteWise AI is typing">
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg,#3b7fff,#8b5cf6)',
              }} aria-hidden="true">
                <BotIcon />
              </div>
              <div style={{
                padding: '0.9rem 1.2rem', background: 'rgba(22,27,39,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '4px 16px 16px 16px',
                display: 'flex', gap: '5px', alignItems: 'center',
              }} aria-hidden="true">
                {[0, 0.18, 0.36].map((delay, i) => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#3d4d63',
                    animation: `bounce-dot 1.4s ${delay}s infinite ease-in-out`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Suggested Questions */}
          {showSuggestions && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingLeft: '2.75rem' }} role="group" aria-label="Suggested questions">
              {SUGGESTED.map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  aria-label={`Ask: ${q}`}
                  style={{
                    padding: '0.45rem 0.9rem', background: 'rgba(22,27,39,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px',
                    color: '#7f8ea3', fontSize: '0.82rem', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.18s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.color = '#eef2ff'; e.currentTarget.style.borderColor = 'rgba(59,127,255,0.4)'; }}
                  onMouseOut={e => { e.currentTarget.style.color = '#7f8ea3'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(13,17,23,0.95)', flexShrink: 0 }}>
        <form onSubmit={onSubmit} aria-label="Chat input form" style={{
          maxWidth: 760, margin: '0 auto', display: 'flex', gap: '0.6rem', alignItems: 'center',
          background: 'rgba(22,27,39,0.9)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '0.5rem 0.5rem 0.5rem 1.1rem', transition: 'border-color 0.2s',
        }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(59,127,255,0.5)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
        >
          <input
            ref={inputRef}
            id="chat-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about voting, registration, eligibility…"
            disabled={loading}
            autoFocus
            aria-label="Type your election question"
            aria-controls="chat-messages"
            aria-disabled={loading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#eef2ff', fontSize: '0.92rem', fontFamily: 'inherit', padding: '0.4rem 0',
            }}
          />
          <button type="submit" disabled={loading || !input.trim()}
            aria-label="Send message"
            aria-disabled={loading || !input.trim()}
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: input.trim() && !loading ? 'linear-gradient(135deg,#3b7fff,#8b5cf6)' : 'rgba(255,255,255,0.05)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}>
            <Send size={16} color={input.trim() && !loading ? 'white' : '#3d4d63'} aria-hidden="true" />
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#3d4d63', marginTop: '0.6rem' }} role="note">
          VoteWise AI may produce inaccuracies. Always verify with your local Election Commission.
        </p>
      </div>

      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.65); opacity: 0.35; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
