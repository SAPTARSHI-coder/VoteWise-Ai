# Masterclass: `client/src/pages/Home.jsx`

## Purpose of this File
The Home page is the landing page of the application. Its purpose is to grab the user's attention, explain what the app does, and provide a clear "Call to Action" (CTA) to guide them into the core features (Chat, Timeline, Simulator). 

*(Note: This documentation correctly references the pure CSS classes used in your styling system.)*

---

## The Code & Line-by-Line Breakdown

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gamepad2, MessageSquare } from 'lucide-react';
```
* **`import React from 'react';`**: Standard React import.
* **`import { Link } from 'react-router-dom';`**: We import the `Link` component so we can create buttons that navigate to other pages without reloading the browser.
* **`import { Sparkles, ... } from 'lucide-react';`**: We import beautiful, lightweight SVG icons to make the UI look premium.

```jsx
const Home = () => (
  <div className="animate-fade-in">
```
* **`const Home = () => ...`**: We define the Home component using an arrow function. 
* **`<div className="animate-fade-in">`**: This wraps the entire page in an animation class defined in `index.css`. When the page loads, it will smoothly fade in instead of just popping onto the screen abruptly.

```jsx
    <div className="home-hero">
      <div className="home-eyebrow" role="status">
        <span className="dot" aria-hidden="true" />
        Powered by Google Gemini AI
      </div>
```
* **`<div className="home-hero">`**: The "Hero" section is a web design term for the massive, eye-catching text at the very top of a landing page.
* **`home-eyebrow`**: This creates the small, pill-shaped badge above the main title. It establishes credibility instantly by mentioning Google Gemini.
* **`role="status"`**: An accessibility tag that tells screen readers this is important status information.
* **`<span className="dot" ...>`**: A CSS-styled glowing dot inside the eyebrow to make it look "live" and active.

```jsx
      <h1 className="home-title">
        Your Smart <span className="text-gradient">Election</span> Assistant
      </h1>
      <p className="home-subtitle">
        Navigate the electoral process with clarity. Get instant...
      </p>
```
* **`<h1 className="home-title">`**: The main headline.
* **`<span className="text-gradient">`**: Instead of a flat color, we use this CSS class to apply a beautiful purple/blue gradient exclusively to the word "Election", making it pop.
* **`<p className="home-subtitle">`**: The subheadline that explains the value proposition of the app.

```jsx
      <div className="home-actions">
        <Link to="/chat">
          <button className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }} aria-label="Start chatting with VoteWise AI">
            <MessageSquare size={17} aria-hidden="true" /> Start Chatting
          </button>
        </Link>
```
* **`<div className="home-actions">`**: A flexbox container that places our primary and secondary buttons side-by-side.
* **`<button className="btn-primary">`**: The main Call to Action. `btn-primary` gives it the solid blue background with hover effects. We wrap it in a `<Link>` so clicking it instantly loads the Chat page.

```jsx
    <div className="home-features" role="list" aria-label="App features">
      <Link to="/chat" className="feature-card feature-card-link" role="listitem">
```
* **`<div className="home-features">`**: Below the Hero section, we have a grid of feature cards. This class uses CSS Grid to automatically arrange them in a single column on mobile, and 3 columns side-by-side on desktop.
* **`<Link ... className="feature-card feature-card-link">`**: We make the *entire card* a clickable link. The `feature-card` class gives it the premium dark-glass look with a subtle border, and `feature-card-link` adds the hover animation (making the card float up slightly when you mouse over it).

```jsx
        <div className="feature-icon" style={{ background: 'rgba(59,127,255,0.12)', border: '1px solid rgba(59,127,255,0.2)' }} aria-hidden="true">
          <MessageSquare size={18} color="var(--blue)" />
        </div>
        <h3>AI Chat Assistant</h3>
        <p>Get instant, accurate answers...</p>
      </Link>
```
* **`<div className="feature-icon">`**: We create a perfectly round, softly glowing background circle for the icon to sit inside.
* This block repeats 3 times for the three main features of the app, using different colors (blue, violet, teal) for each icon to add visual interest.

```jsx
    </div>
  </div>
);

export default Home;
```
* Finally, we export the completed Home page so `App.jsx` can use it in the routing system.
