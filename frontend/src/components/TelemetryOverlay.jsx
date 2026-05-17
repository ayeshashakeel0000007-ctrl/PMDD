import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResonance } from '../context/SemanticResonanceContext';

const TelemetryOverlay = () => {
  const { resonanceState } = useResonance();
  const [logs, setLogs] = useState([]);
  const idleTimer = useRef(null);

  useEffect(() => {
    let newLogs = [];
    
    if (resonanceState.orchestrationState === 'analyzing') {
       if(idleTimer.current) clearInterval(idleTimer.current);
       newLogs = [
          "[SYS] Aligning semantic tensors...",
          "[AGENT-01] Corpus vectors mapped to memory.",
          "[PIPELINE] Awaiting theory resonance locks...",
       ];
       setLogs([]);
       newLogs.forEach((log, index) => {
          setTimeout(() => {
             setLogs(prev => [...prev, log].slice(-6));
          }, index * 800);
       });
    } else if (resonanceState.orchestrationState === 'results') {
       if(idleTimer.current) clearInterval(idleTimer.current);
       const intensity = resonanceState.intensityMultiplier;
       if (resonanceState.isStabilizing) {
          newLogs = [
             "[SYS] Initiating post-computation stabilization...",
             "[MEMORY] Flushing contaminated semantic buffers...",
             "[THEORY] Re-aligning Gricean baseline..."
          ];
       } else if (intensity > 2) {
          newLogs = [
             "[SYS] CRITICAL DRIFT MAGNITUDE SUSTAINED.",
             "[AGENT-04] Rhetorical pressure exceeds nominal limits.",
             "[PIPELINE] Interpretability variance high."
          ];
       } else {
          newLogs = [
             "[SYS] Nominal discourse topology established.",
             "[MEMORY] Semantic paths cached.",
             "[PIPELINE] Inference synced."
          ];
       }
       setLogs([]);
       newLogs.forEach((log, index) => {
          setTimeout(() => {
             setLogs(prev => [...prev, log].slice(-6));
          }, index * (800 + Math.random() * 500));
       });
    } else {
       // Real-Time Cognitive Life (Idle State)
       setLogs([
          "[SYS] Telemetry socket open.",
          "[SYS] Awaiting neural synchronization."
       ]);
       
       if(idleTimer.current) clearInterval(idleTimer.current);
       idleTimer.current = setInterval(() => {
          const passiveLogs = [
             "[IDLE] Self-calibrating entropy baseline...",
             "[IDLE] Memory cleanup routine executing...",
             "[IDLE] Theory cache alignment verified.",
             "[IDLE] Orchestration harmonize check: OK.",
             "[IDLE] Balancing semantic resonance parameters..."
          ];
          const randomLog = passiveLogs[Math.floor(Math.random() * passiveLogs.length)];
          setLogs(prev => [...prev, randomLog].slice(-6));
       }, 5000); // Emit a passive log every 5 seconds
    }

    return () => { if (idleTimer.current) clearInterval(idleTimer.current); };
  }, [resonanceState.orchestrationState, resonanceState.intensityMultiplier, resonanceState.isStabilizing]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none w-96 flex flex-col items-end gap-1 font-mono text-[9px] tracking-widest uppercase overflow-hidden">
      <AnimatePresence>
        {logs.map((log, i) => {
          let colorClass = 'border-white/20 text-slate-500 bg-obsidian/80';
          if (log.includes('CRITICAL') || log.includes('unstable') || log.includes('contaminated')) colorClass = 'border-rose-500 text-rose-400 bg-black/80';
          if (log.includes('Stabilizing') || log.includes('Re-aligning')) colorClass = 'border-amber-500 text-amber-500 bg-black/80';
          if (log.includes('IDLE')) colorClass = 'border-holo-cyan/20 text-holo-cyan/60 bg-transparent';
          
          return (
             <motion.div 
               key={i + log + Math.random()}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, filter: "blur(4px)" }}
               transition={{ duration: 0.5 }}
               className={`px-2 py-1 rounded-sm border-r-2 ${colorClass}`}
             >
                {log}
             </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default TelemetryOverlay;
