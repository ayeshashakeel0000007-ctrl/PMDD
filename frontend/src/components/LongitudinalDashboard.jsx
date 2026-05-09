import React, { useState } from 'react';
import { Activity, Clock, ArrowRight, Loader } from 'lucide-react';

const LongitudinalDashboard = () => {
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [backendStatus, setBackendStatus] = useState('Checking Connection...');
  const [isAwake, setIsAwake] = useState(false);

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        const isProd = import.meta.env.PROD;
        let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
        apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        
        console.log(`Pinging backend health: ${apiUrl}/health`);
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        if (data.status === 'online') {
          setBackendStatus('Longitudinal Engine Ready');
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
    if (!time1.trim() || !time2.trim()) return;
    
    setLoading(true);
    try {
      const isProd = import.meta.env.PROD;
      let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
      apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      
      console.log(`Sending POST request to: ${apiUrl}/api/analyze/longitudinal`);
      const response = await fetch(`${apiUrl}/api/analyze/longitudinal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time_1_text: time1, time_2_text: time2 }),
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Server Error (${response.status}): ${errorData?.detail || response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Longitudinal Response received:', data);
      
      setResults(data);
      setBackendStatus('Longitudinal Engine Ready');
      setIsAwake(true);
    } catch (error) {
      console.error('Error analyzing longitudinal data:', error);
      setBackendStatus(`Error: ${error.message}`);
      setIsAwake(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
          <Activity className="mr-3 text-pmdd-accent" /> Temporal & Longitudinal Analysis
        </h2>
        <p className="text-pmdd-neutral text-lg mb-2">Compare discourse across two chronological points to measure Pragmatic Meaning Drift (KL Divergence).</p>
        <div className="flex items-center text-sm">
           <div className={`w-2 h-2 rounded-full mr-2 ${isAwake ? 'bg-pmdd-accent' : 'bg-yellow-500 animate-pulse'}`}></div>
           <span className={isAwake ? 'text-pmdd-accent' : 'text-yellow-500'}>{backendStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="glass-panel p-6 bg-pmdd-dark/80 relative">
          <div className="flex items-center mb-4 text-pmdd-soft">
            <Clock size={18} className="mr-2" /> <h3>Time Point 1 (Baseline)</h3>
          </div>
          <textarea
            className="w-full h-48 bg-[#0a0d12] border border-pmdd-accent/30 rounded-md p-4 text-white focus:outline-none focus:border-pmdd-accent transition-colors resize-none"
            placeholder="Enter the baseline corpus here..."
            value={time1}
            onChange={(e) => setTime1(e.target.value)}
          />
        </div>

        <div className="glass-panel p-6 bg-pmdd-dark/80 relative">
          <div className="flex items-center mb-4 text-pmdd-soft">
            <Clock size={18} className="mr-2" /> <h3>Time Point 2 (Comparison)</h3>
          </div>
          <textarea
            className="w-full h-48 bg-[#0a0d12] border border-pmdd-accent/30 rounded-md p-4 text-white focus:outline-none focus:border-pmdd-accent transition-colors resize-none"
            placeholder="Enter the subsequent corpus here..."
            value={time2}
            onChange={(e) => setTime2(e.target.value)}
          />
        </div>
      </div>

      <div className="text-center mb-12">
        <button
          onClick={handleAnalyze}
          disabled={loading || !time1.trim() || !time2.trim()}
          className="bg-pmdd-accent hover:bg-pmdd-accent/90 text-white font-medium py-3 px-8 rounded-md transition-all shadow-[0_0_15px_rgba(100,255,218,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center"><Loader className="animate-spin mr-2" size={18} /> Calculating Drift...</span>
          ) : (
            <span className="flex items-center">Calculate Temporal Drift <ArrowRight className="ml-2" size={18} /></span>
          )}
        </button>
      </div>

      {results && (
        <div className="glass-panel p-8 bg-pmdd-dark/80 border border-pmdd-accent/50 animate-fade-in">
          <h3 className="text-2xl font-bold text-white mb-6 border-b border-pmdd-accent/30 pb-4">Longitudinal Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#12161b] p-6 rounded-lg border border-pmdd-accent/20">
              <p className="text-sm text-pmdd-neutral uppercase tracking-wider mb-2">KL Divergence Drift</p>
              <div className="text-4xl font-bold text-pmdd-accent font-mono">{results.longitudinal_metrics.kl_divergence_drift.toFixed(4)}</div>
            </div>
            <div className="bg-[#12161b] p-6 rounded-lg border border-pmdd-accent/20">
              <p className="text-sm text-pmdd-neutral uppercase tracking-wider mb-2">Drift Magnitude</p>
              <div className={`text-4xl font-bold ${results.longitudinal_metrics.drift_magnitude === 'High' ? 'text-red-400' : 'text-yellow-400'}`}>
                {results.longitudinal_metrics.drift_magnitude}
              </div>
            </div>
            <div className="bg-[#12161b] p-6 rounded-lg border border-pmdd-accent/20">
              <p className="text-sm text-pmdd-neutral uppercase tracking-wider mb-2">System Confidence</p>
              <div className="text-4xl font-bold text-green-400 font-mono">
                {results.time_2_report?.math_scores?.systemic_uncertainty_index !== undefined 
                  ? ((1 - results.time_2_report.math_scores.systemic_uncertainty_index) * 100).toFixed(1) + '%'
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg text-pmdd-soft mb-4">Time 1 Intent Distribution</h4>
              <pre className="bg-[#0a0d12] p-4 rounded text-sm text-pmdd-neutral font-mono overflow-x-auto">
                {JSON.stringify(results.longitudinal_metrics.speech_act_distribution_t1, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-lg text-pmdd-soft mb-4">Time 2 Intent Distribution</h4>
              <pre className="bg-[#0a0d12] p-4 rounded text-sm text-pmdd-neutral font-mono overflow-x-auto">
                {JSON.stringify(results.longitudinal_metrics.speech_act_distribution_t2, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LongitudinalDashboard;
