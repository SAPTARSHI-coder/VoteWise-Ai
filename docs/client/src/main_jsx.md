# Masterclass: `client/src/main.jsx`

## Purpose of this File
This is the entry point for the entire React Frontend application. Similar to how `server.js` starts the backend, `main.jsx` is the very first file the browser runs when a user visits VoteWise AI. Its only job is to grab the raw HTML page and inject our React application into it.

---

## The Code & Line-by-Line Breakdown

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
```
* **`import { StrictMode } from 'react'`**: Imports a tool from React that highlights potential problems in an application by running checks and warnings. It only runs in development mode, not in production.
* **`import { createRoot } from 'react-dom/client'`**: Imports the modern React 18 feature that creates a root container to render our app.
* **`import './index.css'`**: Imports the global CSS file. This is where all the Tailwind CSS rules are injected, which makes everything beautiful.
* **`import App from './App.jsx'`**: Imports our main application wrapper component.

```jsx
createRoot(document.getElementById('root')).render(
```
* **`document.getElementById('root')`**: If you look inside the `index.html` file in the `public` folder, you will see a single empty `<div>` with `id="root"`. This code grabs that empty box.
* **`createRoot(...).render(...)`**: This tells React to take total control of that empty box and start drawing our application inside it.

```jsx
  <StrictMode>
    <App />
  </StrictMode>,
)
```
* **`<App />`**: We take the `App` component we imported earlier and tell React to render it on the screen. From this point onward, React is running the show!
