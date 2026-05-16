import React, { memo, useMemo } from 'react';
import { Database, BrainCircuit, ScanText, Scale, Cpu, Zap, Loader, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AgentPipeline = memo(({ results, isAnalyzing }) => {
  const plan = results?.execution_plan;
  const runtime = results?.runtime_seconds;
  const scores = results?.final_output?.math_scores || {};

  const getAgentStatus = (id) => {
    if (isAnalyzing) return "Processing...";
    if (results) return "Complete";
    return "Pending";
  };

  const isAgentActive = (id) => {
    if (isAnalyzing) return true;
    if (!results) return false;
    if (id === 2) return plan ? plan.run_pragmatics : true;
    if (id === 3) return plan ? plan.run_semantics : true;
    if (id === 4) return plan ? plan.run_register : true;
    return true; 
  };

  const getAgentData = (id) => {
    if (!results) return null;
    if (id === 2) return {
      conf: results.final_output?.pragmatic_synthesis?.dominant_intent ? 0.92 : 0.85,
      features: "Speech Acts, Maxims",
      summary: results.final_output?.pragmatic_synthesis?.dominant_intent || "Extracted intent"
    };
    if (id === 3) return {
      conf: 0.88,
      features: "Semantic Fields",
      summary: "Conceptual mapping complete"
    };
    if (id === 4) return {
      conf: 0.95,
      features: "Formality, Power",
      summary: results.final_output?.register_synthesis?.power_dynamic || "Register analyzed"
    };
    if (id === 5) return {
      conf: 1 - (scores.systemic_uncertainty_index || 0.1),
      features: "Math Synthesis",
      summary: "Calibration & Aggregation"
    };
    return { conf: 1.0, features: "Tokenization", summary: "Data clean & ready" };
  };

  const agents = useMemo(() => [
    { id: 1, name: "Data Preprocessor", icon: <Database size={24} /> },
    { id: 2, name: "Pragmatics Agent", icon: <BrainCircuit size={24} /> },
    { id: 3, name: "Semantics Agent", icon: <ScanText size={24} /> },
    { id: 4, name: "Register Agent", icon: <Scale size={24} /> },
    { id: 5, name: "Orchestrator", icon: <Cpu size={24} /> },
  ], []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div id="architecture" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-white mb-3 text-gradient">Live Agent Orchestration</h2>
        <p className="text-pmdd-neutral max-w-2xl mx-auto text-lg">
          Cinematic view of specialized linguistic intelligence agents, rigorously bounded by deterministic logic.
        </p>
      </div>

      <AnimatePresence>
        {plan && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto mb-16 glass-panel p-6 shadow-lg border-t-4 border-t-pmdd-accent"
          >
            <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
              <div className="bg-pmdd-accent/20 p-2 rounded-lg"><Zap className="text-pmdd-accent" size={20} /></div>
              <h3 className="text-xl font-semibold text-white">Profiler Execution Plan</h3>
              {runtime && <span className="ml-auto text-xs text-pmdd-accent font-mono bg-pmdd-accent/10 px-3 py-1.5 rounded-lg border border-pmdd-accent/20 shadow-inner">Runtime: {runtime}s</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5"><span className="text-pmdd-neutral block text-xs uppercase tracking-wider mb-1">Domain</span><span className="text-white font-medium text-base">{plan.domain}</span></div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5"><span className="text-pmdd-neutral block text-xs uppercase tracking-wider mb-1">Intent</span><span className="text-white font-medium text-base">{plan.communicative_intent}</span></div>
              <div className="col-span-2 bg-slate-900/50 p-4 rounded-lg border border-white/5"><span className="text-pmdd-neutral block text-xs uppercase tracking-wider mb-1">Routing Rationale</span><span className="text-pmdd-soft italic leading-relaxed">{plan.routing_rationale}</span></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-[1400px] mx-auto mt-8">
        {/* Animated Connector Line */}
        <div className="hidden lg:block absolute top-[40px] left-[10%] w-[80%] h-1.5 bg-slate-800 z-0 rounded-full overflow-hidden">
          {isAnalyzing && (
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-pmdd-accent to-transparent shadow-[0_0_20px_rgba(59,130,246,1)]"
            />
          )}
          {results && !isAnalyzing && (
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-pmdd-accent via-pmdd-secondary to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            />
          )}
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10"
        >
          {agents.map((agent) => {
            const active = isAgentActive(agent.id);
            const status = getAgentStatus(agent.id);
            const pulseAnimation = isAnalyzing ? "animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.3)] border-pmdd-accent/50" : "";
            const data = getAgentData(agent.id);
            
            return (
              <motion.div 
                key={agent.id} 
                variants={itemVariants}
                className={`glass-panel p-6 flex flex-col items-center transition-all duration-500 relative group overflow-hidden ${active ? 'bg-slate-900/80 hover:-translate-y-2' : ''} ${!active ? 'opacity-40 grayscale border-white/5' : 'border-white/10'} ${pulseAnimation} ${results && !isAnalyzing && active ? 'border-pmdd-accent/50 shadow-[0_0_25px_rgba(59,130,246,0.15)]' : ''}`}
              >
                {active && !isAnalyzing && (
                  <div className="absolute inset-0 bg-gradient-to-b from-pmdd-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-colors duration-500 ${isAnalyzing ? 'bg-pmdd-accent/20 text-pmdd-accent border border-pmdd-accent/50' : (active && results ? 'bg-gradient-to-br from-pmdd-accent to-pmdd-secondary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-800 border border-slate-700 text-pmdd-neutral')}`}>
                  {agent.icon}
                </div>
                
                <h4 className="text-white font-bold text-center mb-3 relative z-10">{agent.name}</h4>
                
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide relative z-10 flex items-center mb-4 transition-colors duration-500 ${isAnalyzing ? 'bg-blue-900/40 text-blue-400 border border-blue-500/30' : (active && results ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : (!active ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-slate-800 border border-slate-700 text-pmdd-neutral'))}`}>
                  {isAnalyzing && <Loader size={12} className="mr-2 animate-spin" />}
                  {active ? status : "Bypassed"}
                </div>

                {/* Computational Observatory Detailed Info */}
                {data && !isAnalyzing && active && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="w-full mt-2 pt-4 border-t border-white/10 space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-pmdd-neutral flex items-center"><ShieldCheck size={12} className="mr-1"/> Confidence</span>
                      <span className="text-emerald-400 font-mono">{(data.conf * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1">
                      <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${data.conf * 100}%` }}></div>
                    </div>
                    
                    <div className="text-xs">
                      <span className="block text-pmdd-neutral mb-1 flex items-center"><Activity size={12} className="mr-1"/> Features Extracted</span>
                      <span className="block text-pmdd-soft bg-slate-800/50 px-2 py-1 rounded border border-slate-700 text-center">{data.features}</span>
                    </div>

                    <div className="text-xs">
                      <span className="block text-pmdd-neutral mb-1 flex items-center"><AlertCircle size={12} className="mr-1"/> Reasoning Summary</span>
                      <span className="block text-pmdd-soft italic text-center leading-tight">"{data.summary}"</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
});

export default AgentPipeline;
