import React from 'react';
import { Database, BrainCircuit, ScanText, Scale, Cpu, Zap } from 'lucide-react';

const AgentPipeline = ({ results }) => {
  const plan = results?.execution_plan;
  const runtime = results?.runtime_seconds;

  const agents = [
    { id: 1, name: "Preprocessor", icon: <Database size={24} />, status: results ? "Complete" : "Pending", active: true },
    { id: 2, name: "Pragmatics", icon: <BrainCircuit size={24} />, status: results ? "Complete" : "Pending", active: plan ? plan.run_pragmatics : true },
    { id: 3, name: "Semantics", icon: <ScanText size={24} />, status: results ? "Complete" : "Pending", active: plan ? plan.run_semantics : true },
    { id: 4, name: "Register", icon: <Scale size={24} />, status: results ? "Complete" : "Pending", active: plan ? plan.run_register : true },
    { id: 5, name: "Orchestrator", icon: <Cpu size={24} />, status: results ? "Complete" : "Pending", active: true },
  ];

  return (
    <div id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-pmdd-accent/30">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Agentic Reasoning Pipeline</h2>
        <p className="text-pmdd-neutral max-w-2xl mx-auto">
          A sequential flow of specialized linguistic intelligence agents, rigorously bounded by deterministic logic.
        </p>
      </div>

      {plan && (
        <div className="max-w-4xl mx-auto mb-10 bg-pmdd-dark/50 border border-pmdd-soft/30 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4 border-b border-pmdd-accent/20 pb-3">
            <Zap className="text-pmdd-soft" size={20} />
            <h3 className="text-lg font-semibold text-white">Profiler Execution Plan</h3>
            {runtime && <span className="ml-auto text-xs text-pmdd-neutral font-mono bg-pmdd-dark px-2 py-1 rounded">Runtime: {runtime}s</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-pmdd-neutral block text-xs">Domain</span><span className="text-white font-medium">{plan.domain}</span></div>
            <div><span className="text-pmdd-neutral block text-xs">Intent</span><span className="text-white font-medium">{plan.communicative_intent}</span></div>
            <div className="col-span-2"><span className="text-pmdd-neutral block text-xs">Routing Rationale</span><span className="text-pmdd-soft italic">{plan.routing_rationale}</span></div>
          </div>
        </div>
      )}

      <div className="relative max-w-6xl mx-auto">
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-pmdd-accent/30 -translate-y-1/2 z-0"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
          {agents.map((agent) => (
            <div key={agent.id} className={`glass-panel p-6 flex flex-col items-center text-center transition-all duration-300 ${results && agent.active ? 'border-pmdd-soft bg-pmdd-accent/10' : ''} ${!agent.active ? 'opacity-40 grayscale' : ''}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${results && agent.active ? 'bg-pmdd-soft text-pmdd-dark' : 'bg-pmdd-dark border border-pmdd-accent text-pmdd-neutral'}`}>
                {agent.icon}
              </div>
              <h4 className="text-white font-bold mb-3">{agent.name}</h4>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${results && agent.active ? 'bg-green-900/40 text-green-400 border border-green-700/50' : (!agent.active ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'bg-pmdd-dark border border-pmdd-accent/40 text-pmdd-neutral')}`}>
                {agent.active ? agent.status : "Bypassed"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPipeline;
