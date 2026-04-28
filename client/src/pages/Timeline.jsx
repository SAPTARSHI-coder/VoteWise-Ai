import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    tag: 'Step 1',
    title: 'Voter Registration',
    description: 'Ensure you are registered to vote. You must meet age and citizenship requirements to be eligible.',
    details: 'Visit your local election portal or NVSP (National Voters\' Service Portal) to apply for a Voter ID card. Keep your Aadhaar or passport ready for age and address proof. You can apply online at voters.eci.gov.in.',
  },
  {
    id: 2,
    tag: 'Step 2',
    title: 'Electoral Roll Verification',
    description: 'Having a Voter ID is not enough — your name must be on the electoral roll for your constituency.',
    details: 'Even if you have a valid Voter ID, your name must appear on the voter list for your area. You can verify this online at electoralsearch.eci.gov.in or via SMS. Do this well before election day.',
  },
  {
    id: 3,
    tag: 'Step 3',
    title: 'Voting Day',
    description: 'Head to your designated polling booth with valid photo ID and cast your vote on the EVM.',
    details: 'Carry your Voter ID or any alternative approved photo ID (Aadhaar, PAN, Passport). Join the queue, get your ID verified, and receive your voter slip. Proceed to the EVM booth and press the button next to your chosen candidate until you hear a beep.',
  },
  {
    id: 4,
    tag: 'Step 4',
    title: 'Counting & Results',
    description: 'Votes are counted by the Election Commission of India and results are officially declared.',
    details: 'The counting process is conducted under strict security and transparent VVPAT paper trail verification. Results are typically announced on the same day counting begins and are published on the ECI official website in real time.',
  },
];

const Timeline = () => {
  const [activeStep, setActiveStep] = useState(1);
  const current = steps.find(s => s.id === activeStep);

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="label">Interactive Guide</div>
        <h2>Election Process Timeline</h2>
        <p>A step-by-step walkthrough of exercising your democratic right — from registration to results.</p>
      </div>

      <div className="timeline-layout card" style={{ overflow: 'hidden' }}>
        {/* Sidebar Nav */}
        <div className="timeline-nav" style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                className={`timeline-step-btn ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="step-number">
                  {activeStep > step.id ? <CheckCircle2 size={16} /> : step.id}
                </div>
                <span className="step-label">{step.title}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`step-connector ${activeStep > step.id ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="timeline-detail animate-fade-in" key={activeStep}>
          <div className="step-tag">{current.tag}</div>
          <h3 className="text-gradient">{current.title}</h3>
          <p className="description">{current.description}</p>
          <div className="detail-box">{current.details}</div>
          <div className="timeline-nav-buttons">
            <button
              className="btn-ghost"
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
            >
              <ChevronLeft size={17} /> Previous
            </button>
            <button
              className="btn-primary"
              onClick={() => setActiveStep(Math.min(steps.length, activeStep + 1))}
              disabled={activeStep === steps.length}
            >
              {activeStep === steps.length ? '✓ Completed' : 'Next Step'} {activeStep < steps.length && <ChevronRight size={17} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
