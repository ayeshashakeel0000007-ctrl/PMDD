import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BrainCircuit, ScanText, Scale, Cpu, Activity, Lock, AlertTriangle, RefreshCcw, ChevronDown, CheckCircle2, Clock, Terminal, Network, Layers, Server, ShieldAlert, ActivitySquare, SearchCode } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';

const AGENT_DEFS = [
  {
    id: 1, name: "Preprocessor", icon: <Database size={14}/>,
    role: "Corpus Baseline Initiator",
    domain: "Syntax & Tokenization",
    purpose: "Normalizes clause boundaries, token segmentation, and semantic structure before interpretability propagation begins.",
    why: "Without clean normalization, downstream agents produce incoherent vector alignments.",
    contribution: "Establishes the deterministic corpus baseline.",
    theoryDominance: "Lexical Semantics",
  },
  {
    id: 2, name: "Pragmatics", icon: <BrainCircuit size={14}/>,
    role: "Intent Extraction Engine",
    domain: "Coercion & Directives",
    purpose: "Detects speech acts, conversational pressure, coercion patterns, implicature, and intent escalation across clause sequences.",
    why: "Pragmatic force is the primary carrier of discourse drift — invisible at the surface but structurally decisive.",
    contribution: "Supplies illocutionary force vectors.",
    theoryDominance: "Speech Act Theory",
  },
  {
    id: 3, name: "Semantics", icon: <ScanText size={14}/>,
    role: "Meaning Mutation Tracker",
    domain: "Lexical Migration",
    purpose: "Tracks lexical mutation, semantic field migration, ambiguity propagation, and ideological reframing across the corpus.",
    why: "Semantic instability is the measurable signature of meaning drift.",
    contribution: "Produces entropy tensors.",
    theoryDominance: "Systemic Functional Linguistics",
  },
  {
    id: 4, name: "Register", icon: <Scale size={14}/>,
    role: "Institutional Profiler",
    domain: "Authority & Formality",
    purpose: "Measures institutional framing, authority pressure, formality gradients, and discourse hierarchy patterns.",
    why: "Register shift is how power asymmetry enters language.",
    contribution: "Provides formality tensors.",
    theoryDominance: "Register Theory / SFL",
  },
  {
    id: 5, name: "Orchestrator", icon: <Cpu size={14}/>,
    role: "Synthesis Arbitrator",
    domain: "Epistemic Resolution",
    purpose: "Arbitrates conflicting interpretations from all agents and synthesizes a deterministic final drift conclusion.",
    why: "Multi-theory disagreement is inevitable — the Orchestrator resolves conflicts.",
    contribution: "Produces the final drift magnitude.",
    theoryDominance: "Epistemic Synthesis",
  },
];

const COGNITIVE_STATES = ['Stable','Processing','Arbitration Conflict','Synchronizing','Drift Escalation','Recovery','Consensus Locked'];
const STATE_COLORS = {
  'Stable': 'text-slate-400 border-white/10',
  'Processing': 'text-white border-white/40',
  'Arbitration Conflict': 'text-amber-500 border-amber-500/50',
  'Synchronizing': 'text-white border-white/30',
  'Drift Escalation': 'text-rose-400 border-rose-500/50',
  'Recovery': 'text-amber-300 border-amber-300/30',
  'Consensus Locked': 'text-slate-400 border-white/10',
};

const PacketStream = ({ active, color = 'bg-white', count = 3 }) => {
  if (!active) return <div className="w-full h-[2px] bg-white/5 rounded" />;
  return (
    <div className="relative w-full h-[2px] bg-white/5 overflow-hidden rounded">
      {[...Array(count)].map((_, i) => (
        <motion.div key={i}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
          className={`absolute top-0 h-full w-6 ${color} opacity-70`}
          style={{ filter: 'blur(1px)' }}
        />
      ))}
    </div>
  );
};

const EntropyBar = ({ value = 0, label, color = 'bg-white' }) => (
  <div className="space-y-[3px]">
    <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-slate-500">
      <span>{label}</span><span className="text-slate-300">{value}%</span>
    </div>
    <div className="w-full h-[2px] bg-white/5">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2 }}
        className={`h-full ${color}`} />
    </div>
  </div>
);

const AgentCard = ({ agent, results, index, isHighDrift, onExpand, isExpanded, anyExpanded }) => {
  const [cogState, setCogState] = useState('Stable');
  const [metrics, setMetrics] = useState({ latency: '---', throughput: '---', confidence: 0, load: 0, pressure: 0, throughputClauses: 0 });
  const mounted = useRef(true);
  useEffect(() => { return () => { mounted.current = false; }; }, []);

  useEffect(() => {
    if (!results) { setCogState('Stable'); return; }
    const delays = [0, 600, 1200, 1900, 2600];
    const delay = delays[index] || index * 700;

    // Wait state for Register (id=4) and lock for Orchestrator (id=5) on high drift
    if (agent.id === 4) { setCogState('Synchronizing'); }
    else if (agent.id === 5 && isHighDrift) { setCogState('Arbitration Conflict'); }
    else { setCogState('Processing'); }

    const completeTimer = setTimeout(() => {
      if (!mounted.current) return;
      if (isHighDrift && agent.id === 3) {
        setCogState('Drift Escalation');
        setTimeout(() => { if (mounted.current) setCogState('Recovery'); }, 1800);
        setTimeout(() => { if (mounted.current) { setCogState('Consensus Locked'); finalizeMetrics(); } }, 3400);
      } else if (agent.id === 5) {
        setCogState('Consensus Locked'); finalizeMetrics();
      } else {
        setCogState('Stable'); finalizeMetrics();
      }
    }, delay + 1600);

    function finalizeMetrics() {
      const base = { 1: 0.12, 2: 0.38, 3: 0.61, 4: 0.84, 5: 1.02 };
      const hash = agent.id * 1.618;
      setMetrics({
        latency: (base[agent.id] + (hash % 0.08)).toFixed(3),
        throughput: ((hash % 4) + 1.5).toFixed(1),
        confidence: ((hash % 15) + 82).toFixed(1),
        load: Math.round((hash % 30) + 55),
        pressure: isHighDrift ? Math.round((hash % 30) + 60) : Math.round((hash % 20) + 20),
        throughputClauses: results?.segments?.length || 4,
      });
    }

    return () => clearTimeout(completeTimer);
  }, [results, index, isHighDrift, agent.id]);

  const isActive = cogState !== 'Stable';
  const isConflict = cogState === 'Arbitration Conflict' || cogState === 'Drift Escalation';
  const stateStyle = STATE_COLORS[cogState] || 'text-slate-500 border-white/5';
  const dimOpacity = anyExpanded && !isExpanded ? 'opacity-25 transition-all' : 'opacity-100 transition-all';

  const jitter = isConflict ? { x: [0, -1, 1, -1, 0] } : {};

  return (
    <div className={`relative ${dimOpacity} cursor-pointer hover-glow`} onClick={() => onExpand(isExpanded ? null : agent.id)}>
      <motion.div animate={jitter} transition={{ duration: 0.15, repeat: isConflict ? Infinity : 0 }}
        className={`glass-panel border ${isConflict ? 'border-amber-500/40' : isActive ? 'border-white/25' : 'border-white/8'} p-4 flex flex-col gap-2 min-h-[360px] relative overflow-hidden`}>

        {/* Scan line effect */}
        {isActive && <motion.div animate={{ y: ['0%','100%'] }} transition={{ duration: 2, repeat: Infinity, ease:'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-white/5 pointer-events-none z-0" />}

        {/* Header */}
        <div className="flex flex-col gap-1 border-b border-white/8 pb-2 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`${isConflict ? 'text-amber-500' : isActive ? 'text-white' : 'text-slate-500'}`}>{agent.icon}</div>
              <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-white">{agent.name}</span>
            </div>
            <div className="flex items-center gap-1">
              {isConflict && <AlertTriangle size={8} className="text-amber-500 animate-pulse"/>}
              {cogState === 'Synchronizing' && <Clock size={8} className="text-white animate-pulse"/>}
              {cogState === 'Consensus Locked' && <CheckCircle2 size={8} className="text-slate-400"/>}
              <ChevronDown size={10} className={`text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
            </div>
          </div>
          <div className="text-[9px] font-mono tracking-widest uppercase text-slate-500">{agent.role}</div>
        </div>

        {/* Cognitive State Badge */}
        <div className={`text-xs font-mono uppercase tracking-[0.15em] border px-2 py-[2px] w-fit ${stateStyle} ${isConflict ? 'animate-pulse' : ''}`}>
          {cogState}
        </div>

        {/* Analytical Domain & Theory Block */}
        <div className="bg-white/3 border border-white/5 p-2 relative z-10 flex flex-col gap-2">
          <div>
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest block">Analytical Domain</span>
            <span className="text-[10px] font-mono text-white">{agent.domain}</span>
          </div>
          <div className="border-t border-white/5 pt-1">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest block">Active Theory</span>
            <span className="text-[10px] font-mono text-white">{agent.theoryDominance}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 relative z-10">
          {[
            { label: 'Latency', val: `${metrics.latency}s` },
            { label: 'Throughput', val: `${metrics.throughput}k/s` },
            { label: 'Confidence', val: `${metrics.confidence}%` },
            { label: 'Clauses', val: metrics.throughputClauses },
          ].map(m => (
            <div key={m.label} className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-600 uppercase tracking-widest">{m.label}</span>
              <span className="text-slate-200">{m.val}</span>
            </div>
          ))}
        </div>

        {/* Load Bars */}
        <div className="space-y-1 relative z-10">
          <EntropyBar label="Semantic Load" value={metrics.load} color={isConflict ? 'bg-amber-500' : 'bg-holo-cyan'} />
          <EntropyBar label="Propagation Pressure" value={metrics.pressure} color={isHighDrift ? 'bg-rose-500' : 'bg-plasma-violet'} />
        </div>

        {/* Sync Pulse */}
        <div className="flex items-center gap-2 relative z-10 mt-auto">
          <motion.div animate={isActive ? { opacity: [0.3, 1, 0.3] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-[3px] h-[3px] rounded-full ${isConflict ? 'bg-amber-500' : isActive ? 'bg-white' : 'bg-white/10'}`} />
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            Sync: {cogState === 'Synchronizing' ? 'AWAIT' : isActive ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </motion.div>

      {/* Enhanced Animated Beam to next agent (desktop only) */}
      {agent.id < 5 && (
        <div className="absolute top-[40%] -right-3 w-6 h-[2px] -translate-y-1/2 overflow-visible z-20 hidden md:block">
          {isActive && (
            <>
              {/* Primary glowing rail */}
              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }}
                transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
                className={`absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-${isConflict ? 'amber-500' : 'holo-cyan'} to-transparent`} />
              
              {/* High energy flash */}
              <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'linear', delay: 0.2 }}
                className={`absolute top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent blur-[1px] opacity-70`} />
                
              {/* Traveling Semantic Packets (Data Payload Nodes) */}
              <motion.div initial={{ x: -10 }} animate={{ x: 30 }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'linear', delay: 0.1 }}
                className={`absolute -top-[1.5px] h-[5px] w-[5px] rounded-sm bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]`} />
              <motion.div initial={{ x: -10 }} animate={{ x: 30 }}
                transition={{ duration: 0.35, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                className={`absolute -top-[1.5px] h-[3px] w-[8px] bg-${isConflict ? 'amber-400' : 'holo-cyan'} shadow-[0_0_5px_currentColor]`} />
            </>
          )}
          {/* Static standby rail */}
          {!isActive && <div className="absolute top-0 h-full w-full bg-white/5 border-b border-white/10 border-dashed" />}
        </div>
      )}
    </div>
  );
};

const InspectionDrawer = ({ agent, results, isHighDrift }) => {
  if (!agent) return null;
  const math = results?.final_output?.math_scores || {};
  const traces = {
    1: `[NORMALIZE] Token boundary extraction complete.\n[SEGMENT] ${results?.segments?.length || 0} clauses isolated.\n[INDEX] Syntactic dependency graph built.\n[EMIT] Corpus matrix → downstream agents.`,
    2: `[SAT] Speech Act classifier running.\n[GRICE] Implicature extraction: cooperative violations: 2\n[PRESSURE] Deontic modality score: ${(math.pragmatic_entropy||0.5).toFixed(3)}\n[EMIT] Illocutionary vectors → Semantics.`,
    3: `[SFL] Transitivity scheme mapping active.\n[DRIFT] Semantic entropy: ${((1-(math.confidence_weighted_formality||0.8))*10).toFixed(3)} bits\n[MIGRATE] Field migration: INSTITUTION → COERCION\n[EMIT] Entropy tensor → Register.`,
    4: `[REGISTER] Formality tensor: ${(math.confidence_weighted_formality||0.8).toFixed(3)}\n[TENOR] Authority pressure: ${isHighDrift ? 'HIGH' : 'MODERATE'}\n[MODE] Institutional override: ${isHighDrift ? 'TRIGGERED' : 'NOMINAL'}\n[EMIT] Override signal → Orchestrator.`,
    5: `[ARBITRATE] Receiving theory tensors...\n[WEIGHT] Pragmatics: 0.84 | Semantics: 0.91 | Register: 0.78\n[RESOLVE] Weighted synthesis accepted.\n[CONCLUDE] Drift magnitude: ${((math.systemic_uncertainty_index||0.05)*100).toFixed(1)}%\n[EMIT] Final interpretability lineage generated.`,
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      className="col-span-full mt-2 glass-panel border border-white/20 p-6 relative shadow-2xl">
      <div className="flex items-center gap-3 mb-5 border-b border-white/8 pb-3">
        <SearchCode size={12} className="text-slate-400"/>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white">{agent.name} — Deep Inspection</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Traces */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
            <Terminal size={10} className="text-slate-500"/><span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Computational Traces</span>
          </div>
          <pre className="text-[10px] font-mono text-slate-300 bg-white/3 p-3 border border-white/5 whitespace-pre-wrap leading-relaxed">{traces[agent.id]}</pre>
          <div className="mt-2 text-xs font-mono text-slate-600 space-y-1">
            <div className="flex justify-between"><span>Entropy Array:</span><span className="text-slate-300">[0.82, 0.45, 0.91, 0.12]</span></div>
            <div className="flex justify-between"><span>Propagation Mode:</span><span className="text-slate-300">{isHighDrift ? 'Non-linear' : 'Linear'}</span></div>
          </div>
        </div>
        {/* Interpretability */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
            <BrainCircuit size={10} className="text-slate-500"/><span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Interpretability Engine</span>
          </div>
          <div className="bg-white/3 p-3 border border-white/5 space-y-3 text-[10px] font-mono">
            <div>
              <span className="text-slate-500 uppercase tracking-widest block mb-1">Theory Dominance</span>
              <span className="text-white border-l border-white/20 pl-2 block">{agent.theoryDominance}</span>
            </div>
            <div className="border-t border-white/5 pt-2">
              <span className="text-slate-500 uppercase tracking-widest block mb-1">Why It Matters</span>
              <p className="text-slate-300 leading-relaxed">{agent.why}</p>
            </div>
            <div className="border-t border-white/5 pt-2">
              <span className="text-slate-500 uppercase tracking-widest block mb-1">Contribution</span>
              <p className="text-slate-400 leading-relaxed">{agent.contribution}</p>
            </div>
          </div>
        </div>
        {/* Telemetry */}
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
            <Network size={10} className="text-slate-500"/><span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">System Telemetry</span>
          </div>
          <div className="bg-white/3 p-3 border border-white/5 space-y-2 text-[10px] font-mono text-slate-500">
            {[
              ['Memory Traffic', '38.4 MB/s'],
              ['Orch. Pressure', isHighDrift ? 'ELEVATED' : 'NOMINAL'],
              ['Packet Prop.', '947 ms'],
              ['Theory Conflicts', isHighDrift && agent.id >= 3 ? 'DETECTED' : 'NONE'],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between border-b border-white/3 pb-1">
                <span>{k}</span>
                <span className={v === 'ELEVATED' || v === 'DETECTED' ? 'text-amber-500' : 'text-slate-300'}>{v}</span>
              </div>
            ))}
            <div className="pt-2">
              <span className="text-slate-600 uppercase block mb-2 text-xs">Cached Semantic Vectors</span>
              <div className="flex gap-[2px] flex-wrap">
                {[...Array(28)].map((_, i) => (
                  <div key={i} className={`w-[2px] h-2 ${i % 4 === 0 ? (isHighDrift ? 'bg-rose-500' : 'bg-white') : 'bg-white/8'}`}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AgentPipeline = ({ results }) => {
  const { resonanceState } = useResonance();
  const [conflictLog, setConflictLog] = useState(null);
  const [expandedAgentId, setExpandedAgentId] = useState(null);
  const plan = results?.execution_plan;
  const isHighDrift = resonanceState.intensityMultiplier > 1.5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative border border-white/5 glass-panel mt-12 overflow-hidden group">
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {[...Array(15)].map((_, i) => (
           <motion.div key={i} className="absolute w-1 h-1 bg-holo-cyan rounded-full"
             initial={{ x: Math.random() * 1000, y: Math.random() * 500, opacity: 0 }}
             animate={{ x: Math.random() * 1000, y: Math.random() * 500, opacity: [0, 1, 0] }}
             transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: 'linear' }} />
         ))}
      </div>
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-holo-cyan to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
      
      {/* Travelling Synchronization Pulse */}
      <motion.div className="absolute top-0 left-0 w-[2px] h-32 bg-white blur-[2px] opacity-50"
         animate={{ y: ['-100%', '800%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={10} className="text-slate-600"/>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-600">Distributed Explainable AI Semantic Cognition Network</span>
        </div>
        <h2 className="text-lg font-mono text-white tracking-[0.1em] uppercase">Inference Module Network</h2>
      </div>

      {plan && (
        <div className="mb-10 bg-black/60 backdrop-blur-xl border border-white/10 p-6 relative shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden rounded-sm group/profiler">
          {/* Background grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" />
          {/* Ambient glowing orb in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-holo-cyan/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <Layers size={14} className="text-holo-cyan animate-pulse"/>
              <span className="text-sm font-mono uppercase tracking-[0.25em] text-white font-bold drop-shadow-md">Computational Timeline & Profiler</span>
            </div>
            {results?.runtime_seconds && (
               <div className="flex items-center gap-2 text-[10px] font-mono border border-holo-cyan/30 bg-cyan-950/30 px-3 py-1.5 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                  <span className="text-slate-400 uppercase tracking-widest">Global Sync</span>
                  <span className="text-holo-cyan font-bold">{results.runtime_seconds}s</span>
               </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8 text-[10px] font-mono relative z-10">
            {[
              ['Input Complexity', isHighDrift ? 'High Volatility' : 'Nominal', isHighDrift ? 'text-rose-400' : 'text-slate-200'],
              ['Target Domain', plan.domain || 'Academic', 'text-holo-cyan'],
              ['Intent Hypothesis', plan.communicative_intent || 'Persuasion', 'text-amber-400'],
              ['Orchestration', plan.routing_rationale?.slice(0,60)+'...' || 'Standard routing', 'text-slate-300'],
            ].map(([k,v, color]) => (
              <div key={k} className="flex flex-col gap-1 relative overflow-hidden group bg-black/40 border border-white/10 p-3 hover:border-holo-cyan/50 transition-colors duration-500 rounded-sm">
                <span className="text-slate-500 uppercase tracking-widest text-[9px]">{k}</span>
                <span className={`${color} font-bold tracking-wide mt-1`}>{v}</span>
                {/* Hover scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-sweep pointer-events-none" />
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-holo-cyan transition-colors" />
              </div>
            ))}
          </div>
          
          {/* Execution Rail */}
          <div className="relative pt-4 pb-2 z-10 bg-black/40 border border-white/5 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-6">
               <ActivitySquare size={12} className="text-amber-500" />
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] font-bold">Live Execution Rail</span>
            </div>
            <div className="flex items-center justify-between relative px-2">
              {/* Static Background Track */}
              <div className="absolute left-0 w-full h-[1px] bg-white/10 top-1/2 -translate-y-1/2 border-y border-dashed border-white/5"/>
              
              {/* Animated Foreground Tracer */}
              <motion.div className="absolute left-0 h-[2px] bg-holo-cyan shadow-[0_0_12px_rgba(0,240,255,0.9)] top-1/2 -translate-y-1/2 z-0" 
                 animate={{ width: ['0%', '100%', '0%'] }} 
                 transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

              {[['00.012s','Normalization'],['00.842s','Pragmatic Map'],[isHighDrift?'01.2s':'01.9s',isHighDrift?'Drift Detected':'Semantic Parse'],['02.4s','Register Sync'],['03.1s','Arbitration']].map(([t,s],i)=>(
                <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-[5px] h-[5px] rounded-full shadow-lg ${isHighDrift&&i>=2 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'} ring-2 ring-black`}/>
                  <span className="text-[9px] font-mono text-slate-500 bg-black/80 px-1.5 py-0.5 border border-white/10 rounded-sm">[{t}]</span>
                  <span className={`absolute top-8 text-[9px] font-mono uppercase whitespace-nowrap tracking-widest ${isHighDrift&&i===2 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="h-6"/>
          </div>
          <AnimatePresence>
            {conflictLog && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                className="mt-4 pt-3 border-t border-rose-500/30 text-[10px] font-mono text-amber-500 tracking-widest uppercase flex items-center gap-2 bg-rose-950/20 px-3 py-2">
                <ShieldAlert size={12} className="animate-pulse text-rose-500"/>{conflictLog}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Agent Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative z-10">
        {AGENT_DEFS.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} results={results} index={i}
            isHighDrift={isHighDrift} onExpand={setExpandedAgentId}
            isExpanded={expandedAgentId === agent.id}
            anyExpanded={expandedAgentId !== null}
          />
        ))}
        <AnimatePresence>
          {expandedAgentId && (
            <InspectionDrawer
              key="drawer"
              agent={AGENT_DEFS.find(a => a.id === expandedAgentId)}
              results={results}
              isHighDrift={isHighDrift}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Theory Arbitration Log */}
      <div className="border-l border-white/10 pl-4 py-2 mt-8">
        <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Terminal size={10}/>Theory Arbitration Logs</h4>
        <div className="font-mono text-[10px] text-slate-600 space-y-[3px]">
          <p>[ARBITRATION] Initialization sequence complete.</p>
          {isHighDrift ? (
            <>
              <p className="text-amber-500/80">[ARBITRATION] Pragmatics → coercive escalation detected.</p>
              <p className="text-amber-500/80">[ARBITRATION] Semantics → lexical mutation bounds exceeded.</p>
              <p className="text-rose-400/80">[ARBITRATION] Register → institutional override triggered.</p>
              <p className="text-slate-300">[RESOLUTION] Weighted synthesis accepted. Confidence delta → +0.08</p>
            </>
          ) : (
            <>
              <p>[ARBITRATION] Pragmatics → nominal intent mapping.</p>
              <p>[ARBITRATION] Register → institutional alignment confirmed.</p>
              <p className="text-slate-400">[RESOLUTION] Linear consensus reached. Confidence delta → +0.02</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentPipeline;
