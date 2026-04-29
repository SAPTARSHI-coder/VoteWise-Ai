# Masterclass: `client/src/pages/Timeline.jsx`

## Purpose of this File
This file renders the interactive "Election Process Timeline" page. It breaks down the complex voting process into bite-sized, numbered steps. It uses React "State" to remember which step the user is currently looking at and updates the UI accordingly without reloading the page.

---

## The Code & Line-by-Line Breakdown

### 1. The Data Structure
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    tag: 'Step 1',
    title: 'Voter Registration',
    description: 'Ensure you are registered to vote...',
    details: "Visit your local election portal...",
  },
  // ... (Steps 2, 3, and 4 are defined similarly)
];
```
* **Data Separation**: Instead of hardcoding all the paragraphs directly into the HTML, we create an Array of Objects called `steps` outside the component. This makes the code much cleaner and easier to update later. 

### 2. State and Navigation Setup
```jsx
const Timeline = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  const current = steps.find(s => s.id === activeStep);
```
* **`const [activeStep, setActiveStep] = useState(1);`**: We use React State to track the current step. It starts at `1`.
* **`const navigate = useNavigate();`**: A React Router hook that lets us programmatically redirect the user to another page (like a "Back to Home" button).
* **`const current = ...`**: We search the `steps` array to find the exact object that matches the `activeStep`. We store it in the `current` variable so we can easily display its title and description.

### 3. The Layout Structure
```jsx
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="label">Interactive Guide</div>
        <h2>Election Process Timeline</h2>
        <p>A step-by-step walkthrough of exercising your democratic right...</p>
      </div>
```
* **`<div className="page-container ...">`**: This applies standard margins and max-width so the content doesn't stretch too wide on huge monitors. 

### 4. The Sidebar Navigation
```jsx
      <div className="timeline-layout card" style={{ overflow: 'hidden' }}>
        <nav className="timeline-nav" aria-label="Election process steps">
          {steps.map((step, idx) => (
```
* **`timeline-layout`**: Uses CSS Grid to split the screen into two columns on desktop: the sidebar menu on the left, and the content on the right.
* We loop over our `steps` array to automatically generate the navigation buttons.

```jsx
              <button
                className={`timeline-step-btn ${activeStep === step.id ? 'active' : ''} ${activeStep > step.id ? 'completed' : ''}`}
                onClick={() => setActiveStep(step.id)}
```
* **Dynamic Classes**: This is crucial. 
  * If the user is currently on this step (`activeStep === step.id`), we apply the `active` CSS class.
  * If the user has already moved past this step (`activeStep > step.id`), we apply the `completed` CSS class.
* **`onClick={() => setActiveStep(step.id)}`**: When the user clicks a step in the sidebar, we update the state to that step's ID. React automatically re-renders the right-side panel with the new content.

### 5. The Content Panel
```jsx
        <div className="timeline-detail animate-fade-in" key={activeStep}>
          <div className="step-tag" aria-hidden="true">{current.tag}</div>
          <h3 className="text-gradient">{current.title}</h3>
          <p className="description">{current.description}</p>
          <div className="detail-box">{current.details}</div>
```
* **`key={activeStep}`**: This is a React trick. By changing the `key` every time the step changes, we force React to completely destroy and recreate this `<div>`. This forces the `animate-fade-in` CSS animation to trigger again, creating a smooth transition between steps.
* We read all the data from the `current` object we found earlier and display it here.

### 6. The "Next/Previous" Buttons
```jsx
          <div className="timeline-nav-buttons">
            <button
              className="btn-ghost"
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
            >
              <ChevronLeft size={17} aria-hidden="true" /> Previous
            </button>
```
* **`onClick={() => setActiveStep(Math.max(...))}`**: Lowers the step by 1. We use `Math.max` to ensure it never goes below 1.
* **`disabled={activeStep === 1}`**: If we are on the first step, the "Previous" button becomes greyed out and unclickable.

```jsx
            <button
              className="btn-primary"
              onClick={() => {
                if (activeStep === steps.length) {
                  navigate('/');
                } else {
                  setActiveStep(Math.min(steps.length, activeStep + 1));
                }
              }}
            >
              {activeStep === steps.length ? '✓ Completed' : 'Next Step'} 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```
* **The "Next" Logic**: 
  * If we are on the very last step (`activeStep === steps.length`), the button text changes to "Completed". When clicked, `navigate('/')` sends the user back to the Home page.
  * Otherwise, the button says "Next Step" and increments the state by 1.
