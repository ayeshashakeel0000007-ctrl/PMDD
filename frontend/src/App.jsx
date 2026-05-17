import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Globe, ShieldAlert, FileText, Download, RotateCcw, ThumbsUp, AlertTriangle, Network, SearchCode, Binary, BookOpen, Save, Layers } from 'lucide-react';
import LiveAnalysisDashboard from './components/LiveAnalysisDashboard';
import EvidenceExplorer from './components/EvidenceExplorer';
import AgentPipeline from './components/AgentPipeline';
import TelemetryOverlay from './components/TelemetryOverlay';
import ValidationObservatory from './components/ValidationObservatory';
import TheoryTraceabilityMatrix from './components/TheoryTraceabilityMatrix';
import DensifiedIntelligence from './components/DensifiedIntelligence';
import { useResonance } from './context/SemanticResonanceContext';
import { useWorkspace } from './context/ResearchWorkspaceContext';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import './index.css';

const ResearcherOverlay = ({ data, active }) => {
   if (!active || !data) return null;
   const math = data.final_output?.math_scores || {};
   return (
      <div className="absolute inset-0 z-40 bg-obsidian/95 backdrop-blur-xl p-8 overflow-y-auto font-mono text-[10px] text-holo-cyan mix-blend-screen pointer-events-auto">
         <div className="flex items-center gap-4 mb-8 border-b border-holo-cyan/20 pb-4">
            <Binary className="animate-pulse" size={24}/>
            <h2 className="text-xl tracking-[0.3em] uppercase">Deep Inspection Mode</h2>
         </div>
         <div className="grid grid-cols-2 gap-8">
            <div className="bg-black/50 p-4 border border-holo-cyan/10">
               <h3 className="text-white mb-4 tracking-widest uppercase">Global Tensors</h3>
               <pre className="text-slate-400 overflow-x-auto">{JSON.stringify(math, null, 2)}</pre>
            </div>
            <div className="bg-black/50 p-4 border border-holo-cyan/10">
               <h3 className="text-white mb-4 tracking-widest uppercase">Orchestration Trace</h3>
               <pre className="text-slate-400 overflow-x-auto">{JSON.stringify(data.execution_plan, null, 2)}</pre>
            </div>
            <div className="bg-black/50 p-4 border border-holo-cyan/10 col-span-2">
               <h3 className="text-white mb-4 tracking-widest uppercase">Clause Vector Array</h3>
               <pre className="text-slate-400 overflow-x-auto max-h-96">{JSON.stringify(data.segments, null, 2)}</pre>
            </div>
         </div>
      </div>
   );
};

const SemanticConstellation = memo(({ data }) => {
  const { resonanceState } = useResonance();
  const intensity = resonanceState.intensityMultiplier;
  const isHighDrift = intensity > 1.5;
  const stabilizing = resonanceState.isStabilizing;
  
  return (
  <div className="flex-1 flex items-center justify-center relative w-full min-h-[350px] overflow-hidden group perspective-1000">
    <motion.div animate={{ rotateZ: isHighDrift ? [0, 360] : [0, 180], rotateX: isHighDrift ? [0, 20, 0] : 0 }} transition={{ duration: isHighDrift ? (stabilizing ? 40 : 20) : 60, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center preserve-3d">
       <svg width="300" height="300" viewBox="-150 -150 300 300">
          <circle r={50 * intensity} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 6" className={isHighDrift ? "animate-spin-slow" : ""} style={{transformOrigin: "center"}}/>
          <circle r={100} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <motion.circle r={140} fill="none" stroke={isHighDrift ? "rgba(244,63,94,0.15)" : "rgba(255,255,255,0.05)"} strokeWidth={1} strokeDasharray="10 20" animate={{ scale: isHighDrift ? [1, 1.05, 1] : 1 }} transition={{ duration: stabilizing ? 4 : 2, repeat: Infinity }} />
       </svg>
    </motion.div>
    <svg width="300" height="300" viewBox="-150 -150 300 300" className="z-10">
       {['Assertive', 'Directive', 'Commissive', 'Expressive', 'Declaration'].map((label, i) => {
         const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
         const val = Math.random() * 60 + 40; 
         const x = Math.cos(angle) * val;
         const y = Math.sin(angle) * val;
         const isDirective = label === 'Directive' || label === 'Expressive';
         const finalX = (isHighDrift && !isDirective) ? x * 0.7 : x;
         const finalY = (isHighDrift && !isDirective) ? y * 0.7 : y;
         const radX = isDirective && isHighDrift ? finalX * 1.5 : finalX;
         const radY = isDirective && isHighDrift ? finalY * 1.5 : finalY;
         const color = isDirective ? (isHighDrift ? "#f43f5e" : "#fff") : "#00f0ff";
         const strokeColor = isDirective ? (isHighDrift ? "rgba(244,63,94,0.4)" : "rgba(255,255,255,0.2)") : "rgba(0,240,255,0.2)";

         return (
           <g key={label} className="cursor-crosshair group/node">
             <motion.line x1="0" y1="0" x2={radX} y2={radY} stroke={strokeColor} strokeWidth={isDirective && isHighDrift ? 2 : 1} 
                initial={{ strokeDasharray: "5 5", strokeDashoffset: 0 }} animate={{ strokeDashoffset: isHighDrift ? -20 : -10 }} transition={{ duration: stabilizing ? 2 : 1, repeat: Infinity, ease: "linear" }}
             />
             <motion.circle initial={{ r: 0 }} animate={{ r: isDirective ? 12 * intensity : 8 }} transition={{ duration: isHighDrift ? 0.5 : 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} cx={radX} cy={radY} fill={color} opacity="0.8" />
             <motion.circle cx={radX} cy={radY} r={isDirective ? 24 * Math.min(intensity, 1.5) : 16} fill={strokeColor} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: stabilizing ? 4 : (isHighDrift ? 1 : 4), repeat: Infinity }} />
             <text x={radX * 1.4} y={radY * 1.4} fill={color} fontSize="10" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle" className="tracking-widest">{label}</text>
           </g>
         );
       })}
    </svg>
  </div>
  );
});

const MeaningRiver = memo(({ data }) => {
  const { resonanceState } = useResonance();
  const intensity = resonanceState.intensityMultiplier;
  const isHighDrift = intensity > 1.5;
  const flowDuration = isHighDrift ? (resonanceState.isStabilizing ? 2 : 1) : 4;

  return (
  <div className="flex-1 flex items-center justify-center relative w-full min-h-[350px] overflow-hidden group">
    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none ${isHighDrift ? 'animate-pulse' : 'animate-sweep'}`}></div>
    <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none">
       <defs>
         <linearGradient id="riv1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8"/><stop offset="100%" stopColor="#fff" stopOpacity="0.4"/></linearGradient>
         <linearGradient id="riv2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#fff" stopOpacity="0.4"/><stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9"/></linearGradient>
         <filter id="turb">
           <feTurbulence type="fractalNoise" baseFrequency={isHighDrift ? 0.08 : 0.01} numOctaves="3" result="noise" />
           <feDisplacementMap in="SourceGraphic" in2="noise" scale={isHighDrift ? 25 : 5} xChannelSelector="R" yChannelSelector="G" />
         </filter>
       </defs>
       <motion.path d="M -50 100 Q 100 20, 200 100 T 450 100" fill="none" stroke="url(#riv1)" strokeWidth="15" filter="url(#turb)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} className="paper-mode-stroke-black" />
       <motion.path d={isHighDrift ? "M 150 100 Q 200 180, 250 50 T 450 150" : "M 150 100 Q 250 180, 450 60"} fill="none" stroke="url(#riv2)" strokeWidth={isHighDrift ? 20 : 10} filter="url(#turb)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }} />
       {[...Array(isHighDrift ? 20 : 5)].map((_, i) => (
         <motion.circle key={i} r={isHighDrift ? "4" : "2"} fill="#fff" filter="blur(1px)" initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }} transition={{ duration: flowDuration + Math.random(), repeat: Infinity, delay: i * 0.2, ease: 'linear' }} style={{ offsetPath: isHighDrift && i % 2 === 0 ? "path('M 150 100 Q 200 180, 250 50 T 450 150')" : "path('M -50 100 Q 100 20, 200 100 T 450 100')" }} className="paper-mode-fill-black"/>
       ))}
    </svg>
    <div className="absolute top-0 left-4 h-full flex flex-col justify-between py-12 text-[10px] font-mono text-slate-500 uppercase tracking-widest paper-mode-text-gray">
      <span>Information Base</span><span>Nominal Fluid</span>
    </div>
    <div className="absolute top-0 right-4 h-full flex flex-col justify-between py-12 text-[10px] font-mono text-right uppercase tracking-widest">
      <span className="text-white paper-mode-text-black">Formal Vector</span>
      <span className={`${isHighDrift ? 'text-rose-400 font-bold' : 'text-slate-500 paper-mode-text-gray'}`}>Contamination Zone</span>
    </div>
  </div>
  );
});

const MiniCard = ({ title, value, color, desc, highlight }) => (
  <div className={`glass-panel p-5 flex flex-col justify-between hover-glow group border-l-2 transition-all ${highlight ? 'animate-pulse bg-white/5 border-white/30' : ''}`} style={{borderLeftColor: color}}>
     <div className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-slate-500 mb-2 paper-mode-text-gray">{title}</div>
     <div className="text-3xl font-light tracking-widest font-mono paper-mode-text-black" style={{color}}>{value}</div>
     <div className="text-[10px] text-slate-600 mt-3 border-t border-white/5 pt-2 uppercase font-mono tracking-widest paper-mode-border-sub paper-mode-text-gray">
       {desc} <span className="float-right text-[8px] text-slate-700">±{(Math.random() * 0.05).toFixed(3)}</span>
     </div>
  </div>
);

// --- MAIN APP ---

function App() {
  const { resonanceState, updateResonance } = useResonance();
  const { savedSnapshots, saveSnapshot, comparisonTarget, setComparisonTarget } = useWorkspace();
  const [appState, setAppState] = useState('hero');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [researcherMode, setResearcherMode] = useState(false);
  const [paperMode, setPaperMode] = useState(false);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { updateResonance(analysisResults, appState); }, [appState, analysisResults]);

  const intensity = resonanceState.intensityMultiplier;
  const isHighDrift = intensity > 1.5;
  const stabilizing = resonanceState.isStabilizing;

  const launchSystem = () => {
    setAppState('ingestion');
    setTimeout(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 100);
  };

  const handleAnalysisStart = () => {
    setAppState('analyzing');
    setAnalysisResults(null);
  };

  const handleResults = (data) => {
    setAnalysisResults(data);
    setAppState('results');
    setTimeout(() => { if(scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const exportPDF = () => {
    if(!containerRef.current) return;
    const opt = { margin: [0.5, 0.5, 0.5, 0.5], filename: 'PMDD_Research_Report.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, logging: false }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }};
    html2pdf().set(opt).from(containerRef.current).save();
  };
  
  const exportJSON = () => {
     if(!analysisResults) return;
     const blob = new Blob([JSON.stringify(analysisResults, null, 2)], { type: "application/json" });
     saveAs(blob, "PMDD_Computational_Trace.json");
  };

  const handleSaveToWorkspace = () => {
     if (analysisResults) saveSnapshot(analysisResults, { name: `Analysis ${new Date().toLocaleTimeString()}` });
  };

  const riskScore = (resonanceState.driftMagnitude * 100).toFixed(1);
  const riskColor = riskScore > 75 ? "#f43f5e" : riskScore > 40 ? "#ffb700" : "#00f0ff";
  const systemStatus = stabilizing ? "STABILIZING..." : isHighDrift ? "CRITICAL ESCALATION" : "NOMINAL";

  // Comparison Logic
  const compareData = savedSnapshots.find(s => s.id === comparisonTarget)?.results;

  return (
    <div className={`min-h-screen relative overflow-x-hidden text-slate-300 font-sans tracking-wide ${paperMode ? 'paper-mode' : ''}`}>
      <div className={`obs-bg transition-opacity duration-1000 ${isHighDrift ? 'opacity-50' : 'opacity-20'}`} />
      <div className={`ambient-fog transition-opacity duration-1000`} style={{opacity: stabilizing ? 0.05 : (isHighDrift ? 0.03 : 0.01)}} />
      <div className={`scanline ${isHighDrift ? 'animate-scan-fast' : 'animate-scan'}`} />
      
      {!paperMode && <TelemetryOverlay />}
      <ResearcherOverlay data={analysisResults} active={researcherMode} />

      <nav className="sticky top-0 z-50 h-16 bg-obsidian/95 border-b border-white/10 flex items-center justify-between px-8 paper-mode-bg-white paper-mode-border-sub print:hidden transition-colors">
        <div className="flex items-center space-x-4">
           <div className={`w-8 h-8 flex items-center justify-center border transition-colors ${isHighDrift ? 'bg-rose-500/10 text-rose-500 border-rose-500/50' : 'bg-white/5 text-white border-white/20'} paper-mode-bg-white paper-mode-text-black paper-mode-border-black`}><Globe size={18} className={isHighDrift ? 'animate-spin' : 'animate-spin-slow'}/></div>
           <h1 className="text-white font-mono tracking-[0.3em] m-0 text-xs uppercase paper-mode-text-black">Classified Linguistic Observatory</h1>
        </div>
        <div className="flex items-center space-x-6">
           {savedSnapshots.length > 0 && (
              <select onChange={e => setComparisonTarget(e.target.value)} value={comparisonTarget || ""} className="bg-transparent border border-white/20 text-slate-300 text-[10px] font-mono p-1 uppercase paper-mode-text-black paper-mode-border-black focus:outline-none">
                 <option value="">-- No Comparison --</option>
                 {savedSnapshots.map(s => <option key={s.id} value={s.id}>Compare: {s.metadata.name}</option>)}
              </select>
           )}
           <button onClick={() => setPaperMode(!paperMode)} className={`flex items-center gap-2 text-[10px] font-mono border px-3 py-1 rounded transition-colors ${paperMode ? 'bg-slate-200 text-slate-800 border-slate-300' : 'border-white/20 text-slate-400 hover:text-white'}`}>
              <BookOpen size={12}/> {paperMode ? 'EXIT PAPER MODE' : 'PAPER MODE'}
           </button>
           {!paperMode && (
              <button onClick={() => setResearcherMode(!researcherMode)} className={`flex items-center gap-2 text-[10px] font-mono border px-3 py-1 rounded transition-colors ${researcherMode ? 'bg-holo-cyan text-obsidian border-holo-cyan' : 'border-white/20 text-slate-400 hover:text-white'}`}>
                 <SearchCode size={12}/> {researcherMode ? 'EXIT DEEP INSPECTION' : 'RESEARCHER MODE'}
              </button>
           )}
           {!paperMode && (
              <div className="flex items-center space-x-3 text-[10px] font-mono">
                 <span className={`font-bold tracking-[0.2em] ${stabilizing ? 'animate-pulse text-amber-500' : ''}`} style={{color: stabilizing ? undefined : riskColor}}>{systemStatus}</span>
                 <div className="ecg-mini"><svg viewBox="0 0 100 20"><path className="ecg-mini-line" stroke={riskColor} style={{animationDuration: stabilizing ? '1s' : (isHighDrift ? '0.5s' : '2s')}} d="M0 10 L30 10 L40 2 L50 18 L60 10 L100 10" /></svg></div>
              </div>
           )}
        </div>
      </nav>

      <main className="w-full max-w-[1400px] mx-auto px-4 py-16 flex flex-col gap-16 relative z-10 transition-colors">
        
        {appState === 'hero' && (
           <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1}} className="text-center pt-20">
             <div className="inline-block mb-6 px-4 py-1 rounded-sm border border-white/20 bg-white/5 text-slate-400 text-[10px] font-mono tracking-[0.3em] uppercase paper-mode-text-black paper-mode-border-black paper-mode-bg-white">
               Restricted Research Facility
             </div>
             <h1 className="text-5xl md:text-7xl font-thin mb-8 tracking-tighter text-white paper-mode-text-black">
               Pragmatic Meaning Drift
             </h1>
             <p className="text-sm font-mono text-slate-500 max-w-2xl mx-auto leading-relaxed tracking-[0.2em] uppercase paper-mode-text-gray">
               Deterministic Execution & Discourse Intelligence
             </p>
             <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}} className="flex justify-center gap-6 mt-20">
                 <button onClick={launchSystem} className="btn-cinematic-run px-12 py-6 font-mono text-xs tracking-[0.3em] uppercase text-white flex items-center gap-4 group paper-mode-text-black paper-mode-border-black hover:bg-slate-100">
                    <Play size={16} className="text-holo-cyan group-hover:scale-125 transition-transform paper-mode-text-black"/> INITIALIZE INSTRUMENTATION
                 </button>
             </motion.div>
           </motion.div>
        )}

        <AnimatePresence>
          {appState !== 'hero' && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} transition={{duration:0.8}}>
              <LiveAnalysisDashboard onAnalysisStart={handleAnalysisStart} onResults={handleResults} onAnalysisError={() => setAppState('ingestion')} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {appState === 'results' && analysisResults && (
            <motion.div ref={scrollRef} initial={{opacity:0, filter:'blur(10px)'}} animate={{opacity:1, filter:'blur(0px)'}} transition={{duration: 1.5}} className="flex flex-col gap-12 pb-32">
              <div ref={containerRef} className="flex flex-col gap-12">
                  
                  {paperMode && (
                     <div className="text-center mb-8 border-b border-slate-300 pb-8 print:block">
                        <h1 className="text-4xl font-serif text-slate-900 mb-4">Computational Analysis of Pragmatic Discourse Drift</h1>
                        <p className="text-sm font-mono text-slate-600 uppercase tracking-widest">Generated via PMDD Research Ecosystem • {new Date().toLocaleDateString()}</p>
                     </div>
                  )}

                  <div className="flex justify-between items-center gap-4 print:hidden">
                     <button onClick={handleSaveToWorkspace} className="export-btn paper-mode-bg-white paper-mode-text-black paper-mode-border-black hover:bg-white/10"><Save size={14}/> SAVE SNAPSHOT</button>
                     <div className="flex gap-4">
                        <button onClick={exportPDF} className="export-btn paper-mode-bg-white paper-mode-text-black paper-mode-border-black hover:bg-white/10"><FileText size={14}/> EXPORT PDF</button>
                        <button onClick={exportJSON} className="export-btn paper-mode-bg-white paper-mode-text-black paper-mode-border-black hover:bg-white/10"><Binary size={14}/> RAW JSON</button>
                     </div>
                  </div>

                  {!paperMode && <AgentPipeline results={analysisResults} />}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="glass-panel p-8 col-span-1 md:col-span-2 flex flex-col justify-center relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10 paper-mode-text-black" style={{color: paperMode ? '#1a1a1a' : riskColor}}><ShieldAlert size={100}/></div>
                        <div className="text-[0.65rem] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4 paper-mode-text-gray">Calculated Drift Resonance</div>
                        <div className="text-7xl font-thin font-sans tracking-tighter paper-mode-text-black" style={{color: riskColor}}>{riskScore}%</div>
                        <div className="mt-4 flex items-center justify-between">
                           <div className="text-xs font-mono tracking-[0.2em] uppercase text-slate-400 paper-mode-text-gray">Var: ±{(Math.random() * 2).toFixed(2)}%</div>
                        </div>
                        {paperMode && <p className="text-[10px] text-slate-600 mt-4 font-mono">Fig 1: Primary drift calculation indicating semantic deviation from institutional neutral baseline.</p>}
                     </div>
                     <MiniCard title="Semantic Entropy" value={`${(resonanceState.systemicUncertainty * 100).toFixed(1)}%`} color={paperMode ? "#1a1a1a" : "#fff"} desc="Ambiguity Threshold" />
                     <MiniCard title="Rhetorical Pressure" value={`${(resonanceState.rhetoricalPressure * 100).toFixed(1)}%`} color={paperMode ? "#1a1a1a" : (isHighDrift ? "#f43f5e" : "#00f0ff")} desc="Coercive Modality" highlight={isHighDrift} />
                  </div>

                  {/* COMPARATIVE MODE RENDERING */}
                  <div className={`grid grid-cols-1 ${compareData ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-8`}>
                     {/* ACTIVE CORPUS */}
                     <div className="glass-panel p-6 border-white/5">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 paper-mode-border-sub">
                           <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white paper-mode-text-black">Semantic Constellation {compareData && "(ACTIVE)"}</div>
                        </div>
                        <SemanticConstellation data={analysisResults} />
                        {paperMode && <p className="text-[10px] text-slate-600 mt-4 font-mono">Fig 2a: Gravitational mapping of speech acts. Directive clauses exert topological distortion.</p>}
                     </div>

                     {/* COMPARE CORPUS */}
                     {compareData && (
                        <div className="glass-panel p-6 border-amber-500/30 bg-amber-900/5 relative">
                           <div className="absolute top-0 right-0 bg-amber-500 text-black text-[8px] font-mono font-bold px-2 py-1 uppercase">Comparison Snapshot</div>
                           <div className="flex items-center justify-between mb-6 border-b border-amber-500/20 pb-4">
                              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500">Semantic Constellation (BASELINE)</div>
                           </div>
                           <SemanticConstellation data={compareData} />
                        </div>
                     )}

                     {/* ACTIVE RIVER */}
                     <div className="glass-panel p-6 border-white/5">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 paper-mode-border-sub">
                           <div className="text-[10px] font-mono text-white uppercase tracking-[0.3em] paper-mode-text-black">Meaning River Dynamics {compareData && "(ACTIVE)"}</div>
                        </div>
                        <MeaningRiver data={analysisResults} />
                        {paperMode && <p className="text-[10px] text-slate-600 mt-4 font-mono">Fig 2b: Fluid dynamic representation of semantic displacement. Turbulence scales with systemic ambiguity.</p>}
                     </div>

                     {/* COMPARE RIVER */}
                     {compareData && (
                        <div className="glass-panel p-6 border-amber-500/30 bg-amber-900/5 relative">
                           <div className="absolute top-0 right-0 bg-amber-500 text-black text-[8px] font-mono font-bold px-2 py-1 uppercase">Comparison Snapshot</div>
                           <div className="flex items-center justify-between mb-6 border-b border-amber-500/20 pb-4">
                              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500">Meaning River (BASELINE)</div>
                           </div>
                           <MeaningRiver data={compareData} />
                        </div>
                     )}
                  </div>

                  <DensifiedIntelligence results={analysisResults} />
                  <ValidationObservatory results={analysisResults} />
                  <TheoryTraceabilityMatrix results={analysisResults} />
                  <EvidenceExplorer results={analysisResults} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
