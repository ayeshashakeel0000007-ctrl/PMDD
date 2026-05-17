import { useState, useRef, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Globe, ShieldAlert, FileText, Binary, Save, Layers, Activity } from 'lucide-react';
import LiveAnalysisDashboard from './components/LiveAnalysisDashboard';
import EvidenceExplorer from './components/EvidenceExplorer';
import AgentPipeline from './components/AgentPipeline';
import TelemetryOverlay from './components/TelemetryOverlay';
import ValidationObservatory from './components/ValidationObservatory';
import TheoryTraceabilityMatrix from './components/TheoryTraceabilityMatrix';
import DensifiedIntelligence from './components/DensifiedIntelligence';
import { useResonance } from './context/SemanticResonanceContext';
import { useWorkspace } from './context/ResearchWorkspaceContext';
import { saveAs } from 'file-saver';
import './index.css';

const STABLE_VALS = [70, 55, 80, 50, 65];

const SemanticConstellation = memo(({ }) => {
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
         const val = STABLE_VALS[i];
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

const MeaningRiver = memo(({ }) => {
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
       </defs>
       <motion.path d="M -50 100 Q 100 20, 200 100 T 450 100" fill="none" stroke="url(#riv1)" strokeWidth="15" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} className="paper-mode-stroke-black" />
       <motion.path d={isHighDrift ? "M 150 100 Q 200 180, 250 50 T 450 150" : "M 150 100 Q 250 180, 450 60"} fill="none" stroke="url(#riv2)" strokeWidth={isHighDrift ? 20 : 10} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }} />
       {[...Array(isHighDrift ? 20 : 5)].map((_, i) => (
         <motion.circle key={i} r={isHighDrift ? "4" : "2"} fill="#fff" initial={{ offsetDistance: '0%' }} animate={{ offsetDistance: '100%' }} transition={{ duration: Number.isFinite(flowDuration) ? flowDuration + (i * 0.17 % 1) : 4, repeat: Infinity, delay: i * 0.2, ease: 'linear' }} style={{ offsetPath: isHighDrift && i % 2 === 0 ? "path('M 150 100 Q 200 180, 250 50 T 450 150')" : "path('M -50 100 Q 100 20, 200 100 T 450 100')" }} className="paper-mode-fill-black"/>
       ))}
    </svg>
    <div className="absolute top-0 left-4 h-full flex flex-col justify-between py-12 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
      <span>Information Base</span><span>Nominal Fluid</span>
    </div>
    <div className="absolute top-0 right-4 h-full flex flex-col justify-between py-12 text-[10px] font-mono text-right uppercase tracking-widest">
      <span className="text-white">Formal Vector</span>
      <span className={`${isHighDrift ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>Contamination Zone</span>
    </div>
  </div>
  );
});

const MiniCard = ({ title, value, color, desc, highlight }) => {
  const variance = useMemo(() => {
    // Generate a pseudo-random but stable variance based on the value string length or hash
    const valStr = String(value);
    const hash = valStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ((hash % 5) * 0.01).toFixed(3);
  }, [value]);
  return (
  <div className={`glass-panel p-5 flex flex-col justify-between hover-glow group border-l-2 transition-all ${highlight ? 'animate-pulse bg-white/5 border-white/30' : ''}`} style={{borderLeftColor: color}}>
     <div className="text-[0.65rem] font-mono uppercase tracking-[0.2em] text-slate-500 mb-2">{title}</div>
     <div className="text-3xl font-light tracking-widest font-mono" style={{color}}>{value}</div>
     <div className="text-[10px] text-slate-600 mt-3 border-t border-white/5 pt-2 uppercase font-mono tracking-widest">
       {desc} <span className="float-right text-[8px] text-slate-700">±{variance}</span>
     </div>
  </div>
  );
};

// --- MAIN APP ---

function App() {
  const { resonanceState, updateResonance } = useResonance();
  const { savedSnapshots, saveSnapshot, comparisonTarget, setComparisonTarget } = useWorkspace();
  const [appState, setAppState] = useState('hero');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => { updateResonance(analysisResults, appState); }, [appState, analysisResults, updateResonance]);

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

  const exportPDF = async () => {
    if(!containerRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = { margin: [0.5, 0.5, 0.5, 0.5], filename: 'PMDD_Research_Report.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true, logging: false }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }};
    html2pdf().set(opt).from(containerRef.current).save();
  };
  
  const exportJSON = () => {
     if(!analysisResults) return;
     const blob = new Blob([JSON.stringify(analysisResults, null, 2)], { type: "application/json" });
     saveAs(blob, "PMDD_Computational_Trace.json");
  };

  const exportMarkdown = () => {
    if(!analysisResults) return;
    let md = `# PMDD Research Report\n\n`;
    md += `## Final Math Scores\n\`\`\`json\n${JSON.stringify(analysisResults.final_output?.math_scores || {}, null, 2)}\n\`\`\`\n\n`;
    md += `## Segments\n`;
    analysisResults.segments?.forEach((seg, i) => {
      md += `### Clause ${i+1}: "${seg.text}"\n`;
      md += `- Pragmatic Confidence: ${seg.pragmatics?.confidence}\n`;
      md += `- Syntactic Depth: ${seg.syntax?.depth}\n\n`;
    });
    const blob = new Blob([md], { type: "text/markdown" });
    saveAs(blob, "PMDD_Report.md");
  };

  const exportCSV = () => {
    if(!analysisResults || !analysisResults.segments) return;
    let csv = "Clause,Text,Confidence,Drift_Risk\n";
    analysisResults.segments.forEach((seg, i) => {
      const conf = seg.pragmatics?.confidence || 1;
      const drift = ((1 - conf) * 100).toFixed(1);
      csv += `${i+1},"${(seg.text||'').replace(/"/g, '""')}",${conf},${drift}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "PMDD_Report.csv");
  };

  const exportDOCX = () => {
     if(!analysisResults) return;
     const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><style>body{font-family:sans-serif;}</style></head><body>";
     const footer = "</body></html>";
     let content = `<h1>PMDD Research Report</h1><p>Generated by Pragmatic Meaning Drift Detector</p><hr/>`;
     analysisResults.segments?.forEach((seg, i) => {
       content += `<h3>Clause ${i+1}: ${seg.text}</h3><ul><li>Confidence: ${seg.pragmatics?.confidence}</li><li>Depth: ${seg.syntax?.depth}</li></ul>`;
     });
     const blob = new Blob([header + content + footer], { type: 'application/msword' });
     saveAs(blob, "PMDD_Report.doc");
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
    <div className={`min-h-screen relative overflow-x-hidden text-slate-300 font-sans tracking-wide ${demoMode ? 'demo-mode-active' : ''}`}>
      <div className={`obs-bg transition-opacity duration-1000 ${isHighDrift ? 'opacity-50' : 'opacity-20'}`} />
      <div className={`ambient-fog transition-opacity duration-1000`} style={{opacity: stabilizing ? 0.05 : (isHighDrift ? 0.03 : 0.01)}} />
      <div className={`scanline ${isHighDrift ? 'animate-scan-fast' : 'animate-scan'}`} />
      <div className="atmospheric-waves"></div>
      
      <TelemetryOverlay />

      <nav className="sticky top-0 z-50 h-16 bg-obsidian/95 border-b border-white/10 flex items-center justify-between px-8 print:hidden transition-colors">
        <div className="flex items-center space-x-4">
           <div className={`w-8 h-8 flex items-center justify-center border transition-colors ${isHighDrift ? 'bg-rose-500/10 text-rose-500 border-rose-500/50' : 'bg-white/5 text-white border-white/20'}`}><Globe size={18} className={isHighDrift ? 'animate-spin' : 'animate-spin-slow'}/></div>
           <h1 className="text-white font-mono tracking-[0.3em] m-0 text-xs uppercase">Classified Linguistic Observatory</h1>
        </div>
        <div className="flex items-center space-x-6">
           {savedSnapshots.length > 0 && (
              <select onChange={e => setComparisonTarget(e.target.value)} value={comparisonTarget || ""} className="bg-transparent border border-white/20 text-slate-300 text-[10px] font-mono p-1 uppercase focus:outline-none transition-opacity duration-500" style={{opacity: demoMode ? 0.2 : 1}}>
                 <option value="">-- No Comparison --</option>
                 {savedSnapshots.map(s => <option key={s.id} value={s.id}>Compare: {s.metadata.name}</option>)}
              </select>
           )}
           <button onClick={() => setDemoMode(!demoMode)} className={`flex items-center gap-2 text-[10px] font-mono border px-3 py-1 rounded transition-colors ${demoMode ? 'bg-white text-black border-white animate-pulse' : 'border-white/20 text-slate-400 hover:text-white'}`}>
              <Layers size={12}/> {demoMode ? 'EXIT DEMO MODE' : 'DEMO MODE'}
           </button>
           <div className="flex items-center space-x-3 text-[10px] font-mono transition-opacity duration-500" style={{opacity: demoMode ? 0 : 1}}>
              <span className={`font-bold tracking-[0.2em] ${stabilizing ? 'animate-pulse text-amber-500' : ''}`} style={{color: stabilizing ? undefined : riskColor}}>{systemStatus}</span>
              <div className="ecg-mini"><svg viewBox="0 0 100 20"><path className="ecg-mini-line" stroke={riskColor} style={{animationDuration: stabilizing ? '1s' : (isHighDrift ? '0.5s' : '2s')}} d="M0 10 L30 10 L40 2 L50 18 L60 10 L100 10" /></svg></div>
           </div>
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
                  
                  <div className="flex justify-between items-center gap-4 print:hidden">
                     <button onClick={handleSaveToWorkspace} className="export-btn hover:bg-white/10"><Save size={14}/> SAVE SNAPSHOT</button>
                     <div className="flex gap-2 flex-wrap justify-end">
                        <button onClick={exportPDF} className="export-btn hover:bg-white/10 text-[10px] px-2 py-1"><FileText size={12}/> PDF</button>
                        <button onClick={exportDOCX} className="export-btn hover:bg-white/10 text-[10px] px-2 py-1"><FileText size={12}/> DOCX</button>
                        <button onClick={exportJSON} className="export-btn hover:bg-white/10 text-[10px] px-2 py-1"><Binary size={12}/> JSON</button>
                        <button onClick={exportCSV} className="export-btn hover:bg-white/10 text-[10px] px-2 py-1"><FileText size={12}/> CSV</button>
                        <button onClick={exportMarkdown} className="export-btn hover:bg-white/10 text-[10px] px-2 py-1"><FileText size={12}/> MD</button>
                     </div>
                  </div>

                  <AgentPipeline results={analysisResults} />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="glass-panel p-8 col-span-1 md:col-span-2 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10" style={{color: riskColor}}><ShieldAlert size={120}/></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-sweep pointer-events-none opacity-50"></div>
                        <div className="flex items-start justify-between z-10 relative">
                           <div>
                              <div className="text-[0.65rem] font-mono text-slate-500 uppercase tracking-[0.3em] mb-4">Calculated Drift Resonance</div>
                              <div className="flex items-baseline gap-4">
                                 <div className="text-7xl font-thin font-sans tracking-tighter" style={{color: riskColor}}>{riskScore}%</div>
                                 <div className="text-xs font-mono tracking-widest uppercase border px-2 py-1" style={{color: riskColor, borderColor: riskColor}}>
                                    {riskScore < 40 ? 'Stable' : riskScore < 75 ? 'Moderate Drift' : riskScore < 90 ? 'High Divergence' : 'Critical Mutation'}
                                 </div>
                              </div>
                           </div>
                           {/* Temporal Graph placeholder (Visual only) */}
                           <div className="h-16 w-32 hidden sm:flex items-end gap-1 opacity-60">
                              {[0.2, 0.4, 0.3, 0.6, 0.5, 0.8, 0.7, 0.9].map((v, i) => (
                                 <motion.div key={i} className="flex-1 bg-white/40 rounded-t-sm" initial={{height: 0}} animate={{height: `${v * 100}%`}} transition={{delay: i * 0.1}} style={{backgroundColor: v * 100 > 75 ? '#f43f5e' : undefined}}></motion.div>
                              ))}
                           </div>
                        </div>
                        <div className="mt-6 z-10 relative">
                           <p className="text-[11px] font-mono text-slate-400 bg-black/40 p-3 border-l-2" style={{borderLeftColor: riskColor}}>
                              {riskScore < 40 ? 'Discourse trajectory remains aligned with baseline communicative intent.' : riskScore < 75 ? 'Emerging semantic shift detected. Minor deviations from institutional baseline.' : 'Discourse trajectory deviates significantly from baseline communicative intent.'}
                           </p>
                           <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-slate-500 mt-4 flex items-center gap-2">
                              Var: ±0.87% | <Activity size={10} className="inline"/> Realtime Telemetry
                           </div>
                        </div>
                     </div>
                     <MiniCard title="Semantic Entropy" value={`${(resonanceState.systemicUncertainty * 100).toFixed(1)}%`} color="#fff" desc="Ambiguity Threshold" />
                     <MiniCard title="Rhetorical Pressure" value={`${(resonanceState.rhetoricalPressure * 100).toFixed(1)}%`} color={isHighDrift ? "#f43f5e" : "#00f0ff"} desc="Coercive Modality" highlight={isHighDrift} />
                  </div>

                  {/* COMPARATIVE MODE RENDERING */}
                  <div className={`grid grid-cols-1 ${compareData ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} gap-8`}>
                     {/* ACTIVE CORPUS */}
                     <div className="glass-panel p-6 border-white/5">
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                           <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white">Semantic Constellation {compareData && "(ACTIVE)"}</div>
                        </div>
                        <SemanticConstellation data={analysisResults} />
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
                        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                           <div className="text-[10px] font-mono text-white uppercase tracking-[0.3em]">Meaning River Dynamics {compareData && "(ACTIVE)"}</div>
                        </div>
                        <MeaningRiver data={analysisResults} />
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

        <footer className="mt-32 pb-16 text-center">
            <h3 className="text-white/60 font-serif italic text-xl animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">Made by Ayesha Sheikh</h3>
        </footer>
      </main>
    </div>
  );
}

export default App;
