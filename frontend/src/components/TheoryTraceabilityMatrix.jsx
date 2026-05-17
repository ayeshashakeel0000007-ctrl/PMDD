import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Fingerprint, Search, Info } from 'lucide-react';

const TheoryTraceabilityMatrix = ({ results }) => {
  const [activeTheory, setActiveTheory] = useState(null);

  if (!results || !results.segments) return null;

  // Extract activated theories
  const theoryMap = {
     "Speech Act Theory (Searle/Austin)": { 
        desc: "Analyzes performative utterance mechanics. Triggers on coercive modality.",
        hits: [] 
     },
     "Systemic Functional Linguistics (Halliday)": { 
        desc: "Maps ideational and interpersonal meta-functions.",
        hits: [] 
     },
     "Register Inference (Biber)": { 
        desc: "Calculates formal vs informal institutional weight.",
        hits: [] 
     },
     "Gricean Pragmatics": { 
        desc: "Detects conversational implicature and maxim violations.",
        hits: [] 
     }
  };

  results.segments.forEach((seg, idx) => {
     if (seg.pragmatics?.speech_acts?.length > 0) {
        theoryMap["Speech Act Theory (Searle/Austin)"].hits.push({ idx, conf: seg.pragmatics.confidence, text: seg.text });
     }
     if (seg.semantics?.semantic_fields?.length > 0) {
        theoryMap["Systemic Functional Linguistics (Halliday)"].hits.push({ idx, conf: 0.85, text: seg.text });
     }
     if (seg.register?.formality_score !== undefined) {
        theoryMap["Register Inference (Biber)"].hits.push({ idx, conf: 1.0, text: seg.text });
     }
     if (seg.pragmatics?.confidence < 0.7) {
        // Assume low confidence implies implicature / hidden meaning
        theoryMap["Gricean Pragmatics"].hits.push({ idx, conf: seg.pragmatics.confidence, text: seg.text });
     }
  });

  return (
    <div className="glass-panel p-8 border border-white/5 relative overflow-hidden mt-8 paper-mode-border">
       <div className="absolute top-0 right-0 p-8 opacity-5"><Network size={150}/></div>
       
       <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4 paper-mode-border-sub relative z-10">
          <Fingerprint size={20} className="text-holo-cyan paper-mode-text-black"/>
          <h3 className="text-lg font-light text-white tracking-[0.2em] uppercase paper-mode-text-black">Theory Traceability Engine</h3>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          <div className="flex flex-col gap-3">
             <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2 paper-mode-text-gray">Activated Reasoning Modules</div>
             {Object.keys(theoryMap).map(theory => (
                <button 
                   key={theory}
                   onClick={() => setActiveTheory(activeTheory === theory ? null : theory)}
                   className={`text-left px-4 py-3 border font-mono text-[10px] uppercase tracking-widest transition-all ${activeTheory === theory ? 'bg-holo-cyan/10 border-holo-cyan text-white paper-mode-bg-white paper-mode-border-black paper-mode-text-black' : 'bg-black/50 border-white/10 text-slate-400 hover:text-white paper-mode-bg-white paper-mode-border-sub paper-mode-text-gray hover:paper-mode-text-black'}`}
                >
                   <div className="flex justify-between items-center">
                      <span>{theory}</span>
                      <span className="text-[8px] px-2 py-0.5 bg-white/5 border border-white/10">{theoryMap[theory].hits.length} Hits</span>
                   </div>
                </button>
             ))}
          </div>

          <div className="lg:col-span-2 bg-black/30 border border-white/5 p-6 min-h-[300px] paper-mode-bg-white paper-mode-border-sub">
             <AnimatePresence mode="wait">
                {activeTheory ? (
                   <motion.div key={activeTheory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6 border-b border-white/10 pb-4 paper-mode-border-sub">
                         <div>
                            <h4 className="text-sm text-holo-cyan font-mono uppercase tracking-widest mb-2 paper-mode-text-black">{activeTheory}</h4>
                            <p className="text-[10px] text-slate-400 font-mono paper-mode-text-gray"><Info size={10} className="inline mr-1" /> {theoryMap[activeTheory].desc}</p>
                         </div>
                      </div>
                      
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 paper-mode-text-gray">Causal Lineage Traces</div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                         {theoryMap[activeTheory].hits.length > 0 ? (
                            theoryMap[activeTheory].hits.map((hit, i) => (
                               <div key={i} className="flex gap-4 p-3 bg-white/5 border border-white/10 paper-mode-bg-white paper-mode-border-sub">
                                  <div className="flex flex-col items-center gap-2">
                                     <span className="text-[9px] text-slate-500 font-mono paper-mode-text-gray">CELL</span>
                                     <span className="text-white font-mono paper-mode-text-black">{hit.idx + 1}</span>
                                  </div>
                                  <div className="w-px bg-white/10 paper-mode-border-sub"></div>
                                  <div className="flex-1">
                                     <p className="text-xs font-serif italic text-slate-300 paper-mode-text-black mb-2">"{hit.text}"</p>
                                     <div className="flex gap-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest paper-mode-text-gray">
                                        <span>Activation Confidence: {(hit.conf * 100).toFixed(1)}%</span>
                                        <span className="text-holo-cyan paper-mode-text-black flex items-center gap-1"><Search size={10}/> TRACED</span>
                                     </div>
                                  </div>
                               </div>
                            ))
                         ) : (
                            <div className="h-full flex items-center justify-center text-xs font-mono text-slate-600 paper-mode-text-gray">
                               NO DIRECT CAUSAL TRIGGERS DETECTED FOR THIS THEORY.
                            </div>
                         )}
                      </div>
                   </motion.div>
                ) : (
                   <div className="h-full flex items-center justify-center flex-col text-center opacity-50">
                      <Network size={32} className="mb-4 text-slate-600 paper-mode-text-gray" />
                      <div className="text-xs font-mono text-slate-500 tracking-widest uppercase paper-mode-text-gray">Select an analytical theory module<br/>to visualize its exact causal propagation lineage.</div>
                   </div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
};

export default TheoryTraceabilityMatrix;
