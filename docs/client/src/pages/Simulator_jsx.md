# Masterclass: `client/src/pages/Simulator.jsx`

## Purpose of this File
This file is a mini text-based adventure game. It asks the user a question, gives them a few choices, and then shows them the consequences of that choice. It uses a concept called a "Decision Tree" to map out all the possible paths the user can take.

---

## The Code & Line-by-Line Breakdown

### 1. The Decision Tree (The Data)
```jsx
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
  // ...
```
* **`const scenario = [...]`**: This is an array of objects. Each object is a "Node" in our decision tree. 
* Notice the first node (index 0). It has a `question` and three `options`.
* **`nextStep: 1`**: If the user clicks the first option, the app looks at `nextStep` and jumps to node index `1` in the array. This is how the "game" moves forward.

```jsx
  {
    isEnd: true, success: false,
    title: "Action Required: Register to Vote",
    content: "You cannot vote without a Voter ID...",
  },
```
* **`isEnd: true`**: Some nodes are "Game Over" screens. They don't have a `question` or `options`. Instead, they have `isEnd: true`. If the user lands on one of these nodes, the app knows the game has ended and shows the final result screen.
* **`success: false/true`**: Determines whether the user won or lost, changing the icon color to Green (Success) or Yellow (Warning).

### 2. The Progress Bar Component
```jsx
const ProgressBar = ({ current, total }) => (
  <div style={{ display: 'flex', gap: '4px', marginBottom: '2rem' }} role="progressbar" ... >
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{ backgroundColor: i < current ? 'var(--blue)' : 'var(--bg-elevated)' }} />
    ))}
  </div>
);
```
* We define a custom `<ProgressBar />` component right in the file. 
* It takes two variables: `current` (how many steps we've taken) and `total` (how many steps it takes to win).
* It creates a row of dashes. If the index of the dash is less than the `current` progress, it colors it blue. Otherwise, it leaves it grey.

### 3. State Management
```jsx
const Simulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const data = scenario[currentStep];
```
* **`currentStep`**: Tracks exactly which Node in the array the user is currently reading. Starts at `0`.
* **`progress`**: Tracks how many questions the user has answered to fill the progress bar.
* **`data = scenario[currentStep]`**: We grab the actual data object for the current step so we can easily display it.

### 4. Game Logic
```jsx
  const handleOption = (nextStep) => {
    setProgress(p => p + 1);
    setCurrentStep(nextStep);
  };

  const reset = () => { setCurrentStep(0); setProgress(0); };
```
* **`handleOption(nextStep)`**: When the user clicks a button, this function runs. It bumps the progress bar by 1, and updates `currentStep` to the `nextStep` defined in the data array.
* **`reset()`**: When the user clicks "Try Again" on an end screen, this instantly resets both states to 0, completely restarting the game without needing to refresh the browser page.

### 5. Conditional Rendering (The UI)
```jsx
        {data.isEnd ? (
          <div className="sim-result animate-fade-in" role="alert">
            <div className={`result-icon-wrap ${data.success ? 'success' : 'warn'}`}>
               {/* Show Green Check or Yellow Warning */}
            </div>
            <h3>{data.title}</h3>
            <p>{data.content}</p>
            <button className="btn-primary" onClick={reset}>Try Again</button>
          </div>
        ) : (
```
* **`{data.isEnd ? (...) : (...)}`**: This is a JavaScript Ternary Operator (`condition ? true : false`). It acts as a giant IF/ELSE block for our HTML.
* **IF `data.isEnd` is true**: We render the Game Over screen. We look at `data.success` to decide whether to show a green success message or a yellow warning message. We also show the "Try Again" button that triggers the `reset()` function.

```jsx
          <div className="animate-fade-in" key={currentStep}>
            <p className="sim-question">{data.question}</p>
            <div className="sim-options">
              {data.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="sim-option"
                  onClick={() => handleOption(opt.nextStep)}
                >
                  <span>{opt.text}</span>
                  <ArrowRight size={18} className="sim-option-arrow" />
                </button>
              ))}
            </div>
          </div>
        )}
```
* **ELSE (`data.isEnd` is false)**: We render the Question screen. 
* We print `data.question`.
* We loop over the `data.options` array and generate a `<button>` for each choice. 
* When clicked, the button calls `handleOption(opt.nextStep)` and instantly jumps the user to the next node in the decision tree.
