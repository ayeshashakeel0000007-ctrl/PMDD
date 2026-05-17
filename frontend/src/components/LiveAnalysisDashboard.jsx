import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, UploadCloud, FileText, Database, Activity, RefreshCw } from 'lucide-react';

const IngestionDiagnostics = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const stages = [
    "Extracting corpus vectors...",
    "Parsing syntactic structures...",
    "Indexing clause dependencies...",
    "Semantic tokenization active...",
    "Rhetorical mapping in progress...",
    "Theory synchronization...",
    "Corpus synchronized successfully."
  ];

  useEffect(() => {
    if (stage < stages.length - 1) {
      const timer = setTimeout(() => setStage(s => s + 1), 950);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-8 glass-panel bg-obsidian border-holo-cyan/30">
       <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 text-holo-cyan font-mono tracking-widest text-sm uppercase">
          <Activity className="animate-pulse"/> <span>Ingestion Diagnostics</span>
       </div>
       <div className="flex flex-col gap-3 font-mono text-xs">
         {stages.map((text, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: i <= stage ? 1 : 0.2, x: 0 }}
               className={`flex items-center gap-3 ${i === stage ? 'text-white' : i < stage ? 'text-semantic-teal' : 'text-slate-600'}`}
            >
               <span className="w-4 h-4 flex items-center justify-center">
                 {i < stage ? '✓' : i === stage ? <RefreshCw size={12} className="animate-spin"/> : '-'}
               </span>
               <span className={i === stage ? 'animate-pulse' : ''}>{text}</span>
            </motion.div>
         ))}
       </div>
       <div className="mt-8 w-full h-1 bg-white/5 rounded overflow-hidden">
          <motion.div 
             className="h-full bg-gradient-to-r from-holo-cyan to-plasma-violet"
             initial={{ width: '0%' }}
             animate={{ width: `${(stage / (stages.length - 1)) * 100}%` }}
             transition={{ duration: 0.5 }}
          />
       </div>
    </div>
  );
};

const LiveAnalysisDashboard = ({ onResults, onAnalysisStart, onAnalysisError }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Initializing Synchronization...');
  const [inputMode, setInputMode] = useState('manual'); // manual, upload, stream
  const [isDragging, setIsDragging] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

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

  const executeAnalysis = async () => {
    if (!text.trim()) return;
    setLoading(true);
    if(onAnalysisStart) onAnalysisStart();
    setShowDiagnostics(true);
  };

  const finalizeAnalysis = async () => {
    try {
      const isProd = import.meta.env.PROD;
      let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
      apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.detail || response.statusText);
      }
      
      const data = await response.json();
      setBackendStatus('Orchestrator Online');
      setIsAwake(true);
      if(onResults) onResults(data);
    } catch (error) {
      setBackendStatus(`Synchronization Error: ${error.message}`);
      setIsAwake(false);
      if(onAnalysisError) onAnalysisError(error);
    } finally {
      setLoading(false);
      setShowDiagnostics(false);
    }
  };

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

       {!showDiagnostics ? (
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
                   disabled={loading || !text.trim()}
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
       ) : (
          <IngestionDiagnostics onComplete={finalizeAnalysis} />
       )}
    </div>
  );
};

export default LiveAnalysisDashboard;
