import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, BrainCircuit, ScanText, Scale, Cpu, Activity, Lock, Unlock, Zap, AlertTriangle, RefreshCcw } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';

const MemoryTransferBeam = ({ active, isHighDrift, hasConflict }) => {
  if (!active) return <div className="absolute top-1/2 -right-4 w-8 h-[1px] bg-white/5 -translate-y-1/2 z-0" />;

  return (
    <div className="absolute top-1/2 -right-6 w-12 h-[1px] -translate-y-1/2 z-0 overflow-hidden bg-white/10">
       <motion.div 
         initial={{ x: '-100%' }} 
         animate={{ x: '100%' }} 
         transition={{ duration: isHighDrift ? 0.2 : 0.5, repeat: Infinity, ease: "linear" }}
         className={`w-full h-full ${hasConflict ? 'bg-amber-500' : isHighDrift ? 'bg-rose-500' : 'bg-holo-cyan'}`}
       />
    </div>
  );
};

const AgentCard = ({ id, name, icon, active, results, index, isHighDrift, globalDrift, onConflict }) => {
  const [internalState, setInternalState] = useState('waiting'); // waiting, processing, deadlock, complete
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (results) {
      const delay = index * (isHighDrift ? 600 : 1000);
      setInternalState('waiting');
      setConflict(false);
      
      const pTimer = setTimeout(() => setInternalState('processing'), delay);
      const cTimer = setTimeout(() => {
         // Simulate deadlocks and theory disagreements
         if (isHighDrift && Math.random() > 0.6 && id === 3) {
            setInternalState('deadlock');
            setConflict(true);
            onConflict(`[AGENT-03] Semantic Tensor Conflict. Entropy bounds exceeded. Requesting Sync Retry...`);
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
  }, [results, index, isHighDrift]);

  const isComplete = internalState === 'complete';
  const isProcessing = internalState === 'processing';
  const isDeadlock = internalState === 'deadlock';

  const pulseColor = 'border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] bg-white/5';
  
  const activeColor = isDeadlock ? 'border-amber-500 text-amber-500 bg-amber-900/10' : 
                      isProcessing ? 'border-holo-cyan text-holo-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)] bg-holo-cyan/5' : 
                      isComplete ? pulseColor : 'border-white/5 bg-obsidian text-slate-500';

  return (
    <div className="relative group/agent">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-obsidian/80 p-6 flex flex-col items-center border ${activeColor} transition-all duration-300 relative z-10 w-full`}
      >
         {isProcessing && <div className="absolute inset-0 bg-holo-cyan/5 animate-pulse pointer-events-none"></div>}
         {isDeadlock && <div className="absolute inset-0 bg-amber-500/10 animate-pulse pointer-events-none"></div>}
         
         <div className="absolute top-2 right-2 text-slate-600 flex gap-1">
            {isDeadlock && <AlertTriangle size={10} className="text-amber-500 animate-pulse"/>}
            {internalState === 'waiting' && <Lock size={10} />}
            {internalState !== 'waiting' && <Unlock size={10} className={isComplete ? "text-white" : "text-slate-400"} />}
         </div>

         <div className={`w-10 h-10 flex items-center justify-center mb-4 relative ${isComplete || isProcessing ? '' : 'grayscale opacity-30'}`}>
            {isProcessing && <div className="absolute inset-0 border border-current opacity-50 animate-spin-slow"></div>}
            {isDeadlock && <RefreshCcw className="absolute inset-0 animate-spin text-amber-500 opacity-50" />}
            <div className="relative z-10">{icon}</div>
         </div>
         <h4 className="font-mono text-[9px] tracking-widest uppercase mb-4 text-center h-8 flex items-center">{name}</h4>
         
         <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-widest uppercase mt-auto">
            <span className="text-slate-500">STATE</span>
            <span className={isDeadlock ? 'text-amber-500 animate-pulse' : isProcessing ? 'text-holo-cyan animate-pulse' : isComplete ? 'text-white' : 'text-slate-600'}>
               {isDeadlock ? 'DEADLOCK' : isProcessing ? 'COMPUTING' : isComplete ? 'SYNCED' : 'LOCKED'}
            </span>
         </div>
         <div className="w-full h-px bg-white/10 mt-2 relative">
            {isProcessing && <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1, repeat: Infinity }} className="h-full w-1/3 bg-holo-cyan" />}
            {isComplete && <div className="h-full w-full bg-white/50" />}
            {isDeadlock && <div className="h-full w-full bg-amber-500" />}
         </div>
      </motion.div>

      {/* Dependency Link */}
      {id < 5 && <MemoryTransferBeam active={isComplete || isDeadlock} isHighDrift={isHighDrift} hasConflict={conflict} />}
    </div>
  );
};

const AgentPipeline = ({ results }) => {
  const { resonanceState } = useResonance();
  const [conflictLog, setConflictLog] = useState(null);
  
  const plan = results?.execution_plan;
  const isHighDrift = resonanceState.intensityMultiplier > 1.5;

  const agents = [
    { id: 1, name: "Vector Ingestion", icon: <Database size={16} />, active: true },
    { id: 2, name: "Pragmatic Drift", icon: <BrainCircuit size={16} />, active: plan ? plan.run_pragmatics : true },
    { id: 3, name: "Semantic Topology", icon: <ScanText size={16} />, active: plan ? plan.run_semantics : true },
    { id: 4, name: "Register Inference", icon: <Scale size={16} />, active: plan ? plan.run_register : true },
    { id: 5, name: "Math Synthesis", icon: <Cpu size={16} />, active: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative border border-white/5 bg-obsidian/40 mt-12">
      <div className="absolute top-0 left-0 w-1 h-full bg-white/10"></div>
      <div className="mb-10 flex flex-col items-start">
         <div className="flex items-center gap-3 mb-2">
            <Activity size={14} className="text-slate-400"/>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400">Distributed Orchestration Pipeline</span>
         </div>
         <h2 className="text-xl font-mono text-white tracking-[0.1em] uppercase">Inference Module Network</h2>
      </div>

      {plan && (
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className={`max-w-full mb-12 bg-black/80 border border-white/10 p-6 relative`}
        >
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2 relative z-10">
            <div className="flex items-center space-x-3">
               <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">Routing Trace</span>
            </div>
            {results?.runtime_seconds && <span className="text-[10px] font-mono text-white uppercase">Latency: {results.runtime_seconds}s</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm relative z-10">
            <div className="flex flex-col gap-1">
               <span className="text-slate-500 font-mono text-[9px] tracking-widest uppercase">Target Domain</span>
               <span className="text-white font-mono text-xs">{plan.domain}</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-slate-500 font-mono text-[9px] tracking-widest uppercase">Intent Hypothesis</span>
               <span className="text-white font-mono text-xs">{plan.communicative_intent}</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-slate-500 font-mono text-[9px] tracking-widest uppercase">Execution Vector</span>
               <span className="text-holo-cyan font-mono text-xs truncate" title={plan.routing_rationale}>
                 {plan.routing_rationale}
               </span>
            </div>
          </div>
          
          <AnimatePresence>
             {conflictLog && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-rose-500/20 text-[10px] font-mono text-amber-500 tracking-widest uppercase flex items-center gap-2">
                   <AlertTriangle size={12} className="animate-pulse" /> {conflictLog}
                </motion.div>
             )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="relative w-full overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} {...agent} results={results} index={i} isHighDrift={isHighDrift} globalDrift={resonanceState.driftMagnitude} onConflict={setConflictLog} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPipeline;
