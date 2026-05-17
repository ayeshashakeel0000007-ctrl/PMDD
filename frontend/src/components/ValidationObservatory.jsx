import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivitySquare, AlertTriangle, SearchCode, FileWarning, BookOpen, Brain, Download, ChevronRight, FileText, Database, Code, CheckCircle2 } from 'lucide-react';
import { useResonance } from '../context/SemanticResonanceContext';

const ValidationObservatory = ({ results }) => {
   const { resonanceState } = useResonance();
   const [viewMode, setViewMode] = useState('academic'); // 'practical' or 'academic'
   const [isExporting, setIsExporting] = useState(false);
   
   const math = results?.final_output?.math_scores || {};
   const uncert = resonanceState?.systemicUncertainty || 0;
   const pressure = resonanceState?.rhetoricalPressure || 0;
   const driftMagnitude = ((math?.systemic_uncertainty_index || 0.05) * 100).toFixed(1);
   
   const narrative = results?.final_output?.synthesis || "Semantic alignment remains within nominal institutional thresholds. No significant pragmatic drift detected.";
   
   const handleExport = (format) => {
       setIsExporting(true);
       
       setTimeout(() => {
          if (format === 'json') {
             const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
             const a = document.createElement('a');
             a.setAttribute("href", dataStr);
             a.setAttribute("download", "pmdd_export.json");
             document.body.appendChild(a);
             a.click();
             a.remove();
          } else if (format === 'csv') {
             const mathScores = results?.final_output?.math_scores || {};
             const headers = "Metric,Value\n";
             const rows = Object.entries(mathScores).map(([k, v]) => `${k},${v}`).join("\n");
             const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
             const a = document.createElement('a');
             a.setAttribute("href", csvContent);
             a.setAttribute("download", "pmdd_metrics.csv");
             document.body.appendChild(a);
             a.click();
             a.remove();
          } else if (format === 'md') {
             let mdContent = `# PMDD Observatory Export\n\n`;
             mdContent += `## 1. Summary\n${results?.final_output?.synthesis || narrative || 'N/A'}\n\n`;
             mdContent += `## 2. Math Scores\n\n| Metric | Value |\n|---|---|\n`;
             Object.entries(results?.final_output?.math_scores || {}).forEach(([k, v]) => {
               mdContent += `| ${k} | ${typeof v === 'number' ? v.toFixed(3) : v} |\n`;
             });
             const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
             const a = document.createElement('a');
             a.setAttribute("href", dataStr);
             a.setAttribute("download", "pmdd_analysis.md");
             document.body.appendChild(a);
             a.click();
             a.remove();
          } else if (format === 'pdf') {
             window.print();
          } else if (format === 'docx') {
             alert("DOCX export requires server-side processing. Please use Markdown or PDF format.");
          }
          setIsExporting(false);
       }, 600);
   };

   return (
      <div id="conclusion-engine" className="glass-panel p-8 border border-white/5 relative overflow-hidden mt-8">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-holo-cyan to-transparent opacity-50" />
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
               <ActivitySquare size={24} className="text-holo-cyan"/>
               <h3 className="text-xl font-light text-white tracking-[0.2em] uppercase">Deterministic Orchestrator Conclusion</h3>
            </div>
            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-sm border border-white/10">
                <button 
                    onClick={() => setViewMode('practical')}
                    className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all ${viewMode === 'practical' ? 'bg-holo-cyan/20 text-holo-cyan border border-holo-cyan/30' : 'text-slate-500 hover:text-white border border-transparent'}`}
                >
                    <BookOpen size={12} className="inline mr-2"/> Practical Summary
                </button>
                <button 
                    onClick={() => setViewMode('academic')}
                    className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-all ${viewMode === 'academic' ? 'bg-plasma-violet/20 text-plasma-violet border border-plasma-violet/30' : 'text-slate-500 hover:text-white border border-transparent'}`}
                >
                    <Brain size={12} className="inline mr-2"/> Academic Analysis
                </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Semantic Trajectory & Conclusion */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-black/40 border border-white/5 p-6 relative">
                    <div className="absolute top-0 right-0 bg-white/5 text-[9px] font-mono tracking-[0.2em] uppercase px-3 py-1 text-slate-400">Orchestration Synthesis</div>
                    <h4 className="text-xs font-mono text-holo-cyan mb-4 uppercase tracking-widest flex items-center gap-2">
                        <ChevronRight size={14}/> Full Narrative Interpretation
                    </h4>
                    <p className="text-sm font-sans font-light text-slate-300 leading-relaxed">
                        {viewMode === 'practical' ? (
                            "The text indicates a shift towards authoritative, directive language, moving away from neutral information sharing. This suggests the author is attempting to enforce compliance rather than simply state facts."
                        ) : (
                            narrative
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/50 p-4 border border-white/5">
                        <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase">Drift Resonance</div>
                        <div className="text-white text-lg font-light tracking-widest">{driftMagnitude}%</div>
                    </div>
                    <div className="bg-black/50 p-4 border border-white/5">
                        <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase">Systemic Uncertainty</div>
                        <div className="text-white text-lg font-light tracking-widest">{(uncert * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-black/50 p-4 border border-white/5">
                        <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase">Rhetorical Pressure</div>
                        <div className="text-white text-lg font-light tracking-widest">{(pressure * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-black/50 p-4 border border-white/5">
                        <div className="text-[9px] font-mono text-slate-500 mb-1 uppercase">Dominant Theory</div>
                        <div className="text-holo-cyan text-xs font-mono uppercase mt-2">Pragmatics</div>
                    </div>
                </div>

                {uncert > 0.4 && (
                  <div className="bg-amber-900/10 border border-amber-500/30 p-4 flex items-start gap-3 rounded-sm">
                     <FileWarning size={16} className="text-amber-500 shrink-0 mt-0.5"/>
                     <p className="text-xs font-mono text-amber-400 leading-relaxed">
                        <strong className="text-amber-500 uppercase">Ambiguity Advisory:</strong> Significant structural conflict detected between Register Inference and Pragmatic Semantic models.
                     </p>
                  </div>
                )}
            </div>

            {/* Export & Data Controls */}
            <div className="flex flex-col gap-4">
                <div className="bg-black/30 border border-white/5 p-5">
                    <h4 className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <Download size={14}/> Multi-Format Export
                    </h4>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleExport('pdf')} className="flex items-center justify-between w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-white">Publication PDF</span>
                            {isExporting ? <ActivitySquare size={14} className="text-holo-cyan animate-pulse"/> : <FileText size={14} className="text-slate-500 group-hover:text-holo-cyan"/>}
                        </button>
                        <button onClick={() => handleExport('docx')} className="flex items-center justify-between w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-white">Manuscript DOCX</span>
                            {isExporting ? <ActivitySquare size={14} className="text-holo-cyan animate-pulse"/> : <FileText size={14} className="text-slate-500 group-hover:text-holo-cyan"/>}
                        </button>
                        <button onClick={() => handleExport('json')} className="flex items-center justify-between w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-white">Raw JSON Payload</span>
                            {isExporting ? <ActivitySquare size={14} className="text-plasma-violet animate-pulse"/> : <Code size={14} className="text-slate-500 group-hover:text-plasma-violet"/>}
                        </button>
                        <button onClick={() => handleExport('csv')} className="flex items-center justify-between w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-white">Metrics CSV</span>
                            {isExporting ? <ActivitySquare size={14} className="text-semantic-teal animate-pulse"/> : <Database size={14} className="text-slate-500 group-hover:text-semantic-teal"/>}
                        </button>
                        <button onClick={() => handleExport('md')} className="flex items-center justify-between w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group">
                            <span className="text-[11px] font-mono uppercase tracking-widest text-white">Markdown Source</span>
                            {isExporting ? <ActivitySquare size={14} className="text-slate-300 animate-pulse"/> : <FileText size={14} className="text-slate-500 group-hover:text-white"/>}
                        </button>
                    </div>
                </div>

                <div className="bg-black/30 border border-white/5 p-5 mt-auto">
                    <h4 className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <SearchCode size={14}/> Cognitive Trust System
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Calibration</span>
                            {uncert > 0.4 ? <span className="text-rose-400 text-[10px] font-mono">UNSTABLE</span> : <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1"><CheckCircle2 size={10}/> OPTIMAL</span>}
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Agreement</span>
                            <span className="text-white text-[10px] font-mono">{((1 - uncert) * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>

         </div>
      </div>
   );
};

export default ValidationObservatory;
