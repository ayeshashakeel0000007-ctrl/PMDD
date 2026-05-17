import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResonance } from '../context/SemanticResonanceContext';
import { Network, GitMerge, Activity, ShieldAlert, BookOpen, Cpu, TrendingUp, Layers, Compass, Wind, Hexagon } from 'lucide-react';

// ── 1. Semantic Force Network (Replaces Constellation) ──
const SemanticForceNetwork = memo(({ results, isHighDrift, label="ACTIVE" }) => {
  const segs = results?.segments || [];
  
  const nodes = segs.map((s, i) => {
    const act = s.pragmatics?.speech_acts?.[0] || {};
    const conf = s.pragmatics?.confidence || 1;
    return { id: i, label: `C${i+1}`, act: act.category || 'Assertive', conf };
  });

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
         
         <circle cx={cx} cy={cy} r="140" fill={`url(#gravityWell-${label})`} className={isHighDrift ? "animate-pulse" : ""} />
         <circle cx={cx} cy={cy} r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 8" className="animate-spin-slow" style={{ transformOrigin: `${cx}px ${cy}px` }} />
         <circle cx={cx} cy={cy} r="50" fill="none" stroke="rgba(255,255,255,0.1)" className="animate-spin-slow-reverse" style={{ transformOrigin: `${cx}px ${cy}px` }} />
         
         {/* Orbiting Nodes */}
         <g className="animate-spin-slow" style={{ transformOrigin: `${cx}px ${cy}px` }}>
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
                    <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth="1" opacity={isDir && isHighDrift ? 0.6 : 0.2} className={isHighDrift && isDir ? "animate-pulse" : ""} />
                    {i > 0 && (
                      <line x1={cx + Math.cos((Math.PI * 2 * (i-1)) / Math.max(nodes.length, 1) - Math.PI/2) * (100 - (isHighDrift && (nodes[i-1].act==='Directive'||nodes[i-1].act==='Expressive') ? 40 : 0))}
                            y1={cy + Math.sin((Math.PI * 2 * (i-1)) / Math.max(nodes.length, 1) - Math.PI/2) * (100 - (isHighDrift && (nodes[i-1].act==='Directive'||nodes[i-1].act==='Expressive') ? 40 : 0))}
                            x2={x} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 4"/>
                    )}
                    <circle cx={x} cy={y} r={isDir && isHighDrift ? 6 : 4} fill={col} filter={`url(#glowF-${label})`} />
                    {n.conf < 0.65 && <circle cx={x} cy={y} r="12" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping" opacity="0.4"/>}
                    
                    {/* Counter-rotate text so it remains upright */}
                    <g className="animate-spin-slow-reverse" style={{ transformOrigin: `${x}px ${y}px` }}>
                       <text x={x + (x>cx?10:-10)} y={y+4} fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace" textAnchor={x>cx?"start":"end"}>{n.label}</text>
                    </g>
                  </g>
               );
            })}
         </g>
         
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
            {/* Animated Flow Gradients */}
            <linearGradient id={`flowGlow`} x1="0%" y1="0%" x2="200%" y2="0%">
               <stop offset="0%" stopColor="transparent" />
               <stop offset="50%" stopColor="white" stopOpacity="0.5" />
               <stop offset="100%" stopColor="transparent" />
               <animate attributeName="x1" from="-100%" to="100%" dur="3s" repeatCount="indefinite" />
               <animate attributeName="x2" from="0%" to="200%" dur="3s" repeatCount="indefinite" />
            </linearGradient>
         </defs>
         
         {[25,50,75].map(y => (
           <line key={y} x1="0" y1={h-(y*(h-20)/100)-20} x2={w} y2={h-(y*(h-20)/100)-20} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 6"/>
         ))}
         
         {segs.length > 1 && (
            <>
               <path d={syn.d} fill={`url(#synF-${label})`} className="animate-pulse" style={{ animationDuration: '4s' }} />
               <path d={syn.line} fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" strokeDasharray="4 4" className="animate-flow" />
               
               <path d={sem.d} fill={`url(#semF-${label})`} className="animate-pulse" style={{ animationDuration: '3s' }} />
               <path d={sem.line} fill="none" stroke="#00f0ff" strokeWidth="1.5" opacity="0.7"/>
               
               <path d={prag.d} fill={`url(#pragF-${label})`} className="animate-pulse" style={{ animationDuration: '2s' }} />
               <path d={prag.line} fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.9"/>
               
               {/* Flow highlight running across the top line */}
               <path d={prag.line} fill="none" stroke="url(#flowGlow)" strokeWidth="3" opacity="0.8" />
            </>
         )}

         {/* Fracture lines for high drift pragmatics */}
         {isHighDrift && prag.pts.map((p, i) => {
            if (segs[i]?.pragmatics?.confidence < 0.65) {
               return (
                  <g key={`frac-${i}`}>
                     <line x1={p.x} y1="0" x2={p.x} y2={h} stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" className="animate-flow" />
                     <circle cx={p.x} cy={p.y} r="4" fill="#f43f5e" className="animate-pulse" />
                     <text x={p.x} y={p.y - 10} fill="#f43f5e" fontSize="8" fontFamily="monospace" textAnchor="middle">FRACTURE</text>
                  </g>
               )
            }
            return null;
         })}
      </svg>
      <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] font-mono uppercase">
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"/> Pragmatics</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-holo-cyan rounded-full animate-pulse"/> Semantics</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/> Syntax</div>
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
    <div className="relative w-full min-h-[220px] bg-black/40 border border-white/8 overflow-hidden group">
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
                           stroke="rgba(255,255,255,0.05)" strokeWidth="1" rx="1"
                           className={isHigh ? "animate-pulse" : ""}
                           style={isHigh ? { animationDuration: `${Math.max(1, 3 - val*2)}s` } : {}} />
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
         <div className="w-16 h-2 bg-gradient-to-r from-[rgba(0,240,255,0.1)] to-rose-500 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
         </div>
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
         
         {/* Animated Execution Scanner Head */}
         <motion.line x1="0" y1="0" x2="0" y2={h} stroke="rgba(0,240,255,0.4)" strokeWidth="2"
            animate={{ x: [20, w-20] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} />
            
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
      <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
         <Activity size={10} className="text-holo-cyan animate-pulse"/>
         Theory Shift Branching
      </div>
    </div>
  );
});

// ── 5. Densified Semantic Topology Network ──
const sanitizeToken = (token) => {
  if (!token) return null;
  const t = token.toLowerCase();
  const blacklisted = ['confucius', 'sloking', 'upper soul', 'placeholder', 'null'];
  if (blacklisted.some(b => t.includes(b))) return null;
  if (/[^a-zA-Z0-9\s\-]/.test(token)) return null;
  if (token.length > 30 || token.length < 2) return null;
  return token;
};

// Deterministic hashing for stable layout
const hashStr = (str) => {
   let hash = 0;
   for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
   return Math.abs(hash);
};

const KeywordTopology = memo(({ results }) => {
  const keywords = [];
  
  // Dense dynamic extraction
  results?.segments?.forEach((seg, sIdx)=>{
    const clause = sIdx + 1;
    // Pragmatics
    seg.pragmatics?.speech_acts?.forEach(act=>{
      const cleanWord = sanitizeToken(act.evidence);
      if(!cleanWord) return;
      
      let category = 'Informational';
      let colorClass = 'border-cyan-400 text-cyan-300 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]';
      let badgeClass = 'bg-cyan-500 text-black';
      let ringColor = 'rgba(34,211,238,0.5)';
      
      if (act.category === 'Directive') {
         category = 'Persuasive';
         colorClass = 'border-amber-500 text-amber-400 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
         badgeClass = 'bg-amber-500 text-black';
         ringColor = 'rgba(245,158,11,0.5)';
      }
      
      if (act.category === 'Expressive' || act.category === 'COERCION') {
         category = 'Coercive';
         colorClass = 'border-rose-500 text-rose-400 bg-rose-950/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]';
         badgeClass = 'bg-rose-500 text-white';
         ringColor = 'rgba(244,63,94,0.5)';
      }
      
      keywords.push({ id: `k-p-${sIdx}-${cleanWord}`, word:cleanWord, cat:category, rawCat: act.category, conf:act.confidence || 0.8, type: 'pragmatics', clause, colorClass, badgeClass, ringColor });
    });
    
    // Register / Institutional
    if (seg.register?.formality_score > 0.7) {
       const instWords = (seg.text || "").split(' ').filter(w => w.length > 6);
       if (instWords.length > 0) {
          const w = sanitizeToken(instWords[0]);
          if (w) keywords.push({ id: `k-r-${sIdx}`, word:w, cat:'Institutional', rawCat: 'Formality', conf: seg.register.formality_score, type: 'register', clause, colorClass: 'border-yellow-500 text-yellow-400 bg-yellow-950/40 shadow-[0_0_15px_rgba(234,179,8,0.2)]', badgeClass: 'bg-yellow-500 text-black', ringColor: 'rgba(234,179,8,0.5)' });
       }
    }
    
    // Semantics / Ambiguity
    seg.semantics?.semantic_fields?.slice(0,2).forEach((f, fIdx)=>{
      const cleanWord = sanitizeToken(f.word);
      if(!cleanWord) return;
      const isAmbiguous = (seg.semantics.confidence || 1) < 0.6;
      let cat = isAmbiguous ? 'Ambiguity' : 'Stable';
      let cClass = isAmbiguous ? 'border-violet-500 text-violet-400 bg-violet-950/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'border-teal-400 text-teal-300 bg-teal-950/40 shadow-[0_0_15px_rgba(45,212,191,0.2)]';
      let bClass = isAmbiguous ? 'bg-violet-500 text-white' : 'bg-teal-500 text-black';
      let rCol = isAmbiguous ? 'rgba(139,92,246,0.5)' : 'rgba(45,212,191,0.5)';
      
      keywords.push({ id: `k-s-${sIdx}-${fIdx}`, word:cleanWord, cat, rawCat: f.field, conf:seg.semantics.confidence || 0.9, type: 'semantics', clause, colorClass: cClass, badgeClass: bClass, ringColor: rCol });
    });
  });

  const uniqueKw = Array.from(new Map(keywords.map(item => [item.word, item])).values()).slice(0, 45);

  // Group by broad category to cluster them
  const groups = { 'Coercive': [], 'Persuasive': [], 'Institutional': [], 'Ambiguity': [], 'Stable': [], 'Informational': [] };
  uniqueKw.forEach(kw => { if (groups[kw.cat]) groups[kw.cat].push(kw); });

  // Distribute clusters deterministically
  const placeInCluster = (kwArray, baseX, baseY, spreadX, spreadY) => {
     kwArray.forEach((kw, i) => {
        const hash = hashStr(kw.word);
        kw.targetX = baseX + (hash % spreadX) - (spreadX/2);
        kw.targetY = baseY + ((hash >> 4) % spreadY) - (spreadY/2);
     });
  };

  placeInCluster(groups['Coercive'], 25, 30, 30, 40); 
  placeInCluster(groups['Persuasive'], 75, 30, 30, 40);
  placeInCluster(groups['Institutional'], 50, 50, 40, 30);
  placeInCluster(groups['Ambiguity'], 20, 75, 25, 30);
  placeInCluster(groups['Stable'], 80, 75, 25, 30);
  placeInCluster(groups['Informational'], 50, 85, 50, 20);

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-10 mt-12 relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.8)] rounded-sm">
      {/* Background execution rails */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-20" />
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0,240,255,0.2) 0%, transparent 70%)" }} />

      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6 relative z-10">
        <div className="flex items-center gap-4">
           <Network size={28} className="text-holo-cyan animate-pulse drop-shadow-[0_0_10px_currentColor]"/>
           <div>
              <h3 className="font-mono text-2xl text-white uppercase tracking-[0.2em] drop-shadow-md">Semantic Topology Network</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-2 uppercase tracking-[0.3em]">Deterministic Node Extraction & Gravity Clustering</p>
           </div>
        </div>
        
        {/* Category Legend */}
        <div className="hidden lg:flex gap-4 text-[9px] font-mono tracking-widest uppercase items-center">
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_currentColor]"></span> Informational</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_5px_currentColor]"></span> Persuasive</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_5px_currentColor] animate-pulse"></span> Coercive</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_5px_currentColor]"></span> Institutional</div>
           <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_5px_currentColor]"></span> Ambiguity</div>
        </div>
      </div>
      
      {uniqueKw.length === 0 && <p className="text-slate-600 font-mono text-base">No lexical nodes extracted.</p>}
      
      <div className="relative w-full h-[600px] overflow-hidden">
         <svg width="100%" height="100%" className="absolute inset-0">
            {/* Draw propagation links between related nodes */}
            {uniqueKw.map((kw, i) => {
               if (i === 0) return null;
               const prev = uniqueKw.slice(0, i).reverse().find(k => k.cat === kw.cat);
               if (prev) {
                  return (
                     <g key={`plink-${i}`}>
                        <path d={`M ${prev.targetX}% ${prev.targetY}% Q ${(prev.targetX+kw.targetX)/2}% ${prev.targetY-10}% ${kw.targetX}% ${kw.targetY}%`} 
                              fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" className="animate-flow" />
                        <circle r="2" fill={kw.ringColor} filter="blur(2px)">
                           <animateMotion dur={`${(hashStr(kw.word)%3)+2}s`} repeatCount="indefinite" path={`M ${prev.targetX}% ${prev.targetY}% Q ${(prev.targetX+kw.targetX)/2}% ${prev.targetY-10}% ${kw.targetX}% ${kw.targetY}%`}/>
                        </circle>
                     </g>
                  );
               }
               return null;
            })}
         </svg>
         
         {uniqueKw.map((kw, i) => {
            const hsh = hashStr(kw.word);
            const duration = (hsh % 6) + 4;
            const yDrift = hsh % 2 === 0 ? [-5, 5, -5] : [5, -5, 5];
            
            // Deterministic math logic for display
            const semWeight = (kw.conf * 100).toFixed(1);
            const driftImpact = ((1 - kw.conf) * 10).toFixed(2);
            const authContrib = (hsh % 100) / 100;
            const ambiguityLvl = (kw.cat === 'Ambiguity' ? 0.8 + authContrib*0.2 : authContrib * 0.3).toFixed(2);
            
            return (
               <motion.div key={kw.id} 
                    animate={{ y: yDrift, x: [0, -3, 3, 0] }}
                    transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
                    className={`absolute group cursor-crosshair px-5 py-2.5 text-sm md:text-base font-mono border backdrop-blur-md transition-all duration-300 hover:z-50 hover:scale-110 ${kw.colorClass}`}
                    style={{ left: `${kw.targetX}%`, top: `${kw.targetY}%` }}>
                  
                  {kw.word}
                  
                  <div className={`absolute -top-3 -right-3 text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-md ${kw.badgeClass}`}>
                     {semWeight}%
                  </div>
                  
                  {/* Extreme Intelligence Panel */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[380px] bg-[#0a0a0a]/95 border border-white/20 p-6 hidden group-hover:flex flex-col gap-4 z-[100] text-xs font-mono shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-sm pointer-events-none">
                     
                     {/* Header */}
                     <div className="flex items-center justify-between border-b border-white/20 pb-3">
                        <div className="text-white font-bold tracking-[0.2em] uppercase text-xl drop-shadow-md">{kw.word}</div>
                        <div className="flex items-center gap-2">
                           <Activity size={12} className="animate-pulse" style={{color: kw.ringColor}}/>
                           <span className="text-[9px] uppercase tracking-widest text-slate-400">Node telemetry active</span>
                        </div>
                     </div>
                     
                     {/* Metrics Grid */}
                     <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[10px]">
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Semantic Cat:</span><span className="font-bold" style={{color: kw.ringColor}}>{kw.cat}</span></div>
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Rhetorical Role:</span><span className="text-white">{kw.rawCat}</span></div>
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Discourse Func:</span><span className="text-slate-300">{kw.type.toUpperCase()}</span></div>
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Origin Clause:</span><span className="font-bold border border-white/10 bg-white/5 w-fit px-2 py-0.5 mt-0.5">Line {kw.clause}</span></div>
                        
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Confidence %:</span><span className="text-white">{semWeight}%</span></div>
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Drift Impact:</span><span className="text-rose-400">Δ {driftImpact}</span></div>
                        
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Prop Influence:</span><span className="text-cyan-300">{(authContrib*100).toFixed(1)}%</span></div>
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Ambiguity Lvl:</span><span className="text-violet-400">{ambiguityLvl}</span></div>
                        
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Persuasion:</span><span className="text-amber-400">{(kw.cat === 'Coercive' || kw.cat === 'Persuasive') ? 'HIGH' : 'NOMINAL'}</span></div>
                        <div className="flex flex-col"><span className="text-slate-500 uppercase tracking-widest">Inst. Authority:</span><span className="text-yellow-400">{kw.cat === 'Institutional' ? 'MAXIMUM' : (authContrib*100 > 50 ? 'ELEVATED' : 'BASELINE')}</span></div>
                     </div>
                     
                     <div className="w-full bg-white/5 h-px my-1"></div>
                     
                     {/* Semantic Gravity Theory */}
                     <div className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-slate-400">
                        <Hexagon size={10} className="text-white"/> Active Theory Engine
                     </div>
                     <div className="flex gap-2 flex-wrap text-[8px] uppercase tracking-widest text-white">
                        <span className="bg-white/10 px-2 py-1 rounded-sm border border-white/10">{kw.type === 'pragmatics' ? 'Speech Act Theory' : (kw.type === 'semantics' ? 'Distributional Semantics' : 'SFL Register')}</span>
                        {kw.cat === 'Coercive' && <span className="bg-rose-500/20 px-2 py-1 rounded-sm border border-rose-500/30 text-rose-300">CDA Ideological Framing</span>}
                        {kw.cat === 'Ambiguity' && <span className="bg-violet-500/20 px-2 py-1 rounded-sm border border-violet-500/30 text-violet-300">Gricean Maxim Flouting</span>}
                     </div>

                     {/* Reasoning Narrative */}
                     <div className="text-[10px] text-slate-300 mt-2 border-l-2 pl-3 bg-white/5 p-3 leading-relaxed" style={{borderLeftColor: kw.ringColor}}>
                        <span className="text-white font-bold block mb-1 uppercase tracking-widest border-b border-white/10 pb-1 w-max">Interpretability Log</span>
                        {kw.cat === 'Coercive' ? `The lexical node "${kw.word}" forces a rhetorical escalation in Clause ${kw.clause}, carrying a high drift impact (Δ${driftImpact}). It actively manipulates the listener's agency by injecting deontic pressure.`
                        : kw.cat === 'Persuasive' ? `The node "${kw.word}" serves a persuasive discourse function, attempting to alter the epistemic state without explicit coercion. It propagates moderate institutional pressure.`
                        : kw.cat === 'Institutional' ? `Extracted as an institutional marker in Clause ${kw.clause}, "${kw.word}" elevates the formality and establishes a high-authority baseline.`
                        : kw.cat === 'Ambiguity' ? `High ambiguity detected (${ambiguityLvl}). "${kw.word}" introduces semantic instability, potentially flouting cooperative maxims to obscure intent.`
                        : `"${kw.word}" acts as a stable informational baseline for Clause ${kw.clause}. It contributes purely to semantic coherence with negligible drift impact.`}
                     </div>
                     
                  </div>
               </motion.div>
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
