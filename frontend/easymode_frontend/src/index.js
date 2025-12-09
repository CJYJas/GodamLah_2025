import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'; // Import the correct client method for React 18+
import App from './App'; // Import your main component
import './i18n';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// --- Main Render Function ---

// 1. Find the root DOM element from index.html
const rootElement = document.getElementById('root'); 

// 2. Create the React Root using ReactDOM.createRoot (modern React 18 approach)
const root = ReactDOM.createRoot(rootElement);

// 3. Render the application components into the root
root.render(
  <React.StrictMode>
    <App /> {/* Your main application component */}
  </React.StrictMode>
);

// Note on <React.StrictMode>: 
// This is a development tool that helps find potential problems in the code.
// It doesn't render anything visible but activates checks and warnings.