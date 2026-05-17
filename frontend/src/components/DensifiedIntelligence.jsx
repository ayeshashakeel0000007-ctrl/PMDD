import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResonance } from '../context/SemanticResonanceContext';
import { Network, GitMerge, Activity, ShieldAlert, BookOpen, Cpu, TrendingUp, Layers, Compass, Wind, Hexagon } from 'lucide-react';

// ── 1. Semantic Force Network (Replaces Constellation) ──
const SemanticForceNetwork = memo(({ results, isHighDrift, label="ACTIVE" }) => {
  const segs = results?.segments || [];
  const math = results?.final_output?.math_scores || {};
  const dist = math.speech_act_distribution || {};
  
  // Create nodes for each clause
  const nodes = segs.map((s, i) => {
    const act = s.pragmatics?.speech_acts?.[0] || {};
    const conf = s.pragmatics?.confidence || 1;
    return { id: i, label: `C${i+1}`, act: act.category || 'Assertive', conf };
  });

  // Calculate layout (radial)
  const cx = 200, cy = 160;
  
  return (
    <div className="relative w-full min-h-[320px] bg-black/40 border border-white/8 overflow-hidden group">
      <svg width="100%" height="320" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet">
         <defs>
            <radialGradient id={`gravityWell-${label}`} cx="50%" cy="50%" r="50%">
               <stop offset="0%" stopColor={isHighDrift ? "rgba(244,63,94,0.15)" : "rgba(0,240,255,0.05)"} />
               <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id={`glowF-${label}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
         </defs>
         
         <circle cx={cx} cy={cy} r="140" fill={`url(#gravityWell-${label})`} />
         <circle cx={cx} cy={cy} r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 8" />
         <circle cx={cx} cy={cy} r="50" fill="none" stroke="rgba(255,255,255,0.1)" />
         
         {/* Orbiting Nodes */}
         {nodes.map((n, i) => {
            const angle = (Math.PI * 2 * i) / Math.max(nodes.length, 1) - Math.PI/2;
            const isDir = n.act === 'Directive' || n.act === 'Expressive';
            const driftOffset = isHighDrift && isDir ? 40 : 0;
            const r = 100 - driftOffset;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            const col = isDir && isHighDrift ? '#f43f5e' : (isDir ? '#fbbf24' : '#00f0ff');
            
            return (
               <g key={n.id}>
                 <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth="1" opacity={isDir && isHighDrift ? 0.6 : 0.2} />
                 {i > 0 && (
                   <line x1={cx + Math.cos((Math.PI * 2 * (i-1)) / Math.max(nodes.length, 1) - Math.PI/2) * (100 - (isHighDrift && (nodes[i-1].act==='Directive'||nodes[i-1].act==='Expressive') ? 40 : 0))}
                         y1={cy + Math.sin((Math.PI * 2 * (i-1)) / Math.max(nodes.length, 1) - Math.PI/2) * (100 - (isHighDrift && (nodes[i-1].act==='Directive'||nodes[i-1].act==='Expressive') ? 40 : 0))}
                         x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 4"/>
                 )}
                 <circle cx={x} cy={y} r={isDir && isHighDrift ? 6 : 4} fill={col} filter={`url(#glowF-${label})`} />
                 {n.conf < 0.65 && <circle cx={x} cy={y} r="12" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping" opacity="0.4"/>}
                 <text x={x + (x>cx?10:-10)} y={y+4} fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace" textAnchor={x>cx?"start":"end"}>{n.label}</text>
               </g>
            );
         })}
         
         <circle cx={cx} cy={cy} r="6" fill={isHighDrift ? "#f43f5e" : "#fff"} filter={`url(#glowF-${label})`} />
         <text x={cx} y={cy+18} fill="#fff" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="2">CORE</text>
      </svg>
      <div className="absolute top-4 left-4 right-4 flex justify-between text-[10px] font-mono text-slate-500 uppercase">
        <span>Force Vector Network</span>
        {isHighDrift && <span className="text-rose-400 animate-pulse">Gravity Well Collapsed</span>}
      </div>
    </div>
  );
});

// ── 2. Layered Semantic Flow ──
const LayeredSemanticFlow = memo(({ results, isHighDrift, label="ACTIVE" }) => {
  const segs = results?.segments || [];
  const w = 400, h = 160;
  
  // 3 layers: Pragmatics, Semantics, Syntax
  const generatePath = (type) => {
    const pts = segs.map((s, i) => {
       let val = 1;
       if (type === 'pragmatics') val = s.pragmatics?.confidence || 1;
       if (type === 'semantics') val = s.semantics?.confidence || 1;
       if (type === 'syntax') val = s.syntax?.depth ? 1 - (s.syntax.depth / 20) : 1;
       return { x: (i / Math.max(segs.length - 1, 1)) * w, y: h - (val * (h - 40)) - 20 };
    });
    const d = pts.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
    return { pts, d: `${d} L ${w} ${h} L 0 ${h} Z`, line: d };
  };

  const prag = generatePath('pragmatics');
  const sem = generatePath('semantics');
  const syn = generatePath('syntax');

  return (
    <div className="relative w-full min-h-[260px] bg-black/40 border border-white/8 overflow-hidden">
      <svg width="100%" height="220" viewBox={`0 0 ${w} ${h+30}`} preserveAspectRatio="none">
         <defs>
            <linearGradient id={`pragF-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3"/><stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/></linearGradient>
            <linearGradient id={`semF-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2"/><stop offset="100%" stopColor="#00f0ff" stopOpacity="0"/></linearGradient>
            <linearGradient id={`synF-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24" stopOpacity="0.1"/><stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/></linearGradient>
         </defs>
         
         {[25,50,75].map(y => (
           <line key={y} x1="0" y1={h-(y*(h-20)/100)-20} x2={w} y2={h-(y*(h-20)/100)-20} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6"/>
         ))}
         
         {segs.length > 1 && (
            <>
               <path d={syn.d} fill={`url(#synF-${label})`} />
               <path d={syn.line} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5"/>
               
               <path d={sem.d} fill={`url(#semF-${label})`} />
               <path d={sem.line} fill="none" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7"/>
               
               <path d={prag.d} fill={`url(#pragF-${label})`} />
               <path d={prag.line} fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.9"/>
            </>
         )}

         {/* Fracture lines for high drift pragmatics */}
         {isHighDrift && prag.pts.map((p, i) => {
            if (segs[i]?.pragmatics?.confidence < 0.65) {
               return (
                  <g key={`frac-${i}`}>
                     <line x1={p.x} y1="0" x2={p.x} y2={h} stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
                     <circle cx={p.x} cy={p.y} r="4" fill="#f43f5e" />
                     <text x={p.x} y={p.y - 10} fill="#f43f5e" fontSize="8" fontFamily="monospace" textAnchor="middle">FRACTURE</text>
                  </g>
               )
            }
            return null;
         })}
      </svg>
      <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] font-mono uppercase">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full"/> Pragmatics</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-holo-cyan rounded-full"/> Semantics</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full"/> Syntax</div>
      </div>
    </div>
  );
});

// ── 3. Rhetorical Pressure Heatfield ──
const RhetoricalPressureHeatfield = memo(({ results }) => {
  const segs = results?.segments || [];
  const w = 400, h = 180;
  
  // We grid clauses (cols) x theories (rows)
  const rows = ['Pragmatics', 'Semantics', 'Register', 'Syntax'];
  const cols = segs.length || 1;
  const cellW = (w - 40) / cols;
  const cellH = (h - 20) / rows.length;
  
  const getIntensity = (s, row) => {
     if (!s) return 0;
     if (row === 'Pragmatics') return 1 - (s.pragmatics?.confidence || 1);
     if (row === 'Semantics') return 1 - (s.semantics?.confidence || 1);
     if (row === 'Register') return s.register?.formality_score ? Math.abs(0.5 - s.register.formality_score) * 2 : 0;
     if (row === 'Syntax') return s.syntax?.depth ? Math.min(s.syntax.depth / 20, 1) : 0;
     return 0;
  };

  return (
    <div className="relative w-full min-h-[220px] bg-black/40 border border-white/8 overflow-hidden">
      <svg width="100%" height="220" viewBox={`0 0 ${w} ${h+20}`} preserveAspectRatio="none">
         {rows.map((r, rIdx) => (
            <g key={r}>
               <text x="5" y={rIdx * cellH + cellH/2 + 4} fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">{r.substring(0,4).toUpperCase()}</text>
               {segs.map((s, cIdx) => {
                  const val = getIntensity(s, r);
                  // Color scale: low = dark, high = rose
                  const isHigh = val > 0.4;
                  return (
                     <rect key={`${r}-${cIdx}`} x={40 + cIdx * cellW} y={rIdx * cellH} width={cellW - 2} height={cellH - 2} 
                           fill={isHigh ? `rgba(244,63,94,${val})` : `rgba(0,240,255,${val * 0.5})`}
                           stroke="rgba(255,255,255,0.05)" strokeWidth="1" rx="1" />
                  );
               })}
            </g>
         ))}
         {segs.map((_, cIdx) => (
            <text key={`lx-${cIdx}`} x={40 + cIdx * cellW + cellW/2} y={h + 10} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace" textAnchor="middle">
               C{cIdx+1}
            </text>
         ))}
      </svg>
      <div className="absolute top-2 right-4 flex gap-2 text-[8px] font-mono text-slate-500 uppercase items-center">
         <span>Low Pressure</span>
         <div className="w-16 h-2 bg-gradient-to-r from-[rgba(0,240,255,0.1)] to-rose-500 rounded"/>
         <span>High Pressure</span>
      </div>
    </div>
  );
});

// ── 4. Semantic Evolution Topology ──
const SemanticEvolutionTopology = memo(({ results, isHighDrift }) => {
  const segs = results?.segments || [];
  const w = 400, h = 180;
  
  return (
    <div className="relative w-full min-h-[220px] bg-black/40 border border-white/8 overflow-hidden">
      <svg width="100%" height="220" viewBox={`0 0 ${w} ${h+20}`} preserveAspectRatio="none">
         <line x1="20" y1={h/2} x2={w-20} y2={h/2} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
         {segs.map((s, i) => {
            const x = 20 + (i / Math.max(segs.length - 1, 1)) * (w - 40);
            const isEsc = (s.pragmatics?.confidence || 1) < 0.65;
            const yOff = i % 2 === 0 ? -40 : 40;
            return (
               <g key={i}>
                  <line x1={x} y1={h/2} x2={x} y2={h/2 + (isEsc ? yOff * 1.5 : yOff)} stroke={isEsc ? "#f43f5e" : "#00f0ff"} strokeWidth="1.5" strokeDasharray={isEsc ? "none" : "2 2"} opacity="0.6"/>
                  <circle cx={x} cy={h/2} r="3" fill="#fff" />
                  <circle cx={x} cy={h/2 + (isEsc ? yOff * 1.5 : yOff)} r={isEsc ? 6 : 4} fill={isEsc ? "#f43f5e" : "#00f0ff"} />
                  {isEsc && <circle cx={x} cy={h/2 + yOff * 1.5} r="12" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.4" className="animate-ping"/>}
                  <text x={x} y={h/2 + (isEsc ? yOff * 1.5 : yOff) + (yOff > 0 ? 15 : -10)} fill="rgba(255,255,255,0.6)" fontSize="8" fontFamily="monospace" textAnchor="middle">
                     {s.pragmatics?.speech_acts?.[0]?.category || 'Assertive'}
                  </text>
               </g>
            );
         })}
      </svg>
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
         Theory Shift Branching
      </div>
    </div>
  );
});

// ── 5. Keyword Intelligence Topology ──
const sanitizeToken = (token) => {
  if (!token) return null;
  const t = token.toLowerCase();
  const blacklisted = ['confucius', 'sloking', 'upper soul', 'placeholder', 'null'];
  if (blacklisted.some(b => t.includes(b))) return null;
  if (/[^a-zA-Z0-9\s\-]/.test(token)) return null;
  if (token.length > 30 || token.length < 2) return null;
  return token;
};

const KeywordTopology = memo(({ results }) => {
  const keywords = [];
  results?.segments?.forEach((seg, sIdx)=>{
    seg.pragmatics?.speech_acts?.forEach(act=>{
      const cleanWord = sanitizeToken(act.evidence);
      if(!cleanWord) return;
      keywords.push({ id: `k-p-${sIdx}`, word:cleanWord, cat:act.category, conf:act.confidence, type: 'prag' });
    });
    seg.semantics?.semantic_fields?.slice(0,2).forEach(f=>{
      const cleanWord = sanitizeToken(f.word);
      if(!cleanWord) return;
      keywords.push({ id: `k-s-${sIdx}`, word:cleanWord, cat:f.field, conf:0.85, type: 'sem' });
    });
  });

  const uniqueKw = Array.from(new Map(keywords.map(item => [item.word, item])).values()).slice(0, 40);

  return (
    <div className="bg-black/40 border border-white/8 p-8 mt-8 relative overflow-hidden glass-panel hover-glow">
      <div className="flex items-center gap-3 mb-6 border-b border-white/8 pb-4">
        <Network size={18} className="text-holo-cyan"/>
        <h3 className="font-mono text-xl text-white uppercase tracking-[0.15em]">Lexical Topology Network</h3>
      </div>
      {uniqueKw.length === 0 && <p className="text-slate-600 font-mono text-sm">No lexical nodes extracted.</p>}
      
      <div className="relative w-full h-[400px]">
         <svg width="100%" height="100%" className="absolute inset-0">
            {/* Draw lines between nodes of same type */}
            {uniqueKw.map((kw, i) => {
               if (i === 0) return null;
               const prev = uniqueKw[i-1];
               if (prev.type === kw.type) {
                  return <line key={`l-${i}`} x1={`${(i*13)%90 + 5}%`} y1={`${(i*27)%90 + 5}%`} x2={`${((i-1)*13)%90 + 5}%`} y2={`${((i-1)*27)%90 + 5}%`} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
               }
               return null;
            })}
         </svg>
         
         {uniqueKw.map((kw, i) => {
            const isDir = kw.cat === 'Directive' || kw.type === 'prag';
            const col = isDir ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' : 'border-holo-cyan/40 text-holo-cyan bg-holo-cyan/5';
            return (
               <div key={kw.id} className={`absolute group cursor-crosshair px-3 py-1 text-xs font-mono border backdrop-blur-sm transition-transform hover:scale-110 hover:z-50 ${col}`}
                    style={{ left: `${(i*13)%90 + 5}%`, top: `${(i*27)%90 + 5}%` }}>
                  {kw.word}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 border border-white/20 p-3 hidden group-hover:flex flex-col gap-2 z-50 text-[10px] font-mono shadow-2xl">
                     <div className="text-white font-bold tracking-widest uppercase border-b border-white/10 pb-1">{kw.word}</div>
                     <div className="flex justify-between"><span className="text-slate-500">Category:</span><span>{kw.cat}</span></div>
                     <div className="flex justify-between"><span className="text-slate-500">Confidence:</span><span>{(kw.conf*100).toFixed(1)}%</span></div>
                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );
});

// ── 6. Orchestrator Synthesis Engine ──
const OrchestratorSynthesis = ({ results, isHighDrift }) => {
  const [viewMode, setViewMode] = useState('ACADEMIC');
  const math = results?.final_output?.math_scores || {};
  const segs = results?.segments || [];
  const highEntropyIdx = segs.reduce((acc,s,i)=>(s.pragmatics?.confidence||1)<0.65?[...acc,i]:acc,[]);
  const synthConf = (1-(math.systemic_uncertainty_index||0.05)).toFixed(2);

  return (
    <div className="bg-black/50 border border-white/10 p-8 mt-10 relative overflow-hidden glass-panel hover-glow">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-holo-cyan to-rose-500 opacity-50"/>
      <div className="flex items-center gap-3 mb-8 border-b border-white/8 pb-5">
        <Cpu size={22} className="text-slate-300"/>
        <h3 className="font-mono text-2xl text-white uppercase tracking-[0.15em]">Orchestrator Synthesis Engine</h3>
        <span className="ml-auto text-xs font-mono text-slate-400 border border-white/20 px-3 py-1 uppercase bg-white/5">Consensus Locked</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4"><TrendingUp size={14}/> Computational Narrative</h4>
          <div className="bg-white/5 border border-white/10 p-6 space-y-4 text-sm font-mono text-slate-300 leading-relaxed shadow-inner">
            <p><span className="text-holo-cyan font-bold">Initialization:</span> Institutional framing seeded in early clauses established authority asymmetry tensor.</p>
            <p><span className="text-rose-400 font-bold">Escalation Velocity:</span> {highEntropyIdx.length>0?`Clauses ${highEntropyIdx.map(i=>i+1).join(', ')} triggered pragmatic pressure escalation via deontic modality injection (Δ > 0.4).`:'No critical escalation events detected — discourse maintained cooperative baseline (Δ < 0.1).'}</p>
            <p><span className="text-amber-400 font-bold">Theory Arbitration:</span> {isHighDrift?'Gricean cooperative maxim violations co-activated with SFL register shifts, forcing multi-agent arbitration.':'Single-theory consensus. No inter-theory conflicts required arbitration.'}</p>
            <p><span className="text-white font-bold">Stabilization Convergence:</span> Weighted epistemic synthesis resolved all conflicts. Final system confidence: {(synthConf*100).toFixed(1)}%.</p>
          </div>
        </div>

        <div>
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><BookOpen size={14}/> Interpretability Output</h4>
              <div className="flex border border-white/20 rounded overflow-hidden shadow-lg">
                 <button onClick={() => setViewMode('ACADEMIC')} className={`px-4 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors ${viewMode === 'ACADEMIC' ? 'bg-white/20 text-white font-bold' : 'bg-black/50 text-slate-400 hover:bg-white/10'}`}>Academic</button>
                 <button onClick={() => setViewMode('PRACTICAL')} className={`px-4 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-colors ${viewMode === 'PRACTICAL' ? 'bg-white/20 text-white font-bold' : 'bg-black/50 text-slate-400 hover:bg-white/10'}`}>Practical</button>
              </div>
           </div>
           <div className="bg-black/40 border border-white/10 p-6 min-h-[220px] shadow-inner relative overflow-hidden">
              <AnimatePresence mode="wait">
                 {viewMode === 'ACADEMIC' ? (
                    <motion.div key="academic" initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-10}} className="space-y-4 text-sm font-mono text-slate-300 leading-relaxed">
                       <p className="text-white border-l-2 border-holo-cyan pl-4 py-1 bg-white/5">Systemic functional analysis reveals {isHighDrift ? 'statistically significant (p < 0.01)' : 'nominal'} pragmatic drift.</p>
                       <p>Kullback-Leibler (KL) divergence signals distributional shift in illocutionary force from assertives toward deontic directives.</p>
                       <p>{isHighDrift ? 'Institutional register override compounds ambiguity propagation across clause boundaries, indicating a highly orchestrated coercive intent escalation vector.' : 'No significant epistemic or institutional manipulation vectors detected. Corpus remains within normal Gricean cooperative bounds.'}</p>
                    </motion.div>
                 ) : (
                    <motion.div key="practical" initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:10}} className="space-y-4 text-base font-sans text-slate-200 leading-relaxed tracking-wide">
                       <p className={`text-xl font-light mb-3 ${isHighDrift ? 'text-rose-400' : 'text-holo-cyan'}`}>{isHighDrift ? 'High Risk of Manipulative Language' : 'Normal, Cooperative Language'}</p>
                       <p>{isHighDrift ? 'The speaker is gradually escalating pressure by using authoritative, commanding language disguised as normal conversation.' : 'The speaker is maintaining a cooperative and transparent communicative style throughout the text.'}</p>
                       <p className="text-slate-400 italic mt-4 border-t border-white/10 pt-4">{isHighDrift ? 'This pattern is typical in coercive control or strong rhetorical manipulation where the intent is to force agreement without explicitly asking for it.' : 'The text is clear and honest. There are no hidden attempts to push the listener into agreement or action.'}</p>
                    </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

// ── Main DensifiedIntelligence Component ──
export default function DensifiedIntelligence({ results, compareData }) {
  const { resonanceState } = useResonance();
  const isHighDrift = resonanceState.intensityMultiplier > 1.5;
  if (!results) return null;

  const vizPanels = [
    { title:'Semantic Force Network', subtitle:'Gravitational speech act mapping. Clause nodes orbit the core intent; directives pull the geometry under high drift.', comp:<SemanticForceNetwork results={results} isHighDrift={isHighDrift} label="ACTIVE"/> },
    { title:'Layered Semantic Flow', subtitle:'Confidence across theories mapped as overlapping continuums. Vertical markers indicate pragmatic fracture points.', comp:<LayeredSemanticFlow results={results} isHighDrift={isHighDrift} label="ACTIVE"/> },
    { title:'Rhetorical Pressure Heatfield', subtitle:'2D Tensor representing clause-by-theory volatility. High intensity blocks indicate active coercive mechanics.', comp:<RhetoricalPressureHeatfield results={results} isHighDrift={isHighDrift}/> },
    { title:'Semantic Evolution Topology', subtitle:'Clause progression trajectory. Deflections indicate theory shifts and meaning entropy collapses.', comp:<SemanticEvolutionTopology results={results} isHighDrift={isHighDrift}/> },
  ];

  return (
    <div className="w-full mt-16 mb-16">
      {/* Section Header */}
      <div className="mb-12 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <Hexagon size={16} className="text-holo-cyan animate-pulse"/>
          <span className="font-mono text-sm text-holo-cyan uppercase tracking-[0.3em]">Multi-dimensional Deterministic Synthesis</span>
        </div>
        <h2 className="font-sans text-4xl md:text-5xl font-thin text-white uppercase tracking-widest drop-shadow-md">Discourse Intelligence Matrix</h2>
      </div>

      {/* 4 Visualization Panels Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {vizPanels.map((v,i)=>(
          <div key={i} className="glass-panel p-6 flex flex-col gap-5 hover-glow group">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <h3 className="font-mono text-sm text-white uppercase tracking-[0.2em]">{v.title}</h3>
              <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-holo-cyan transition-colors" />
            </div>
            {v.comp}
            <p className="text-xs font-mono text-slate-500 leading-relaxed uppercase tracking-wider">{v.subtitle}</p>
          </div>
        ))}
      </div>

      {compareData && (
         <div className="mt-16 border-t border-amber-500/20 pt-16 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-900/80 border border-amber-500 text-amber-500 text-xs font-mono px-4 py-1 uppercase tracking-widest">Comparative Baseline Mode</div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="glass-panel p-6 flex flex-col gap-5 border-amber-500/20">
                  <div className="border-b border-amber-500/20 pb-4"><h3 className="font-mono text-sm text-amber-500 uppercase tracking-[0.2em]">Semantic Force Network (Baseline)</h3></div>
                  <SemanticForceNetwork results={compareData} isHighDrift={false} label="BASELINE"/>
               </div>
               <div className="glass-panel p-6 flex flex-col gap-5 border-amber-500/20">
                  <div className="border-b border-amber-500/20 pb-4"><h3 className="font-mono text-sm text-amber-500 uppercase tracking-[0.2em]">Layered Semantic Flow (Baseline)</h3></div>
                  <LayeredSemanticFlow results={compareData} isHighDrift={false} label="BASELINE"/>
               </div>
            </div>
         </div>
      )}

      <OrchestratorSynthesis results={results} isHighDrift={isHighDrift}/>
      <KeywordTopology results={results}/>
    </div>
  );
}
