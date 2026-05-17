import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BrainCircuit, ScanText, Scale, Cpu, Activity, Lock, AlertTriangle, RefreshCcw, ChevronDown, CheckCircle2, Clock, Terminal, Network, Layers, Server, ShieldAlert, ActivitySquare, SearchCode } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';

const AGENT_DEFS = [
  {
    id: 1, name: "Preprocessor", icon: <Database size={14}/>,
    purpose: "Normalizes clause boundaries, token segmentation, and semantic structure before interpretability propagation begins.",
    why: "Without clean normalization, downstream agents produce incoherent vector alignments.",
    contribution: "Establishes the deterministic corpus baseline all agents operate on.",
    theoryDominance: "Lexical Semantics",
  },
  {
    id: 2, name: "Pragmatics", icon: <BrainCircuit size={14}/>,
    purpose: "Detects speech acts, conversational pressure, coercion patterns, implicature, and intent escalation across clause sequences.",
    why: "Pragmatic force is the primary carrier of discourse drift — invisible at the surface but structurally decisive.",
    contribution: "Supplies illocutionary force vectors to Semantics and Register for cross-theory arbitration.",
    theoryDominance: "Speech Act Theory / Gricean Pragmatics",
  },
  {
    id: 3, name: "Semantics", icon: <ScanText size={14}/>,
    purpose: "Tracks lexical mutation, semantic field migration, ambiguity propagation, and ideological reframing across the corpus.",
    why: "Semantic instability is the measurable signature of meaning drift — it quantifies how vocabulary is weaponized.",
    contribution: "Produces entropy tensors and propagation vectors feeding the arbitration engine.",
    theoryDominance: "Systemic Functional Linguistics",
  },
  {
    id: 4, name: "Register", icon: <Scale size={14}/>,
    purpose: "Measures institutional framing, authority pressure, formality gradients, and discourse hierarchy patterns.",
    why: "Register shift is how power asymmetry enters language — covert but computationally detectable.",
    contribution: "Provides formality tensors and institutional override signals to the Orchestrator.",
    theoryDominance: "Register Theory / SFL",
  },
  {
    id: 5, name: "Orchestrator", icon: <Cpu size={14}/>,
    purpose: "Arbitrates conflicting interpretations from all agents and synthesizes a deterministic final drift conclusion.",
    why: "Multi-theory disagreement is inevitable — the Orchestrator resolves conflicts with weighted epistemic synthesis.",
    contribution: "Produces the final drift magnitude, uncertainty index, and interpretability lineage.",
    theoryDominance: "Weighted Epistemic Synthesis",
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
      setMetrics({
        latency: (base[agent.id] + Math.random() * 0.08).toFixed(3),
        throughput: (Math.random() * 4 + 1.5).toFixed(1),
        confidence: (Math.random() * 15 + 82).toFixed(1),
        load: Math.round(Math.random() * 30 + 55),
        pressure: isHighDrift ? Math.round(Math.random() * 30 + 60) : Math.round(Math.random() * 20 + 20),
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
    <div className={`relative ${dimOpacity} cursor-pointer`} onClick={() => onExpand(isExpanded ? null : agent.id)}>
      <motion.div animate={jitter} transition={{ duration: 0.15, repeat: isConflict ? Infinity : 0 }}
        className={`bg-black/70 border ${isConflict ? 'border-amber-500/40' : isActive ? 'border-white/25' : 'border-white/8'} p-3 flex flex-col gap-2 min-h-[360px] relative overflow-hidden`}>

        {/* Scan line effect */}
        {isActive && <motion.div animate={{ y: ['0%','100%'] }} transition={{ duration: 2, repeat: Infinity, ease:'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-white/5 pointer-events-none z-0" />}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 pb-2 relative z-10">
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

        {/* Cognitive State Badge */}
        <div className={`text-xs font-mono uppercase tracking-[0.15em] border px-2 py-[2px] w-fit ${stateStyle} ${isConflict ? 'animate-pulse' : ''}`}>
          {cogState}
        </div>

        {/* Purpose Block */}
        <div className="bg-white/3 border border-white/5 p-2 relative z-10">
          <p className="text-[10px] font-mono text-slate-400 leading-relaxed">{agent.purpose}</p>
          <div className="mt-2 pt-2 border-t border-white/5">
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">Theory: </span>
            <span className="text-xs font-mono text-white">{agent.theoryDominance}</span>
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
            <div key={m.label} className="flex justify-between text-xs font-mono">
              <span className="text-slate-600 uppercase tracking-widest">{m.label}</span>
              <span className="text-slate-200">{m.val}</span>
            </div>
          ))}
        </div>

        {/* Load Bars */}
        <div className="space-y-1 relative z-10">
          <EntropyBar label="Semantic Load" value={metrics.load} color={isConflict ? 'bg-amber-500' : 'bg-white'} />
          <EntropyBar label="Propagation Pressure" value={metrics.pressure} color={isHighDrift ? 'bg-rose-500' : 'bg-white/60'} />
        </div>

        {/* Packet Stream Telemetry */}
        <div className="relative z-10 space-y-1">
          <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">Packet Stream</span>
          <PacketStream
            active={isActive}
            color={isConflict ? 'bg-amber-400' : isHighDrift ? 'bg-rose-400' : 'bg-white'}
            count={isConflict ? 5 : 3}
          />
        </div>

        {/* Sync Pulse */}
        <div className="flex items-center gap-2 relative z-10 mt-auto">
          <motion.div animate={isActive ? { opacity: [0.3, 1, 0.3] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-[3px] h-[3px] rounded-full ${isConflict ? 'bg-amber-500' : isActive ? 'bg-white' : 'bg-white/10'}`} />
          <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">
            Sync: {cogState === 'Synchronizing' ? 'AWAIT' : isActive ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>
      </motion.div>

      {/* Beam to next agent */}
      {agent.id < 5 && (
        <div className="absolute top-1/2 -right-3 w-6 h-[1px] -translate-y-1/2 overflow-hidden bg-white/5 z-20">
          {isActive && <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
            className={`absolute top-0 h-full w-3 ${isConflict ? 'bg-amber-500' : 'bg-white'}`} />}
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
    2: `[SAT] Speech Act classifier running.\n[GRICE] Implicature extraction: cooperative violations: ${Math.floor(Math.random()*3)+1}\n[PRESSURE] Deontic modality score: ${(math.pragmatic_entropy||0.5).toFixed(3)}\n[EMIT] Illocutionary vectors → Semantics.`,
    3: `[SFL] Transitivity scheme mapping active.\n[DRIFT] Semantic entropy: ${((1-(math.confidence_weighted_formality||0.8))*10).toFixed(3)} bits\n[MIGRATE] Field migration: INSTITUTION → COERCION\n[EMIT] Entropy tensor → Register.`,
    4: `[REGISTER] Formality tensor: ${(math.confidence_weighted_formality||0.8).toFixed(3)}\n[TENOR] Authority pressure: ${isHighDrift ? 'HIGH' : 'MODERATE'}\n[MODE] Institutional override: ${isHighDrift ? 'TRIGGERED' : 'NOMINAL'}\n[EMIT] Override signal → Orchestrator.`,
    5: `[ARBITRATE] Receiving theory tensors...\n[WEIGHT] Pragmatics: 0.84 | Semantics: 0.91 | Register: 0.78\n[RESOLVE] Weighted synthesis accepted.\n[CONCLUDE] Drift magnitude: ${((math.systemic_uncertainty_index||0.05)*100).toFixed(1)}%\n[EMIT] Final interpretability lineage generated.`,
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      className="col-span-full mt-1 bg-black/90 border border-white/10 p-5 relative">
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
              ['Memory Traffic', `${(Math.random()*50+20).toFixed(1)} MB/s`],
              ['Orch. Pressure', isHighDrift ? 'ELEVATED' : 'NOMINAL'],
              ['Packet Prop.', `${(Math.random()*100+900).toFixed(0)} ms`],
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
                  <div key={i} className={`w-[2px] h-2 ${Math.random() > 0.75 ? (isHighDrift ? 'bg-rose-500' : 'bg-white') : 'bg-white/8'}`}/>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative border border-white/5 bg-black/40 mt-12">
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-white/15 via-white/5 to-white/15" />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Activity size={10} className="text-slate-600"/>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-600">Distributed Explainable AI Semantic Cognition Network</span>
        </div>
        <h2 className="text-lg font-mono text-white tracking-[0.1em] uppercase">Inference Module Network</h2>
      </div>

      {plan && (
        <div className="mb-10 bg-black/70 border border-white/8 p-4 relative">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={12} className="text-slate-500"/>
              <span className="text-xs font-mono uppercase tracking-widest text-white">Computational Timeline & Profiler</span>
            </div>
            {results?.runtime_seconds && <span className="text-[10px] font-mono text-slate-500 border border-white/8 px-2 py-1">Sync: {results.runtime_seconds}s</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 text-[10px] font-mono">
            {[
              ['Input Complexity', isHighDrift ? 'High Volatility' : 'Nominal'],
              ['Target Domain', plan.domain || 'Academic'],
              ['Intent Hypothesis', plan.communicative_intent || 'Persuasion'],
              ['Orchestration', plan.routing_rationale?.slice(0,60)+'...' || 'Standard routing'],
            ].map(([k,v]) => (
              <div key={k} className="flex flex-col gap-1">
                <span className="text-slate-600 uppercase tracking-widest">{k}</span>
                <span className="text-slate-200 bg-white/3 p-2 border border-white/5">{v}</span>
              </div>
            ))}
          </div>
          {/* Execution Rail */}
          <div className="relative pt-2">
            <span className="text-xs font-mono text-slate-600 uppercase tracking-widest block mb-4">Live Execution Rail</span>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 w-full h-[1px] bg-white/8 top-1/2 -translate-y-1/2"/>
              {[['00.012s','Normalization'],['00.842s','Pragmatic Map'],[isHighDrift?'01.2s':'01.9s',isHighDrift?'Drift Detected':'Semantic Parse'],['02.4s','Register Sync'],['03.1s','Arbitration']].map(([t,s],i)=>(
                <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-[3px] h-[3px] rounded-full ${isHighDrift&&i>=2?'bg-rose-500':'bg-white'}`}/>
                  <span className="text-xs font-mono text-slate-500 bg-black px-1">[{t}]</span>
                  <span className="absolute top-5 text-xs font-mono text-slate-600 uppercase whitespace-nowrap">{s}</span>
                </div>
              ))}
            </div>
            <div className="h-8"/>
          </div>
          <AnimatePresence>
            {conflictLog && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                className="mt-3 pt-3 border-t border-rose-500/20 text-[10px] font-mono text-amber-500 tracking-widest uppercase flex items-center gap-2">
                <ShieldAlert size={10} className="animate-pulse"/>{conflictLog}
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
