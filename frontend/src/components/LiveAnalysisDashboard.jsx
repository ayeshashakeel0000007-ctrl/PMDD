import React, { useState } from 'react';
import { Upload, Play, AlertCircle, Loader, Activity } from 'lucide-react';
import axios from 'axios';

const LiveAnalysisDashboard = ({ onResults }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [backendStatus, setBackendStatus] = useState('Checking Connection...');
  const [isAwake, setIsAwake] = useState(false);

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        const isProd = import.meta.env.PROD;
        let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
        apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        
        console.log(`Pinging backend health: ${apiUrl}/health`);
        const res = await axios.get(`${apiUrl}/health`);
        if (res.data.status === 'online') {
          setBackendStatus('Backend Online & Agents Active');
          setIsAwake(true);
        }
      } catch (err) {
        console.error("Health check failed:", err);
        setBackendStatus('Cold Start Recovery: Waking up mathematical engine...');
        setIsAwake(false);
      }
    };
    checkHealth();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const isProd = import.meta.env.PROD;
      let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
      apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      
      console.log(`Sending POST request to: ${apiUrl}/api/analyze`);
      console.log(`Payload:`, { text });

      const response = await axios.post(`${apiUrl}/api/analyze`, { text });
      
      console.log('Response received:', response.data);
      onResults(response.data);
      setBackendStatus('Backend Online & Agents Active');
      setIsAwake(true);
    } catch (err) {
      console.error("Analysis request failed details:", err);
      let errorMessage = "Analysis server unavailable. API Timeout or Cold Start failed.";
      
      if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          errorMessage = `Server Error (${err.response.status}): ${err.response.data?.detail || 'Unknown error'}`;
      } else if (err.request) {
          // The request was made but no response was received
          errorMessage = "Network Error: Could not reach the backend. Please check CORS or your VITE_API_URL.";
      } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Live Analysis Dashboard</h2>
        <p className="text-pmdd-neutral">Input corpus text for agentic linguistic extraction and mathematical validation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-pmdd-soft">Corpus Input</h3>
            <button className="text-pmdd-neutral hover:text-white transition-colors">
              <Upload size={20} />
            </button>
          </div>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow w-full bg-pmdd-dark/80 border border-pmdd-accent/40 rounded-lg p-4 text-white focus:outline-none focus:border-pmdd-soft resize-none mb-4 font-mono text-sm"
            placeholder="Enter text corpus here..."
          ></textarea>
          
          <button 
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full py-3 bg-pmdd-accent hover:bg-pmdd-secondary disabled:bg-pmdd-accent/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center shadow-lg"
          >
            {loading ? (
              <><Loader className="animate-spin mr-2" size={18} /> Processing Pipeline...</>
            ) : (
              <><Play className="mr-2" size={18} /> Run Deterministic Analysis</>
            )}
          </button>
        </div>

        {/* Status / Failsafe Panel */}
        <div className="glass-panel p-6 flex flex-col h-[500px]">
          <h3 className="text-lg font-semibold text-pmdd-soft mb-4">System Status</h3>
          
          {error ? (
            <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg flex items-start text-red-200">
              <AlertCircle className="mr-3 mt-0.5 flex-shrink-0" size={18} />
              <span className="text-sm leading-relaxed">{error}</span>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6 border border-dashed border-pmdd-accent/40 rounded-lg bg-pmdd-dark/40">
              {loading ? (
                <>
                  <div className="w-12 h-12 rounded-full border-4 border-pmdd-accent border-t-pmdd-soft animate-spin mb-4"></div>
                  <p className="text-pmdd-neutral text-sm">Agents evaluating semantic fields and pragmatic shifts...</p>
                </>
              ) : (
                <>
                  <Activity size={32} className={`mb-4 ${isAwake ? 'text-pmdd-accent opacity-100' : 'text-pmdd-neutral opacity-50'}`} />
                  <p className="text-pmdd-neutral text-sm font-medium">{backendStatus}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveAnalysisDashboard;
