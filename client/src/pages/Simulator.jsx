import React, { useState } from 'react';
import { ArrowRight, RefreshCcw, CheckCircle, AlertTriangle } from 'lucide-react';

const Simulator = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const scenario = [
    {
      question: "You are preparing for the upcoming election. Do you already have a valid Voter ID card?",
      options: [
        { text: "Yes, I have my Voter ID.", nextStep: 1 },
        { text: "No, I just turned 18 and haven't applied.", nextStep: 2 },
        { text: "I lost my Voter ID.", nextStep: 3 }
      ]
    },
    {
      // Step 1
      question: "Great! Next step: Have you checked if your name is on the electoral roll (voter list) for your area?",
      options: [
        { text: "Yes, I checked online and my name is there.", nextStep: 4 },
        { text: "No, I assumed having a Voter ID was enough.", nextStep: 5 }
      ]
    },
    {
      // Step 2
      isEnd: true,
      success: false,
      title: "Action Required: Register to Vote",
      content: "You cannot vote without a Voter ID. You need to apply online via the National Voters' Service Portal (NVSP) by filling out Form 6. You'll need age proof (like Aadhaar or birth certificate) and address proof."
    },
    {
      // Step 3
      isEnd: true,
      success: false,
      title: "Action Required: Request Duplicate",
      content: "Don't worry! You can apply for a duplicate Voter ID card online through the Election Commission portal. Alternatively, if your name is on the electoral roll, you can vote using other approved photo IDs (like Aadhaar, Passport, or PAN card)."
    },
    {
      // Step 4
      question: "Excellent. On voting day, you reach the polling booth. What do you do first?",
      options: [
        { text: "Join the queue and wait for the polling officer to check my ID.", nextStep: 6 },
        { text: "Walk directly to the EVM machine to vote.", nextStep: 7 }
      ]
    },
    {
      // Step 5
      isEnd: true,
      success: false,
      title: "Warning: Name Must Be on the List!",
      content: "A Voter ID alone is not enough to vote! Your name MUST be on the electoral roll of your constituency. Always verify this online or via SMS a few weeks before the election."
    },
    {
      // Step 6
      isEnd: true,
      success: true,
      title: "Success! You Voted Successfully.",
      content: "You waited in line, the officer verified your ID, and you proceeded to the EVM compartment. You pressed the button for your candidate and heard the beep. You have successfully exercised your democratic right!"
    },
    {
      // Step 7
      isEnd: true,
      success: false,
      title: "Hold On!",
      content: "You cannot walk directly to the EVM. You must first have your identity verified by the polling officer who will check your name on the voter list and mark your finger with indelible ink."
    }
  ];

  const currentData = scenario[currentStep];

  const reset = () => setCurrentStep(0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem' }}>Voting Day Simulator</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Test your knowledge of the voting process in real-world scenarios.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {currentData.isEnd ? (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', marginBottom: '1.5rem', background: currentData.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              {currentData.success ? <CheckCircle size={48} color="var(--success)" /> : <AlertTriangle size={48} color="var(--warning)" />}
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: currentData.success ? 'var(--success)' : 'var(--warning)' }}>
              {currentData.title}
            </h3>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
              {currentData.content}
            </p>
            <button className="btn-primary" onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCcw size={18} /> Restart Simulation
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2.5rem', lineHeight: '1.5' }}>{currentData.question}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(option.nextStep)}
                  style={{
                    padding: '1.2rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1.1rem',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                >
                  {option.text}
                  <ArrowRight size={20} color="var(--text-secondary)" />
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
