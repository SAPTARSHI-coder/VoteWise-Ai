import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';

// Lazy loading for efficiency win
const Home = lazy(() => import('./pages/Home'));
const ChatAssistant = lazy(() => import('./pages/ChatAssistant'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Simulator = lazy(() => import('./pages/Simulator'));

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
    <div style={{ width: 40, height: 40, border: '3px solid rgba(59,127,255,0.2)', borderTopColor: '#3b7fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Router>
      {/* Skip link — first focusable element, jumps keyboard users past navbar */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" role="main">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/simulator" element={<Simulator />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
