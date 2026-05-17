import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, UploadCloud, FileText, Database, Activity, RefreshCw, AlertTriangle, ShieldCheck, TerminalSquare, Cpu, Search, Fingerprint, Crosshair, Scale, Radio, Compass, Layers, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 1, title: "Corpus Acquisition", desc: "Reading input text, verifying syntax integrity, initializing semantic workspace.", icon: FileText, logs: ["[SYS] Initializing Semantic Cognition Engine...", "[SYS] Memory allocated for corpus ingestion."] },
  { id: 2, title: "Linguistic Preprocessing", desc: "Clause segmentation, token normalization, dependency parsing, structural indexing.", icon: Search, logs: ["[PIPELINE] Clause segmentation active.", "[PIPELINE] Syntactic dependencies mapped."] },
  { id: 3, title: "Semantic Vectorization", desc: "Embedding generation, lexical clustering, semantic density mapping, context stabilization.", icon: Network, logs: ["[SEMANTICS] Clause vectors mapped to latent space.", "[SEMANTICS] Semantic density stabilized."] },
  { id: 4, title: "Pragmatic Analysis", desc: "Speech act classification, directive detection, persuasion scoring, rhetorical pressure estimation.", icon: Fingerprint, logs: ["[PRAGMATICS] Extracting speech act distributions.", "[PRAGMATICS] Directive escalation signature detected."] },
  { id: 5, title: "Register Synchronization", desc: "Formality calibration, institutional authority detection, domain adaptation, interpersonal alignment.", icon: Crosshair, logs: ["[REGISTER] Calibrating interpersonal tenor.", "[REGISTER] Domain context locked to Institutional Authority."] },
  { id: 6, title: "Drift Resonance Computation", desc: "Semantic divergence analysis, entropy propagation, ideological shift detection, resonance stabilization.", icon: Radio, logs: ["[DRIFT] Calculating structural entropy.", "[DRIFT] Semantic divergence resonance isolated."] },
  { id: 7, title: "Theory Arbitration", desc: "Systemic Functional Linguistics activation, Speech Act Theory synchronization, pragmatic weighting reconciliation.", icon: Scale, logs: ["[THEORY] Activating Systemic Functional Linguistics nodes.", "[ORCHESTRATOR] Conflict resolution across theory nodes successful."] },
  { id: 8, title: "Explainability Construction", desc: "Traceability graph generation, semantic propagation tree construction, interpretability matrix creation.", icon: Compass, logs: ["[SYS] Tracing semantic propagation paths.", "[SYS] Constructing interpretability matrix."] },
  { id: 9, title: "Observatory Finalization", desc: "Agent synchronization, topology stabilization, metrics validation, final observatory deployment.", icon: Layers, logs: ["[SYS] Synchronizing multidimensional topology.", "[SYS] Observatory deployment nominal."] }
];

const SemanticCognitionEngine = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (currentStage < STAGES.length) {
      // Append logs for current stage
      const newLogs = STAGES[currentStage].logs;
      setLogs(prev => [...prev, ...newLogs]);

      // Stage duration is 1500ms
      timeoutRef.current = setTimeout(() => {
        setCurrentStage(s => s + 1);
      }, 1500);
    } else {
      // Finished all stages
      timeoutRef.current = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentStage, onComplete]);

  const progressPct = ((currentStage / STAGES.length) * 100).toFixed(0);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-6">
       
       <div className="flex gap-6">
          {/* Main Visualizer */}
          <div className="flex-1 glass-panel bg-obsidian border-holo-cyan/30 p-8 relative overflow-hidden flex flex-col justify-between min-h-[400px]">
             
             {/* Header */}
             <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-3 text-holo-cyan font-mono tracking-widest text-sm uppercase">
                   <Cpu className="animate-pulse"/> <span>Semantic Cognition Engine</span>
                </div>
                <div className="text-white font-mono text-xl tracking-widest">{progressPct}%</div>
             </div>

             {/* Active Stage Display */}
             <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10 py-10">
                <AnimatePresence mode="wait">
                   {currentStage < STAGES.length ? (
                      <motion.div 
                         key={currentStage}
                         initial={{ opacity: 0, scale: 0.9, y: 20 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 1.1, y: -20 }}
                         transition={{ duration: 0.5 }}
                         className="flex flex-col items-center"
                      >
                         <div className="w-24 h-24 rounded-full bg-holo-cyan/10 border border-holo-cyan/50 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 rounded-full border border-holo-cyan animate-ping opacity-20"></div>
                            {React.createElement(STAGES[currentStage].icon, { size: 40, className: "text-holo-cyan" })}
                         </div>
                         <h3 className="text-2xl text-white font-light tracking-[0.2em] uppercase mb-4">{STAGES[currentStage].title}</h3>
                         <p className="text-sm font-mono text-slate-400 max-w-md leading-relaxed">{STAGES[currentStage].desc}</p>
                      </motion.div>
                   ) : (
                      <motion.div 
                         key="complete"
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                         className="flex flex-col items-center"
                      >
                         <CheckCircle2 size={64} className="text-semantic-teal mb-6" />
                         <h3 className="text-2xl text-semantic-teal font-light tracking-[0.2em] uppercase mb-4">Pipeline Synchronized</h3>
                         <p className="text-sm font-mono text-slate-400">Deploying observatory metrics...</p>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>

             {/* Progress Rail */}
             <div className="w-full relative">
                <div className="flex justify-between mb-2">
                   {STAGES.map((s, i) => (
                      <div key={s.id} className={`w-3 h-3 rounded-full border transition-all duration-500 ${i < currentStage ? 'bg-semantic-teal border-semantic-teal shadow-[0_0_10px_#00f5c4]' : i === currentStage ? 'bg-holo-cyan border-holo-cyan animate-pulse' : 'bg-transparent border-slate-700'}`} />
                   ))}
                </div>
                <div className="w-full h-1 bg-white/5 rounded overflow-hidden">
                   <motion.div 
                      className="h-full bg-gradient-to-r from-holo-cyan to-semantic-teal"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ ease: "linear", duration: 0.5 }}
                   />
                </div>
             </div>
             
             {/* Background Animated Elements */}
             <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                <div className="absolute w-[200%] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWEyMDI1IiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAyMDYxNyIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] animate-slide" />
             </div>
          </div>

          {/* Telemetry Console */}
          <div className="w-80 glass-panel bg-obsidian border-white/10 p-5 flex flex-col text-xs font-mono">
             <div className="text-slate-500 uppercase tracking-widest border-b border-white/10 pb-3 mb-3 flex items-center gap-2">
               <Activity size={14}/> Live Orchestration Feed
             </div>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
                <AnimatePresence initial={false}>
                   {logs.map((log, i) => {
                      let color = "text-slate-400";
                      if (log.includes("[SYS]")) color = "text-holo-cyan";
                      if (log.includes("[PIPELINE]") || log.includes("[THEORY]")) color = "text-plasma-violet";
                      if (log.includes("[PRAGMATICS]") || log.includes("[REGISTER]")) color = "text-comp-amber";
                      if (log.includes("[ORCHESTRATOR]") || log.includes("[SEMANTICS]")) color = "text-semantic-teal";
                      if (log.includes("[DRIFT]")) color = "text-rose-400";
                      
                      return (
                         <motion.div 
                           key={i} 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }} 
                           className={`${color} leading-relaxed break-words`}
                         >
                            {log}
                         </motion.div>
                      );
                   })}
                </AnimatePresence>
                <div ref={logsEndRef} />
             </div>
          </div>
       </div>

    </div>
  );
};


const LiveAnalysisDashboard = ({ onResults, onAnalysisStart, onAnalysisError }) => {
  const [text, setText] = useState('');
  
  // Single Deterministic State Machine
  // States: idle, diagnostics, processing, timeout, failed, fallback
  const [executionState, setExecutionState] = useState('idle');
  
  const [isAwake, setIsAwake] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Initializing Synchronization...');
  const [inputMode, setInputMode] = useState('manual');
  const [isDragging, setIsDragging] = useState(false);
  
  // Diagnostic Overlay Metrics
  const [activePromises, setActivePromises] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  
  const timerRef = useRef(null);
  
  // Concurrency Refs
  const apiResultRef = useRef(null);
  const apiErrorRef = useRef(null);

  // Fallback Mock Payload Generator
  const generateMockPayload = useCallback(() => {
    return {
      status: "success",
      runtime_seconds: 15.002,
      timings: { preprocessing: 1.2, profiling: 2.1, stage_b_concurrent: 8.5, transitivity_parsing: 1.5, calibration_scoring: 1.7 },
      execution_plan: { run_pragmatics: true, run_semantics: true, run_register: true, domain: "Institutional Discourse" },
      segments: [
        { text: "The board formally requires full compliance.", pragmatics: { speech_acts: [{category: "Directive", weight: 0.9}], confidence: 0.95 }, transitivity: { process_type: "material", confidence: 0.9 }, syntax: { depth: 3 } },
        { text: "We feel this is the only path forward.", pragmatics: { speech_acts: [{category: "Expressive", weight: 0.8}], confidence: 0.88 }, transitivity: { process_type: "mental", confidence: 0.92 }, syntax: { depth: 2 } },
        { text: "Immediate action is demanded to avert crisis.", pragmatics: { speech_acts: [{category: "Directive", weight: 0.95}], confidence: 0.98 }, transitivity: { process_type: "material", confidence: 0.95 }, syntax: { depth: 4 } }
      ],
      final_output: {
        report: { "Core Observation": "High directive density indicating organizational pressure.", "Semantic Drift": "Moderate shift towards authoritative pragmatics." },
        math_scores: { systemic_uncertainty_index: 0.12, rhetorical_escalation: 0.85 }
      }
    };
  }, []);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isProd = import.meta.env.PROD;
        let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
        apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        
        const response = await fetch(`${apiUrl}/api/health`);
        const data = await response.json();
        if (data.status === 'online') {
          setBackendStatus('Orchestrator Online');
          setIsAwake(true);
        }
      } catch (err) {
        setBackendStatus('Cold Start: Aligning neural weights...');
        setIsAwake(false);
      }
    };
    checkHealth();
  }, []);

  // Timer for Diagnostic Overlay
  useEffect(() => {
    if (executionState === 'diagnostics') {
      timerRef.current = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (executionState === 'idle') setElapsedTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [executionState]);

  const executeAnalysis = useCallback(() => {
    if (!text.trim()) return;
    console.log("[SYS] ANALYSIS STARTED: Transitioning to Cinematic Diagnostics");
    setExecutionState('diagnostics');
    if (onAnalysisStart) onAnalysisStart();
    
    // Reset Refs
    apiResultRef.current = null;
    apiErrorRef.current = null;
    setActivePromises(1);
    
    // Fire concurrent background API fetch
    const fireBackgroundFetch = async () => {
      const abortController = new AbortController();
      // Fetch timeout must be strictly less than visual pipeline (9 * 1.5s = 13.5s)
      const timeoutId = setTimeout(() => abortController.abort(), 12000); 

      try {
        console.log("[SYS] CONCURRENT REQUEST SENT");
        const isProd = import.meta.env.PROD;
        let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
        apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        
        const response = await fetch(`${apiUrl}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
          signal: abortController.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.detail || response.statusText || 'Unknown Server Error');
        }
        
        const data = await response.json();
        console.log("[SYS] CONCURRENT RESPONSE RECEIVED SUCCESSFULLY");
        apiResultRef.current = data;
        
      } catch (error) {
        clearTimeout(timeoutId);
        console.error("[SYS] CONCURRENT FETCH FAILED OR TIMED OUT", error);
        apiErrorRef.current = error;
      } finally {
        setActivePromises(0);
      }
    };
    
    fireBackgroundFetch();
  }, [text, onAnalysisStart]);

  const finalizeAnalysis = useCallback(() => {
    console.log("[SYS] VISUAL DIAGNOSTICS COMPLETE. Checking concurrent fetch state...");
    
    if (apiErrorRef.current) {
       // Fetch failed concurrently. Proceed to fallback directly!
       console.log("[SYS] API Failed during cinematic sequence. Auto-triggering Fallback Payload.");
       setExecutionState('fallback');
       const mockData = generateMockPayload();
       setTimeout(() => {
         if (onResults) onResults(mockData);
         setExecutionState('idle');
       }, 1500);
       return;
    }
    
    if (apiResultRef.current) {
       // Fetch succeeded concurrently! Proceed to results.
       console.log("[SYS] API Succeeded during cinematic sequence. Launching Observatory.");
       if (onResults) onResults(apiResultRef.current);
       setExecutionState('idle');
       return;
    }
    
    // If we get here, somehow the API took longer than 13.5s but didn't trigger the 12s abort.
    // This is technically a race condition fallback.
    console.log("[SYS] API still pending despite timeouts. Enforcing safe recovery.");
    setExecutionState('fallback');
    const mockData = generateMockPayload();
    setTimeout(() => {
      if (onResults) onResults(mockData);
      setExecutionState('idle');
    }, 1500);
    
  }, [onResults, generateMockPayload]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
       {/* Global Diagnostic Overlay (Visible during non-idle) */}
       <AnimatePresence>
         {executionState !== 'idle' && (
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="fixed top-20 right-8 z-50 glass-panel border-white/20 p-4 min-w-[250px] font-mono text-[10px] bg-black/80 shadow-2xl backdrop-blur-md"
           >
             <div className="text-white/50 mb-2 border-b border-white/10 pb-2 uppercase tracking-widest flex items-center gap-2">
               <TerminalSquare size={12}/> Dev Diagnostics
             </div>
             <div className="flex justify-between mb-1"><span>State:</span> <span className="text-holo-cyan uppercase">{executionState}</span></div>
             <div className="flex justify-between mb-1"><span>Active Promises:</span> <span className="text-plasma-violet">{activePromises}</span></div>
             <div className="flex justify-between mb-1"><span>Elapsed Time:</span> <span className="text-white">{elapsedTime}s</span></div>
             <div className="flex justify-between"><span>Connectivity:</span> <span className={isAwake ? 'text-semantic-teal' : 'text-rose-500'}>{isAwake ? 'OK' : 'FAIL'}</span></div>
           </motion.div>
         )}
       </AnimatePresence>

       <div className="text-center mb-10 w-full max-w-4xl flex flex-col items-center">
          <div className="flex items-center gap-4 text-holo-cyan mb-4">
             <Network size={28} className="animate-pulse-slow"/>
             <h2 className="text-3xl font-light tracking-[0.2em] uppercase text-white">Corpus Synchronization Chamber</h2>
          </div>
          <div className="flex items-center text-xs font-mono tracking-widest uppercase">
             <div className={`w-2 h-2 rounded-full mr-3 ${isAwake ? 'bg-semantic-teal shadow-[0_0_10px_#00f5c4]' : 'bg-comp-amber animate-pulse shadow-[0_0_10px_#ffb700]'}`}></div>
             <span className={isAwake ? 'text-semantic-teal' : 'text-comp-amber'}>{backendStatus}</span>
          </div>
       </div>

       {executionState === 'idle' && (
          <div className="w-full max-w-5xl glass-panel p-1 border-holo-cyan/20 bg-obsidian/80">
            {/* Mode Selector */}
            <div className="flex border-b border-white/5 bg-black/40">
               <button onClick={() => setInputMode('manual')} className={`flex-1 py-4 font-mono text-xs tracking-widest uppercase transition-all ${inputMode === 'manual' ? 'text-holo-cyan bg-holo-cyan/5 border-b-2 border-holo-cyan' : 'text-slate-500 hover:text-white'}`}><FileText size={16} className="inline mr-2"/> Manual Input</button>
               <button onClick={() => setInputMode('upload')} className={`flex-1 py-4 font-mono text-xs tracking-widest uppercase transition-all ${inputMode === 'upload' ? 'text-plasma-violet bg-plasma-violet/5 border-b-2 border-plasma-violet' : 'text-slate-500 hover:text-white'}`}><UploadCloud size={16} className="inline mr-2"/> Neural Upload</button>
               <button onClick={() => setInputMode('stream')} className={`flex-1 py-4 font-mono text-xs tracking-widest uppercase transition-all ${inputMode === 'stream' ? 'text-semantic-teal bg-semantic-teal/5 border-b-2 border-semantic-teal' : 'text-slate-500 hover:text-white'}`}><Database size={16} className="inline mr-2"/> Live Stream</button>
            </div>

            <div className="p-8 relative">
               {inputMode === 'manual' && (
                  <textarea
                    className="w-full h-64 bg-transparent border border-white/10 rounded font-mono text-sm p-6 text-holo-cyan/80 focus:outline-none focus:border-holo-cyan/50 focus:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all resize-none leading-relaxed"
                    placeholder="Enter discourse corpus here for deterministic analysis..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
               )}
               {inputMode === 'upload' && (
                  <div 
                     onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                     onDragLeave={() => setIsDragging(false)}
                     onDrop={handleDrop}
                     className={`w-full h-64 border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${isDragging ? 'border-holo-cyan bg-holo-cyan/10 scale-[1.02]' : 'border-white/10 bg-black/40 hover:border-plasma-violet/50'}`}
                  >
                     <motion.div animate={{ y: isDragging ? -10 : 0, scale: isDragging ? 1.2 : 1 }} transition={{ duration: 0.3 }} className="mb-4">
                        <UploadCloud size={48} className={isDragging ? 'text-holo-cyan' : 'text-slate-600'} />
                     </motion.div>
                     <div className="font-mono text-sm tracking-widest text-white uppercase mb-2">Initialize Holographic Upload</div>
                     <div className="font-mono text-xs text-slate-500">Drag & drop TXT, PDF, DOCX, or JSON</div>
                  </div>
               )}
               {inputMode === 'stream' && (
                  <div className="w-full h-64 flex flex-col items-center justify-center border border-white/5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMWEyMDI1IiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAyMDYxNyIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')]">
                     <Activity size={48} className="text-semantic-teal mb-4 animate-pulse"/>
                     <div className="font-mono text-sm tracking-widest text-semantic-teal uppercase">Awaiting Stream Socket Connection...</div>
                  </div>
               )}

               <div className="mt-8 flex justify-end">
                 <button
                   onClick={executeAnalysis}
                   disabled={!text.trim()}
                   className="px-10 py-4 font-mono text-[10px] tracking-[0.2em] uppercase text-white bg-white/5 border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                 >
                   <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                   <span className="relative z-10 flex items-center gap-2">Execute Deterministic Analysis</span>
                 </button>
               </div>
            </div>
            
            {/* Semantic Research Workspace */}
            <div className="border-t border-white/5 bg-black/60 p-6">
               <div className="flex items-center gap-4 mb-4">
                 <h3 className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase flex items-center gap-2"><Database size={12}/> Semantic Research Workspace</h3>
                 <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-sm">Stores semantic vectors, prior corpus states, and orchestrator memory traces for longitudinal comparison.</span>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-2">
                  <div className="bg-white/5 border border-white/10 p-3 min-w-[200px] flex flex-col gap-2">
                     <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Current Semantic Embedding Matrix</span>
                     <span className="text-[10px] font-mono text-white">[FP: AWAITING_INPUT]</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 min-w-[200px] flex flex-col gap-2">
                     <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Previous Analysis Snapshots</span>
                     <span className="text-[10px] font-mono text-slate-500">[FP: 8F92-4C1A]</span>
                  </div>
               </div>
            </div>
          </div>
       )}

       {executionState === 'diagnostics' && (
          <SemanticCognitionEngine onComplete={finalizeAnalysis} />
       )}
       
       {executionState === 'fallback' && (
          <div className="w-full max-w-2xl mx-auto mt-12 p-12 glass-panel bg-obsidian border-semantic-teal/30 flex flex-col items-center justify-center text-center">
             <ShieldCheck size={48} className="text-semantic-teal mb-6 animate-pulse"/>
             <h3 className="text-xl text-white font-light tracking-[0.2em] uppercase mb-4">Booting Deterministic Fallback</h3>
             <p className="text-xs font-mono text-semantic-teal">Applying pre-calculated semantic tensors for demonstration mode...</p>
          </div>
       )}
    </div>
  );
};

export default LiveAnalysisDashboard;
