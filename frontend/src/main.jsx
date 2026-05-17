import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SemanticResonanceProvider } from './context/SemanticResonanceContext'
import { ResearchWorkspaceProvider } from './context/ResearchWorkspaceContext'
import ErrorBoundary from './components/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ResearchWorkspaceProvider>
        <SemanticResonanceProvider>
          <App />
        </SemanticResonanceProvider>
      </ResearchWorkspaceProvider>
    </ErrorBoundary>
  </StrictMode>,
)
