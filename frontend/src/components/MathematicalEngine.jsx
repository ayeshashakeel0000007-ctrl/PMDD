import React, { useState, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FileText, Beaker, ShieldCheck, Zap, AlertTriangle, Eye, ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';

const MathematicalEngine = React.memo(({ results }) => {
  const [reportView, setReportView] = useState('simple'); // 'simple' or 'technical'

  if (!results || !results.final_output || !results.final_output.math_scores) {
    return null;
  }

  const scores = results.final_output.math_scores;
  const report = results.final_output.report;
  
  // Transform data for charts
  const speechActs = useMemo(() => {
    return Object.keys(scores.speech_act_distribution).map(key => ({
      subject: key,
      A: scores.speech_act_distribution[key],
      fullMark: 10,
    }));
  }, [scores.speech_act_distribution]);

  const entropyData = useMemo(() => {
    return [
      { name: 'Pragmatic Entropy', value: scores.pragmatic_entropy },
      { name: 'Formality Index', value: scores.confidence_weighted_formality || 0 }
    ];
  }, [scores.pragmatic_entropy, scores.confidence_weighted_formality]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-pmdd-accent/30">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Deterministic Mathematical Outputs</h2>
        <p className="text-pmdd-neutral">
          LLM classifications are bounded by hard Python calculations. These metrics represent the true source of interpretability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Radar Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-pmdd-soft mb-6">Speech Act Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={speechActs}>
                <PolarGrid stroke="#57707A" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#C5BAC4', fontSize: 12 }} />
                <Radar name="Corpus" dataKey="A" stroke="#C5BAC4" fill="#C5BAC4" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: '#191D23', borderColor: '#57707A', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entropy/Formality Bar */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-pmdd-soft mb-6">Indices (Entropy & Formality)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entropyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#57707A" horizontal={false} />
                <XAxis type="number" domain={[0, 'dataMax + 0.2']} stroke="#979DAB" />
                <YAxis dataKey="name" type="category" width={120} stroke="#979DAB" tick={{ fill: '#C5BAC4' }} />
                <Tooltip contentStyle={{ backgroundColor: '#191D23', borderColor: '#57707A', color: '#fff' }} />
                <Bar dataKey="value" fill="#57707A" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Synthesized Report (Dual Layer) */}
        <div className="lg:col-span-2 glass-panel p-8 bg-pmdd-dark/80 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pmdd-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-pmdd-accent/40 pb-4 relative z-10">
            <h3 className="text-2xl font-semibold text-white mb-4 sm:mb-0">Orchestrator Synthesis</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex space-x-1 bg-pmdd-dark p-1 rounded-lg border border-pmdd-accent/30 mr-2">
                <button 
                  onClick={() => setReportView('simple')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${reportView === 'simple' ? 'bg-pmdd-soft text-pmdd-dark' : 'text-pmdd-neutral hover:text-white'}`}
                >
                  <FileText size={16} className="mr-2" /> Practical Summary
                </button>
                <button 
                  onClick={() => setReportView('technical')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${reportView === 'technical' ? 'bg-pmdd-accent text-white' : 'text-pmdd-neutral hover:text-white'}`}
                >
                  <Beaker size={16} className="mr-2" /> Academic Analysis
                </button>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "pmdd_export.json");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                  className="flex items-center px-3 py-2 bg-[#12161b] hover:bg-pmdd-accent/20 border border-pmdd-accent/30 rounded-md text-sm text-pmdd-soft transition-colors"
                  title="Export to JSON"
                >
                  <span className="font-mono">JSON</span>
                </button>
                <button 
                  onClick={() => {
                    const mathScores = results.final_output.math_scores || {};
                    const headers = "Metric,Value\n";
                    const rows = Object.entries(mathScores).map(([k, v]) => `${k},${v}`).join("\n");
                    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", csvContent);
                    downloadAnchorNode.setAttribute("download", "pmdd_metrics.csv");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                  className="flex items-center px-3 py-2 bg-[#12161b] hover:bg-pmdd-accent/20 border border-pmdd-accent/30 rounded-md text-sm text-pmdd-soft transition-colors"
                  title="Export to CSV"
                >
                  <span className="font-mono">CSV</span>
                </button>
                <button 
                  onClick={() => {
                    let mdContent = `# PMDD Methodological Appendix & Research Report\n\n`;
                    mdContent += `## 1. Governance & Traceability Audit\n\n`;
                    if (results.final_output.traceability_log) {
                      results.final_output.traceability_log.forEach(log => {
                        mdContent += `- **[${log.event}]** ${log.target}: ${log.reason}`;
                        if (log.old_value !== undefined) {
                          mdContent += ` (Score adjusted: ${log.old_value.toFixed(2)} -> ${log.new_value.toFixed(2)})`;
                        }
                        mdContent += `\n`;
                      });
                    } else {
                      mdContent += `No governance overrides recorded.\n`;
                    }
                    
                    mdContent += `\n## 2. Mathematical Scores\n\n| Metric | Value |\n|---|---|\n`;
                    Object.entries(results.final_output.math_scores || {}).forEach(([k, v]) => {
                      if (typeof v === 'number') {
                        mdContent += `| ${k} | ${v.toFixed(3)} |\n`;
                      }
                    });
                    
                    mdContent += `\n## 3. Academic Analysis\n\n${results.final_output.report.technical_analysis}\n\n### Conclusion\n\n${results.final_output.report.conclusion}\n`;
                    
                    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
                    const downloadAnchorNode = document.createElement('a');
                    downloadAnchorNode.setAttribute("href", dataStr);
                    downloadAnchorNode.setAttribute("download", "pmdd_research_report.md");
                    document.body.appendChild(downloadAnchorNode);
                    downloadAnchorNode.click();
                    downloadAnchorNode.remove();
                  }}
                  className="flex items-center px-3 py-2 bg-[#12161b] hover:bg-pmdd-accent/20 border border-pmdd-accent/30 rounded-md text-sm text-pmdd-soft transition-colors"
                  title="Export Citation-Ready Markdown"
                >
                  <span className="font-mono">MD</span>
                </button>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none relative z-10">
            {reportView === 'simple' ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* In Case You're Not a Linguist Panel */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/80 border border-indigo-500/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-400/30 transition-colors duration-700 pointer-events-none"></div>
                  
                  <h4 className="text-2xl font-bold text-white flex items-center mb-6">
                    <Eye className="mr-3 text-indigo-400" size={28} /> In Case You're Not a Linguist
                  </h4>
                  
                  <div className="text-lg leading-relaxed text-indigo-100 mb-8 border-l-4 border-indigo-400 pl-5 font-medium">
                    "{report.simple_explanation}"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Live Interpretable Summary blocks */}
                    <div className="bg-black/40 p-5 rounded-xl border border-white/5 backdrop-blur-md hover:border-white/10 transition-colors">
                      <h5 className="text-pmdd-accent font-semibold flex items-center mb-3">
                        <ActivitySquare size={18} className="mr-2" /> Linguistic Stability Assessment
                      </h5>
                      <p className="text-sm text-pmdd-neutral leading-relaxed">
                        {(scores.systemic_uncertainty_index || 0) < 0.1 
                          ? "The text exhibits highly stable, predictable semantic patterns. Interpretive confidence is optimal." 
                          : (scores.systemic_uncertainty_index || 0) < 0.25 
                          ? "The text shows moderate stability, with some rhetorical variation. Interpretive confidence remains high." 
                          : "The text is highly volatile, indicating chaotic or unpredictable meaning structures. Expect significant pragmatic shifts."}
                      </p>
                    </div>

                    <div className="bg-black/40 p-5 rounded-xl border border-white/5 backdrop-blur-md hover:border-white/10 transition-colors">
                      <h5 className={`${(scores.pragmatic_entropy || 0) > 0.8 ? 'text-rose-400' : 'text-emerald-400'} font-semibold flex items-center mb-3`}>
                        <AlertTriangle size={18} className="mr-2" /> Communication Risk Interpretation
                      </h5>
                      <p className="text-sm text-pmdd-neutral leading-relaxed">
                        {(scores.pragmatic_entropy || 0) > 0.8 
                          ? "Elevated entropy detected. The author is using complex, potentially evasive or highly persuasive language."
                          : "Low entropy detected. The communication is straightforward, direct, and structurally unambiguous."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 border-l-4 border-l-pmdd-soft">
                  <h4 className="text-pmdd-soft font-semibold mb-2">Executive Conclusion</h4>
                  <p className="text-pmdd-neutral">{report.conclusion}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-sm space-y-6"
              >
                {results.final_output.traceability_log && results.final_output.traceability_log.length > 0 && (
                  <div className="bg-[#12161b] p-6 rounded-lg border border-pmdd-accent/40 shadow-[0_0_15px_rgba(100,255,218,0.1)] hover:shadow-[0_0_25px_rgba(100,255,218,0.2)] transition-shadow duration-500">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                      <Zap size={20} className="text-pmdd-accent mr-2" /> Governance Traceability Audit
                    </h3>
                    <div className="space-y-3">
                      {results.final_output.traceability_log.map((log, idx) => (
                        <div key={idx} className="bg-pmdd-dark p-3 rounded border border-pmdd-accent/10 flex justify-between items-start group hover:border-pmdd-accent/30 transition-colors">
                          <div>
                            <span className="text-pmdd-accent font-mono text-xs mr-2">[{log.event}]</span>
                            <span className="text-white text-sm">{log.target}</span>
                            <p className="text-pmdd-neutral text-xs mt-1">{log.reason}</p>
                          </div>
                          {log.old_value !== undefined && log.new_value !== undefined && (
                            <div className="text-right font-mono text-xs text-pmdd-soft whitespace-nowrap ml-4 flex flex-col">
                              <span className="line-through opacity-50">{log.old_value.toFixed(2)}</span>
                              <span className="text-red-400 font-bold">→ {log.new_value.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="leading-relaxed text-pmdd-bg bg-[#12161b] p-6 rounded-lg border border-pmdd-accent/20">
                  <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-xs border-b border-white/10 pb-2">Technical Analysis</h4>
                  <p>{report.technical_analysis}</p>
                </div>
                <div>
                  <h4 className="text-pmdd-accent font-semibold mb-2 flex items-center"><ShieldCheck size={16} className="mr-2"/> Rigorous Conclusion</h4>
                  <p className="text-pmdd-neutral bg-[#12161b] p-4 rounded-lg border border-pmdd-accent/10">{report.conclusion}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
});

export default MathematicalEngine;
