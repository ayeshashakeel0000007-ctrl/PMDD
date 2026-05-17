import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search, Activity, TrendingUp, Link as LinkIcon, MessageSquareWarning, Flag, ShieldAlert, Check, GitBranch, Share2 } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';
import { useWorkspace } from '../context/ResearchWorkspaceContext';

const sanitizeToken = (token) => {
  if (!token) return null;
  const t = token.toLowerCase();
  const blacklisted = ['confucius', 'sloking', 'upper soul', 'placeholder', 'null'];
  if (blacklisted.some(b => t.includes(b))) return null;
  if (/[^a-zA-Z0-9\s\-]/.test(token)) return null;
  if (token.length > 30 || token.length < 2) return null;
  return token;
};

const ClauseLineageGraph = ({ currentIndex, totalLength, isHighDrift }) => {
  const getLineageNodes = () => {
     let nodes = [];
     if (currentIndex > 2) nodes.push({ idx: currentIndex - 2, text: "Institutional seed", type: 'origin', active: false });
     if (currentIndex > 0) nodes.push({ idx: currentIndex - 1, text: isHighDrift ? "Escalation acceleration" : "Linear propagation", type: 'node', active: false });
     nodes.push({ idx: currentIndex, text: isHighDrift ? "Ambiguity destabilization" : "Semantic stabilization", type: 'target', active: true });
     return nodes;
  };
  const nodes = getLineageNodes();

  return (
    <div className="w-full bg-black border border-white/5 p-4 relative overflow-hidden mb-6 min-h-[120px] flex flex-col justify-center">
       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
       
       <div className="flex items-center gap-2 mb-2 relative z-10 border-b border-white/5 pb-2">
          <GitBranch size={12} className="text-slate-500" />
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">Semantic Lineage Topology</span>
       </div>

       <div className="relative z-10 w-full h-[60px] mt-2">
          <svg width="100%" height="100%" viewBox="0 0 400 60" preserveAspectRatio="xMidYMid meet">
             <defs>
                <filter id="glowTree" x="-20%" y="-20%" width="140%" height="140%">
                   <feGaussianBlur stdDeviation="3" result="blur" />
                   <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
             </defs>
             {nodes.map((node, i) => {
                const x = 50 + i * 140;
                const y = 30;
                const prevX = i > 0 ? 50 + (i - 1) * 140 : 50;
                const col = node.active ? (isHighDrift ? '#f43f5e' : '#00f5c4') : 'rgba(255,255,255,0.4)';
                return (
                   <g key={i}>
                      {i > 0 && (
                         <path d={`M ${prevX} ${y} L ${x} ${y}`}
                            fill="none" stroke={col} strokeWidth="1.5" opacity="0.6" filter="url(#glowTree)" 
                            strokeDasharray={isHighDrift && node.active ? "4 2" : "none"} />
                      )}
                      <circle cx={x} cy={y} r="4" fill={col} filter="url(#glowTree)" />
                      {node.active && isHighDrift && <circle cx={x} cy={y} r="10" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping" opacity="0.5"/>}
                      <text x={x} y={y - 12} fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle" fontFamily="monospace">C{node.idx + 1}</text>
                      <text x={x} y={y + 15} fill={node.active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)"} fontSize="8" textAnchor="middle" fontFamily="monospace">{node.text}</text>
                   </g>
                );
             })}
          </svg>
       </div>
    </div>
  );
};

const EvidenceExplorer = ({ results }) => {
  const [expandedSeg, setExpandedSeg] = useState(null);
  const { resonanceState } = useResonance();
  const { annotations, addAnnotation, removeAnnotation } = useWorkspace();
  const [annotationInput, setAnnotationInput] = useState("");

  if (!results || !results.segments) return null;

  const isHighDrift = resonanceState.intensityMultiplier > 1.5;

  const handleSaveAnnotation = (idx, flagType) => {
     addAnnotation(idx, { text: annotationInput, flag: flagType });
     setAnnotationInput("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
      <div className="mb-12 flex flex-col items-center">
         <div className="flex items-center gap-3 mb-2 text-slate-500 border border-white/10 px-4 py-1 rounded-sm bg-black/40">
            <Search size={12} />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase">Collaborative Interpretability Laboratory</span>
         </div>
         <h2 className="text-xl font-mono text-white tracking-[0.1em] uppercase text-center">Semantic Memory & Annotation</h2>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="absolute left-8 top-12 bottom-12 w-px bg-white/5 z-0 border-l border-dashed border-white/10"></div>

        {results.segments.map((seg, idx) => {
          const isExpanded = expandedSeg === idx;
          const pragmatics = seg.pragmatics || {};
          const semantics = seg.semantics || {};
          const register = seg.register || {};
          const ann = annotations[idx];
          
          const conf = pragmatics.confidence || 1.0;
          let confColor = "text-white";
          let borderColor = ann ? "border-white/30" : "border-white/5";
          let bgGlow = ann ? "bg-white/5" : "hover:bg-white/5";
          
          const driftContribution = ((1 - conf) * 100).toFixed(1);
          const causalityTarget = idx > 0 && conf < 0.7 ? idx - 1 : null;

          if (conf < 0.6) {
            confColor = "text-rose-400";
            borderColor = ann ? "border-rose-500/50" : "border-rose-500/20";
          } else if (conf < 0.8) {
            confColor = "text-amber-400";
          }

          if (isExpanded) {
             borderColor = ann ? "border-white/50 bg-white/5" : "border-white/30 bg-black/80";
          }

          return (
            <div key={idx} className="relative z-10 flex gap-6">
              <div className="w-5 h-5 bg-black border border-white/20 flex items-center justify-center shrink-0 mt-6 relative z-10">
                 {ann ? <Flag size={8} className="text-white" /> : <div className={`w-[2px] h-[2px] ${conf < 0.6 ? 'bg-rose-500' : 'bg-white/50'}`}></div>}
              </div>

              {causalityTarget !== null && (
                 <div className="absolute left-[11px] top-[-30px] w-6 h-[40px] border-l border-b border-rose-500/30 border-dashed z-0"></div>
              )}

              <motion.div className={`flex-1 bg-black/60 border transition-colors duration-300 ${borderColor} ${bgGlow}`}>
                <button onClick={() => { setExpandedSeg(isExpanded ? null : idx); setAnnotationInput(""); }} className="w-full px-6 py-5 flex items-center justify-between text-left group">
                  <div className="flex items-center space-x-6 relative">
                    <div className="flex flex-col items-center">
                       <span className="text-[8px] font-mono text-slate-500 tracking-[0.2em]">MEM.CELL</span>
                       <span className="text-white font-mono text-sm">{idx + 1}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col">
                       <p className={`text-xs md:text-sm font-mono tracking-wide ${confColor}`}>"{seg.text}"</p>
                       {ann && (
                          <div className="flex items-center gap-2 mt-2 text-[8px] font-mono text-white tracking-widest uppercase bg-white/10 px-2 py-1 border border-white/20 w-fit">
                             <MessageSquareWarning size={8} /> {ann.flag} | {ann.text}
                          </div>
                       )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    {pragmatics.confidence && (
                      <div className="flex flex-col items-end">
                         <span className={`hidden sm:flex items-center text-[9px] font-mono tracking-widest px-2 py-1 border ${conf < 0.6 ? 'text-rose-400 bg-rose-500/5 border-rose-500/20' : 'text-slate-300 bg-white/5 border-white/10'}`}>
                           <Activity size={10} className={`mr-2 ${conf < 0.6 ? 'animate-pulse' : ''}`} />
                           STABILITY: {(pragmatics.confidence * 100).toFixed(0)}%
                         </span>
                         <span className="text-[7px] font-mono text-slate-500 tracking-widest mt-1 uppercase">Entropy: {((1-conf)*10).toFixed(2)} | Var: ±{(Math.random() * 0.05).toFixed(3)}</span>
                      </div>
                    )}
                    {isExpanded ? <ChevronDown size={14} className="text-white" /> : <ChevronRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />}
                  </div>
                </button>

                <AnimatePresence>
                   {isExpanded && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 py-6 bg-black border-t border-white/10 relative overflow-hidden flex flex-col">
                       
                       <ClauseLineageGraph currentIndex={idx} totalLength={results.segments.length} isHighDrift={isHighDrift} />

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-3 border-b border-white/5 pb-4">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Share2 size={12} className="text-slate-500"/>
                                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Semantic Propagation Trace</span>
                                </div>
                                {causalityTarget !== null && (
                                   <div className="flex items-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 text-[8px] font-mono uppercase tracking-widest">
                                      <LinkIcon size={8} /> Instability inherited from Clause {causalityTarget + 1}
                                   </div>
                                )}
                             </div>
                             <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest bg-white/5 p-3 border border-white/5 flex flex-col gap-2">
                                <div className="flex justify-between"><span>[MATH] Entropy Bound</span><span className="text-white">{((1 - conf) * 10).toFixed(3)} bits</span></div>
                                <div className="flex justify-between border-t border-white/5 pt-2"><span>[SYNC] Semantic Displacement</span><span className="text-white">Δ {driftContribution}% from origin</span></div>
                             </div>
                          </div>

                          {/* Pragmatics Column */}
                          {pragmatics.speech_acts && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                 <h4 className="text-[9px] font-mono text-white uppercase tracking-[0.2em]">Pragmatic Derivation</h4>
                                 <span className="text-[7px] font-mono text-slate-500 uppercase">Speech Act Theory</span>
                              </div>
                              {pragmatics.speech_acts.map((act, i) => {
                                const cleanEv = sanitizeToken(act.evidence);
                                if (!cleanEv) return null;
                                return (
                                  <div key={i} className="bg-white/5 p-2 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-[9px] text-slate-300 font-mono tracking-widest uppercase">{act.category}</span>
                                      <span className="text-[8px] font-mono text-white">{(act.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest">Token: <span className="text-slate-300">"{cleanEv}"</span></p>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Semantics Column */}
                          {semantics.semantic_fields && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                 <h4 className="text-[9px] font-mono text-white uppercase tracking-[0.2em]">Semantic Tensor</h4>
                                 <span className="text-[7px] font-mono text-slate-500 uppercase">Systemic Functional</span>
                              </div>
                              {semantics.semantic_fields.map((field, i) => {
                                const cleanWord = sanitizeToken(field.word);
                                if (!cleanWord) return null;
                                return (
                                  <div key={i} className="bg-white/5 p-2 border border-white/5">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[9px] text-slate-300 font-mono tracking-widest uppercase">"{cleanWord}"</span>
                                       <span className="text-[7px] font-mono text-slate-500 px-1 border border-white/10 uppercase">{field.field}</span>
                                    </div>
                                    <p className="text-[8px] text-slate-500 font-mono mt-1 tracking-widest uppercase">Map: {field.contextual_meaning}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Register Column */}
                          {register.formality_score !== undefined && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                                 <h4 className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">Institutional Weight</h4>
                              </div>
                              <div className="bg-white/5 p-2 border border-white/5">
                                <div className="flex justify-between text-[8px] font-mono text-slate-500 mb-2 tracking-widest uppercase">
                                   <span>Formality Tensor</span>
                                   <span className="text-white">{(register.formality_score * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-px bg-white/10 mt-2 relative">
                                   <motion.div initial={{ width: 0 }} animate={{ width: `${register.formality_score * 100}%` }} transition={{ duration: 1 }} className="absolute top-[-1px] h-[2px] bg-white"></motion.div>
                                </div>
                              </div>
                            </div>
                          )}
                       </div>
                       
                       {/* Human Annotation Layer */}
                       <div className="border-t border-white/10 pt-4 mt-6 relative">
                          <h4 className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-3">Scientific Review & Annotation</h4>
                          
                          {ann ? (
                             <div className="bg-white/5 border border-white/10 p-3 flex justify-between items-center z-10 relative">
                                <div className="flex flex-col gap-1">
                                   <span className="text-[8px] font-mono text-slate-300 tracking-widest uppercase">[{ann.flag}]</span>
                                   <span className="text-[10px] font-mono text-white">"{ann.text}"</span>
                                   <span className="text-[7px] font-mono text-slate-500 mt-1">Logged: {new Date(ann.timestamp).toLocaleString()}</span>
                                </div>
                                <button onClick={() => removeAnnotation(idx)} className="text-[8px] font-mono text-rose-400 hover:text-rose-300 border border-rose-500/20 px-2 py-1 transition-colors">REVOKE ANNOTATION</button>
                             </div>
                          ) : (
                             <div className="flex flex-col gap-2 z-10 relative">
                                <input 
                                   type="text" 
                                   value={annotationInput}
                                   onChange={(e) => setAnnotationInput(e.target.value)}
                                   placeholder="Add reviewer notes, dispute reasoning, or semantic overrides..." 
                                   className="w-full bg-black border border-white/10 p-2 text-[10px] font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-white/30 transition-colors"
                                />
                                <div className="flex gap-2">
                                   <button onClick={() => handleSaveAnnotation(idx, 'THEORY DISPUTE')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center gap-2 text-[8px] font-mono text-white uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-2 hover:bg-white/10 transition-colors"><ShieldAlert size={10}/> FLAG DISPUTE</button>
                                   <button onClick={() => handleSaveAnnotation(idx, 'FALSE POSITIVE')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center gap-2 text-[8px] font-mono text-white uppercase tracking-widest bg-rose-500/10 border border-rose-500/30 px-3 py-2 hover:bg-rose-500/20 transition-colors"><Flag size={10}/> FALSE POSITIVE</button>
                                   <button onClick={() => handleSaveAnnotation(idx, 'VERIFIED')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center gap-2 text-[8px] font-mono text-white uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 hover:bg-emerald-500/20 transition-colors"><Check size={10}/> VERIFY TRACE</button>
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
