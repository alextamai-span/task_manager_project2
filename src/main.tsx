// imports
// -------
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// rendering
// ---------
// getting the root element (the body) from the HTML for the app
// ! is a non-null assertion operator, it tells TypeScript that we are sure that the element with id 'root' exists in the HTML
createRoot(document.getElementById('root')!).render(
  // StrictMode: helps to identify potential problems in the application, it activates additional checks and warnings for its descendants
  <StrictMode>
    {/* rendering the main App component */}
    <App />
  </StrictMode>
)
