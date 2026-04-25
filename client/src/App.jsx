import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bot, History, Info } from 'lucide-react';
import ChatAssistant from './pages/ChatAssistant';
import Timeline from './pages/Timeline';
import Simulator from './pages/Simulator';

const Home = () => (
  <div className="animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
    <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>VoteWise AI</h1>
    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
      Your smart election assistant. Navigate the electoral process with confidence, verify facts, and simulate voting scenarios.
    </p>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <Link to="/chat">
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bot size={20} /> Ask Assistant
        </button>
      </Link>
      <Link to="/timeline">
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)' }}>
          <History size={20} /> View Timeline
        </button>
      </Link>
    </div>
  </div>
);

const Navbar = () => (
  <nav className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem', borderRadius: '12px' }}>
    <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Bot color="var(--accent-primary)" /> VoteWise
    </Link>
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <Link to="/chat" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Bot size={18} /> Assistant</Link>
      <Link to="/timeline" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><History size={18} /> Timeline</Link>
      <Link to="/simulator" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Info size={18} /> Simulator</Link>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '1rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatAssistant />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/simulator" element={<Simulator />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
