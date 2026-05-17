import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useResonance } from '../context/SemanticResonanceContext';
import { Network, GitMerge, Activity, ShieldAlert, BookOpen, Cpu, TrendingUp } from 'lucide-react';

// ── Semantic Constellation (replaces SVGRadar) ──────────────────────────────
const SemanticConstellation = memo(({ results, isHighDrift }) => {
  const labels = ['Assertive','Directive','Commissive','Expressive','Declaration'];
  const math = results?.final_output?.math_scores || {};
  const dist = math.speech_act_distribution || {};
  const total = Object.values(dist).reduce((a,b)=>a+b,0) || 1;

  return (
    <div className="relative flex items-center justify-center w-full min-h-[280px] overflow-hidden bg-black/40 border border-white/5">
      <svg width="260" height="260" viewBox="-130 -130 260 260">
        {/* orbit rings */}
        {[40,80,120].map(r=>(
          <circle key={r} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"
            strokeDasharray={isHighDrift?"4 8":"2 10"}/>
        ))}
        {/* axis lines */}
        {labels.map((_,i)=>{
          const a=(Math.PI*2*i)/5-Math.PI/2;
          return <line key={i} x1="0" y1="0" x2={Math.cos(a)*120} y2={Math.sin(a)*120}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>;
        })}
        {/* nodes */}
        {labels.map((l,i)=>{
          const a=(Math.PI*2*i)/5-Math.PI/2;
          const count=dist[l]||0;
          const r=20+Math.min((count/total)*100,80);
          const x=Math.cos(a)*r, y=Math.sin(a)*r;
          const isDir=l==='Directive'||l==='Expressive';
          const col=isDir&&isHighDrift?'#f43f5e':'rgba(255,255,255,0.7)';
          return (
            <g key={l}>
              <line x1="0" y1="0" x2={x} y2={y} stroke={col} strokeWidth="1" opacity="0.3"/>
              <circle cx={x} cy={y} r={isDir&&isHighDrift?10:6} fill={col} opacity="0.8"/>
              {isDir&&isHighDrift&&<circle cx={x} cy={y} r="16" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.3"/>}
              <text x={x*1.5} y={y*1.5} fill="rgba(255,255,255,0.5)" fontSize="8"
                fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">{l}</text>
            </g>
          );
        })}
        {/* turbulence ring on high drift */}
        {isHighDrift&&<circle r="110" fill="none" stroke="rgba(244,63,94,0.1)"
          strokeWidth="2" strokeDasharray="3 9"/>}
      </svg>
      {isHighDrift&&<div className="absolute bottom-2 left-3 text-xs font-mono text-rose-400 uppercase tracking-widest">
        Ambiguity turbulence active
      </div>}
    </div>
  );
});

// ── Meaning Evolution River (replaces SVGSankey) ─────────────────────────────
const MeaningRiver = memo(({ results, isHighDrift }) => {
  const segs = results?.segments || [];
  const points = segs.map((s,i)=>{
    const conf=s.pragmatics?.confidence||0.5;
    const y=100-conf*80;
    return `${(i/(Math.max(segs.length-1,1)))*380},${y}`;
  }).join(' ');

  return (
    <div className="relative w-full min-h-[220px] bg-black/40 border border-white/5 flex items-center overflow-hidden">
      <svg width="100%" height="200" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
            <stop offset="60%" stopColor="rgba(255,255,255,0.3)"/>
            <stop offset="100%" stopColor={isHighDrift?"rgba(244,63,94,0.8)":"rgba(255,255,255,0.5)"}/>
          </linearGradient>
          <filter id="blur1"><feGaussianBlur stdDeviation="2"/></filter>
        </defs>
        {/* glow path */}
        {segs.length>1&&<polyline points={points} fill="none"
          stroke={isHighDrift?"rgba(244,63,94,0.2)":"rgba(255,255,255,0.08)"}
          strokeWidth="16" filter="url(#blur1)"/>}
        {/* main path */}
        {segs.length>1&&<polyline points={points} fill="none"
          stroke="url(#riverGrad)" strokeWidth="2"/>}
        {/* fracture points on high drift */}
        {isHighDrift&&segs.map((s,i)=>{
          const conf=s.pragmatics?.confidence||0.5;
          if(conf<0.65&&i>0){
            const x=(i/(Math.max(segs.length-1,1)))*380;
            const y=100-conf*80;
            return <circle key={i} cx={x} cy={y} r="5" fill="none" stroke="#f43f5e"
              strokeWidth="1" strokeDasharray="2 3"/>;
          }
          return null;
        })}
        {/* labels */}
        <text x="4" y="20" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">NOMINAL</text>
        <text x="4" y="150" fill="rgba(244,63,94,0.4)" fontSize="8" fontFamily="monospace">CRITICAL</text>
      </svg>
      {isHighDrift&&<div className="absolute bottom-2 left-3 text-xs font-mono text-rose-400 tracking-widest uppercase">
        Semantic fracture points detected
      </div>}
    </div>
  );
});

// ── Drift Pressure Atmosphere (replaces area chart) ──────────────────────────
const DriftAtmosphere = memo(({ results, isHighDrift }) => {
  const segs = results?.segments || [];
  const w=400, h=120;
  const bars = segs.map((s,i)=>{
    const conf=s.pragmatics?.confidence||0.5;
    const pressure=(1-conf)*100;
    return { x:(i/Math.max(segs.length-1,1))*w, h:pressure*h/100, pressure };
  });

  return (
    <div className="relative w-full min-h-[180px] bg-black/40 border border-white/5 overflow-hidden">
      <svg width="100%" height="140" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="atmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isHighDrift?"#f43f5e":"rgba(255,255,255,0.8)"}/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
        </defs>
        {/* heatmap bars */}
        {bars.map((b,i)=>(
          <rect key={i} x={b.x-6} y={h-b.h} width="12" height={b.h}
            fill={b.pressure>60?"rgba(244,63,94,0.6)":b.pressure>35?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.2)"}
            rx="1"/>
        ))}
        {/* coercion wavefront */}
        {isHighDrift&&bars.map((b,i)=>b.pressure>65&&(
          <line key={`w${i}`} x1={b.x} y1="0" x2={b.x} y2={h}
            stroke="rgba(244,63,94,0.15)" strokeWidth="20"/>
        ))}
      </svg>
      <div className="absolute top-2 left-3 flex gap-4 text-xs font-mono text-slate-600 uppercase tracking-widest">
        <span>Pressure Storm Map</span>
        {isHighDrift&&<span className="text-rose-400 animate-pulse">Coercion Wavefront Active</span>}
      </div>
    </div>
  );
});

// ── Semantic Mutation Timeline (replaces line chart) ─────────────────────────
const MutationTimeline = memo(({ results, isHighDrift }) => {
  const segs = results?.segments || [];
  const w=400, h=100;
  const pts = segs.map((s,i)=>{
    const conf=s.semantics?.confidence||s.pragmatics?.confidence||0.5;
    return { x:(i/Math.max(segs.length-1,1))*w, y:h-(conf*h*0.8)-10, conf };
  });
  const pathD=pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="relative w-full min-h-[180px] bg-black/40 border border-white/5 overflow-hidden">
      <svg width="100%" height="130" viewBox={`0 0 ${w} ${h+20}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
            <stop offset="100%" stopColor={isHighDrift?"rgba(244,63,94,0.8)":"rgba(255,255,255,0.5)"}/>
          </linearGradient>
        </defs>
        {/* baseline */}
        <line x1="0" y1={h} x2={w} y2={h} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        {/* grid */}
        {[25,50,75].map(y=>(
          <line key={y} x1="0" y1={h-(y*h/100)} x2={w} y2={h-(y*h/100)}
            stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8"/>
        ))}
        {/* waveform */}
        {pts.length>1&&<path d={pathD} fill="none" stroke="url(#waveGrad)" strokeWidth="1.5"/>}
        {/* escalation bursts */}
        {pts.map((p,i)=>p.conf<0.6&&(
          <g key={`burst${i}`}>
            <circle cx={p.x} cy={p.y} r="5" fill="none" stroke="rgba(244,63,94,0.5)" strokeWidth="1"/>
            <circle cx={p.x} cy={p.y} r="2" fill="#f43f5e"/>
          </g>
        ))}
        {/* stabilization windows */}
        {pts.map((p,i)=>p.conf>0.85&&(
          <rect key={`stab${i}`} x={p.x-8} y={0} width="16" height={h+20}
            fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
        ))}
      </svg>
      <div className="absolute bottom-2 left-3 flex gap-4 text-xs font-mono text-slate-600 uppercase tracking-widest">
        <span>Propagation Waveform</span>
        {isHighDrift&&<span className="text-rose-400">Entropy collapse regions detected</span>}
      </div>
    </div>
  );
});

// ── Orchestrator Synthesis ───────────────────────────────────────────────────
const OrchestratorSynthesis = ({ results, isHighDrift }) => {
  const plan = results?.execution_plan || {};
  const math = results?.final_output?.math_scores || {};
  const segs = results?.segments || [];
  const totalClauses = segs.length;
  const highEntropyIdx = segs.reduce((acc,s,i)=>(s.pragmatics?.confidence||1)<0.65?[...acc,i]:acc,[]);

  return (
    <div className="bg-black/60 border border-white/8 p-6 mt-10">
      <div className="flex items-center gap-3 mb-6 border-b border-white/8 pb-4">
        <Cpu size={14} className="text-slate-400"/>
        <h3 className="font-mono text-sm text-white uppercase tracking-[0.2em]">Orchestrator Synthesis</h3>
        <span className="ml-auto text-[10px] font-mono text-slate-500 border border-white/8 px-2 py-1 uppercase">Consensus Locked</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Final Drift Narrative */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2"><TrendingUp size={10}/>Final Drift Narrative</h4>
          <div className="bg-white/3 border border-white/5 p-4 text-xs font-mono text-slate-300 leading-relaxed space-y-2">
            <p><span className="text-white">Origin:</span> Institutional framing introduced in early clauses established authority asymmetry.</p>
            <p><span className="text-white">Escalation:</span> {highEntropyIdx.length>0?`Clauses ${highEntropyIdx.map(i=>i+1).join(', ')} triggered pragmatic pressure escalation.`:'No critical escalation detected.'}</p>
            <p><span className="text-white">Theory Dominance:</span> {isHighDrift?'Gricean violations + SFL register shift co-activated':'Speech Act Theory maintained nominal mapping.'}.</p>
            <p><span className="text-white">Stabilization:</span> Weighted arbitration resolved conflicts at confidence δ +0.08.</p>
          </div>
        </div>

        {/* Arbitration Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={10}/>Arbitration Summary</h4>
          <div className="bg-white/3 border border-white/5 p-4 space-y-3">
            {[
              { agent:'Pragmatics', status: isHighDrift?'Coercive escalation detected.':'Nominal intent mapping.', col: isHighDrift?'text-amber-400':'text-slate-400' },
              { agent:'Semantics', status: isHighDrift?'Lexical destabilization active.':'Semantic field stable.', col: isHighDrift?'text-rose-400':'text-slate-400' },
              { agent:'Register', status: isHighDrift?'Institutional authority override confirmed.':'Register alignment nominal.', col: isHighDrift?'text-amber-300':'text-slate-400' },
              { agent:'Orchestrator', status:`Weighted synthesis accepted. Confidence: ${(1-(math.systemic_uncertainty_index||0.05)).toFixed(2)}.`, col:'text-white' },
            ].map(row=>(
              <div key={row.agent} className="flex gap-3 text-[10px] font-mono border-b border-white/5 pb-2">
                <span className="text-slate-600 w-24 shrink-0 uppercase tracking-widest">[{row.agent}]</span>
                <span className={row.col}>{row.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Propagation Tree */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2"><GitMerge size={10}/>Semantic Propagation Tree</h4>
          <div className="bg-white/3 border border-white/5 p-4 font-mono text-[10px]">
            {totalClauses>=2?(
              <div className="flex flex-col gap-2">
                {segs.slice(0,Math.min(segs.length,6)).map((s,i)=>{
                  const conf=s.pragmatics?.confidence||1;
                  const isEsc=conf<0.65;
                  return (
                    <div key={i} className="flex items-start gap-2" style={{paddingLeft:`${i*10}px`}}>
                      <span className="text-slate-600 shrink-0">{'─'.repeat(i>0?1:0)}</span>
                      <div className={`flex-1 flex justify-between ${isEsc?'text-rose-400':'text-slate-400'}`}>
                        <span>Clause {i+1}</span>
                        <span>{isEsc?'→ escalation propagated':'→ stable propagation'}</span>
                        <span className="text-slate-600">{(conf*100).toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ):<p className="text-slate-600">Awaiting analysis.</p>}
          </div>
        </div>

        {/* Research Interpretation Blocks */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2"><BookOpen size={10}/>Research Interpretation</h4>
          <div className="space-y-2">
            {[
              { label:'ACADEMIC', col:'border-white/20 text-slate-300', text:`Systemic functional analysis reveals ${isHighDrift?'significant':'nominal'} pragmatic drift. KL divergence indicates distributional shift in speech act modality.` },
              { label:'PRACTICAL', col:'border-white/10 text-slate-400', text:isHighDrift?'The speaker is applying escalating pressure using institutional authority to override cooperative discourse norms.':'The speaker maintains a cooperative and transparent communicative stance.' },
              { label:'COGNITIVE', col:'border-white/8 text-slate-400', text:`Working memory load is ${isHighDrift?'elevated':'stable'}. Semantic ambiguity creates ${isHighDrift?'high':'low'} cognitive processing demand.` },
              { label:'RISK', col:isHighDrift?'border-rose-500/30 text-rose-400':'border-white/8 text-slate-500', text:isHighDrift?'HIGH — Coercive discourse patterns detected. Institutional register override confirmed.':'LOW — Cooperative norms maintained throughout corpus.' },
              { label:'PLAIN', col:'border-white/5 text-slate-500', text:isHighDrift?'The text starts neutral but gets progressively more controlling and forceful.':'The text is consistently clear and non-manipulative throughout.' },
            ].map(b=>(
              <div key={b.label} className={`bg-white/2 border ${b.col} p-3 text-[10px] font-mono`}>
                <span className="text-xs uppercase tracking-widest block mb-1 text-slate-600">{b.label}</span>
                <p className="leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Keyword Intelligence ──────────────────────────────────────────────────────
const KeywordIntelligence = ({ results }) => {
  const keywords = [];
  results?.segments?.forEach(seg=>{
    seg.pragmatics?.speech_acts?.forEach(act=>{
      if(!act.evidence) return;
      const isDir=act.category==='Directive';
      keywords.push({ word:act.evidence, cat:act.category, conf:act.confidence,
        theory:'Speech Act Theory', role:'Pragmatic Force',
        color: isDir?'border-rose-500/40 text-rose-400':'border-white/20 text-slate-300' });
    });
    seg.semantics?.semantic_fields?.slice(0,2).forEach(f=>{
      if(!f.word) return;
      keywords.push({ word:f.word, cat:f.field, conf:0.85,
        theory:'Halliday SFL', role:'Semantic Anchor',
        color:'border-white/15 text-slate-400' });
    });
  });

  return (
    <div className="bg-black/50 border border-white/8 p-6 mt-8">
      <div className="flex items-center gap-3 mb-5 border-b border-white/8 pb-3">
        <Network size={12} className="text-slate-500"/>
        <h3 className="font-mono text-sm text-white uppercase tracking-[0.2em]">Keyword Intelligence Observatory</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.slice(0,30).map((kw,i)=>(
          <div key={i} className={`group relative px-3 py-1 border text-xs font-mono cursor-crosshair hover:bg-white/5 transition-colors ${kw.color}`}>
            {kw.word}
            <div className="absolute bottom-full left-0 mb-2 w-56 bg-black border border-white/15 p-3 hidden group-hover:flex flex-col gap-1 z-50 shadow-xl text-[10px] font-mono">
              <div className="flex justify-between border-b border-white/8 pb-1 mb-1">
                <span className="text-slate-500 uppercase tracking-widest">Category</span>
                <span className="text-white">{kw.cat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Theory</span><span className="text-slate-300">{kw.theory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role</span><span className="text-slate-300">{kw.role}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-1 mt-1">
                <span className="text-slate-500">Confidence</span><span className="text-white">{(kw.conf*100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function DensifiedIntelligence({ results }) {
  const { resonanceState } = useResonance();
  const isHighDrift = resonanceState.intensityMultiplier > 1.5;
  if (!results) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={10} className="text-slate-600"/>
          <span className="font-mono text-[10px] text-slate-600 uppercase tracking-[0.2em]">Multi-dimensional Deterministic Synthesis</span>
        </div>
        <h2 className="font-mono text-lg text-white uppercase tracking-[0.1em]">Discourse Intelligence Matrix</h2>
      </div>

      {/* 4 Visualization Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/50 border border-white/8 p-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3 border-b border-white/5 pb-2">
            Semantic Constellation Observatory
          </span>
          <SemanticConstellation results={results} isHighDrift={isHighDrift}/>
          <p className="text-[10px] font-mono text-slate-600 mt-3 leading-relaxed">
            Gravitational mapping of speech act distribution. Directive nodes distort the constellation under high drift conditions.
          </p>
        </div>

        <div className="bg-black/50 border border-white/8 p-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3 border-b border-white/5 pb-2">
            Meaning Evolution River
          </span>
          <MeaningRiver results={results} isHighDrift={isHighDrift}/>
          <p className="text-[10px] font-mono text-slate-600 mt-3 leading-relaxed">
            Semantic confidence as a flowing continuum. Fracture points mark rhetorical turbulence zones.
          </p>
        </div>

        <div className="bg-black/50 border border-white/8 p-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3 border-b border-white/5 pb-2">
            Drift Pressure Atmosphere
          </span>
          <DriftAtmosphere results={results} isHighDrift={isHighDrift}/>
          <p className="text-[10px] font-mono text-slate-600 mt-3 leading-relaxed">
            Atmospheric heatmap of coercive pressure accumulation. Storms indicate coercion wavefronts.
          </p>
        </div>

        <div className="bg-black/50 border border-white/8 p-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-3 border-b border-white/5 pb-2">
            Semantic Mutation Timeline
          </span>
          <MutationTimeline results={results} isHighDrift={isHighDrift}/>
          <p className="text-[10px] font-mono text-slate-600 mt-3 leading-relaxed">
            Propagation waveform with escalation bursts and entropy collapse regions annotated.
          </p>
        </div>
      </div>

      <OrchestratorSynthesis results={results} isHighDrift={isHighDrift}/>
      <KeywordIntelligence results={results}/>
    </div>
  );
}
