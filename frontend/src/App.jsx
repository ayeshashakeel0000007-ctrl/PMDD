import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import LiveAnalysisDashboard from './components/LiveAnalysisDashboard';
import AgentPipeline from './components/AgentPipeline';
import EvidenceExplorer from './components/EvidenceExplorer';
import MathematicalEngine from './components/MathematicalEngine';
import LongitudinalDashboard from './components/LongitudinalDashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleResults = (data) => {
    setAnalysisResults(data);
  };

  const systemCertainty = analysisResults?.final_output?.math_scores?.systemic_uncertainty_index !== undefined
    ? ((1 - analysisResults.final_output.math_scores.systemic_uncertainty_index) * 100).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-pmdd-dark font-sans selection:bg-pmdd-accent selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-pmdd-accent/20 bg-pmdd-dark/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-pmdd-accent to-pmdd-soft flex items-center justify-center font-bold text-pmdd-dark">
                PM
              </div>
              <span className="text-white font-semibold tracking-wide hidden sm:block">PMDD Platform</span>
            </div>
            
            <div className="hidden md:flex space-x-2">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${currentView === 'dashboard' ? 'bg-pmdd-accent/10 text-pmdd-accent' : 'text-pmdd-neutral hover:text-white'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('longitudinal')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${currentView === 'longitudinal' ? 'bg-pmdd-accent/10 text-pmdd-accent' : 'text-pmdd-neutral hover:text-white'}`}
              >
                Longitudinal Analysis
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            {systemCertainty && currentView === 'dashboard' && (
              <div className="hidden sm:flex items-center text-pmdd-neutral">
                <span className="mr-2">System Certainty:</span>
                <span className={`font-mono px-2 py-0.5 rounded ${systemCertainty > 80 ? 'text-green-400 bg-green-900/20' : 'text-yellow-400 bg-yellow-900/20'}`}>
                  {systemCertainty}%
                </span>
              </div>
            )}
            <span className="px-3 py-1 bg-pmdd-accent/10 border border-pmdd-accent/30 rounded-full text-pmdd-soft">v3.0.0</span>
          </div>
        </div>
      </nav>

      <main>
        {currentView === 'dashboard' ? (
          <>
            <HeroSection />
            <LiveAnalysisDashboard onResults={handleResults} />
            <AgentPipeline results={analysisResults} />
            {analysisResults && (
              <>
                <EvidenceExplorer results={analysisResults} />
                <MathematicalEngine results={analysisResults} />
              </>
            )}
          </>
        ) : (
          <LongitudinalDashboard />
        )}
      </main>

      <footer className="border-t border-pmdd-accent/20 py-12 text-center text-pmdd-neutral text-sm">
        <p>Pragmatic Meaning Drift Detector © 2026</p>
        <p className="mt-2 text-pmdd-accent">Deterministic Validation & Agentic Reasoning</p>
      </footer>
    </div>
  );
}

export default App;
