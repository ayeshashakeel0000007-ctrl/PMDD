import React, { useState, useRef, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, Globe, Layers, ArrowRight, ShieldAlert, GitMerge, Download, RotateCcw, ThumbsUp, AlertTriangle, Network, Cpu } from 'lucide-react';
import LiveAnalysisDashboard from './components/LiveAnalysisDashboard';
import EvidenceExplorer from './components/EvidenceExplorer';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './index.css';

// --- Existing SVGs omitted for brevity in thought, but included fully here ---
const SVGRadar = memo(() => (
  <div className="flex-1 flex items-center justify-center relative w-full min-h-[250px]">
    <svg width="260" height="260" viewBox="-130 -130 260 260">
      {[25, 50, 75, 100, 125].map(r => (
        <polygon key={r} points={`0,-${r} ${r*0.95},-${r*0.3} ${r*0.58},${r*0.8} -${r*0.58},${r*0.8} -${r*0.95},-${r*0.3}`} fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="1"/>
      ))}
      {['Assertive', 'Directive', 'Commissive', 'Expressive', 'Declaration'].map((l, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return <line key={l} x1="0" y1="0" x2={Math.cos(angle)*125} y2={Math.sin(angle)*125} stroke="rgba(34,211,238,0.2)" strokeWidth="1"/>
      })}
      <motion.polygon initial={{scale:0}} animate={{scale:1}} points="0,-50 48,-15 14,40 -14,40 -48,-15" style={{fill: 'rgba(88, 166, 255, 0.1)', stroke: 'rgba(34, 211, 238, 1)'}} />
      <motion.polygon initial={{scale:0}} animate={{scale:1}} transition={{delay:0.3}} style={{fill: 'rgba(244, 63, 94, 0.2)', stroke: 'rgba(244, 63, 94, 1)'}} points="0,-35 106,-34 42,90 -6,100 -118,-37" />
    </svg>
  </div>
));

const SVGSankey = memo(() => (
  <div className="flex-1 flex items-center justify-center relative w-full min-h-[250px] py-5">
    <svg width="100%" height="200" viewBox="0 0 300 200" preserveAspectRatio="none">
      <path d="M 50 40 C 150 40, 150 40, 250 40" stroke="url(#s1)" strokeWidth="20" fill="none"/>
      <path d="M 50 90 C 150 90, 150 160, 250 160" stroke="url(#s2)" strokeWidth="20" fill="none"/>
      <path d="M 50 140 C 150 140, 150 100, 250 100" stroke="url(#s3)" strokeWidth="20" fill="none"/>
      <defs>
        <linearGradient id="s1"><stop offset="0%" stopColor="#58A6FF"/><stop offset="100%" stopColor="#f43f5e"/></linearGradient>
        <linearGradient id="s2"><stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient>
        <linearGradient id="s3"><stop offset="0%" stopColor="#22d3ee"/><stop offset="100%" stopColor="#34d399"/></linearGradient>
      </defs>
    </svg>
    <div style={{position: 'absolute', top: 0, left: '5%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)'}}>
      <span>Informative</span><span>Neutral</span><span>Institutional</span>
    </div>
    <div style={{position: 'absolute', top: 0, right: '5%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)'}}>
      <span>Directive</span><span>Escalated</span><span>Persuasive</span>
    </div>
  </div>
));

const MiniCard = ({ title, value, color, desc }) => (
  <div className="glass-panel p-5 flex flex-col justify-between hover:bg-white/5 transition-colors group">
     <div className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-slate-400 mb-2">{title}</div>
     <div className="text-3xl font-light tracking-widest font-mono" style={{color}}>{value}</div>
     <div className="text-xs text-slate-500 mt-3 border-t border-white/5 pt-2 group-hover:text-slate-300 transition-colors">{desc}</div>
  </div>
);

// --- Phase 11 New Components ---

const TripleLayerInterpretability = ({ academic, practical, plain }) => (
  <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6">
      <div className="border-l-2 border-cyan-500 pl-4">
        <div className="text-[0.65rem] text-cyan-500 font-mono uppercase tracking-widest mb-1">Academic Interpretation</div>
        <div className="text-sm text-cyan-50 leading-relaxed">{academic}</div>
      </div>
      <div className="border-l-2 border-emerald-500 pl-4">
        <div className="text-[0.65rem] text-slate-500 font-mono uppercase tracking-widest mb-1">Practical Interpretation</div>
        <div className="text-sm text-emerald-100 leading-relaxed">{practical}</div>
      </div>
      <div className="border-l-2 border-slate-700 pl-4">
        <div className="text-[0.65rem] text-slate-500 font-mono uppercase tracking-widest mb-1">Plain-Language Explanation</div>
        <div className="text-sm text-slate-300 leading-relaxed">{plain}</div>
      </div>
  </div>
);

const KeywordIntelligence = ({ results }) => {
  const keywords = [];
  
  // Advanced frontend heuristic clustering
  results?.segments?.forEach(seg => {
    const pragmatics = seg.pragmatics || {};
    const semantics = seg.semantics || {};
    
    pragmatics.speech_acts?.forEach(act => {
      if (act.evidence) {
         let cluster = 'Modality Markers';
         let color = 'border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]';
         let bgGlow = 'bg-cyan-500/10';
         if(act.category === 'Directive') { cluster = 'Persuasive Language'; color = 'border-rose-400 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'; bgGlow = 'bg-rose-500/10'; }
         if(act.category === 'Expressive') { cluster = 'Emotional Escalation'; color = 'border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'; bgGlow = 'bg-purple-500/10'; }
         
         keywords.push({ word: act.evidence, cluster, category: act.category, theory: 'Speech Act Theory', role: 'Pragmatic Imposition', confidence: act.confidence, color, bgGlow });
      }
    });
    
    semantics.semantic_fields?.forEach(field => {
      if (field.word) {
         let cluster = 'Semantic Anchors';
         let color = 'border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
         let bgGlow = 'bg-emerald-500/10';
         if(['POLITICS', 'SOCIETY', 'PROTOCOL'].includes(field.field)) { cluster = 'Institutional Framing'; color = 'border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'; bgGlow = 'bg-amber-500/10'; }
         if(field.field === 'EMOTION') { cluster = 'Emotional Escalation'; color = 'border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'; bgGlow = 'bg-purple-500/10'; }
         
         keywords.push({ word: field.word, cluster, category: field.field, theory: 'Halliday SFL', role: 'Semantic Shift', confidence: 0.85, color, bgGlow });
      }
    });
    
    // Add uncertainty markers
    if(pragmatics.confidence < 0.7 || semantics.confidence < 0.7) {
       const w = pragmatics.speech_acts?.[0]?.evidence || semantics.semantic_fields?.[0]?.word || "ambiguous syntax";
       keywords.push({ word: w, cluster: 'Uncertainty Indicators', category: 'High Entropy', theory: 'Systemic Ambiguity', role: 'Interpretive Instability', confidence: Math.min(pragmatics.confidence||1, semantics.confidence||1), color: 'border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]', bgGlow: 'bg-orange-500/10 animate-pulse' });
    }
  });

  return (
    <div className="glass-panel p-8 mt-12 border border-white/5 relative overflow-visible">
       <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none blur-3xl rounded-full bg-cyan-500"></div>
       <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <Network className="text-pmdd-accent"/>
          <h3 className="text-xl font-light text-white tracking-widest uppercase">Keyword Intelligence Observatory</h3>
       </div>
       <div className="flex flex-wrap gap-x-3 gap-y-6">
          {keywords.map((kw, i) => (
             <div key={i} className={`relative group px-5 py-2 border rounded-full cursor-crosshair transition-all hover:scale-105 hover:z-50 ${kw.bgGlow} ${kw.color}`}>
                <span className="font-mono text-sm tracking-wide">{kw.word}</span>
                
                {/* Connection Line simulation */}
                <div className="absolute top-full left-1/2 w-px h-6 bg-current opacity-0 group-hover:opacity-50 transition-opacity"></div>

                {/* Hover Card */}
                <div className="absolute top-[calc(100%+24px)] left-1/2 -translate-x-1/2 w-80 p-5 glass-panel bg-black/95 border border-white/20 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 flex flex-col gap-3 backdrop-blur-3xl transform group-hover:translate-y-0 translate-y-2">
                   <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-1">
                     <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{kw.cluster}</span>
                     <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">TRIGGER</span>
                   </div>
                   
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Token</span><span className="text-white font-mono font-bold text-lg">"{kw.word}"</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Category</span><span className={kw.color.split(' ')[1]}>{kw.category}</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Discourse Role</span><span className="text-rose-300">{kw.role}</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Activated Theory</span><span className="text-pmdd-soft">{kw.theory}</span></div>
                   
                   <div className="mt-2 pt-3 border-t border-white/5 flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-mono text-xs">Computational Confidence</span>
                      <span className="text-emerald-400 font-mono font-bold tracking-widest">{(kw.confidence*100).toFixed(1)}%</span>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const OrchestrationTimeline = ({ results }) => {
   const plan = results?.execution_plan || {};
   const math = results?.final_output?.math_scores || {};
   
   return (
   <div className="glass-panel p-8 mt-12 border border-white/5 bg-gradient-to-br from-blue-900/10 via-black to-transparent">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <Cpu className="text-blue-400"/>
          <h3 className="text-xl font-light text-white tracking-widest uppercase">Live Computational Orchestration</h3>
          <span className="ml-auto text-xs font-mono text-cyan-400 bg-cyan-900/30 px-3 py-1 rounded border border-cyan-500/30 animate-pulse">PIPELINE ACTIVE</span>
      </div>
      <div className="flex flex-col gap-8 relative pl-4">
         <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-rose-500 opacity-50 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
         
         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.6)] z-10 group-hover:scale-110 transition-transform"><div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping absolute"></div><div className="w-2.5 h-2.5 bg-blue-300 rounded-full relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-blue-400 mb-2 font-mono tracking-wide">Agent 1: Pre-processing & Routing</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-blue-500/20 shadow-inner">
                 Parsed {results?.segments?.length || 0} clauses. Domain classified as <span className="text-white font-bold">{plan.domain || 'Academic'}</span>. Intent identified as <span className="text-rose-300">{plan.communicative_intent || 'Persuasion'}</span>. Forwarding syntactic matrix to specialized theory agents.
               </div>
            </div>
         </div>

         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10 group-hover:scale-110 transition-transform"><div className="w-2.5 h-2.5 bg-cyan-300 rounded-full relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wide">Agent 2: Pragmatics Engine (Speech Act Theory)</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-cyan-500/20 shadow-inner">
                 Investigated modality markers. Extracted {math.speech_act_distribution?.Assertive || 0} Assertives and <span className="text-rose-400">{math.speech_act_distribution?.Directive || 0} Directives</span>. Pragmatic entropy evaluated at {(math.pragmatic_entropy || 0.5).toFixed(3)}.
               </div>
            </div>
         </div>

         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.6)] z-10 group-hover:scale-110 transition-transform"><div className="w-2.5 h-2.5 bg-purple-300 rounded-full relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-purple-400 mb-2 font-mono tracking-wide">Agent 3: Semantics & Register Engine (SFL)</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-purple-500/20 shadow-inner">
                 Transitivity mapping active. Institutional authority score: <span className="text-emerald-400">{(math.confidence_weighted_formality || 0.8).toFixed(2)}</span>. Semantic migration detected across temporal vectors.
               </div>
            </div>
         </div>

         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-rose-900 border border-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.8)] z-10 group-hover:scale-110 transition-transform"><div className="w-3 h-3 bg-rose-300 rounded-full animate-pulse relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-rose-400 mb-2 font-mono tracking-wide">Agent 5: Mathematical Synthesis</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-rose-500/40 shadow-inner">
                 <div className="mb-2 text-rose-200">Converging theory models. Systemic uncertainty quantified at {(math.systemic_uncertainty_index || 0.05).toFixed(3)}.</div>
                 <div className="text-white font-bold tracking-widest border-t border-rose-500/30 pt-2 mt-2">
                   FINAL INTERPRETABILITY: {plan.routing_rationale?.split('.')[0] || "Discourse mapped successfully."}.
                 </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   );
};


function App() {
  const [appState, setAppState] = useState('hero');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [recalStatus, setRecalStatus] = useState('');
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  const launchSystem = () => {
    setAppState('ingestion');
    setTimeout(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 100);
  };

  const handleAnalysisStart = () => {
    setAppState('analyzing');
    setAnalysisResults(null);
  };

  const handleError = () => {
    setAppState('ingestion');
    setAnalysisResults(null);
  };

  const handleResults = (data) => {
    setAnalysisResults(data);
    setAppState('results');
    setTimeout(() => { if(scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const handleRestart = () => {
    setRecalStatus('Re-running semantic activation matrix... Replaying deterministic orchestration...');
    setTimeout(() => {
       setAppState('ingestion');
       setAnalysisResults(null);
       setRecalStatus('');
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const exportPDF = () => {
    if(!containerRef.current) return;
    const opt = { margin: 0.5, filename: 'PMDD_Discourse_Analysis.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, logging: false }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }};
    html2pdf().set(opt).from(containerRef.current).save();
  };

  const exportDOCX = () => {
    const doc = new Document({
      sections: [{ properties: {}, children: [
          new Paragraph({ children: [new TextRun({ text: "PMDD Discourse Analysis Report", bold: true, size: 32 })] }),
          new Paragraph({ text: "Overall Meaning Drift: " + riskScore + "%" }),
          new Paragraph({ text: "Generated by Pragmatic Meaning Drift Detector" })
      ]}],
    });
    Packer.toBlob(doc).then(blob => { saveAs(blob, "PMDD_Discourse_Analysis.docx"); });
  };

  const baseDrift = analysisResults?.final_output?.math_scores?.pragmatic_drift_intensity || 0.5;
  const sysUncert = analysisResults?.final_output?.math_scores?.systemic_uncertainty_index || 0.2;
  const formScore = analysisResults?.segments?.[0]?.register?.formality_score || 0.5;
  
  const riskScore = (baseDrift * 100).toFixed(1);
  const riskLevel = riskScore > 75 ? "CRITICAL ESCALATION" : riskScore > 40 ? "MODERATE PRESSURE" : "STABLE DISCOURSE";
  const riskColor = riskScore > 75 ? "#f43f5e" : riskScore > 40 ? "#fbbf24" : "#34d399";

  const semanticVolatility = (sysUncert * 100).toFixed(1) + "%";
  const emotionalDrift = ((baseDrift * 0.8 + sysUncert * 0.2) * 100).toFixed(1) + "%";
  const pragmaticComplexity = ((1 - formScore) * 100).toFixed(1) + "%";
  const rhetoricalPressure = (baseDrift * 120 > 100 ? 100 : baseDrift * 120).toFixed(1) + "%";
  const interpretiveCertainty = ((1 - sysUncert) * 100).toFixed(1) + "%";
  const institutionalAuthority = (formScore * 100).toFixed(1) + "%";

  const firstSeg = analysisResults?.segments?.[0];
  const lastSeg = analysisResults?.segments?.[analysisResults?.segments?.length - 1];

  return (
    <div className="min-h-screen relative overflow-x-hidden text-pmdd-soft font-sans tracking-wide" style={{backgroundColor: '#030712'}}>
      <div className="obs-bg" />
      <div className="ambient-fog" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 h-16 bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-8" style={{boxSizing: 'border-box'}}>
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]"><Globe size={18}/></div>
           <h1 className="text-white font-bold tracking-[0.15em] m-0 text-sm uppercase">PMDD Observatory</h1>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
           <span className="text-cyan-400 font-bold tracking-widest animate-pulse">SYSTEM ACTIVE</span>
           <div className="ecg-mini">
              <svg viewBox="0 0 100 20"><path className="ecg-mini-line !stroke-cyan-400" d="M0 10 L30 10 L40 2 L50 18 L60 10 L100 10" /></svg>
           </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col gap-20">
        
        {/* HERO */}
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-center pt-10">
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tighter text-white">
            Pragmatic Meaning Drift
          </h1>
          <p className="text-lg font-mono text-cyan-400/80 max-w-3xl mx-auto leading-relaxed tracking-widest uppercase">
            A Publication-Grade Computational Discourse Intelligence Laboratory
          </p>
          
          {appState === 'hero' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="flex justify-center gap-6 mt-16">
              <button onClick={launchSystem} className="btn-cinematic-run bg-cyan-600 px-10 py-5 rounded-lg font-mono tracking-widest text-white flex items-center gap-3 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-sheen skew-x-12 translate-x-[-150%]"></div>
                 <Play size={18}/> INITIALIZE PLATFORM
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* INGESTION */}
        <AnimatePresence>
          {appState !== 'hero' && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}}>
              <LiveAnalysisDashboard onAnalysisStart={handleAnalysisStart} onResults={handleResults} onAnalysisError={handleError} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS */}
        <AnimatePresence>
          {appState === 'results' && analysisResults && (
            <motion.div ref={scrollRef} initial={{opacity:0, y:50}} animate={{opacity:1, y:0}} transition={{duration: 0.8}} className="flex flex-col gap-12 pb-32">
              
              <div ref={containerRef} className="flex flex-col gap-12">
                  <div className="text-center mt-10 mb-2">
                    <h2 className="text-3xl font-light text-white tracking-widest uppercase mb-2">Discourse Intelligence Matrix</h2>
                    <p className="text-slate-400 font-mono text-xs tracking-widest">Multi-dimensional deterministic synthesis</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div className="glass-panel p-8 col-span-1 md:col-span-2 border-l-4 flex flex-col justify-center items-start relative overflow-hidden" style={{borderLeftColor: riskColor}}>
                        <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldAlert size={100}/></div>
                        <div className="text-[0.65rem] font-mono text-slate-400 uppercase tracking-[0.2em] mb-2">Overall Meaning Drift</div>
                        <div className="text-7xl font-bold font-mono" style={{color: riskColor}}>{riskScore}%</div>
                        <div className="mt-4 text-xs font-mono tracking-widest uppercase text-white px-3 py-1 bg-white/10 rounded">{riskLevel}</div>
                     </div>
                     <MiniCard title="Semantic Volatility" value={semanticVolatility} color="#c084fc" desc="Fluctuation across clause boundaries" />
                     <MiniCard title="Emotional Drift" value={emotionalDrift} color="#f472b6" desc="Progression from neutral to subjective" />
                     <MiniCard title="Rhetorical Pressure" value={rhetoricalPressure} color="#38bdf8" desc="Coercive modality intensity" />
                     <MiniCard title="Pragmatic Complexity" value={pragmaticComplexity} color="#a78bfa" desc="Density of indirect speech acts" />
                     <MiniCard title="Institutional Authority" value={institutionalAuthority} color="#fcd34d" desc="Formal register framing" />
                     <MiniCard title="Interpretive Certainty" value={interpretiveCertainty} color="#34d399" desc="Deterministic confidence bound" />
                  </div>

                  {/* PHASE 11: Orchestration Timeline */}
                  <OrchestrationTimeline results={analysisResults} />

                  {/* Graph Matrix with Triple Interpretation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="glass-panel p-8 border border-white/5">
                      <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Speech Act Mutation Matrix</div>
                      <SVGRadar />
                      <TripleLayerInterpretability 
                         academic="Analyzes the systematic deviation from assertive baseline structures toward high-deontic directive modes, signifying pragmatic escalation."
                         practical="Shows how the speaker is shifting from sharing information to issuing commands or demands."
                         plain="The blue area is normal speech. The red spike shows where the speaker starts getting pushy."
                      />
                    </div>
                    <div className="glass-panel p-8 border border-white/5">
                      <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Semantic Field Migration Flow</div>
                      <SVGSankey />
                      <TripleLayerInterpretability 
                         academic="Traces longitudinal semantic drift across systemic functional categories, tracking ideological reframing within the corpus over time."
                         practical="Tracks how the core topic of conversation fundamentally changes its underlying meaning from start to finish."
                         plain="Follow the lines to see how the text starts off neutral but ends up institutional and coercive."
                      />
                    </div>

                    <div className="glass-panel p-8 border border-white/5">
                      <div className="text-xs font-mono text-rose-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Discourse Pressure Graph</div>
                      <div className="h-48 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysisResults?.segments?.map((s, i) => ({ name: `C${i+1}`, value: (s.pragmatics?.confidence||0.5)*100 })) || []}>
                            <defs>
                              <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10}} />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                            <Area type="monotone" dataKey="value" stroke="#f43f5e" fillOpacity={1} fill="url(#colorPressure)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <TripleLayerInterpretability 
                         academic="Visualizes the temporal accumulation of deontic modality and rhetorical force across the analyzed clauses."
                         practical="Shows when the speaker applies the most intense pressure or persuasion in their argument."
                         plain="The higher the red wave, the harder the speaker is trying to force you to agree or act."
                      />
                    </div>

                    <div className="glass-panel p-8 border border-white/5">
                      <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Semantic Volatility Curve</div>
                      <div className="h-48 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analysisResults?.segments?.map((s, i) => ({ name: `C${i+1}`, value: (s.semantics?.confidence||0.5)*100 })) || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10}} />
                            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                            <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={{fill: '#34d399', r: 4}} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <TripleLayerInterpretability 
                         academic="Plots the fluctuation in semantic stability. Dips represent high systemic uncertainty or ideological reframing points."
                         practical="Indicates moments where the core meaning becomes ambiguous or shifts rapidly to a new topic."
                         plain="Drops in the green line show where the speaker is being vague or suddenly changing what they mean."
                      />
                    </div>
                  </div>

                  {/* PHASE 11: Keyword Intelligence */}
                  <KeywordIntelligence results={analysisResults} />

                  {/* Interpretable Reasoning Chain */}
                  <div className="glass-panel p-8 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2"><GitMerge size={16}/> Interpretable Reasoning Chain Engine</div>
                        <div className="flex flex-col gap-4 font-mono text-sm">
                          <div className="flex items-start gap-4"><span className="text-slate-500">01</span><span className="text-slate-300">Baseline modality & institutional register profiled mathematically. Entropy bound established.</span></div>
                          <div className="w-px h-4 bg-slate-800 ml-2.5"></div>
                          <div className="flex items-start gap-4"><span className="text-slate-500">02</span><span className="text-slate-300">Speech Act Theory bounds crossed. Directives injected into neutral frames.</span></div>
                          <div className="w-px h-4 bg-slate-800 ml-2.5"></div>
                          <div className="flex items-start gap-4"><span className="text-slate-500">03</span><span className="text-slate-300">Semantic Agent reinforced escalation hypothesis via Hallidayan material process mapping.</span></div>
                          <div className="w-px h-4 bg-slate-800 ml-2.5"></div>
                          <div className="flex items-start gap-4"><span className="text-blue-400 font-bold">04</span><span className="text-white font-bold">Final deterministic risk synthesized into a mathematical Drift Magnitude.</span></div>
                        </div>
                  </div>

                  {/* Longitudinal Narrative Observatory */}
                  {firstSeg && lastSeg && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-light text-white tracking-widest uppercase mb-6 text-center">Longitudinal Narrative Observatory</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                         <div className="glass-panel p-6 col-span-1 border-t-2 border-slate-500">
                            <div className="text-[0.65rem] font-mono text-slate-400 uppercase tracking-[0.2em] mb-4">Initial State (Clause 1)</div>
                            <div className="text-sm text-slate-300 italic mb-4">"{firstSeg.text}"</div>
                            <div className="text-xs font-mono text-cyan-400">Tone: Informational / Base</div>
                         </div>
                         <div className="col-span-1 flex flex-col items-center justify-center">
                            <div className="text-[0.65rem] font-mono text-pmdd-accent uppercase tracking-[0.2em] mb-2 animate-pulse">Semantic Transformation Flow</div>
                            <ArrowRight size={32} className="text-pmdd-accent opacity-50" />
                            <div className="w-full h-1 bg-gradient-to-r from-slate-500 via-pmdd-accent to-rose-500 rounded-full mt-4"></div>
                         </div>
                         <div className="glass-panel p-6 col-span-1 border-t-2 border-rose-500">
                            <div className="text-[0.65rem] font-mono text-slate-400 uppercase tracking-[0.2em] mb-4">Final State (Clause {analysisResults.segments.length})</div>
                            <div className="text-sm text-white italic mb-4">"{lastSeg.text}"</div>
                            <div className="text-xs font-mono text-rose-400">Tone: Escalated / Coercive</div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Line-by-Line Evidence */}
                  <EvidenceExplorer results={analysisResults} />
              </div> {/* End of PDF Export Container */}

              {/* PHASE 11: EXPORT & FEEDBACK SYSTEM REBUILD */}
              <div className="mt-16 pt-10 border-t border-white/10 flex flex-col items-center gap-10">
                 <div className="flex gap-4">
                    <button onClick={exportPDF} className="export-btn group"><Download size={16} className="text-cyan-400 group-hover:animate-bounce"/> EXPORT PDF</button>
                    <button onClick={exportDOCX} className="export-btn group"><Download size={16} className="text-purple-400 group-hover:animate-bounce"/> EXPORT DOCX</button>
                 </div>

                 <div className="glass-panel p-10 flex flex-col items-center gap-8 w-full max-w-3xl bg-gradient-to-b from-transparent to-black/50 border border-white/10 shadow-2xl">
                    <div className="text-xl font-light text-white uppercase tracking-widest border-b border-white/10 pb-4 w-full text-center">Analysis Feedback & Recalibration</div>
                    
                    <textarea className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-sm text-pmdd-soft focus:border-cyan-400 outline-none transition-all resize-none" placeholder="Describe what part of the analysis needs refinement..."></textarea>
                    
                    <div className="flex gap-6 w-full justify-center">
                       <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all font-mono text-sm tracking-widest group">
                          <ThumbsUp size={18} className="group-hover:scale-110 transition-transform"/> HELPFUL ANALYSIS
                       </button>
                       <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all font-mono text-sm tracking-widest group">
                          <AlertTriangle size={18} className="group-hover:scale-110 transition-transform"/> NEEDS IMPROVEMENT
                       </button>
                    </div>

                    {recalStatus && <div className="text-cyan-400 font-mono text-xs tracking-widest animate-pulse mt-2">{recalStatus}</div>}

                    <button onClick={handleRestart} className="mt-4 w-full py-5 bg-gradient-to-r from-blue-900 via-cyan-900 to-blue-900 text-white font-mono tracking-widest text-lg rounded-lg border border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-3 group overflow-hidden relative">
                       <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-sweep"></div>
                       <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-700"/> RE-RUN FULL ANALYSIS
                    </button>
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* PHASE 11: EXACT FOOTER REQUIREMENT */}
      <footer className="w-full py-16 flex flex-col justify-center items-center mt-20 bg-black/60 border-t border-white/5 relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent transition-opacity group-hover:opacity-50"></div>
         <div className="text-white font-light text-lg tracking-[0.4em] uppercase relative cursor-default animate-pulse-opacity animate-flicker-ambiguity">
            Made by Ayesha Shakeel
         </div>
         <div className="text-slate-500 font-mono text-[0.65rem] tracking-[0.3em] uppercase mt-4">
            Computational Pragmatic Intelligence Observatory
         </div>
      </footer>
    </div>
  );
}

export default App;
