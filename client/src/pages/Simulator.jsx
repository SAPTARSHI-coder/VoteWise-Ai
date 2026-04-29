import React, { useState } from 'react';
import { ArrowRight, RefreshCcw, CheckCircle, AlertTriangle } from 'lucide-react';

const scenario = [
  {
    question: "You're preparing for the upcoming election. Do you already have a valid Voter ID card?",
    options: [
      { text: "Yes, I have my Voter ID.", nextStep: 1 },
      { text: "No, I just turned 18 and haven't applied yet.", nextStep: 2 },
      { text: "I lost my Voter ID card.", nextStep: 3 },
    ],
  },
  {
    question: "Great! Have you verified that your name is on the electoral roll (voter list) for your constituency?",
    options: [
      { text: "Yes, I checked online — my name is there.", nextStep: 4 },
      { text: "No, I assumed having a Voter ID was enough.", nextStep: 5 },
    ],
  },
  {
    isEnd: true, success: false,
    title: "Action Required: Register to Vote",
    content: "You cannot vote without a Voter ID. Apply online at voters.eci.gov.in by filling Form 6. You'll need age proof (Aadhaar or birth certificate) and address proof. Do this well before the election deadline.",
  },
  {
    isEnd: true, success: false,
    title: "Action Required: Request a Duplicate",
    content: "You can apply for a duplicate Voter ID online through the Election Commission portal. Alternatively, if your name is on the electoral roll, you may vote using other approved photo IDs like Aadhaar, Passport, or PAN card.",
  },
  {
    question: "On voting day, you arrive at the polling booth. What do you do first?",
    options: [
      { text: "Join the queue and wait for the polling officer to verify my ID.", nextStep: 6 },
      { text: "Walk directly to the EVM machine to cast my vote.", nextStep: 7 },
    ],
  },
  {
    isEnd: true, success: false,
    title: "Warning: Your Name Must Be on the List",
    content: "A Voter ID alone does not guarantee voting rights. Your name MUST appear on the electoral roll of your constituency. Always verify this online at electoralsearch.eci.gov.in several weeks before the election.",
  },
  {
    isEnd: true, success: true,
    title: "You Voted Successfully!",
    content: "You waited in the queue, had your ID verified by the polling officer, received your voter slip, and proceeded to the EVM booth. You pressed the button next to your chosen candidate and heard the confirmation beep. Democracy in action!",
  },
  {
    isEnd: true, success: false,
    title: "Not So Fast!",
    content: "You cannot walk directly to the EVM machine. You must first have your identity verified by the presiding officer who will check your name on the voter list, mark your finger with indelible ink, and issue you a voter slip.",
  },
];

const ProgressBar = ({ current, total }) => (
  <div
    style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }}
    role="progressbar"
    aria-valuenow={current}
    aria-valuemin={0}
    aria-valuemax={total}
    aria-label={`Scenario progress: step ${current} of ${total}`}
  >
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          flex: 1, height: '3px', borderRadius: '99px',
          backgroundColor: i < current ? 'var(--blue)' : 'var(--bg-elevated)',
          transition: 'background-color 0.3s',
        }}
        aria-hidden="true"
      />
    ))}
  </div>
);

const questionCount = scenario.filter(s => !s.isEnd).length;

const Simulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const data = scenario[currentStep];

  const handleOption = (nextStep) => {
    setProgress(p => p + 1);
    setCurrentStep(nextStep);
  };

  const reset = () => { setCurrentStep(0); setProgress(0); };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="label">Interactive Scenario</div>
        <h2>Voting Day Simulator</h2>
        <p>Walk through real-world scenarios and discover if you're ready to exercise your democratic right correctly.</p>
      </div>

      <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem' }}>
        <ProgressBar current={progress} total={questionCount + 1} />

        {/* Result screen */}
        {data.isEnd ? (
          <div
            className="sim-result animate-fade-in"
            role="alert"
            aria-live="assertive"
            aria-label={data.success ? 'Success outcome' : 'Warning outcome'}
          >
            <div className={`result-icon-wrap ${data.success ? 'success' : 'warn'}`} aria-hidden="true">
              {data.success
                ? <CheckCircle size={36} color="var(--green)" />
                : <AlertTriangle size={36} color="var(--amber)" />
              }
            </div>
            <h3 style={{ color: data.success ? 'var(--green)' : 'var(--amber)' }}>{data.title}</h3>
            <p>{data.content}</p>
            <button className="btn-primary" onClick={reset} aria-label="Restart the simulator from the beginning">
              <RefreshCcw size={16} aria-hidden="true" /> Try Again
            </button>
          </div>
        ) : (
          /* Question + choices */
          <div
            className="animate-fade-in"
            key={currentStep}
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="sim-question" id="sim-question">{data.question}</p>
            <div className="sim-options" role="group" aria-labelledby="sim-question">
              {data.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="sim-option"
                  onClick={() => handleOption(opt.nextStep)}
                  aria-label={opt.text}
                >
                  <span>{opt.text}</span>
                  <ArrowRight size={18} className="sim-option-arrow" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
