import React, { useState, useMemo } from 'react';
import { Activity, Clock, ArrowRight, Loader, TrendingUp, AlertTriangle, ShieldCheck, Zap, Gauge, Thermometer, Flame, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import ReportGenerator from './ReportGenerator';

const TripleLayerInterpretability = ({ academic, practical, plain }) => (
  <div className="mt-6 flex flex-col gap-3 font-mono text-sm border-t border-white/10 pt-4">
    <div className="flex gap-4 p-3 bg-blue-900/10 rounded border border-blue-500/20"><div className="text-blue-400 font-bold w-24 shrink-0">ACADEMIC</div><div className="text-slate-300">{academic}</div></div>
    <div className="flex gap-4 p-3 bg-purple-900/10 rounded border border-purple-500/20"><div className="text-purple-400 font-bold w-24 shrink-0">PRACTICAL</div><div className="text-slate-300">{practical}</div></div>
    <div className="flex gap-4 p-3 bg-emerald-900/10 rounded border border-emerald-500/20"><div className="text-emerald-400 font-bold w-24 shrink-0">PLAIN</div><div className="text-slate-300">{plain}</div></div>
  </div>
);

const LongitudinalDashboard = React.memo(() => {
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
        
        const response = await axios.get(`${apiUrl}/health`);
        if (response.data.status === 'online') {
          setBackendStatus('Longitudinal Engine Ready');
          setIsAwake(true);
        }
      } catch (err) {
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
      
      const response = await axios.post(`${apiUrl}/api/analyze/longitudinal`, { time_1_text: time1, time_2_text: time2 });
      
      setResults(response.data);
      setBackendStatus('Longitudinal Engine Ready');
      setIsAwake(true);
    } catch (error) {
      setBackendStatus(`Error: ${error.message}`);
      setIsAwake(false);
    } finally {
      setLoading(false);
    }
  };

  const radarData = useMemo(() => {
    if (!results) return [];
    const t1 = results.longitudinal_metrics.speech_act_distribution_t1 || {};
    const t2 = results.longitudinal_metrics.speech_act_distribution_t2 || {};
    
    const allKeys = new Set([...Object.keys(t1), ...Object.keys(t2)]);
    return Array.from(allKeys).map(key => ({
      subject: key,
      'Time 1': t1[key] || 0,
      'Time 2': t2[key] || 0
    }));
  }, [results]);

  const transitivityRadarData = useMemo(() => {
    if (!results || !results.longitudinal_metrics.transitivity_distribution_t1) return [];
    const t1 = results.longitudinal_metrics.transitivity_distribution_t1 || {};
    const t2 = results.longitudinal_metrics.transitivity_distribution_t2 || {};
    
    const allKeys = new Set([...Object.keys(t1), ...Object.keys(t2)]);
    return Array.from(allKeys).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      'Time 1': t1[key] || 0,
      'Time 2': t2[key] || 0
    }));
  }, [results]);

  const derivedMetrics = useMemo(() => {
    if (!results) return null;
    const m = results.longitudinal_metrics;
    const t1 = m.speech_act_distribution_t1 || {};
    const t2 = m.speech_act_distribution_t2 || {};
    
    const clamp = (val, min, max) => isNaN(val) ? 0 : Math.min(Math.max(val, min), max);

    // Semantic Stability Gauge (bounded 0-1)
    const stability = clamp(1 - ((m.kl_divergence_drift || 0) * 1.5), 0, 1);
    
    // Escalation Thermometer
    const t1Exp = t1['Expressive'] || 0;
    const t2Exp = t2['Expressive'] || 0;
    const t1Dir = t1['Directive'] || 0;
    const t2Dir = t2['Directive'] || 0;
    const escalation = clamp((t2Exp + t2Dir) - (t1Exp + t1Dir), -100, 100);
    
    // Persuasion Intensity
    const t2Total = Object.values(t2).reduce((a, b) => a + b, 0) || 1;
    const persuasion = clamp(((t2['Directive'] || 0) + (t2['Assertive'] || 0)) / t2Total, 0, 1);

    // Narrative Logic for the Human Interpretation
    let shiftNarrative = "The discourse maintained its standard communicative parameters with minimal deviation.";
    let coreShift = "The underlying narrative structure remained consistent between Time 1 and Time 2.";
    let emotionalTransform = "Emotional levels and rhetorical intensity stayed relatively flat.";
    let riskOutlook = "Stable. The subject is communicating predictably within established bounds.";

    if ((m.kl_divergence_drift || 0) > 0.5) {
      coreShift = "The fundamental rhetorical framework has been aggressively restructured, indicating a hard pivot in strategy or worldview.";
      riskOutlook = "High Volatility. The communication patterns suggest unpredictability or impending crisis framing.";
      if (escalation > 0) shiftNarrative = "The discourse shifted significantly from institutional stability toward emotionally escalated crisis framing, indicating increased rhetorical polarization and reduced communicative restraint.";
      else shiftNarrative = "A severe semantic shift occurred, fundamentally altering the core narrative framework and rhetorical strategy without necessarily escalating emotional volatility.";
    } else if ((m.kl_divergence_drift || 0) > 0.2) {
      coreShift = "The underlying narrative emphasis drifted moderately, suggesting subtle repositioning.";
      riskOutlook = "Moderate. Watch for further escalation in subsequent discourse.";
      if (escalation > 0) shiftNarrative = "Moderate rhetorical escalation is present. The communication became more demanding or expressive over time.";
      else shiftNarrative = "The underlying meaning drifted moderately, suggesting a change in focus or persuasive strategy while maintaining similar emotional levels.";
    }

    if (escalation > 2) {
      emotionalTransform = "A severe spike in expressive and directive acts signifies the author is increasingly commanding and emotionally charged.";
    } else if (escalation > 0) {
      emotionalTransform = "A mild increase in emotional language or direct commands was detected.";
    } else if (escalation < 0) {
      emotionalTransform = "The discourse became more subdued, formal, or emotionally restrained over time.";
    }

    // Incorporate Transitivity into Human Interpretation
    const trans = m.transitivity_metrics || {};
    if (trans.material_aggression_index > 0.15) {
      coreShift += " The discourse shifted from relational/institutional framing toward material-transformative structures, indicating stronger persuasive pressure and action-oriented rhetoric.";
    } else if (trans.emotional_cognition_density > 0.3) {
      coreShift += " The communication became increasingly mental-reactive and emotionally evaluative, suggesting heightened affective engagement and ideological positioning.";
    } else if (trans.verbal_persuasion_pressure > 0.3) {
      coreShift += " There is a strong emergence of verbal-directive structures, amplifying persuasion pressure.";
    }

    const confidenceVal = results.time_2_report?.math_scores?.systemic_uncertainty_index !== undefined 
      ? (1 - results.time_2_report.math_scores.systemic_uncertainty_index) : 1;
      
    let aiConfidence = "PMDD has high confidence in these findings due to clear, dense pragmatic markers.";
    if (confidenceVal < 0.6) aiConfidence = "PMDD confidence is low. The text may be sparse, highly ambiguous, or evasive, forcing the agents to rely on broader semantic approximations.";
    else if (confidenceVal < 0.8) aiConfidence = "PMDD confidence is moderate. Some rhetorical markers were mixed or subtly contradictory.";

    return { stability, escalation, persuasion, shiftNarrative, coreShift, emotionalTransform, riskOutlook, aiConfidence, confidenceVal };
  }, [results]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-white mb-4 text-gradient flex items-center">
          <TrendingUp className="mr-4 text-pmdd-accent" size={36} /> Meaning Drift Intelligence
        </h2>
        <p className="text-pmdd-neutral text-lg mb-4">
          Compare discourse across two chronological points to measure Pragmatic Meaning Drift via KL Divergence.
        </p>
        <div className="flex items-center text-sm font-medium">
           <div className={`w-3 h-3 rounded-full mr-3 ${isAwake ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`}></div>
           <span className={isAwake ? 'text-emerald-400' : 'text-amber-500'}>{backendStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-panel p-8">
          <div className="flex items-center mb-6 text-pmdd-soft border-b border-white/5 pb-4">
            <Clock size={20} className="mr-3 text-pmdd-secondary" /> <h3 className="text-lg font-semibold tracking-wide">Time Point 1 (Baseline)</h3>
          </div>
          <textarea
            className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-xl p-5 text-pmdd-soft focus:outline-none focus:ring-2 focus:ring-pmdd-accent/50 transition-all resize-none font-mono text-sm leading-relaxed"
            placeholder="Enter the baseline corpus here..."
            value={time1}
            onChange={(e) => setTime1(e.target.value)}
          />
        </div>

        <div className="glass-panel p-8">
          <div className="flex items-center mb-6 text-pmdd-soft border-b border-white/5 pb-4">
            <Clock size={20} className="mr-3 text-pmdd-accent" /> <h3 className="text-lg font-semibold tracking-wide">Time Point 2 (Comparison)</h3>
          </div>
          <textarea
            className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-xl p-5 text-pmdd-soft focus:outline-none focus:ring-2 focus:ring-pmdd-accent/50 transition-all resize-none font-mono text-sm leading-relaxed"
            placeholder="Enter the subsequent corpus here..."
            value={time2}
            onChange={(e) => setTime2(e.target.value)}
          />
        </div>
      </div>

      <div className="text-center mb-16">
        <button
          onClick={handleAnalyze}
          disabled={loading || !time1.trim() || !time2.trim()}
          className="btn-primary w-full md:w-auto md:px-12 text-lg py-4"
        >
          {loading ? (
            <span className="flex items-center"><Loader className="animate-spin mr-3" size={24} /> Calculating Drift Topologies...</span>
          ) : (
            <span className="flex items-center">Calculate Temporal Drift <ArrowRight className="ml-3" size={24} /></span>
          )}
        </button>
      </div>

      {!results && !loading && (
        <div className="glass-panel p-16 flex flex-col items-center justify-center text-center border-dashed border-white/10">
          <Activity size={48} className="text-pmdd-neutral/30 mb-6" />
          <h3 className="text-2xl font-medium text-pmdd-soft mb-2">Awaiting Longitudinal Data</h3>
          <p className="text-pmdd-neutral max-w-lg">
            Input two chronological data sets above to visualize semantic transitions, rhetorical escalation, and KL divergence vectors.
          </p>
        </div>
      )}

      {results && (
        <>
          <div className="flex justify-end mb-4">
            <ReportGenerator elementId="longitudinal-export-content" filename="PMDD_Longitudinal_Report.pdf" />
          </div>
            <div id="longitudinal-export-content" className="glass-panel p-10 animate-fade-in border-t-4 border-t-pmdd-accent relative overflow-hidden">
              {/* Environmental Aesthetics */}
              <div className="animated-grid-bg"></div>
              <div className="semantic-particles"></div>
              <div className="orchestration-wave"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-pmdd-accent/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 export-page mb-16" data-appendix="Executive Summary">
                <h3 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center">
                  <ShieldCheck className="mr-3 text-emerald-400" size={32} /> Executive Linguistic Intelligence Summary
                </h3>
                
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 backdrop-blur-md mb-8">
                  <p className="text-xl text-pmdd-soft leading-relaxed font-medium">
                    <strong className="text-white font-bold mr-2">Top-Line Interpretation:</strong> 
                    {derivedMetrics.shiftNarrative}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden hover:bg-slate-800/80 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-pmdd-accent"></div>
                    <p className="text-sm text-pmdd-neutral uppercase tracking-wider mb-3">KL Divergence</p>
                    <div className="text-5xl font-bold text-pmdd-accent font-mono tracking-tighter">
                      {(results.longitudinal_metrics.kl_divergence_drift || 0).toFixed(4)}
                    </div>
                    <div className="mt-4 w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pmdd-accent to-rose-500 h-2 rounded-full" style={{ width: `${Math.min((results.longitudinal_metrics.kl_divergence_drift || 0) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/80 p-8 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden hover:bg-slate-800/80 transition-colors">
                    <div className={`absolute top-0 left-0 w-1 h-full ${results.longitudinal_metrics.drift_magnitude === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                    <p className="text-sm text-pmdd-neutral uppercase tracking-wider mb-3">Drift Magnitude</p>
                    <div className={`text-5xl font-bold tracking-tight flex items-center ${results.longitudinal_metrics.drift_magnitude === 'High' ? 'text-rose-400' : 'text-amber-400'}`}>
                      {results.longitudinal_metrics.drift_magnitude === 'High' && <AlertTriangle className="mr-3" size={32} />}
                      {results.longitudinal_metrics.drift_magnitude || 'Low'}
                    </div>
                  </div>
                  
                  <div className={`bg-slate-900/80 p-8 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden transition-colors ${derivedMetrics.confidenceVal < 0.6 ? 'opacity-80' : ''}`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${derivedMetrics.confidenceVal < 0.6 ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                    <p className="text-sm text-pmdd-neutral uppercase tracking-wider mb-3">System Confidence</p>
                    <div className={`text-5xl font-bold font-mono tracking-tighter ${derivedMetrics.confidenceVal < 0.6 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {(derivedMetrics.confidenceVal * 100).toFixed(1)}%
                    </div>
                    {derivedMetrics.confidenceVal < 0.6 && (
                      <p className="text-xs text-amber-500/80 mt-3 font-semibold uppercase tracking-wider">Caution: Low Certainty</p>
                    )}
                  </div>
                </div>

                {/* Transformation Story Engine */}
                <div className="mt-12 mb-8 bg-slate-900/60 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
                  <h4 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center">
                    <Activity className="mr-3 text-purple-400" size={28} /> Narrative Transformation Engine
                  </h4>
                  <div className="flex flex-col lg:flex-row items-stretch justify-between space-y-6 lg:space-y-0 lg:space-x-8">
                    
                    {/* Before Card */}
                    <div className="flex-1 bg-slate-800/50 p-6 rounded-xl border border-slate-700 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">Before (Time 1)</span>
                        <Scale size={20} className="text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-pmdd-soft text-lg italic leading-relaxed mb-4">"{time1.substring(0, 100)}{time1.length > 100 ? '...' : ''}"</p>
                      <div className="border-t border-slate-700 pt-4">
                        <div className="flex items-center text-sm text-pmdd-neutral mb-2"><div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div> Baseline State</div>
                        <div className="flex items-center text-sm text-pmdd-neutral"><div className="w-2 h-2 rounded-full bg-slate-500 mr-2"></div> Initial Rhetorical Posture</div>
                      </div>
                    </div>

                    {/* Animated Transition Arrow */}
                    <div className="flex flex-col items-center justify-center px-4 w-full lg:w-auto relative py-8 lg:py-0">
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-full lg:w-[150%] h-px bg-gradient-to-r from-transparent via-pmdd-accent to-transparent opacity-30"></div>
                       </div>
                       
                       <div className="relative z-10 w-32 h-16 flex items-center justify-center">
                         <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                            <defs>
                              <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                                <stop offset="100%" stopColor="#f43f5e" stopOpacity="1" />
                              </linearGradient>
                              <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                            </defs>
                            
                            <motion.path 
                              d="M10,25 Q50,5 90,25" 
                              fill="none" 
                              stroke="url(#arrowGrad)" 
                              strokeWidth="3"
                              strokeDasharray="100"
                              initial={{ strokeDashoffset: 100 }}
                              animate={{ strokeDashoffset: 0 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              filter="url(#glow)"
                            />
                            
                            <motion.polygon 
                              points="85,20 95,25 85,30" 
                              fill="#f43f5e"
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                            
                            <circle cx="10" cy="25" r="4" fill="#3b82f6" />
                         </svg>
                       </div>
                       <div className="mt-2 text-xs font-mono text-pmdd-accent bg-pmdd-accent/10 px-3 py-1.5 rounded border border-pmdd-accent/30 text-center whitespace-nowrap shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                         Semantic Shift<br/><span className="text-white font-bold">{(results.longitudinal_metrics.kl_divergence_drift || 0).toFixed(2)} KL</span>
                       </div>
                    </div>

                    {/* After Card */}
                    <div className="flex-1 bg-slate-800/50 p-6 rounded-xl border border-slate-700 relative overflow-hidden group shadow-[0_0_20px_rgba(244,63,94,0.05)]">
                      <div className={`absolute top-0 left-0 w-full h-1 ${derivedMetrics.escalation > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`${derivedMetrics.escalation > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'} text-xs font-bold px-3 py-1 rounded uppercase tracking-wider`}>After (Time 2)</span>
                        <Flame size={20} className={`${derivedMetrics.escalation > 0 ? 'text-rose-400' : 'text-emerald-400'} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      </div>
                      <p className="text-white text-lg italic leading-relaxed mb-4">"{time2.substring(0, 100)}{time2.length > 100 ? '...' : ''}"</p>
                      <div className="border-t border-slate-700 pt-4">
                        <div className={`flex items-center text-sm mb-2 ${derivedMetrics.escalation > 0 ? 'text-rose-200' : 'text-emerald-200'}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${derivedMetrics.escalation > 0 ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`}></div> 
                          {derivedMetrics.escalation > 0 ? 'Escalated / Persuasive' : 'De-escalated / Stable'}
                        </div>
                        <div className="flex items-center text-sm text-pmdd-soft"><div className="w-2 h-2 rounded-full bg-amber-400 mr-2"></div> {derivedMetrics.emotionalTransform.split('.')[0]}</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Recharts Visualizations */}
              <div className="relative z-10 export-page grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8 mb-12" data-appendix="Appendix E: Meaning Drift Intelligence">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-pmdd-soft mb-6 text-center uppercase tracking-wider">Rhetorical Escalation Radar</h4>
                    <div className="h-[350px] w-full min-h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b' }} />
                          <Radar name="Time 1 (Baseline)" dataKey="Time 1" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                          <Radar name="Time 2 (Comparison)" dataKey="Time 2" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} />
                          <Legend />
                          <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <TripleLayerInterpretability 
                     academic="Contrasts Speech Act distributions across temporal points, revealing structural drift from assertives to directives."
                     practical="Compares how the speaker's tone changed, particularly if they became more commanding."
                     plain="If the red shape is bigger on 'Directive', the speaker is giving more orders now than before."
                  />
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-pmdd-soft mb-6 text-center uppercase tracking-wider">Speech Act Distribution Shift</h4>
                    <div className="h-[350px] w-full min-h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={radarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#64748b' }} />
                          <RechartsTooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                          <Legend />
                          <Bar dataKey="Time 1" fill="#818cf8" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Time 2" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <TripleLayerInterpretability 
                     academic="Quantifies absolute frequency shifts in pragmatic force, isolating specific modality escalations."
                     practical="Shows exactly how many more intense words or commands were used over time."
                     plain="Red bars taller than purple bars mean the person is getting more aggressive in that area."
                  />
                </div>
              </div>

              {/* Hallidayan Transitivity Observatory */}
              {results.longitudinal_metrics.transitivity_metrics && (
                <div className="relative z-10 export-page mb-12" data-appendix="Appendix T: Hallidayan Transitivity Observatory">
                  <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center">
                    <Activity className="mr-3 text-purple-400" size={28} /> Hallidayan Transitivity Observatory
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-md">
                      <p className="text-xs text-pmdd-neutral uppercase tracking-wider mb-1">Material Aggression</p>
                      <div className="text-2xl font-bold text-rose-400">
                        {(results.longitudinal_metrics.transitivity_metrics.material_aggression_index > 0 ? "+" : "")}
                        {(results.longitudinal_metrics.transitivity_metrics.material_aggression_index * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-md">
                      <p className="text-xs text-pmdd-neutral uppercase tracking-wider mb-1">Inst. Formality</p>
                      <div className="text-2xl font-bold text-emerald-400">
                        {(results.longitudinal_metrics.transitivity_metrics.institutional_formality_score * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-md">
                      <p className="text-xs text-pmdd-neutral uppercase tracking-wider mb-1">Verbal Persuasion</p>
                      <div className="text-2xl font-bold text-purple-400">
                        {(results.longitudinal_metrics.transitivity_metrics.verbal_persuasion_pressure * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-xl border border-white/5 shadow-md">
                      <p className="text-xs text-pmdd-neutral uppercase tracking-wider mb-1">Emotional Cognition</p>
                      <div className="text-2xl font-bold text-indigo-400">
                        {(results.longitudinal_metrics.transitivity_metrics.emotional_cognition_density * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-pmdd-soft mb-6 text-center uppercase tracking-wider">Transitivity Process Shifts</h4>
                        <div className="h-[350px] w-full min-h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={transitivityRadarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                              <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                              <YAxis tick={{ fill: '#64748b' }} />
                              <RechartsTooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                              <Legend />
                              <Bar dataKey="Time 1" fill="#818cf8" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="Time 2" fill="#e879f9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <TripleLayerInterpretability 
                         academic="Maps longitudinal migration across Hallidayan transitivity structures, indicating ideological or agency-driven realignments."
                         practical="Shows if the speaker shifted from talking about ideas/relationships to focusing on actions or feelings."
                         plain="Measures what the speaker is focused on doing: acting, feeling, or explaining."
                      />
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-pmdd-soft mb-6 text-center uppercase tracking-wider">Hallidayan Radar Overlay</h4>
                        <div className="h-[350px] w-full min-h-[350px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={transitivityRadarData}>
                              <PolarGrid stroke="#334155" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b' }} />
                              <Radar name="Time 1" dataKey="Time 1" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                              <Radar name="Time 2" dataKey="Time 2" stroke="#e879f9" fill="#e879f9" fillOpacity={0.3} />
                              <Legend />
                              <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <TripleLayerInterpretability 
                         academic="Highlights systemic divergence in transitivity profiles, quantifying the shift in communicative agency and worldview."
                         practical="Provides a holistic shape comparison of the core meaning and approach to the topic."
                         plain="If the shapes don't match, the fundamental topic or meaning of the text has drifted."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Human Interpretability Engine */}
              {results.time_1_report && results.time_2_report && derivedMetrics && (
                <div className="relative z-10 export-page mt-16 bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden" data-appendix="Appendix F: What PMDD Concluded">
                  <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"></div>
                  
                  <div className="p-10 border-b border-white/5 bg-gradient-to-br from-indigo-900/30 to-transparent relative group">
                    <h4 className="text-3xl font-bold text-white flex items-center">
                      <Zap className="mr-4 text-purple-400" size={32} /> What PMDD Concluded
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                    {/* Core Discourse Shift */}
                    <div className="bg-slate-900/90 p-8 hover:bg-slate-800/90 transition-colors">
                      <h5 className="text-indigo-400 font-bold uppercase tracking-wider mb-3 text-sm flex items-center">
                        <Activity size={18} className="mr-2" /> Core Discourse Shift
                      </h5>
                      <p className="text-pmdd-soft leading-relaxed">{derivedMetrics.coreShift}</p>
                    </div>

                    {/* Emotional Transformation */}
                    <div className="bg-slate-900/90 p-8 hover:bg-slate-800/90 transition-colors">
                      <h5 className="text-rose-400 font-bold uppercase tracking-wider mb-3 text-sm flex items-center">
                        <Thermometer size={18} className="mr-2" /> Emotional Transformation
                      </h5>
                      <p className="text-pmdd-soft leading-relaxed">{derivedMetrics.emotionalTransform}</p>
                    </div>

                    {/* Persuasion Analysis */}
                    <div className="bg-slate-900/90 p-8 hover:bg-slate-800/90 transition-colors">
                      <h5 className="text-purple-400 font-bold uppercase tracking-wider mb-3 text-sm flex items-center">
                        <Scale size={18} className="mr-2" /> Persuasion Analysis
                      </h5>
                      <p className="text-pmdd-soft leading-relaxed">
                        Currently, {(derivedMetrics.persuasion * 100).toFixed(0)}% of the discourse is focused on directing others or firmly asserting truths, 
                        which indicates a {derivedMetrics.persuasion > 0.5 ? 'highly persuasive or demanding' : 'relatively passive or informative'} rhetorical stance.
                      </p>
                    </div>

                    {/* Risk Outlook */}
                    <div className="bg-slate-900/90 p-8 hover:bg-slate-800/90 transition-colors">
                      <h5 className={`${derivedMetrics.riskOutlook.includes('High') ? 'text-rose-500' : 'text-amber-400'} font-bold uppercase tracking-wider mb-3 text-sm flex items-center`}>
                        <Flame size={18} className="mr-2" /> Communication Risk Outlook
                      </h5>
                      <p className="text-pmdd-soft leading-relaxed">{derivedMetrics.riskOutlook}</p>
                    </div>

                    {/* Institutional Stability */}
                    <div className="bg-slate-900/90 p-8 hover:bg-slate-800/90 transition-colors">
                      <h5 className="text-emerald-400 font-bold uppercase tracking-wider mb-3 text-sm flex items-center">
                        <Gauge size={18} className="mr-2" /> Institutional Stability
                      </h5>
                      <p className="text-pmdd-soft leading-relaxed">
                        Semantic stability is preserved at {(derivedMetrics.stability * 100).toFixed(0)}%. 
                        {derivedMetrics.stability > 0.7 ? ' The text aligns well with institutional or structured communication norms.' : ' The text exhibits structural volatility, breaking away from standard institutional patterns.'}
                      </p>
                    </div>

                    {/* AI Confidence Commentary */}
                    <div className="bg-slate-900/90 p-8 hover:bg-slate-800/90 transition-colors">
                      <h5 className="text-pmdd-neutral font-bold uppercase tracking-wider mb-3 text-sm flex items-center">
                        <ShieldCheck size={18} className="mr-2" /> AI Confidence Commentary
                      </h5>
                      <p className="text-pmdd-soft leading-relaxed">{derivedMetrics.aiConfidence}</p>
                    </div>
                  </div>
                  
                  <div className="relative p-10 pt-16 bg-slate-900">
                    {/* Connection Line */}
                    <div className="absolute left-[50%] top-8 bottom-8 w-1.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-rose-500/50 -translate-x-1/2 hidden md:block rounded-full"></div>
                    
                    <div className="space-y-16">
                      {/* Time 1 */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col md:flex-row items-center justify-between w-full relative z-10"
                      >
                        <div className="md:w-[45%] bg-slate-800/80 p-8 rounded-2xl border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:border-indigo-400/50 transition-colors">
                          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm flex items-center"><Clock size={16} className="mr-2"/> Time 1 Baseline</span>
                            <span className="text-xs font-mono text-pmdd-neutral bg-slate-900 px-3 py-1 rounded-lg">Formality: {(results.time_1_report.math_scores.confidence_weighted_formality * 10).toFixed(1)}</span>
                          </div>
                          <p className="text-pmdd-soft text-base italic leading-relaxed">"{results.time_1_report.report.simple_explanation.split('.')[0]}."</p>
                        </div>
                        <div className="hidden md:flex w-14 h-14 rounded-full bg-slate-900 border-4 border-indigo-500 items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)] font-black text-xl z-20">
                          1
                        </div>
                        <div className="md:w-[45%] hidden md:block"></div>
                      </motion.div>

                      {/* Drift Arrow */}
                      <div className="flex flex-col items-center justify-center w-full py-4 text-purple-400/80 relative z-20">
                        <ArrowRight size={32} className="rotate-90 md:rotate-0 mb-3 md:mb-0" />
                        <span className="text-xs font-mono tracking-widest uppercase bg-purple-900/40 px-4 py-1.5 rounded-full border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)] font-bold text-purple-200">
                          {results.longitudinal_metrics.drift_magnitude} Drift Vector Detected
                        </span>
                      </div>

                      {/* Time 2 */}
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col md:flex-row items-center justify-between w-full relative z-10"
                      >
                        <div className="md:w-[45%] hidden md:block"></div>
                        <div className="hidden md:flex w-14 h-14 rounded-full bg-slate-900 border-4 border-rose-500 items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] font-black text-xl z-20">
                          2
                        </div>
                        <div className="md:w-[45%] bg-slate-800/80 p-8 rounded-2xl border border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)] hover:border-rose-400/50 transition-colors">
                          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                            <span className="text-rose-400 font-bold uppercase tracking-widest text-sm flex items-center"><Clock size={16} className="mr-2"/> Time 2 Escalation</span>
                            <span className="text-xs font-mono text-pmdd-neutral bg-slate-900 px-3 py-1 rounded-lg">Formality: {(results.time_2_report.math_scores.confidence_weighted_formality * 10).toFixed(1)}</span>
                          </div>
                          <p className="text-pmdd-soft text-base italic leading-relaxed">"{results.time_2_report.report.simple_explanation.split('.')[0]}."</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </>
      )}
    </div>
  );
});

export default LongitudinalDashboard;
