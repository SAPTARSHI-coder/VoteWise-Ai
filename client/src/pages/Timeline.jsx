import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Registration',
    description: 'Ensure you are registered to vote. You must meet age and citizenship requirements.',
    details: 'Visit your local election portal or NVSP to apply for a voter ID card. Keep your Aadhaar or passport ready for age/address proof.'
  },
  {
    id: 2,
    title: 'Verification',
    description: 'Check your name in the electoral roll.',
    details: 'Even if you have a voter ID, your name must be on the voter list for your constituency to cast a vote. You can check this online or via SMS.'
  },
  {
    id: 3,
    title: 'Voting Day',
    description: 'Go to your designated polling booth and cast your vote.',
    details: 'Carry your Voter ID or alternative approved photo ID. Press the button next to your chosen candidate on the EVM until you hear a beep.'
  },
  {
    id: 4,
    title: 'Counting & Results',
    description: 'Votes are counted by the Election Commission and results are declared.',
    details: 'The counting process is transparent and conducted under strict security. Results are usually announced on the same day counting begins.'
  }
];

const Timeline = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem' }}>Election Process Timeline</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>A step-by-step guide to exercising your democratic right.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Timeline Navigation */}
        <div className="glass-panel" style={{ flex: '1 1 250px', padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                onClick={() => setActiveStep(step.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '1rem',
                  cursor: 'pointer',
                  opacity: activeStep === step.id ? 1 : 0.6,
                  transition: 'opacity 0.2s',
                  position: 'relative'
                }}
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '11px',
                    top: '30px',
                    width: '2px',
                    height: 'calc(100% + 10px)',
                    background: activeStep > step.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                    zIndex: 0
                  }} />
                )}
                
                <div style={{ zIndex: 1, background: 'var(--bg-primary)', borderRadius: '50%', padding: '2px' }}>
                  {activeStep > step.id ? (
                    <CheckCircle2 color="var(--success)" size={24} />
                  ) : activeStep === step.id ? (
                    <Circle color="var(--accent-primary)" fill="var(--accent-primary)" size={24} />
                  ) : (
                    <Circle color="var(--text-secondary)" size={24} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: activeStep === step.id ? 'white' : 'var(--text-primary)', marginTop: '2px' }}>
                    {step.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Details */}
        <div className="glass-panel" style={{ flex: '2 1 400px', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {steps.map((step) => (
            activeStep === step.id && (
              <div key={step.id} className="animate-fade-in">
                <h3 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{step.id}. {step.title}</h3>
                <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: '500' }}>{step.description}</p>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--accent-primary)', padding: '1.5rem', borderRadius: '0 8px 8px 0' }}>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{step.details}</p>
                </div>
                
                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                  <button 
                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                    disabled={activeStep === 1}
                    style={{ background: 'transparent', color: activeStep === 1 ? 'rgba(255,255,255,0.2)' : 'var(--text-secondary)', fontWeight: '600', padding: '0.5rem', border: 'none', cursor: activeStep === 1 ? 'default' : 'pointer' }}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
                    disabled={activeStep === steps.length}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: activeStep === steps.length ? 0.5 : 1, cursor: activeStep === steps.length ? 'default' : 'pointer' }}
                  >
                    {activeStep === steps.length ? 'Completed' : 'Next Step'} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
