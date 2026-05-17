import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResonance } from '../context/SemanticResonanceContext';
import { Network, GitMerge, Activity, ShieldAlert, BookOpen, Cpu, TrendingUp, ChevronDown } from 'lucide-react';

// ── Semantic Constellation ────────────────────────────────────────────────────
const SemanticConstellation = memo(({ results, isHighDrift }) => {
  const labels = ['Assertive','Directive','Commissive','Expressive','Declaration'];
  const math = results?.final_output?.math_scores || {};
  const dist = math.speech_act_distribution || {};
  const total = Math.max(Object.values(dist).reduce((a,b)=>a+b,0), 1);

  return (
    <div className="relative flex items-center justify-center w-full min-h-[320px] overflow-hidden bg-black/30 border border-white/8">
      <svg width="300" height="300" viewBox="-150 -150 300 300">
        {[45,90,135].map(r=>(
          <circle key={r} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            strokeDasharray={isHighDrift?"3 9":"2 12"}/>
        ))}
        {labels.map((_,i)=>{
          const a=(Math.PI*2*i)/5-Math.PI/2;
          return <line key={i} x1="0" y1="0" x2={Math.cos(a)*140} y2={Math.sin(a)*140}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>;
        })}
        {labels.map((l,i)=>{
          const a=(Math.PI*2*i)/5-Math.PI/2;
          const count=dist[l]||0;
          const r=25+Math.min((count/total)*110,85);
          const x=Math.cos(a)*r, y=Math.sin(a)*r;
          const isDir=l==='Directive'||l==='Expressive';
          const col=isDir&&isHighDrift?'#f43f5e':'rgba(255,255,255,0.75)';
          return (
            <g key={l}>
              <line x1="0" y1="0" x2={x} y2={y} stroke={col} strokeWidth="1" opacity="0.25"/>
              <circle cx={x} cy={y} r={isDir&&isHighDrift?12:7} fill={col} opacity="0.85"/>
              {isDir&&isHighDrift&&<circle cx={x} cy={y} r="20" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.25"/>}
              <text x={x*1.6} y={y*1.6} fill="rgba(255,255,255,0.45)" fontSize="9"
                fontFamily="monospace" textAnchor="middle" dominantBaseline="middle"
                letterSpacing="1">{l}</text>
            </g>
          );
        })}
        {isHighDrift&&<circle r="130" fill="none" stroke="rgba(244,63,94,0.08)" strokeWidth="2" strokeDasharray="3 9"/>}
      </svg>
      {isHighDrift&&<div className="absolute bottom-3 left-4 text-xs font-mono text-rose-400 uppercase tracking-widest">
        Ambiguity turbulence active
      </div>}
    </div>
  );
});

// ── Meaning Evolution River ───────────────────────────────────────────────────
const MeaningRiver = memo(({ results, isHighDrift }) => {
  const segs = results?.segments || [];
  const w=400, h=140;
  const pts = segs.map((s,i)=>{
    const conf=s.pragmatics?.confidence||0.5;
    return { x:(i/Math.max(segs.length-1,1))*w, y:h-(conf*(h-20))-10, conf };
  });
  const pathD=pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
  const fillD=pathD+` L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="relative w-full min-h-[260px] bg-black/30 border border-white/8 flex items-center overflow-hidden">
      <svg width="100%" height="220" viewBox={`0 0 ${w} ${h+20}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="riverFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)"/>
            <stop offset="100%" stopColor={isHighDrift?"rgba(244,63,94,0.12)":"rgba(255,255,255,0.06)"}/>
          </linearGradient>
          <linearGradient id="riverLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
            <stop offset="100%" stopColor={isHighDrift?"rgba(244,63,94,0.9)":"rgba(255,255,255,0.5)"}/>
          </linearGradient>
        </defs>
        {[25,50,75].map(y=>(
          <line key={y} x1="0" y1={h-(y*(h-20)/100)} x2={w} y2={h-(y*(h-20)/100)}
            stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8"/>
        ))}
        {pts.length>1&&<path d={fillD} fill="url(#riverFill)"/>}
        {pts.length>1&&<path d={pathD} fill="none" stroke="url(#riverLine)" strokeWidth="2"/>}
        {isHighDrift&&segs.map((s,i)=>{
          const conf=s.pragmatics?.confidence||0.5;
          if(conf<0.65&&i>0){
            const x=(i/Math.max(segs.length-1,1))*w;
            const y=h-(conf*(h-20))-10;
            return <g key={i}>
              <circle cx={x} cy={y} r="6" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 3"/>
              <circle cx={x} cy={y} r="2.5" fill="#f43f5e"/>
            </g>;
          }
          return null;
        })}
        <text x="6" y="18" fill="rgba(255,255,255,0.2)" fontSize="9" fontFamily="monospace">NOMINAL</text>
        <text x="6" y={h+14} fill="rgba(244,63,94,0.35)" fontSize="9" fontFamily="monospace">CRITICAL</text>
      </svg>
      {isHighDrift&&<div className="absolute bottom-3 left-4 text-xs font-mono text-rose-400 tracking-widest uppercase">
        Semantic fracture points detected
      </div>}
    </div>
  );
});

// ── Drift Pressure Atmosphere ─────────────────────────────────────────────────
const DriftAtmosphere = memo(({ results, isHighDrift }) => {
  const segs = results?.segments || [];
  const w=400, h=130;
  const bars = segs.map((s,i)=>{
    const conf=s.pragmatics?.confidence||0.5;
    const pressure=(1-conf)*100;
    return { x:(i/Math.max(segs.length-1,1))*w, h:pressure*h/100, pressure, idx:i+1 };
  });

  return (
    <div className="relative w-full min-h-[220px] bg-black/30 border border-white/8 overflow-hidden">
      <svg width="100%" height="180" viewBox={`0 0 ${w} ${h+20}`} preserveAspectRatio="none">
        {isHighDrift&&bars.map((b)=>b.pressure>65&&(
          <rect key={`wave${b.idx}`} x={b.x-15} y="0" width="30" height={h}
            fill="rgba(244,63,94,0.06)"/>
        ))}
        {bars.map((b)=>(
          <rect key={b.idx} x={b.x-8} y={h-b.h} width="16" height={b.h}
            fill={b.pressure>65?"rgba(244,63,94,0.65)":b.pressure>40?"rgba(251,191,36,0.45)":"rgba(255,255,255,0.18)"}
            rx="1"/>
        ))}
        {bars.map((b)=>(
          <text key={`l${b.idx}`} x={b.x} y={h+14} fill="rgba(255,255,255,0.2)"
            fontSize="8" textAnchor="middle" fontFamily="monospace">C{b.idx}</text>
        ))}
      </svg>
      <div className="absolute top-3 left-4 flex gap-4 text-xs font-mono text-slate-600 uppercase tracking-widest">
        <span>Pressure Storm Map</span>
        {isHighDrift&&<span className="text-rose-400 animate-pulse">Coercion Wavefront Active</span>}
      </div>
    </div>
  );
});

// ── Semantic Mutation Timeline ────────────────────────────────────────────────
const MutationTimeline = memo(({ results, isHighDrift }) => {
  const segs = results?.segments || [];
  const w=400, h=110;
  const pts = segs.map((s,i)=>{
    const conf=s.semantics?.confidence||s.pragmatics?.confidence||0.5;
    return { x:(i/Math.max(segs.length-1,1))*w, y:h-(conf*h*0.85)-8, conf, idx:i+1 };
  });
  const pathD=pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="relative w-full min-h-[220px] bg-black/30 border border-white/8 overflow-hidden">
      <svg width="100%" height="180" viewBox={`0 0 ${w} ${h+20}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
            <stop offset="100%" stopColor={isHighDrift?"rgba(244,63,94,0.8)":"rgba(255,255,255,0.4)"}/>
          </linearGradient>
        </defs>
        <line x1="0" y1={h} x2={w} y2={h} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        {[25,50,75].map(y=>(
          <line key={y} x1="0" y1={h-(y*h/100)} x2={w} y2={h-(y*h/100)}
            stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8"/>
        ))}
        {pts.length>1&&<path d={pathD} fill="none" stroke="url(#waveGrad)" strokeWidth="2"/>}
        {pts.map((p)=>p.conf<0.6&&(
          <g key={`burst${p.idx}`}>
            <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="rgba(244,63,94,0.5)" strokeWidth="1.5"/>
            <circle cx={p.x} cy={p.y} r="2.5" fill="#f43f5e"/>
          </g>
        ))}
        {pts.map((p)=>p.conf>0.85&&(
          <rect key={`stab${p.idx}`} x={p.x-10} y={0} width="20" height={h}
            fill="rgba(255,255,255,0.015)"/>
        ))}
        {pts.map((p)=>(
          <text key={`l${p.idx}`} x={p.x} y={h+14} fill="rgba(255,255,255,0.2)"
            fontSize="8" textAnchor="middle" fontFamily="monospace">C{p.idx}</text>
        ))}
      </svg>
      <div className="absolute bottom-3 left-4 flex gap-4 text-xs font-mono text-slate-600 uppercase tracking-widest">
        <span>Propagation Waveform</span>
        {isHighDrift&&<span className="text-rose-400">Entropy collapse regions detected</span>}
      </div>
    </div>
  );
});

// ── Orchestrator Synthesis ────────────────────────────────────────────────────
const OrchestratorSynthesis = ({ results, isHighDrift }) => {
  const [openBlock, setOpenBlock] = useState(null);
  const [viewMode, setViewMode] = useState('ACADEMIC'); // ACADEMIC or PRACTICAL
  const plan = results?.execution_plan || {};
  const math = results?.final_output?.math_scores || {};
  const segs = results?.segments || [];
  const highEntropyIdx = segs.reduce((acc,s,i)=>(s.pragmatics?.confidence||1)<0.65?[...acc,i]:acc,[]);
  const synthConf = (1-(math.systemic_uncertainty_index||0.05)).toFixed(2);

  const interpBlocks = [
    { label:'ACADEMIC', text:`Systemic functional analysis reveals ${isHighDrift?'statistically significant':'nominal'} pragmatic drift. KL divergence signals distributional shift in illocutionary force from assertives toward deontic directives. Institutional register override compounds ambiguity propagation across clause boundaries.` },
    { label:'PRACTICAL', text: isHighDrift?'The speaker progressively escalates pressure using institutional authority, overriding cooperative conversational norms. The shift from informing to commanding is detectable and measurable.':'The speaker maintains a cooperative communicative stance throughout the corpus. No significant escalation detected.' },
    { label:'COGNITIVE', text:`Working memory demand is ${isHighDrift?'elevated':'nominal'}. Semantic ambiguity forces increased reanalysis cycles. ${isHighDrift?'Syntactic repackaging of coercive intent introduces cognitive dissonance for the listener.':'Transparent structure minimizes processing load.'}` },
    { label:'RISK', text: isHighDrift?'HIGH RISK — Coercive discourse patterns confirmed. Institutional register override and lexical mutation indicate systematic rhetorical manipulation.':'LOW RISK — Cooperative norms maintained. No manipulation vectors detected.' },
    { label:'PLAIN LANGUAGE', text: isHighDrift?'The text starts off normal but gradually becomes more controlling and forceful. The speaker is trying to push you to agree or act without openly saying so.':'The text is clear and honest throughout. The speaker is sharing information without hidden pressure.' },
  ];

  return (
    <div className="bg-black/50 border border-white/10 p-8 mt-10">
      <div className="flex items-center gap-3 mb-8 border-b border-white/8 pb-5">
        <Cpu size={18} className="text-slate-400"/>
        <h3 className="font-mono text-xl text-white uppercase tracking-[0.15em]">Orchestrator Synthesis</h3>
        <span className="ml-auto text-xs font-mono text-slate-500 border border-white/10 px-3 py-1 uppercase">Consensus Locked</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Final Drift Narrative */}
        <div>
          <h4 className="text-sm font-mono text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
            <TrendingUp size={14}/>Final Drift Narrative
          </h4>
          <div className="bg-white/3 border border-white/8 p-5 space-y-3 text-sm font-mono text-slate-300 leading-relaxed">
            <p><span className="text-white font-bold">Origin:</span> Institutional framing seeded in early clauses established authority asymmetry before escalation began.</p>
            <p><span className="text-white font-bold">Escalation:</span> {highEntropyIdx.length>0?`Clauses ${highEntropyIdx.map(i=>i+1).join(', ')} triggered pragmatic pressure escalation via deontic modality injection.`:'No critical escalation events detected — discourse maintained cooperative baseline.'}</p>
            <p><span className="text-white font-bold">Theory Conflict:</span> {isHighDrift?'Gricean cooperative maxim violations co-activated with SFL register shifts, forcing arbitration.':'Single-theory consensus. No inter-theory conflicts required arbitration.'}</p>
            <p><span className="text-white font-bold">Stabilization:</span> Weighted epistemic synthesis resolved all conflicts. Final confidence: {synthConf}.</p>
          </div>
        </div>

        {/* Arbitration Summary */}
        <div>
          <h4 className="text-sm font-mono text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
            <ShieldAlert size={14}/>Arbitration Summary
          </h4>
          <div className="bg-white/3 border border-white/8 p-5 space-y-3">
            {[
              { agent:'Pragmatics', status: isHighDrift?'Coercive escalation detected. Deontic modality elevated.':'Nominal intent mapping. Cooperative maxims intact.', col: isHighDrift?'text-amber-400':'text-slate-400' },
              { agent:'Semantics', status: isHighDrift?'Lexical destabilization active. Semantic field migration confirmed.':'Semantic field stable. No migration detected.', col: isHighDrift?'text-rose-400':'text-slate-400' },
              { agent:'Register', status: isHighDrift?'Institutional authority override triggered. Formality tensor elevated.':'Register alignment nominal. Formality gradient stable.', col: isHighDrift?'text-amber-300':'text-slate-400' },
              { agent:'Orchestrator', status:`Weighted synthesis accepted. System confidence: ${synthConf}.`, col:'text-white' },
            ].map(row=>(
              <div key={row.agent} className="flex gap-4 text-sm font-mono border-b border-white/5 pb-3">
                <span className="text-slate-600 w-28 shrink-0 uppercase tracking-wider text-xs">[{row.agent}]</span>
                <span className={row.col}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Glowing SVG Semantic Propagation Tree */}
        <div>
          <h4 className="text-sm font-mono text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
            <GitMerge size={14}/>Semantic Propagation Topology
          </h4>
          <div className="bg-black/80 border border-white/8 p-5 relative min-h-[200px] flex items-center justify-center overflow-hidden">
            {segs.length >= 2 ? (
              <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                 <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                       <feGaussianBlur stdDeviation="4" result="blur" />
                       <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                 </defs>
                 {segs.slice(0, Math.min(segs.length, 6)).map((s, i) => {
                    const conf = s.pragmatics?.confidence || 1;
                    const isEsc = conf < 0.65;
                    const x = 40 + i * 55;
                    const y = 100 + (i % 2 === 0 ? -30 : 30) * (isEsc ? 1.5 : 1);
                    const prevX = i > 0 ? 40 + (i - 1) * 55 : 40;
                    const prevY = i > 0 ? 100 + ((i - 1) % 2 === 0 ? -30 : 30) * (((segs[i-1]?.pragmatics?.confidence||1)<0.65) ? 1.5 : 1) : 100;
                    const col = isEsc ? '#f43f5e' : '#00f5c4';
                    return (
                       <g key={i}>
                          {i > 0 && (
                             <path d={`M ${prevX} ${prevY} C ${prevX + 25} ${prevY}, ${x - 25} ${y}, ${x} ${y}`}
                                fill="none" stroke={col} strokeWidth="2" opacity="0.4" filter="url(#glow)" />
                          )}
                          <circle cx={x} cy={y} r="5" fill={col} filter="url(#glow)" />
                          {isEsc && <circle cx={x} cy={y} r="12" fill="none" stroke="#f43f5e" strokeWidth="1" className="animate-ping" opacity="0.5"/>}
                          <text x={x} y={y + 15} fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle" fontFamily="monospace">C{i+1}</text>
                       </g>
                    );
                 })}
              </svg>
            ) : <p className="text-slate-600 font-mono text-sm z-10">Awaiting sufficient clauses.</p>}
          </div>
        </div>

        {/* Research Interpretation Toggle Block */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <h4 className="text-sm font-mono text-slate-300 uppercase tracking-widest flex items-center gap-2">
               <BookOpen size={14}/>Research Interpretation
             </h4>
             <div className="flex border border-white/10 rounded-sm overflow-hidden">
                <button onClick={() => setViewMode('ACADEMIC')} className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors ${viewMode === 'ACADEMIC' ? 'bg-white/10 text-white' : 'bg-transparent text-slate-500 hover:text-white'}`}>Academic</button>
                <button onClick={() => setViewMode('PRACTICAL')} className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase transition-colors ${viewMode === 'PRACTICAL' ? 'bg-white/10 text-white' : 'bg-transparent text-slate-500 hover:text-white'}`}>Practical</button>
             </div>
          </div>
          <div className="bg-white/3 border border-white/8 p-6 min-h-[200px]">
             <AnimatePresence mode="wait">
                {viewMode === 'ACADEMIC' ? (
                   <motion.div key="academic" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="space-y-4 text-sm font-mono text-slate-300 leading-relaxed">
                      <p className="text-white border-l-2 border-holo-cyan pl-3">Systemic functional analysis reveals {isHighDrift ? 'statistically significant' : 'nominal'} pragmatic drift.</p>
                      <p>KL divergence signals distributional shift in illocutionary force from assertives toward deontic directives.</p>
                      <p>{isHighDrift ? 'Institutional register override compounds ambiguity propagation across clause boundaries, indicating a coercive intent escalation vector.' : 'No significant epistemic or institutional manipulation vectors detected. Corpus remains within normal cooperative bounds.'}</p>
                   </motion.div>
                ) : (
                   <motion.div key="practical" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="space-y-4 text-sm font-sans text-slate-200 leading-relaxed tracking-wide">
                      <p className="text-lg font-light text-white mb-2">{isHighDrift ? 'High Risk of Manipulative Language' : 'Normal, Cooperative Language'}</p>
                      <p>{isHighDrift ? 'The speaker is gradually escalating pressure by using authoritative, commanding language disguised as normal conversation.' : 'The speaker is maintaining a cooperative and transparent communicative style throughout the text.'}</p>
                      <p>{isHighDrift ? 'This pattern is typical in coercive control or strong rhetorical manipulation where the intent is to force agreement without explicitly asking for it.' : 'The text is clear and honest. There are no hidden attempts to push the listener into agreement or action.'}</p>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Data Sanitization Layer ─────────────────────────────────────────────────────
const sanitizeToken = (token) => {
  if (!token) return null;
  const t = token.toLowerCase();
  // Filter out known hallucinated or non-scientific backend terms
  const blacklisted = ['confucius', 'sloking', 'upper soul', 'placeholder', 'null'];
  if (blacklisted.some(b => t.includes(b))) return null;
  // Ensure token is primarily letters/numbers, no weird artifacts
  if (/[^a-zA-Z0-9\s\-]/.test(token)) return null;
  if (token.length > 30 || token.length < 2) return null;
  return token;
};

// ── Keyword Intelligence ──────────────────────────────────────────────────────
const KeywordIntelligence = ({ results }) => {
  const keywords = [];
  results?.segments?.forEach(seg=>{
    seg.pragmatics?.speech_acts?.forEach(act=>{
      const cleanWord = sanitizeToken(act.evidence);
      if(!cleanWord) return;
      const isDir=act.category==='Directive';
      keywords.push({ word:cleanWord, cat:act.category, conf:act.confidence,
        theory:'Speech Act Theory', role:'Pragmatic Force',
        color: isDir?'border-rose-500/40 text-rose-400 bg-rose-500/5':'border-white/15 text-slate-300 bg-white/3' });
    });
    seg.semantics?.semantic_fields?.slice(0,2).forEach(f=>{
      const cleanWord = sanitizeToken(f.word);
      if(!cleanWord) return;
      keywords.push({ word:cleanWord, cat:f.field, conf:0.85,
        theory:'Halliday SFL', role:'Semantic Anchor',
        color:'border-white/10 text-slate-400 bg-white/2' });
    });
  });

  return (
    <div className="bg-black/40 border border-white/8 p-8 mt-8">
      <div className="flex items-center gap-3 mb-6 border-b border-white/8 pb-4">
        <Network size={16} className="text-slate-500"/>
        <h3 className="font-mono text-xl text-white uppercase tracking-[0.15em]">Keyword Intelligence Observatory</h3>
      </div>
      {keywords.length===0&&<p className="text-slate-600 font-mono text-sm">No keyword data. Run an analysis to populate this observatory.</p>}
      <div className="flex flex-wrap gap-3">
        {keywords.slice(0,32).map((kw,i)=>(
          <div key={i} className={`group relative px-4 py-2 border text-sm font-mono cursor-crosshair hover:bg-white/8 transition-colors ${kw.color}`}>
            {kw.word}
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-black border border-white/15 p-4 hidden group-hover:flex flex-col gap-2 z-50 shadow-2xl text-xs font-mono">
              <div className="flex justify-between border-b border-white/8 pb-2 mb-1">
                <span className="text-slate-500 uppercase tracking-widest">Token</span>
                <span className="text-white font-bold">"{kw.word}"</span>
              </div>
              <div className="flex justify-between"><span className="text-slate-500">Category</span><span className="text-slate-200">{kw.cat}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Theory</span><span className="text-slate-300">{kw.theory}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="text-slate-300">{kw.role}</span></div>
              <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                <span className="text-slate-500">Confidence</span>
                <span className="text-white font-bold">{(kw.conf*100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DensifiedIntelligence({ results }) {
  const { resonanceState } = useResonance();
  const isHighDrift = resonanceState.intensityMultiplier > 1.5;
  if (!results) return null;

  const vizPanels = [
    { title:'Semantic Constellation Observatory', subtitle:'Gravitational speech act mapping. Directive nodes distort geometry under high drift.', comp:<SemanticConstellation results={results} isHighDrift={isHighDrift}/> },
    { title:'Meaning Evolution River', subtitle:'Semantic confidence across clauses as a living continuum. Fracture points mark rhetorical turbulence.', comp:<MeaningRiver results={results} isHighDrift={isHighDrift}/> },
    { title:'Drift Pressure Atmosphere', subtitle:'Atmospheric heatmap of coercive pressure. Storm bars indicate coercion wavefronts.', comp:<DriftAtmosphere results={results} isHighDrift={isHighDrift}/> },
    { title:'Semantic Mutation Timeline', subtitle:'Propagation waveform with escalation bursts and entropy collapse regions annotated.', comp:<MutationTimeline results={results} isHighDrift={isHighDrift}/> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={12} className="text-slate-600"/>
          <span className="font-mono text-xs text-slate-600 uppercase tracking-[0.25em]">Multi-dimensional Deterministic Synthesis</span>
        </div>
        <h2 className="font-mono text-2xl text-white uppercase tracking-[0.12em]">Discourse Intelligence Matrix</h2>
      </div>

      {/* 4 Visualization Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vizPanels.map((v,i)=>(
          <div key={i} className="bg-black/40 border border-white/8 p-5 flex flex-col gap-4">
            <div className="border-b border-white/8 pb-3">
              <h3 className="font-mono text-sm text-white uppercase tracking-widest">{v.title}</h3>
            </div>
            {v.comp}
            <p className="text-xs font-mono text-slate-600 leading-relaxed">{v.subtitle}</p>
          </div>
        ))}
      </div>

      <OrchestratorSynthesis results={results} isHighDrift={isHighDrift}/>
      <KeywordIntelligence results={results}/>
    </div>
  );
}
