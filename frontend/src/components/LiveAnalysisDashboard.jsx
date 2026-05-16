import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Activity, Terminal } from 'lucide-react';
import axios from 'axios';
import { parseFile } from '../utils/fileParser';
import { motion, AnimatePresence } from 'framer-motion';

const terminalLines = [
  "Initializing PMDD Core Pipeline...",
  "AI Linguistic Observatory Activation Initiated...",
  "> Parsing semantic structures...",
  "> Computing pragmatic entropy...",
  "> Halliday SFL activated across node clusters...",
  "> Institutional rhetoric escalation detected...",
  "> Drift vector stabilized...",
  "> Synthesizing final deterministic thesis..."
];

const LiveTerminal = () => {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        setLines(prev => [...prev, terminalLines[currentLine]]);
        currentLine++;
      }
    }, 600); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#030712] border border-pmdd-accent/40 rounded-lg p-6 font-mono text-xs text-pmdd-accent h-56 overflow-y-auto text-left relative mt-6 shadow-[inset_0_0_50px_rgba(34,211,238,0.05)]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-sweep"></div>
      
      <div className="absolute top-4 right-6 text-white/40 flex items-center gap-3">
         <Terminal size={14}/> 
         <span className="tracking-widest opacity-80">OBSERVATORY TERMINAL</span>
      </div>
      
      {/* Waveform Scanner */}
      <div className="absolute top-12 right-6 flex items-end gap-1 h-6 opacity-30">
         {[...Array(12)].map((_, i) => (
           <motion.div key={i} animate={{height: [4, Math.random() * 24 + 4, 4]}} transition={{repeat: Infinity, duration: Math.random() * 0.5 + 0.5}} className="w-1 bg-cyan-400 rounded-t"></motion.div>
         ))}
      </div>

      <div className="flex flex-col gap-2 mt-8 text-[0.85rem] leading-relaxed relative z-10">
        {lines.map((line, i) => (
          <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} key={i} className="tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
            {line}
          </motion.div>
        ))}
        <motion.div animate={{opacity: [0, 1, 0]}} transition={{repeat: Infinity, duration: 1}} className="w-2 h-4 bg-pmdd-accent mt-2"></motion.div>
      </div>
    </div>
  );
};

const LiveAnalysisDashboard = React.memo(({ onResults, onAnalysisStart, onAnalysisError }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsingFile, setParsingFile] = useState(false);

  const handleFileUpload = useCallback(async (file) => {
    if (!file) return;
    setParsingFile(true);
    try {
      const extractedText = await parseFile(file);
      setText(extractedText);
    } catch (err) {
      setError(`File Processing Error`);
    } finally {
      setParsingFile(false);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    if (onAnalysisStart) onAnalysisStart();
    
    try {
      const isProd = import.meta.env.PROD;
      let apiUrl = isProd ? '' : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000');
      apiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const response = await axios.post(`${apiUrl}/api/analyze`, { text });
      
      // Extended delay for cinematic loading experience
      setTimeout(() => {
        onResults(response.data);
        setLoading(false);
      }, 5500);

    } catch (err) {
      setError("Diagnostic Server Unavailable");
      if (onAnalysisError) onAnalysisError();
      setLoading(false);
    }
  }, [text, onAnalysisStart, onResults, onAnalysisError]);

  return (
    <div className="ingestion-container relative z-10" style={{maxWidth: '1200px', margin: '0 auto', width: '100%'}}>
      <div className="glass-panel" style={{padding: '50px', background: 'rgba(13, 17, 23, 0.75)'}}>
        <div className="text-center font-mono text-cyan-400 text-sm tracking-[0.2em] uppercase mb-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          Computational Corpus Ingestion Lab
        </div>
        
        <textarea 
          className="corpus-input-area border-pmdd-accent/30 focus:border-cyan-400 transition-all duration-500" 
          placeholder="Paste longitudinal discourse text here to initialize semantic reasoning..." 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          disabled={loading || parsingFile}
        />
        
        {error && <div className="text-red-400 mt-4 text-center font-mono tracking-widest">{error}</div>}
        
        <AnimatePresence>
          {loading && (
             <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}>
               <LiveTerminal />
             </motion.div>
          )}
        </AnimatePresence>

        {!loading && (
          <button 
            className="btn-cinematic-run w-full mt-10 p-5 rounded-xl text-white font-bold tracking-widest text-lg flex items-center justify-center relative overflow-hidden group"
            onClick={handleAnalyze} 
            disabled={!text.trim()} 
          >
            {/* Base gradient and glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-pmdd-accent to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* White Sheen Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-sheen skew-x-12 translate-x-[-150%]"></div>
            {/* Pulse Ripple */}
            <div className="absolute inset-0 border border-cyan-300 rounded-xl animate-pulse-glow opacity-0 group-hover:opacity-100"></div>
            
            <Activity className="mr-3 relative z-10 text-cyan-200 group-hover:animate-spin-slow" size={24} /> 
            <span className="relative z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">RUN DETERMINISTIC ANALYSIS</span>
          </button>
        )}
      </div>
    </div>
  );
});

export default LiveAnalysisDashboard;
