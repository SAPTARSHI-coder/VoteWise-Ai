import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gamepad2, MessageSquare } from 'lucide-react';

const Home = () => (
  <div className="animate-fade-in">
    <div className="home-hero">
      <div className="home-eyebrow" role="status">
        <span className="dot" aria-hidden="true" />
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
          <button className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }} aria-label="Start chatting with VoteWise AI">
            <MessageSquare size={17} aria-hidden="true" /> Start Chatting
          </button>
        </Link>
        <Link to="/timeline">
          <button className="btn-ghost" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }} aria-label="Explore the election timeline">
            <Sparkles size={17} aria-hidden="true" /> Explore Timeline
          </button>
        </Link>
      </div>
    </div>

    <div className="home-features" role="list" aria-label="App features">
      <Link to="/chat" className="feature-card feature-card-link" role="listitem">
        <div className="feature-icon" style={{ background: 'rgba(59,127,255,0.12)', border: '1px solid rgba(59,127,255,0.2)' }} aria-hidden="true">
          <MessageSquare size={18} color="var(--blue)" />
        </div>
        <h3>AI Chat Assistant</h3>
        <p>Get instant, accurate answers to any election or voting question — 100% non-partisan and fact-based.</p>
      </Link>
      <Link to="/timeline" className="feature-card feature-card-link" role="listitem">
        <div className="feature-icon" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }} aria-hidden="true">
          <Sparkles size={18} color="var(--violet)" />
        </div>
        <h3>Election Timeline</h3>
        <p>Step through the full electoral process — from registration to results — in an interactive visual guide.</p>
      </Link>
      <Link to="/simulator" className="feature-card feature-card-link" role="listitem">
        <div className="feature-icon" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }} aria-hidden="true">
          <Gamepad2 size={18} color="var(--teal)" />
        </div>
        <h3>Voting Simulator</h3>
        <p>Practice real-world voting day scenarios and test your knowledge with an interactive decision tree.</p>
      </Link>
    </div>
  </div>
);

export default Home;
