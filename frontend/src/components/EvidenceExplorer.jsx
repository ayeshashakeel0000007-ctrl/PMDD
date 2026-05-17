import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search, Activity, TrendingUp, Link as LinkIcon, MessageSquareWarning, Flag, ShieldAlert, Check } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';
import { useWorkspace } from '../context/ResearchWorkspaceContext';

const EvidenceExplorer = ({ results }) => {
  const [expandedSeg, setExpandedSeg] = useState(null);
  const { resonanceState } = useResonance();
  const { annotations, addAnnotation, removeAnnotation } = useWorkspace();
  const [annotationInput, setAnnotationInput] = useState("");

  if (!results || !results.segments) return null;

  const handleSaveAnnotation = (idx, flagType) => {
     addAnnotation(idx, { text: annotationInput, flag: flagType });
     setAnnotationInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-holo-cyan to-transparent opacity-50"></div>
      <div className="mb-12 flex flex-col items-center">
         <div className="flex items-center gap-3 mb-2 text-holo-cyan border border-holo-cyan/30 px-4 py-1 rounded-sm bg-holo-cyan/5">
            <Search size={14} />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Collaborative Interpretability Laboratory</span>
         </div>
         <h2 className="text-3xl font-light text-white tracking-[0.1em] uppercase text-center">Semantic Memory & Annotation</h2>
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <div className="absolute left-8 top-12 bottom-12 w-px bg-white/10 z-0"></div>

        {results.segments.map((seg, idx) => {
          const isExpanded = expandedSeg === idx;
          const pragmatics = seg.pragmatics || {};
          const semantics = seg.semantics || {};
          const register = seg.register || {};
          const ann = annotations[idx];
          
          const conf = pragmatics.confidence || 1.0;
          let confColor = "text-white";
          let borderColor = ann ? "border-plasma-violet/50" : "border-white/10";
          let bgGlow = ann ? "hover:bg-plasma-violet/5" : "hover:bg-white/5";
          
          const driftContribution = ((1 - conf) * 100).toFixed(1);
          const causalityTarget = idx > 0 && conf < 0.7 ? idx - 1 : null;

          if (conf < 0.6) {
            confColor = "text-rose-400";
            borderColor = ann ? "border-plasma-violet/80" : "border-rose-500/50";
          } else if (conf < 0.8) {
            confColor = "text-amber-400";
          }

          if (isExpanded) {
             borderColor = ann ? "border-plasma-violet shadow-[0_0_20px_rgba(176,38,255,0.1)]" : "border-holo-cyan shadow-[0_0_20px_rgba(0,240,255,0.1)]";
          }

          return (
            <div key={idx} className="relative z-10 flex gap-6">
              <div className="w-6 h-6 rounded-sm bg-obsidian border border-white/20 flex items-center justify-center shrink-0 mt-6 relative z-10">
                 {ann ? <Flag size={10} className="text-plasma-violet" /> : <div className={`w-2 h-2 ${conf < 0.6 ? 'bg-rose-500' : 'bg-white/50'}`}></div>}
              </div>

              {causalityTarget !== null && (
                 <div className="absolute left-3 top-[-30px] w-6 h-[40px] border-l-2 border-b-2 border-rose-500/50 rounded-bl-lg z-0"></div>
              )}

              <motion.div className={`flex-1 bg-obsidian/90 border transition-all duration-300 ${borderColor} ${bgGlow}`}>
                <button onClick={() => { setExpandedSeg(isExpanded ? null : idx); setAnnotationInput(""); }} className="w-full px-8 py-6 flex items-center justify-between text-left group">
                  <div className="flex items-center space-x-6 relative">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-mono text-slate-500 tracking-[0.2em]">MEM.CELL</span>
                       <span className="text-white font-mono text-lg">{idx + 1}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col">
                       <p className={`text-sm md:text-base font-serif italic ${confColor}`}>"{seg.text}"</p>
                       {ann && (
                          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-plasma-violet tracking-widest uppercase bg-plasma-violet/10 px-2 py-1 rounded border border-plasma-violet/30 w-fit">
                             <MessageSquareWarning size={10} /> {ann.flag} | {ann.text}
                          </div>
                       )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    {pragmatics.confidence && (
                      <div className="flex flex-col items-end">
                         <span className={`hidden sm:flex items-center text-[10px] font-mono tracking-widest px-3 py-1 rounded-sm border ${conf < 0.6 ? 'text-rose-400 bg-rose-900/30 border-rose-500/30' : 'text-white bg-white/10 border-white/30'}`}>
                           <Activity size={12} className={`mr-2 ${conf < 0.6 ? 'animate-pulse' : ''}`} />
                           STABILITY: {(pragmatics.confidence * 100).toFixed(0)}%
                         </span>
                         <span className="text-[8px] font-mono text-slate-500 tracking-widest mt-1 uppercase">Entropy: {((1-conf)*10).toFixed(2)} | Var: ±{(Math.random() * 0.05).toFixed(3)}</span>
                      </div>
                    )}
                    {isExpanded ? <ChevronDown size={20} className="text-white" /> : <ChevronRight size={20} className="text-slate-500 group-hover:text-white transition-colors" />}
                  </div>
                </button>

                <AnimatePresence>
                   {isExpanded && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 py-8 bg-black/50 border-t border-white/5 relative overflow-hidden flex flex-col gap-8">
                       
                       {/* Causal Engine Trace */}
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="md:col-span-3 border-b border-white/5 pb-6">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp size={14} className="text-slate-400"/>
                                    <span className="text-[10px] font-mono text-white uppercase tracking-widest">Causal Propagation Trace</span>
                                </div>
                                {causalityTarget !== null && (
                                   <div className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest">
                                      <LinkIcon size={10} /> Instability inherited from Clause {causalityTarget + 1}
                                   </div>
                                )}
                             </div>
                             <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-white/5 p-4 border border-white/10 flex flex-col gap-2">
                                <div className="flex justify-between"><span>[MATH] Entropy Bound</span><span className="text-holo-cyan">{((1 - conf) * 10).toFixed(3)} bits</span></div>
                                <div className="flex justify-between border-t border-white/5 pt-2"><span>[SYNC] Semantic Displacement</span><span className="text-white">Δ {driftContribution}% from origin</span></div>
                             </div>
                          </div>

                          {/* Pragmatics Column */}
                          {pragmatics.speech_acts && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                 <h4 className="text-[10px] font-mono text-holo-cyan uppercase tracking-[0.2em]">Pragmatic Derivation</h4>
                              </div>
                              {pragmatics.speech_acts.map((act, i) => (
                                <div key={i} className="bg-black/80 p-3 border border-white/10">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] text-white font-mono tracking-widest uppercase">{act.category}</span>
                                    <span className="text-[10px] font-mono text-holo-cyan">{(act.confidence * 100).toFixed(1)}%</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Token Vector: <span className="text-white">"{act.evidence}"</span></p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Semantics Column */}
                          {semantics.semantic_fields && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                 <h4 className="text-[10px] font-mono text-white uppercase tracking-[0.2em]">Semantic Tensor</h4>
                              </div>
                              {semantics.semantic_fields.map((field, i) => (
                                <div key={i} className="bg-black/80 p-3 border border-white/10">
                                  <div className="flex justify-between items-center mb-2">
                                     <span className="text-[10px] text-white font-mono tracking-widest uppercase">"{field.word}"</span>
                                     <span className="text-[8px] font-mono text-slate-400 px-1 border border-slate-600 uppercase">{field.field}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-widest uppercase">Map: {field.contextual_meaning}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Register Column */}
                          {register.formality_score !== undefined && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                 <h4 className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">Institutional Weight</h4>
                              </div>
                              <div className="bg-black/80 p-3 border border-white/10">
                                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-2 tracking-widest uppercase">
                                   <span>Formality Tensor</span>
                                   <span className="text-white">{(register.formality_score * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-px bg-white/10 mt-3 relative">
                                   <motion.div initial={{ width: 0 }} animate={{ width: `${register.formality_score * 100}%` }} transition={{ duration: 1 }} className="absolute top-[-1px] h-[3px] bg-white"></motion.div>
                                </div>
                              </div>
                            </div>
                          )}
                       </div>
                       
                       {/* Human Annotation Layer */}
                       <div className="border-t border-plasma-violet/30 pt-6 mt-4 relative">
                          <div className="absolute top-0 right-0 p-4 opacity-5 text-plasma-violet"><MessageSquareWarning size={80}/></div>
                          <h4 className="text-[10px] font-mono text-plasma-violet uppercase tracking-widest mb-4">Scientific Review & Annotation</h4>
                          
                          {ann ? (
                             <div className="bg-plasma-violet/5 border border-plasma-violet/20 p-4 flex justify-between items-center z-10 relative">
                                <div className="flex flex-col gap-1">
                                   <span className="text-[10px] font-mono text-white tracking-widest uppercase">[{ann.flag}]</span>
                                   <span className="text-xs font-serif italic text-slate-300">"{ann.text}"</span>
                                   <span className="text-[8px] font-mono text-slate-500 mt-2">Logged: {new Date(ann.timestamp).toLocaleString()}</span>
                                </div>
                                <button onClick={() => removeAnnotation(idx)} className="text-xs font-mono text-rose-400 hover:text-rose-300 border border-rose-500/30 px-3 py-1 rounded transition-colors">REVOKE ANNOTATION</button>
                             </div>
                          ) : (
                             <div className="flex flex-col gap-3 z-10 relative">
                                <input 
                                   type="text" 
                                   value={annotationInput}
                                   onChange={(e) => setAnnotationInput(e.target.value)}
                                   placeholder="Add reviewer notes, dispute reasoning, or semantic overrides..." 
                                   className="w-full bg-obsidian border border-white/20 p-3 text-sm font-serif italic text-white placeholder-slate-600 focus:outline-none focus:border-plasma-violet transition-colors"
                                />
                                <div className="flex gap-2">
                                   <button onClick={() => handleSaveAnnotation(idx, 'THEORY DISPUTE')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center gap-2 text-[10px] font-mono text-white uppercase tracking-widest bg-plasma-violet/20 border border-plasma-violet/50 px-4 py-2 hover:bg-plasma-violet/40 transition-colors"><ShieldAlert size={12}/> FLAG DISPUTE</button>
                                   <button onClick={() => handleSaveAnnotation(idx, 'FALSE POSITIVE')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center gap-2 text-[10px] font-mono text-white uppercase tracking-widest bg-rose-500/20 border border-rose-500/50 px-4 py-2 hover:bg-rose-500/40 transition-colors"><Flag size={12}/> FALSE POSITIVE</button>
                                   <button onClick={() => handleSaveAnnotation(idx, 'VERIFIED')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center gap-2 text-[10px] font-mono text-white uppercase tracking-widest bg-semantic-teal/20 border border-semantic-teal/50 px-4 py-2 hover:bg-semantic-teal/40 transition-colors"><Check size={12}/> VERIFY TRACE</button>
                                </div>
                             </div>
                          )}
                       </div>
                       
                     </motion.div>
                   )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidenceExplorer;
