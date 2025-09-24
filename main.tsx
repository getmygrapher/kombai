import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import App from './src/App'
import KombaiWrapper from './KombaiWrapper'
import ErrorBoundary from '@kombai/react-error-boundary'
import './src/index.css'

// Main App with Routing
const AppWithRouting: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main App Route */}
        <Route path="/*" element={<App />} />
        
        {/* Redirect root to main app */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        {/* Ensure bare /availability also resolves */}
        <Route path="/availability" element={<Navigate to="/availability/calendar" replace />} />
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <KombaiWrapper>
        <AppWithRouting />
      </KombaiWrapper>
    </ErrorBoundary>
  </StrictMode>,
)