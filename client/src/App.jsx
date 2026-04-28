import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sparkles, Gamepad2, MessageSquare, Home } from 'lucide-react';
import ChatAssistant from './pages/ChatAssistant';
import Timeline from './pages/Timeline';
import Simulator from './pages/Simulator';
import './index.css';

const VoteLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="logo-icon"><VoteLogo /></div>
        VoteWise AI
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={15} /> Home
        </Link>
        <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
          <MessageSquare size={15} /> Assistant
        </Link>
        <Link to="/timeline" className={`nav-link ${location.pathname === '/timeline' ? 'active' : ''}`}>
          <Sparkles size={15} /> Timeline
        </Link>
        <Link to="/simulator" className={`nav-link ${location.pathname === '/simulator' ? 'active' : ''}`}>
          <Gamepad2 size={15} /> Simulator
        </Link>
        <Link to="/chat" className="nav-badge" style={{ marginLeft: '0.5rem' }}>
          Try Now →
        </Link>
      </div>
    </nav>
  );
};

const Home = () => (
  <div className="animate-fade-in">
    <div className="home-hero">
      <div className="home-eyebrow">
        <span className="dot" />
        Powered by Google Gemini AI
      </div>
      <h1 className="home-title">
        Your Smart <span className="text-gradient">Election</span> Assistant
      </h1>
      <p className="home-subtitle">
        Navigate the electoral process with clarity. Get instant, non-partisan answers to your election questions, explore timelines, and simulate voting scenarios.
      </p>
      <div className="home-actions">
        <Link to="/chat">
          <button className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}>
            <MessageSquare size={17} /> Start Chatting
          </button>
        </Link>
        <Link to="/timeline">
          <button className="btn-ghost" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}>
            <Sparkles size={17} /> Explore Timeline
          </button>
        </Link>
      </div>
    </div>

    <div className="home-features">
      <Link to="/chat" className="feature-card feature-card-link">
        <div className="feature-icon" style={{ background: 'rgba(59,127,255,0.12)', border: '1px solid rgba(59,127,255,0.2)' }}>
          <MessageSquare size={18} color="var(--blue)" />
        </div>
        <h3>AI Chat Assistant</h3>
        <p>Get instant, accurate answers to any election or voting question — 100% non-partisan and fact-based.</p>
      </Link>
      <Link to="/timeline" className="feature-card feature-card-link">
        <div className="feature-icon" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <Sparkles size={18} color="var(--violet)" />
        </div>
        <h3>Election Timeline</h3>
        <p>Step through the full electoral process — from registration to results — in an interactive visual guide.</p>
      </Link>
      <Link to="/simulator" className="feature-card feature-card-link">
        <div className="feature-icon" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <Gamepad2 size={18} color="var(--teal)" />
        </div>
        <h3>Voting Simulator</h3>
        <p>Practice real-world voting day scenarios and test your knowledge with an interactive decision tree.</p>
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatAssistant />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </Router>
  );
}

export default App;
