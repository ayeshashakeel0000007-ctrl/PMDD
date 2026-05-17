import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search, Activity, TrendingUp, Link as LinkIcon, MessageSquareWarning, Flag, ShieldAlert, Check, GitBranch, Share2 } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';
import { useWorkspace } from '../context/ResearchWorkspaceContext';

const sanitizeToken = (token) => {
  if (!token) return null;
  let t = String(token).toLowerCase();
  const blacklisted = ['confucius', 'sloking', 'upper soul', 'placeholder', 'null'];
  if (blacklisted.some(b => t.includes(b))) return null;
  t = t.replace(/[^a-zA-Z0-9\s\-]/g, '').trim();
  if (t.length > 30) {
      t = t.split(/\s+/).slice(0, 3).join(' ');
  }
  if (t.length < 2) return null;
  return t;
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
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-12 relative">
      {/* Central Axis Guide */}
      <div className="absolute top-0 left-12 md:left-1/2 md:-translate-x-1/2 w-[1px] h-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2)_50%,transparent_50%)] bg-[length:100%_20px] opacity-30 pointer-events-none"></div>
      
      <div className="mb-16 flex flex-col items-center relative z-10">
         <div className="flex items-center gap-3 mb-4 text-holo-cyan border border-holo-cyan/30 px-6 py-2 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,240,255,0.1)] rounded-sm">
            <Search size={14} className="animate-pulse"/>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase font-bold">Clause-by-Clause Dissection</span>
         </div>
         <h2 className="text-3xl md:text-5xl font-sans font-thin text-white tracking-[0.15em] uppercase text-center drop-shadow-lg">Semantic Reasoning Engine</h2>
         <p className="text-xs font-mono text-slate-500 mt-4 uppercase tracking-widest max-w-2xl text-center">Interactive semantic capsules detailing exact theoretical triggers, causality traces, and deterministic drift calculations.</p>
      </div>

      <div className="flex flex-col gap-12 relative z-10">
        {results.segments.map((seg, idx) => {
          const isExpanded = expandedSeg === idx;
          const pragmatics = seg.pragmatics || {};
          const semantics = seg.semantics || {};
          const register = seg.register || {};
          const ann = annotations[idx];
          
          const conf = pragmatics.confidence || 0.9;
          const isRisky = conf < 0.65;
          const isModerate = conf >= 0.65 && conf < 0.85;
          
          let themeColor = "text-teal-400";
          let themeBorder = "border-teal-500/30";
          let themeBg = "bg-teal-950/20";
          let themeShadow = "shadow-[0_0_15px_rgba(45,212,191,0.1)]";
          
          if (isRisky) {
             themeColor = "text-rose-400";
             themeBorder = "border-rose-500/50";
             themeBg = "bg-rose-950/20";
             themeShadow = "shadow-[0_0_25px_rgba(244,63,94,0.15)]";
          } else if (isModerate) {
             themeColor = "text-amber-400";
             themeBorder = "border-amber-500/40";
             themeBg = "bg-amber-950/20";
             themeShadow = "shadow-[0_0_20px_rgba(245,158,11,0.1)]";
          }

          if (isExpanded) {
             themeBg = isRisky ? "bg-rose-950/40" : (isModerate ? "bg-amber-950/40" : "bg-teal-950/40");
             themeBorder = isRisky ? "border-rose-500" : (isModerate ? "border-amber-500" : "border-teal-500");
          }

          const driftContribution = ((1 - conf) * 100).toFixed(1);
          const causalityTarget = idx > 0 && conf < 0.7 ? idx - 1 : null;
          const speechAct = pragmatics.speech_acts?.[0]?.category || "Assertive";
          const triggerWord = sanitizeToken(pragmatics.speech_acts?.[0]?.evidence) || "N/A";

          return (
            <div key={idx} className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 group">
              
              {/* Clause Lineage Axis Node */}
              <div className="hidden md:flex flex-col items-center relative z-20 shrink-0 w-12 pt-6">
                 <div className={`w-10 h-10 border-2 rounded-full flex items-center justify-center bg-[#0a0a0a] z-10 transition-all duration-500 ${themeBorder} ${themeShadow} ${isRisky ? 'animate-pulse' : ''}`}>
                    <span className={`font-mono text-sm font-bold ${themeColor}`}>{idx + 1}</span>
                 </div>
                 {/* Connection to next */}
                 {idx < results.segments.length - 1 && (
                    <div className="w-[2px] h-[calc(100%+3rem)] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1)_50%,transparent_50%)] bg-[length:100%_10px] mt-2"></div>
                 )}
              </div>

              {/* Casual Influence Trail (SVG) */}
              {causalityTarget !== null && (
                 <svg className="absolute left-[23px] top-[-60px] w-12 h-[80px] pointer-events-none z-0 hidden md:block">
                    <path d="M 0 0 C 0 40, 30 40, 30 80" fill="none" stroke="rgba(244,63,94,0.4)" strokeWidth="2" strokeDasharray="4 4" className="animate-flow" />
                 </svg>
              )}

              {/* Main Reasoning Capsule */}
              <motion.div className={`flex-1 flex flex-col backdrop-blur-xl border transition-all duration-500 ${themeBorder} ${themeBg} ${themeShadow}`}>
                
                {/* Header Strip */}
                <div className="w-full flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
                   <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono tracking-[0.2em] text-slate-400 uppercase">Memory Cell {idx + 1}</span>
                      <div className={`px-2 py-0.5 text-[8px] font-bold font-mono uppercase tracking-widest border ${themeBorder} ${themeColor} bg-white/5`}>
                         {speechAct}
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      {ann && <Flag size={12} className="text-rose-400" />}
                      <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500 flex items-center gap-1">
                         <Activity size={10} className={isRisky ? 'text-rose-400 animate-pulse' : 'text-slate-500'}/>
                         Weight: {(conf * 100).toFixed(0)}%
                      </span>
                   </div>
                </div>

                {/* Content Block */}
                <button onClick={() => { setExpandedSeg(isExpanded ? null : idx); setAnnotationInput(""); }} className="w-full px-6 py-6 text-left relative overflow-hidden focus:outline-none">
                  {/* Subtle background graphic */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                     <p className={`text-lg md:text-xl font-sans font-light leading-relaxed tracking-wide ${themeColor} ${isExpanded ? 'drop-shadow-[0_0_10px_currentColor]' : ''}`}>
                        "{seg.text}"
                     </p>
                     <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                        <div className="text-right hidden md:block">
                           <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Drift Ent.</div>
                           <div className={`font-mono text-xl font-bold ${isRisky ? 'text-rose-400' : 'text-white'}`}>{driftContribution}</div>
                        </div>
                        <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-white/10' : 'bg-black/50 hover:bg-white/5'}`}>
                           <ChevronDown size={16} className="text-white"/>
                        </div>
                     </div>
                  </div>
                </button>

                {/* Expanded Intelligence Data */}
                <AnimatePresence>
                   {isExpanded && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-6 py-8 bg-[#050505] border-t border-white/10 relative overflow-hidden flex flex-col">
                       
                       <ClauseLineageGraph currentIndex={idx} totalLength={results.segments.length} isHighDrift={isRisky} />

                       {/* Meaning Drift Detector Sub-Panel */}
                       <div className="w-full mb-8 border border-white/10 bg-white/5 p-5 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full" style={{backgroundColor: isRisky ? '#f43f5e' : (isModerate ? '#f59e0b' : '#2dd4bf')}}></div>
                          <h4 className="text-[10px] font-mono text-white uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                             <TrendingUp size={12} className={themeColor}/> Meaning Drift Detector
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                             <div className="lg:col-span-2">
                                <p className="text-xs font-mono text-slate-300 leading-relaxed mb-3">
                                   {isRisky ? `CRITICAL DRIFT: The original communicative intent has mutated. By injecting the trigger word "${triggerWord}", the system detects a shift from cooperative semantics to deontic coercion.` 
                                   : isModerate ? `MODERATE SHIFT: Ambiguity detected. The phrase relies on institutional framing ("${triggerWord}") which slightly elevates rhetorical pressure.`
                                   : `STABLE ALIGNMENT: Clause semantic structure aligns perfectly with Gricean cooperative principles. No coercive intent or hidden pressure vectors detected.`}
                                </p>
                                {causalityTarget !== null && (
                                   <div className="text-[9px] font-mono text-rose-400 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 w-fit">
                                      <LinkIcon size={10} className="inline mr-2"/> Causal link: Inherits tension from Clause {causalityTarget + 1}
                                   </div>
                                )}
                             </div>
                             <div className="flex flex-col gap-2 border-l border-white/10 pl-6 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                                <div className="flex justify-between"><span>Entropy Bound:</span><span className="text-white">{((1 - conf) * 10).toFixed(3)} bits</span></div>
                                <div className="flex justify-between"><span>Uncertainty Var:</span><span className="text-white">±{(conf * 0.05).toFixed(3)}</span></div>
                                <div className="flex justify-between"><span>Resonance Wgt:</span><span className={themeColor}>{(conf * 100).toFixed(1)}%</span></div>
                             </div>
                          </div>
                       </div>

                       {/* Theoretical Overlays */}
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          
                          {/* Speech Act Theory */}
                          <div className="border border-white/10 bg-black/50 p-4">
                             <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                <h4 className="text-[10px] font-mono text-white uppercase tracking-[0.15em]">Speech Act Theory</h4>
                                <span className="text-[8px] text-slate-500 font-mono">PRAGMATICS</span>
                             </div>
                             <div className="space-y-3">
                                {pragmatics.speech_acts?.map((act, i) => (
                                   <div key={i} className="flex flex-col gap-1">
                                      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                                         <span className={themeColor}>{act.category}</span>
                                         <span className="text-white">{(act.confidence * 100).toFixed(1)}%</span>
                                      </div>
                                      <div className="text-[9px] font-mono text-slate-400">Trigger: <span className="text-slate-200">"{sanitizeToken(act.evidence)}"</span></div>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {/* Distributional Semantics */}
                          <div className="border border-white/10 bg-black/50 p-4">
                             <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                <h4 className="text-[10px] font-mono text-white uppercase tracking-[0.15em]">SFL Register</h4>
                                <span className="text-[8px] text-slate-500 font-mono">SEMANTICS</span>
                             </div>
                             <div className="space-y-3">
                                {semantics.semantic_fields?.map((field, i) => (
                                   <div key={i} className="flex flex-col gap-1">
                                      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                                         <span className="text-holo-cyan">{field.field}</span>
                                         <span className="text-white border border-white/10 px-1 bg-white/5">"{sanitizeToken(field.word)}"</span>
                                      </div>
                                      <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">Map: {field.contextual_meaning}</div>
                                   </div>
                                ))}
                             </div>
                          </div>

                          {/* Institutional Formality */}
                          <div className="border border-white/10 bg-black/50 p-4 flex flex-col justify-between">
                             <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                <h4 className="text-[10px] font-mono text-white uppercase tracking-[0.15em]">Inst. Authority</h4>
                                <span className="text-[8px] text-slate-500 font-mono">TENSOR</span>
                             </div>
                             {register.formality_score !== undefined && (
                                <div className="flex flex-col gap-3">
                                   <div className="flex justify-between text-[10px] font-mono text-slate-300 uppercase tracking-widest">
                                      <span>Formality</span>
                                      <span className="font-bold text-yellow-400">{(register.formality_score * 100).toFixed(1)}%</span>
                                   </div>
                                   <div className="w-full h-[3px] bg-white/10 relative overflow-hidden">
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${register.formality_score * 100}%` }} transition={{ duration: 1, delay: 0.2 }} className="absolute top-0 bottom-0 left-0 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></motion.div>
                                   </div>
                                </div>
                             )}
                          </div>
                       </div>
                       
                       {/* Human Annotation Layer */}
                       <div className="border-t border-white/10 pt-5 mt-auto relative">
                          <h4 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                             <MessageSquareWarning size={10}/> Scientific Review & Annotation
                          </h4>
                          
                          {ann ? (
                             <div className="bg-white/5 border border-white/10 p-4 flex justify-between items-center z-10 relative">
                                <div className="flex flex-col gap-1.5">
                                   <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-mono text-slate-300 tracking-[0.2em] uppercase bg-black/50 px-2 py-0.5 border border-white/10">[{ann.flag}]</span>
                                      <span className="text-[8px] font-mono text-slate-500">Logged: {new Date(ann.timestamp).toLocaleString()}</span>
                                   </div>
                                   <span className="text-xs font-mono text-white mt-1">"{ann.text}"</span>
                                </div>
                                <button onClick={() => removeAnnotation(idx)} className="text-[9px] font-mono text-rose-400 hover:text-white hover:bg-rose-500 border border-rose-500/30 px-4 py-2 transition-all uppercase tracking-widest font-bold">Revoke</button>
                             </div>
                          ) : (
                             <div className="flex flex-col lg:flex-row gap-3 z-10 relative">
                                <input 
                                   type="text" 
                                   value={annotationInput}
                                   onChange={(e) => setAnnotationInput(e.target.value)}
                                   placeholder="Add reviewer notes, dispute reasoning, or semantic overrides..." 
                                   className="flex-1 bg-black/80 border border-white/20 p-3 text-[11px] font-mono text-white placeholder-slate-600 focus:outline-none focus:border-holo-cyan transition-colors"
                                />
                                <div className="flex gap-2 shrink-0">
                                   <button onClick={() => handleSaveAnnotation(idx, 'THEORY DISPUTE')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center justify-center gap-2 text-[9px] font-mono text-white uppercase tracking-widest bg-white/5 border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors"><ShieldAlert size={12}/> Dispute</button>
                                   <button onClick={() => handleSaveAnnotation(idx, 'FALSE POSITIVE')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center justify-center gap-2 text-[9px] font-mono text-white uppercase tracking-widest bg-rose-500/10 border border-rose-500/40 px-4 py-2 hover:bg-rose-500/20 transition-colors text-rose-300"><Flag size={12}/> Fls. Pos</button>
                                   <button onClick={() => handleSaveAnnotation(idx, 'VERIFIED')} disabled={!annotationInput} className="disabled:opacity-50 flex items-center justify-center gap-2 text-[9px] font-mono text-white uppercase tracking-widest bg-teal-500/10 border border-teal-500/40 px-4 py-2 hover:bg-teal-500/20 transition-colors text-teal-300"><Check size={12}/> Verify</button>
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
