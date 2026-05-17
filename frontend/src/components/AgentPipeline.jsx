import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BrainCircuit, ScanText, Scale, Cpu, Activity, Lock, Unlock, Zap, AlertTriangle, RefreshCcw, Layers, Server, ShieldAlert, ActivitySquare, Terminal, Network, SearchCode, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';

const MemoryTransferBeam = ({ active, isHighDrift, hasConflict, isWaitState }) => {
  // Semantic Residue Trail: leave ghosted paths active post-arbitration
  if (!active && isHighDrift) return (
     <div className="absolute top-1/2 -right-6 w-12 h-[1px] -translate-y-1/2 z-0 overflow-hidden bg-rose-500/10 border-b border-rose-500/20 border-dashed"></div>
  );
  if (!active && !isHighDrift) return <div className="absolute top-1/2 -right-4 w-8 h-[1px] bg-white/5 -translate-y-1/2 z-0" />;

  return (
    <div className={`absolute top-1/2 -right-6 w-12 h-[1px] -translate-y-1/2 z-0 overflow-hidden bg-white/10 flex items-center ${isWaitState ? 'opacity-30' : 'opacity-100'} ${isHighDrift && !isWaitState ? 'animate-pulse' : ''}`}>
       <motion.div 
         initial={{ x: '-100%' }} 
         animate={{ x: '100%' }} 
         transition={{ duration: isHighDrift ? (isWaitState ? 2 : 0.1) : 0.5, repeat: Infinity, ease: "linear" }}
         className={`w-full h-full ${hasConflict ? 'bg-amber-500' : isHighDrift ? 'bg-rose-500' : 'bg-holo-cyan'}`}
       />
       {/* Active Data Packet */}
       {!isWaitState && (
         <motion.div
           initial={{ x: -10 }}
           animate={{ x: 60 }}
           transition={{ duration: isHighDrift ? 0.2 : 0.8, repeat: Infinity, ease: "linear" }}
           className={`absolute w-[2px] h-[2px] ${hasConflict ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-white shadow-[0_0_8px_#fff]'}`}
         />
       )}
    </div>
  );
};

const AgentInspectionDrawer = ({ agent, results, isHighDrift }) => {
  const getTraceData = () => {
    switch(agent.id) {
      case 1: return { title: "Corpus Normalization", data: "Vector Synchronization: STABLE\nSegmentation Integrity: 99.4%\nTokens Extracted: 4,092" };
      case 2: return { title: "Pragmatic Mapping", data: "Speech Acts Identified: 12\nConversational Pressure: HIGH\nIntent Mutation: DETECTED" };
      case 3: return { title: "Semantic Topology", data: "Semantic Drift: " + (isHighDrift ? "SEVERE" : "NOMINAL") + "\nLexical Mutation: ACTIVE\nConcept Migration: 2 Nodes" };
      case 4: return { title: "Register Inference", data: "Institutional Authority: HIGH\nFormality Dynamics: RIGID\nRhetorical Calibration: FORCED" };
      case 5: return { title: "Orchestration Synthesis", data: "Theory Arbitration: RESOLVED\nConflict Resolution: ACTIVE\nInterpretability Gen: COMPLETE" };
      default: return { title: "Raw Traces", data: "" };
    }
  };

  const getInterpretabilityData = () => {
    switch(agent.id) {
      case 1: return { theories: "Lexical Semantics: 92%\nSyntax Tree: 88%", chains: "Tokenize -> Tag -> Embed" };
      case 2: return { theories: "Speech Act Theory: 84%\nGricean Pragmatics: 71%", chains: "Illocutionary Force Detected -> Intent Mapped" };
      case 3: return { theories: "Systemic Functional Linguistics: 95%", chains: "Ideational Metafunction -> Semantic Tension" };
      case 4: return { theories: "Register Theory: 89%\nSociolinguistics: 75%", chains: "Tenor Shift -> Formality Override" };
      case 5: return { theories: "Synthesis Engine", chains: "Pragmatics + Semantics -> Final Drift Tensor" };
      default: return { theories: "", chains: "" };
    }
  };

  const trace = getTraceData();
  const interp = getInterpretabilityData();

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      className="col-span-full bg-black/90 border border-white/10 mt-2 p-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <SearchCode className="text-holo-cyan" size={14} />
        <h3 className="text-sm font-mono text-white tracking-[0.2em] uppercase">{agent.name} <span className="text-slate-500 text-xs">Deep Inspection</span></h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {/* Left Column: Raw Computational Traces */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 border-b border-white/5 pb-2">
            <Terminal size={12} />
            <h4 className="font-mono text-[9px] uppercase tracking-widest">Computational Traces</h4>
          </div>
          <div className="bg-white/5 p-3 border border-white/5 font-mono text-[9px] text-slate-300 leading-relaxed whitespace-pre-line">
            <span className="text-holo-cyan">[{trace.title}]</span>
            <br/><br/>
            {trace.data}
            <br/><br/>
            <span className="text-slate-500">Entropy Array:</span> [0.82, 0.45, 0.91, 0.12]
            <br/>
            <span className="text-slate-500">Propagation:</span> {isHighDrift ? 'Non-linear' : 'Linear'}
          </div>
        </div>

        {/* Center Column: Interpretability Engine */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 border-b border-white/5 pb-2">
            <BrainCircuit size={12} />
            <h4 className="font-mono text-[9px] uppercase tracking-widest">Interpretability Engine</h4>
          </div>
          <div className="bg-white/5 p-3 border border-white/5 font-mono text-[9px] text-slate-300">
            <div className="mb-4">
              <span className="text-slate-500 uppercase tracking-widest block mb-2">Activated Theories</span>
              <div className="text-white whitespace-pre-line border-l border-holo-cyan/30 pl-2">{interp.theories}</div>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-widest block mb-2">Reasoning Chain</span>
              <div className="text-slate-400 whitespace-pre-line">{interp.chains}</div>
            </div>
          </div>
        </div>

        {/* Right Column: System Telemetry */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400 border-b border-white/5 pb-2">
            <Network size={12} />
            <h4 className="font-mono text-[9px] uppercase tracking-widest">System Telemetry</h4>
          </div>
          <div className="bg-white/5 p-3 border border-white/5 font-mono text-[9px] text-slate-400 space-y-2">
            <div className="flex justify-between items-center">
               <span>Memory Traffic</span>
               <span className="text-white">{(Math.random() * 50 + 20).toFixed(1)} MB/s</span>
            </div>
            <div className="flex justify-between items-center">
               <span>Orchestration Pressure</span>
               <span className={isHighDrift ? 'text-rose-400' : 'text-emerald-400'}>{isHighDrift ? 'ELEVATED' : 'NOMINAL'}</span>
            </div>
            <div className="flex justify-between items-center">
               <span>Packet Propagation</span>
               <span className="text-white">{(Math.random() * 100 + 900).toFixed(0)} ms</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-2">
               <span>Theory Conflicts</span>
               <span className={isHighDrift && agent.id >= 3 ? 'text-amber-500 animate-pulse' : 'text-slate-500'}>{isHighDrift && agent.id >= 3 ? 'DETECTED' : 'NONE'}</span>
            </div>
            
            {/* Memory Visualization Array */}
            <div className="mt-3 pt-2 border-t border-white/5">
               <span className="text-slate-500 uppercase block mb-2 text-[8px]">Cached Semantic Vectors</span>
               <div className="flex gap-[2px] flex-wrap">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className={`w-[2px] h-2 ${Math.random() > 0.8 ? (isHighDrift ? 'bg-rose-500' : 'bg-white') : 'bg-white/10'}`} />
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const AgentCard = ({ agent, results, index, isHighDrift, globalDrift, onConflict, isExpanded, onExpand, anyExpanded }) => {
  const [internalState, setInternalState] = useState('waiting');
  const [conflict, setConflict] = useState(false);
  const [waitMsg, setWaitMsg] = useState("");

  useEffect(() => {
    if (results) {
      let delay = index * (isHighDrift ? 600 : 1000);
      setConflict(false);
      
      // Multi-Agent Dependency Wait States
      if (agent.id === 4) {
         setInternalState('sync_wait');
         setWaitMsg("[WAIT] Awaiting semantic stabilization...");
         delay += 800; 
      } else if (agent.id === 5 && isHighDrift) {
         setInternalState('locked');
         setWaitMsg("[LOCK] Paused due to pragmatic conflict.");
         delay += 1500;
      } else {
         setInternalState('waiting');
      }
      
      const pTimer = setTimeout(() => {
         setInternalState('processing');
         setWaitMsg("");
      }, delay);

      const cTimer = setTimeout(() => {
         if (isHighDrift && Math.random() > 0.6 && agent.id === 3) {
            setInternalState('deadlock');
            setConflict(true);
            onConflict(`[AGENT-03] Semantic Tensor Conflict. Entropy bounds exceeded.`);
            setTimeout(() => {
               setInternalState('processing'); // Retry
               onConflict(`[ORCHESTRATOR] Conflict reconciled. Ambiguity penalty applied.`);
               setTimeout(() => {
                  setInternalState('complete');
                  setConflict(false);
               }, 1500);
            }, 2000);
         } else {
            setInternalState('complete');
         }
      }, delay + (isHighDrift ? 800 : 1500));

      return () => { clearTimeout(pTimer); clearTimeout(cTimer); };
    } else {
      setInternalState('waiting');
    }
  }, [results, index, isHighDrift, agent.id, onConflict]);

  const isComplete = internalState === 'complete';
  const isProcessing = internalState === 'processing';
  const isDeadlock = internalState === 'deadlock';
  const isWait = internalState === 'sync_wait' || internalState === 'locked';

  const pulseColor = 'border-white/20 text-white bg-white/5';
  const activeColor = isDeadlock ? 'border-amber-500 text-amber-500 bg-amber-900/10' : 
                      isProcessing ? 'border-white/50 text-white bg-white/5' : 
                      isWait ? 'border-rose-500/30 text-rose-400 bg-rose-500/5' :
                      isComplete ? pulseColor : 'border-white/5 bg-obsidian text-slate-500';

  const dimOpacity = anyExpanded && !isExpanded ? 'opacity-30 grayscale hover:opacity-60 transition-all cursor-pointer' : 'opacity-100 cursor-pointer';
  
  const latency = isComplete ? (Math.random() * 0.4 + 0.1).toFixed(3) : "---";
  const throughput = isComplete ? (Math.random() * 5 + 1).toFixed(1) : "---";
  const confidence = isComplete ? (Math.random() * 20 + 80).toFixed(1) : 0;
  
  const stabilityZone = isDeadlock ? 'Conflict Detected' : isWait ? 'Dependency Lock' : isProcessing ? 'Volatile' : isComplete ? 'Stable' : 'Offline';
  const stabilityColor = isDeadlock ? 'text-amber-500' : isWait ? 'text-rose-400' : isProcessing ? 'text-white' : isComplete ? 'text-slate-400' : 'text-slate-600';

  // Confidence Collapse Animation
  const collapseJitter = (isHighDrift && (isProcessing || isDeadlock)) ? { x: [0, -1, 1, -1, 0], y: [0, 1, -1, 1, 0] } : { x: 0, y: 0 };

  return (
    <div className={`relative group/agent ${dimOpacity}`} onClick={() => onExpand(isExpanded ? null : agent.id)}>
      <motion.div 
        animate={collapseJitter}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
        className={`bg-black/80 p-4 flex flex-col items-center border ${activeColor} ${isExpanded ? 'border-b-transparent rounded-t-sm' : 'rounded-sm hover:border-white/30'} transition-colors duration-300 relative z-10 w-full min-h-[280px]`}
      >
         {/* Top Icons */}
         <div className="absolute top-2 right-2 text-slate-600 flex gap-1">
            {isDeadlock && <AlertTriangle size={10} className="text-amber-500 animate-pulse"/>}
            {isWait && <Clock size={10} className="text-rose-400 animate-pulse"/>}
            {internalState === 'waiting' && <Lock size={10} />}
            {internalState !== 'waiting' && !isWait && <Unlock size={10} className={isComplete ? "text-slate-400" : "text-slate-600"} />}
         </div>

         {/* Icon & Name */}
         <div className={`w-10 h-10 flex items-center justify-center mb-3 relative ${isComplete || isProcessing ? '' : 'grayscale opacity-30'}`}>
            {isProcessing && <div className="absolute inset-0 border border-current opacity-30 animate-spin-slow rounded-sm"></div>}
            {isDeadlock && <RefreshCcw className="absolute inset-0 animate-spin text-amber-500 opacity-50" />}
            <div className="relative z-10">{agent.icon}</div>
         </div>
         <h4 className="font-mono text-[9px] tracking-widest uppercase mb-3 text-center h-8 flex items-center font-bold text-white shadow-black drop-shadow-md">{agent.name}</h4>
         
         {isWait && (
            <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center p-4 text-center border border-rose-500/30">
               <span className="text-[8px] font-mono text-rose-400 uppercase tracking-widest">{waitMsg}</span>
            </div>
         )}

         {/* Inference Stability Zone */}
         <div className="w-full flex justify-between items-center text-[7px] font-mono tracking-widest uppercase mb-3 bg-white/5 p-1 border border-white/5">
            <span className="text-slate-500">Zone</span>
            <span className={stabilityColor}>{stabilityZone}</span>
         </div>

         {/* Runtime Metrics */}
         <div className="w-full space-y-1 mb-4 text-[7px] font-mono uppercase tracking-widest">
            <div className="flex justify-between text-slate-500">
               <span>Latency</span>
               <span className={isComplete ? 'text-white' : ''}>{latency}s</span>
            </div>
            <div className="flex justify-between text-slate-500">
               <span>Throughput</span>
               <span className={isComplete ? 'text-white' : ''}>{throughput}k/s</span>
            </div>
            <div className="flex justify-between text-slate-500">
               <span>Confidence</span>
               <span className={isComplete && confidence < 85 ? 'text-amber-400' : isComplete ? 'text-white' : ''}>{confidence}%</span>
            </div>
         </div>

         {/* Semantic Load Pressure */}
         <div className="w-full mt-auto mb-2">
             <div className="flex justify-between text-[7px] font-mono uppercase text-slate-500 mb-1">
                 <span>Semantic Load</span>
                 <span>{isComplete ? '72%' : '0%'}</span>
             </div>
             <div className="w-full h-[2px] bg-white/10 overflow-hidden">
                 <div className={`h-full ${isHighDrift ? 'bg-rose-500' : 'bg-white'} transition-all duration-1000`} style={{ width: isComplete ? '72%' : (isProcessing ? '40%' : '0%') }} />
             </div>
         </div>

         <div className="absolute bottom-[-8px] bg-black border border-white/10 rounded-sm px-2 py-1 opacity-0 group-hover/agent:opacity-100 transition-opacity z-20">
            <ChevronDown size={10} className={isExpanded ? "rotate-180 transition-transform text-white" : "transition-transform text-slate-400"} />
         </div>
      </motion.div>

      {/* Dependency Link */}
      {agent.id < 5 && <MemoryTransferBeam active={isProcessing || isComplete || isDeadlock} isWaitState={isWait} isHighDrift={isHighDrift} hasConflict={conflict} />}
    </div>
  );
};

const AgentPipeline = ({ results }) => {
  const { resonanceState } = useResonance();
  const [conflictLog, setConflictLog] = useState(null);
  const [expandedAgentId, setExpandedAgentId] = useState(null);
  
  const plan = results?.execution_plan;
  const isHighDrift = resonanceState.intensityMultiplier > 1.5;

  const agents = [
    { id: 1, name: "Preprocessor", icon: <Database size={16} />, active: true },
    { id: 2, name: "Pragmatics", icon: <BrainCircuit size={16} />, active: plan ? plan.run_pragmatics : true },
    { id: 3, name: "Semantics", icon: <ScanText size={16} />, active: plan ? plan.run_semantics : true },
    { id: 4, name: "Register", icon: <Scale size={16} />, active: plan ? plan.run_register : true },
    { id: 5, name: "Orchestrator", icon: <Cpu size={16} />, active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative border border-white/5 bg-black/40 mt-12">
      <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-white/20 via-rose-500/20 to-white/20 opacity-50"></div>
      
      <div className="mb-10 flex flex-col items-start">
         <div className="flex items-center gap-3 mb-2">
            <Activity size={12} className="text-slate-500"/>
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-slate-500">Distributed Explainable AI Semantic Cognition Network</span>
         </div>
         <h2 className="text-xl font-mono text-white tracking-[0.1em] uppercase">Inference Module Network</h2>
      </div>

      {plan && (
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className={`max-w-full mb-12 bg-black/80 border border-white/10 p-5 relative shadow-xl`}
        >
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3 relative z-10">
            <div className="flex items-center space-x-3">
               <Layers className="text-slate-400" size={14} />
               <span className="text-[10px] font-mono tracking-widest uppercase text-white">Computational Timeline & Profiler</span>
            </div>
            {results?.runtime_seconds && <span className="text-[9px] font-mono text-slate-400 uppercase border border-white/10 px-2 py-1 bg-white/5"><CheckCircle2 size={10} className="inline mr-1" /> Sync Latency: {results.runtime_seconds}s</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm relative z-10 mb-6 border-b border-white/5 pb-5">
            <div className="flex flex-col gap-2">
               <span className="text-slate-500 font-mono text-[8px] tracking-widest uppercase flex items-center gap-1"><Terminal size={10}/> Input Complexity</span>
               <div className="bg-white/5 p-2 border border-white/5 text-[8px] font-mono text-slate-400 space-y-1">
                 <div className="flex justify-between"><span>Lexical Density:</span><span className="text-white">High</span></div>
                 <div className="flex justify-between"><span>Semantic Volatility:</span><span className={isHighDrift ? 'text-rose-400' : 'text-slate-300'}>{isHighDrift ? '0.84 (ELEVATED)' : '0.21 (NOMINAL)'}</span></div>
               </div>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-slate-500 font-mono text-[8px] tracking-widest uppercase flex items-center gap-1"><Server size={10}/> Target Domain</span>
               <span className="text-slate-300 font-mono text-[9px] bg-white/5 p-2 border border-white/5 h-full flex items-center">{plan.domain}</span>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-slate-500 font-mono text-[8px] tracking-widest uppercase flex items-center gap-1"><ActivitySquare size={10}/> Intent Hypothesis</span>
               <span className="text-slate-300 font-mono text-[9px] bg-white/5 p-2 border border-white/5 h-full flex items-center">{plan.communicative_intent}</span>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-slate-500 font-mono text-[8px] tracking-widest uppercase flex items-center gap-1"><Network size={10}/> Orchestration Decisions</span>
               <span className="text-slate-300 font-mono text-[9px] bg-white/5 p-2 border border-white/5 h-full flex items-center leading-relaxed" title={plan.routing_rationale}>
                 {plan.routing_rationale}
               </span>
            </div>
          </div>

          <div className="relative z-10 w-full pt-2">
             <span className="text-slate-500 font-mono text-[8px] tracking-widest uppercase block mb-4">Live Execution Rail</span>
             <div className="flex items-center w-full justify-between relative">
                <div className="absolute left-0 w-full h-[1px] bg-white/10 z-0 top-1/2 -translate-y-1/2"></div>
                {[
                  { time: '00.012s', stage: 'Normalization' },
                  { time: '00.842s', stage: 'Pragmatic Map' },
                  { time: '01.931s', stage: isHighDrift ? 'Drift Detected' : 'Semantic Parse' },
                  { time: '02.441s', stage: 'Register Sync' },
                  { time: '03.102s', stage: 'Arbitration' }
                ].map((s, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                     <div className={`w-[3px] h-[3px] rounded-full ${isHighDrift && i >= 2 ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-white shadow-[0_0_8px_#fff]'}`}></div>
                     <span className="text-[7px] font-mono text-slate-400 bg-black px-1">[{s.time}]</span>
                     <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest whitespace-nowrap absolute top-5">{s.stage}</span>
                  </div>
                ))}
             </div>
             <div className="h-8"></div>
          </div>
          
          <AnimatePresence>
             {conflictLog && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-rose-500/20 text-[9px] font-mono text-amber-500 tracking-widest uppercase flex items-center gap-2">
                   <ShieldAlert size={10} className="animate-pulse" /> {conflictLog}
                </motion.div>
             )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="relative w-full overflow-visible mb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
          {agents.map((agent, i) => (
            <AgentCard 
               key={agent.id} 
               agent={agent} 
               results={results} 
               index={i} 
               isHighDrift={isHighDrift} 
               globalDrift={resonanceState.driftMagnitude} 
               onConflict={setConflictLog} 
               isExpanded={expandedAgentId === agent.id}
               onExpand={setExpandedAgentId}
               anyExpanded={expandedAgentId !== null}
            />
          ))}
        </div>
        
        <AnimatePresence>
           {expandedAgentId && (
              <AgentInspectionDrawer 
                key="drawer"
                agent={agents.find(a => a.id === expandedAgentId)} 
                results={results} 
                isHighDrift={isHighDrift} 
              />
           )}
        </AnimatePresence>
      </div>

      <div className="border-l-2 border-white/20 pl-4 py-2 mt-8 bg-gradient-to-r from-white/5 to-transparent">
         <h4 className="font-mono text-[9px] text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
           <Terminal size={10}/> Theory Arbitration Logs
         </h4>
         <div className="font-mono text-[9px] text-slate-500 space-y-1">
           <p>[ARBITRATION] Initialization sequence complete.</p>
           {isHighDrift ? (
             <>
                <p className="text-amber-500/80">[ARBITRATION] Pragmatics → coercive interpretation detected.</p>
                <p className="text-amber-500/80">[ARBITRATION] Semantics → lexical mutation bounds exceeded.</p>
                <p className="text-rose-400">[ARBITRATION] Register → institutional override triggered.</p>
                <p className="text-white">[RESOLUTION] Weighted synthesis accepted. Confidence delta → +0.08</p>
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
