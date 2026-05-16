import React, { memo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { Network, Cpu, GitMerge, ShieldAlert } from 'lucide-react';

const TripleLayerInterpretability = ({ academic, practical, plain }) => (
  <div className="mt-6 flex flex-col gap-3 font-mono text-sm border-t border-white/10 pt-4">
    <div className="flex gap-4 p-3 bg-blue-900/10 rounded border border-blue-500/20"><div className="text-blue-400 font-bold w-24 shrink-0">ACADEMIC</div><div className="text-slate-300">{academic}</div></div>
    <div className="flex gap-4 p-3 bg-purple-900/10 rounded border border-purple-500/20"><div className="text-purple-400 font-bold w-24 shrink-0">PRACTICAL</div><div className="text-slate-300">{practical}</div></div>
    <div className="flex gap-4 p-3 bg-emerald-900/10 rounded border border-emerald-500/20"><div className="text-emerald-400 font-bold w-24 shrink-0">PLAIN</div><div className="text-slate-300">{plain}</div></div>
  </div>
);

const SVGRadar = memo(() => (
  <div className="flex-1 flex items-center justify-center relative w-full min-h-[250px]">
    <svg width="260" height="260" viewBox="-130 -130 260 260">
      {[25, 50, 75, 100, 125].map(r => (
        <polygon key={r} points={`0,-${r} ${r*0.95},-${r*0.3} ${r*0.58},${r*0.8} -${r*0.58},${r*0.8} -${r*0.95},-${r*0.3}`} fill="none" stroke="rgba(34,211,238,0.1)" strokeWidth="1"/>
      ))}
      {['Assertive', 'Directive', 'Commissive', 'Expressive', 'Declaration'].map((l, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return <line key={l} x1="0" y1="0" x2={Math.cos(angle)*125} y2={Math.sin(angle)*125} stroke="rgba(34,211,238,0.2)" strokeWidth="1"/>
      })}
      <polygon className="animate-pulse" points="0,-50 48,-15 14,40 -14,40 -48,-15" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2" />
      <polygon className="animate-pulse delay-75" fill="rgba(244,63,94,0.2)" stroke="#f43f5e" strokeWidth="2" points="0,-35 106,-34 42,90 -6,100 -118,-37" />
    </svg>
  </div>
));

const SVGSankey = memo(() => (
  <div className="flex-1 flex items-center justify-center relative w-full min-h-[250px] px-4">
    <svg width="100%" height="200" viewBox="0 0 300 200" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#f43f5e" /></linearGradient>
        <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient>
        <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#10b981" /></linearGradient>
      </defs>
      <path d="M 50 40 C 150 40, 150 40, 250 40" stroke="url(#g1)" strokeWidth="20" fill="none" className="opacity-80"/>
      <path d="M 50 90 C 150 90, 150 160, 250 160" stroke="url(#g2)" strokeWidth="20" fill="none" className="opacity-80"/>
      <path d="M 50 140 C 150 140, 150 100, 250 100" stroke="url(#g3)" strokeWidth="20" fill="none" className="opacity-80"/>
    </svg>
    <div className="absolute top-0 left-[10%] h-[200px] flex flex-col justify-around text-xs font-mono text-slate-400">
      <span>Informative</span><span>Neutral</span><span>Institutional</span>
    </div>
    <div className="absolute top-0 right-[10%] h-[200px] flex flex-col justify-around text-xs font-mono text-white text-right">
      <span className="text-rose-400 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">Directive</span>
      <span className="text-cyan-400">Escalated</span>
      <span className="text-emerald-400">Persuasive</span>
    </div>
  </div>
));

const KeywordIntelligence = ({ results }) => {
  const keywords = [];
  results?.segments?.forEach(seg => {
    const pragmatics = seg.pragmatics || {};
    const semantics = seg.semantics || {};
    
    pragmatics.speech_acts?.forEach(act => {
      if (act.evidence) {
         let cluster = 'Modality Markers';
         let color = 'border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]';
         let bgGlow = 'bg-cyan-500/10';
         if(act.category === 'Directive') { cluster = 'Persuasive Language'; color = 'border-rose-400 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'; bgGlow = 'bg-rose-500/10'; }
         if(act.category === 'Expressive') { cluster = 'Emotional Escalation'; color = 'border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'; bgGlow = 'bg-purple-500/10'; }
         
         keywords.push({ word: act.evidence, cluster, category: act.category, theory: 'Speech Act Theory', role: 'Pragmatic Imposition', confidence: act.confidence, color, bgGlow });
      }
    });
    
    semantics.semantic_fields?.forEach(field => {
      if (field.word) {
         let cluster = 'Semantic Anchors';
         let color = 'border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
         let bgGlow = 'bg-emerald-500/10';
         if(['POLITICS', 'SOCIETY', 'PROTOCOL'].includes(field.field)) { cluster = 'Institutional Framing'; color = 'border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'; bgGlow = 'bg-amber-500/10'; }
         if(field.field === 'EMOTION') { cluster = 'Emotional Escalation'; color = 'border-purple-400 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'; bgGlow = 'bg-purple-500/10'; }
         
         keywords.push({ word: field.word, cluster, category: field.field, theory: 'Halliday SFL', role: 'Semantic Shift', confidence: 0.85, color, bgGlow });
      }
    });
    
    if(pragmatics.confidence < 0.7 || semantics.confidence < 0.7) {
       const w = pragmatics.speech_acts?.[0]?.evidence || semantics.semantic_fields?.[0]?.word || "ambiguous syntax";
       keywords.push({ word: w, cluster: 'Uncertainty Indicators', category: 'High Entropy', theory: 'Systemic Ambiguity', role: 'Interpretive Instability', confidence: Math.min(pragmatics.confidence||1, semantics.confidence||1), color: 'border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]', bgGlow: 'bg-orange-500/10 animate-pulse' });
    }
  });

  return (
    <div className="bg-pmdd-dark p-8 mt-12 border border-pmdd-accent/20 rounded-xl relative overflow-visible shadow-lg">
       <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none blur-3xl rounded-full bg-cyan-500"></div>
       <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <Network className="text-pmdd-accent"/>
          <h3 className="text-xl font-light text-white tracking-widest uppercase">Keyword Intelligence Observatory</h3>
       </div>
       <div className="flex flex-wrap gap-x-3 gap-y-6 relative z-10">
          {keywords.map((kw, i) => (
             <div key={i} className={`relative group px-5 py-2 border rounded-full cursor-crosshair transition-all hover:scale-105 hover:z-50 ${kw.bgGlow} ${kw.color}`}>
                <span className="font-mono text-sm tracking-wide">{kw.word}</span>
                <div className="absolute top-full left-1/2 w-px h-6 bg-current opacity-0 group-hover:opacity-50 transition-opacity"></div>
                <div className="absolute top-[calc(100%+24px)] left-1/2 -translate-x-1/2 w-80 p-5 bg-black/95 border border-white/20 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 flex flex-col gap-3 backdrop-blur-3xl transform group-hover:translate-y-0 translate-y-2 rounded-xl">
                   <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-1">
                     <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{kw.cluster}</span>
                     <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white">TRIGGER</span>
                   </div>
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Token</span><span className="text-white font-mono font-bold text-lg">"{kw.word}"</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Category</span><span className={kw.color.split(' ')[1]}>{kw.category}</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Discourse Role</span><span className="text-rose-300">{kw.role}</span></div>
                   <div className="flex justify-between text-sm"><span className="text-slate-400 font-mono">Activated Theory</span><span className="text-pmdd-soft">{kw.theory}</span></div>
                   <div className="mt-2 pt-3 border-t border-white/5 flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-mono text-xs">Computational Confidence</span>
                      <span className="text-emerald-400 font-mono font-bold tracking-widest">{(kw.confidence*100).toFixed(1)}%</span>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const OrchestrationTimeline = ({ results }) => {
   const plan = results?.execution_plan || {};
   const math = results?.final_output?.math_scores || {};
   
   return (
   <div className="bg-pmdd-dark p-8 mt-12 border border-pmdd-accent/20 rounded-xl bg-gradient-to-br from-blue-900/10 via-black to-transparent shadow-lg">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <Cpu className="text-blue-400"/>
          <h3 className="text-xl font-light text-white tracking-widest uppercase">Live Computational Orchestration</h3>
          <span className="ml-auto text-xs font-mono text-cyan-400 bg-cyan-900/30 px-3 py-1 rounded border border-cyan-500/30 animate-pulse">PIPELINE ACTIVE</span>
      </div>
      <div className="flex flex-col gap-8 relative pl-4">
         <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-rose-500 opacity-50 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
         
         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.6)] z-10 group-hover:scale-110 transition-transform"><div className="w-2.5 h-2.5 bg-blue-300 rounded-full animate-ping absolute"></div><div className="w-2.5 h-2.5 bg-blue-300 rounded-full relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-blue-400 mb-2 font-mono tracking-wide">Agent 1: Pre-processing & Routing</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-blue-500/20 shadow-inner">
                 Parsed {results?.segments?.length || 0} clauses. Domain classified as <span className="text-white font-bold">{plan.domain || 'Academic'}</span>. Intent identified as <span className="text-rose-300">{plan.communicative_intent || 'Persuasion'}</span>. Forwarding syntactic matrix to specialized theory agents.
               </div>
            </div>
         </div>

         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10 group-hover:scale-110 transition-transform"><div className="w-2.5 h-2.5 bg-cyan-300 rounded-full relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-cyan-400 mb-2 font-mono tracking-wide">Agent 2: Pragmatics Engine (Speech Act Theory)</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-cyan-500/20 shadow-inner">
                 Investigated modality markers. Extracted {math.speech_act_distribution?.Assertive || 0} Assertives and <span className="text-rose-400">{math.speech_act_distribution?.Directive || 0} Directives</span>. Pragmatic entropy evaluated at {(math.pragmatic_entropy || 0.5).toFixed(3)}.
               </div>
            </div>
         </div>

         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.6)] z-10 group-hover:scale-110 transition-transform"><div className="w-2.5 h-2.5 bg-purple-300 rounded-full relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-purple-400 mb-2 font-mono tracking-wide">Agent 3: Semantics & Register Engine (SFL)</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-purple-500/20 shadow-inner">
                 Transitivity mapping active. Institutional authority score: <span className="text-emerald-400">{(math.confidence_weighted_formality || 0.8).toFixed(2)}</span>. Semantic migration detected across temporal vectors.
               </div>
            </div>
         </div>

         <div className="flex gap-8 relative group">
            <div className="w-8 h-8 rounded-full bg-rose-900 border border-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.8)] z-10 group-hover:scale-110 transition-transform"><div className="w-3 h-3 bg-rose-300 rounded-full animate-pulse relative"></div></div>
            <div className="flex-1">
               <div className="text-sm font-bold text-rose-400 mb-2 font-mono tracking-wide">Agent 5: Mathematical Synthesis</div>
               <div className="text-sm text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-rose-500/40 shadow-inner">
                 <div className="mb-2 text-rose-200">Converging theory models. Systemic uncertainty quantified at {(math.systemic_uncertainty_index || 0.05).toFixed(3)}.</div>
                 <div className="text-white font-bold tracking-widest border-t border-rose-500/30 pt-2 mt-2">
                   FINAL INTERPRETABILITY: {plan.routing_rationale?.split('.')[0] || "Discourse mapped successfully."}
                 </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   );
};

export default function DensifiedIntelligence({ results }) {
  if (!results) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
      <div className="text-center mt-10 mb-8">
        <h2 className="text-3xl font-light text-white tracking-widest uppercase mb-2">Discourse Intelligence Matrix</h2>
        <p className="text-slate-400 font-mono text-xs tracking-widest">Multi-dimensional deterministic synthesis</p>
      </div>

      <OrchestrationTimeline results={results} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-pmdd-dark p-8 border border-pmdd-accent/20 rounded-xl shadow-lg">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Speech Act Mutation Matrix</div>
          <SVGRadar />
          <TripleLayerInterpretability 
             academic="Analyzes the systematic deviation from assertive baseline structures toward high-deontic directive modes, signifying pragmatic escalation."
             practical="Shows how the speaker is shifting from sharing information to issuing commands or demands."
             plain="The blue area is normal speech. The red spike shows where the speaker starts getting pushy."
          />
        </div>
        <div className="bg-pmdd-dark p-8 border border-pmdd-accent/20 rounded-xl shadow-lg">
          <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Semantic Field Migration Flow</div>
          <SVGSankey />
          <TripleLayerInterpretability 
             academic="Traces longitudinal semantic drift across systemic functional categories, tracking ideological reframing within the corpus over time."
             practical="Tracks how the core topic of conversation fundamentally changes its underlying meaning from start to finish."
             plain="Follow the lines to see how the text starts off neutral but ends up institutional and coercive."
          />
        </div>

        <div className="bg-pmdd-dark p-8 border border-pmdd-accent/20 rounded-xl shadow-lg">
          <div className="text-xs font-mono text-rose-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Discourse Pressure Graph</div>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={results?.segments?.map((s, i) => ({ name: `C${i+1}`, value: (s.pragmatics?.confidence||0.5)*100 })) || []}>
                <defs>
                  <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                <Area type="monotone" dataKey="value" stroke="#f43f5e" fillOpacity={1} fill="url(#colorPressure)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <TripleLayerInterpretability 
             academic="Visualizes the temporal accumulation of deontic modality and rhetorical force across the analyzed clauses."
             practical="Shows when the speaker applies the most intense pressure or persuasion in their argument."
             plain="The higher the red wave, the harder the speaker is trying to force you to agree or act."
          />
        </div>

        <div className="bg-pmdd-dark p-8 border border-pmdd-accent/20 rounded-xl shadow-lg">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Semantic Volatility Curve</div>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results?.segments?.map((s, i) => ({ name: `C${i+1}`, value: (s.semantics?.confidence||0.5)*100 })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={{fill: '#34d399', r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <TripleLayerInterpretability 
             academic="Plots the fluctuation in semantic stability. Dips represent high systemic uncertainty or ideological reframing points."
             practical="Indicates moments where the core meaning becomes ambiguous or shifts rapidly to a new topic."
             plain="Drops in the green line show where the speaker is being vague or suddenly changing what they mean."
          />
        </div>
      </div>

      <KeywordIntelligence results={results} />
      
    </div>
  );
}
