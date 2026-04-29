# Masterclass: `client/src/components/Navbar.jsx`

## Purpose of this File
This file contains the Navigation Bar that sits at the top of every screen in the application. By extracting the Navbar into its own "Component" file, we obey the DRY principle (Don't Repeat Yourself). Instead of copying and pasting the Navbar code into every single page, we write it once here and import it everywhere via `App.jsx`.

*(Note: My apologies, the previous version of this document incorrectly explained Tailwind CSS classes. This version accurately reflects the standard CSS classes used in your actual code!)*

---

## The Code & Line-by-Line Breakdown

```jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Gamepad2, MessageSquare, Home as HomeIcon } from 'lucide-react';
```
* **`import React from 'react';`**
  * Required for JSX syntax.
* **`import { Link, useLocation } from 'react-router-dom';`**
  * `Link`: A special version of a standard HTML `<a>` (anchor) tag. When clicked, it changes the URL instantly without forcing the browser to reload the whole page.
  * `useLocation`: A React Router Hook that tells us what the current URL is (e.g., `/chat` or `/timeline`).
* **`import { Sparkles, ... } from 'lucide-react';`**
  * Importing the specific SVG vector icons we need for the navigation menu buttons.

```jsx
const VoteLogo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
```
* **`const VoteLogo = () => ...`**
  * We define a tiny custom React component right here in the file that renders an SVG graphic of a checkmark and a shield. `aria-hidden="true"` is an accessibility tag telling screen readers to ignore the graphic since it's just decoration.

```jsx
const Navbar = () => {
  const location = useLocation();
```
* **`const Navbar = () => {`**
  * Defines the main Navbar functional component.
* **`const location = useLocation();`**
  * We execute the hook to get an object representing the current URL. We save it in `location`. We use this to figure out which page we are currently on to highlight the correct button.

```jsx
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
```
* **`<nav className="navbar" ...>`**
  * The HTML5 semantic wrapper for navigation links. The styling for `.navbar` is defined in `index.css`.
  * `role="navigation" aria-label="..."`: Crucial accessibility tags for screen readers.

```jsx
      <Link to="/" className="navbar-logo" aria-label="VoteWise AI home">
        <div className="logo-icon" aria-hidden="true"><VoteLogo /></div>
        VoteWise AI
      </Link>
```
* **`<Link to="/">`**
  * The logo itself acts as a link back to the Home page (`/`).

```jsx
      <div className="nav-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          <HomeIcon size={15} aria-hidden="true" /> Home
        </Link>
```
* **`<div className="nav-links">`**: A container for all the buttons on the right side.
* **<code>className={\`nav-link \${location.pathname === '/' ? 'active' : ''}\`}</code>**
  * **Dynamic Styling**: This is a powerful React trick. We always apply the `nav-link` CSS class. Then, we check: *Is the current URL exactly equal to `/`?* If yes, we *also* apply the `active` CSS class, which makes the button light up to show the user where they are.
* **`aria-current={...}`**: If this is the active page, we tell screen readers by setting `aria-current="page"`.

*(The code then repeats this exact structure for `/chat`, `/timeline`, and `/simulator`)*

```jsx
        <Link to="/chat" className="nav-badge" style={{ marginLeft: '0.5rem' }} aria-label="Try VoteWise AI chat assistant">
          Try Now →
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
```
* **`<Link className="nav-badge" ...>`**
  * The final "Call to Action" button on the far right. We give it a special `nav-badge` CSS class to make it look like a highlighted pill button instead of a regular text link.
* **`export default Navbar;`**
  * Exposes the component so `App.jsx` can import it.
