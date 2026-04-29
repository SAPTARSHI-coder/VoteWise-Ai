import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Gamepad2, MessageSquare, Home as HomeIcon } from 'lucide-react';

const VoteLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-logo" aria-label="VoteWise AI home">
        <div className="logo-icon" aria-hidden="true"><VoteLogo /></div>
        VoteWise AI
      </Link>
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          <HomeIcon size={15} aria-hidden="true" /> Home
        </Link>
        <Link
          to="/chat"
          className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}
          aria-current={location.pathname === '/chat' ? 'page' : undefined}
        >
          <MessageSquare size={15} aria-hidden="true" /> Assistant
        </Link>
        <Link
          to="/timeline"
          className={`nav-link ${location.pathname === '/timeline' ? 'active' : ''}`}
          aria-current={location.pathname === '/timeline' ? 'page' : undefined}
        >
          <Sparkles size={15} aria-hidden="true" /> Timeline
        </Link>
        <Link
          to="/simulator"
          className={`nav-link ${location.pathname === '/simulator' ? 'active' : ''}`}
          aria-current={location.pathname === '/simulator' ? 'page' : undefined}
        >
          <Gamepad2 size={15} aria-hidden="true" /> Simulator
        </Link>
        <Link to="/chat" className="nav-badge" style={{ marginLeft: '0.5rem' }} aria-label="Try VoteWise AI chat assistant">
          Try Now →
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
