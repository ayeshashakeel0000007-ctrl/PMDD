import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';

const EvidenceExplorer = ({ results }) => {
  const [expandedSeg, setExpandedSeg] = useState(null);

  if (!results || !results.segments) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-pmdd-accent/30">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Evidence Explorer</h2>
        <p className="text-pmdd-neutral">
          Inspect the exact sentences, confidence scores, and linguistic markers extracted by the agents.
        </p>
      </div>

      <div className="bg-pmdd-dark/80 border border-pmdd-accent/40 rounded-xl overflow-hidden shadow-lg">
        {results.segments.map((seg, idx) => {
          const isExpanded = expandedSeg === idx;
          const pragmatics = seg.pragmatics || {};
          const semantics = seg.semantics || {};
          const register = seg.register || {};
          
          // Confidence Heatmap Logic
          const conf = pragmatics.confidence || 1.0;
          let confColor = "text-white";
          let bgTint = "hover:bg-pmdd-accent/10";
          if (conf < 0.6) {
            confColor = "text-red-300";
            bgTint = "hover:bg-red-900/20 bg-red-900/10";
          } else if (conf < 0.8) {
            confColor = "text-yellow-200";
            bgTint = "hover:bg-yellow-900/20 bg-yellow-900/10";
          }

          return (
            <div key={idx} className="border-b border-pmdd-accent/20 last:border-0">
              <button 
                onClick={() => setExpandedSeg(isExpanded ? null : idx)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${bgTint}`}
              >
                <div className="flex items-center space-x-4 text-left">
                  <span className="text-pmdd-soft font-mono text-sm w-8">{(idx + 1).toString().padStart(2, '0')}</span>
                  <p className={`text-sm md:text-base line-clamp-1 ${confColor}`}>{seg.text}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {pragmatics.confidence && (
                    <span className={`hidden sm:flex items-center text-xs px-2 py-1 rounded ${conf < 0.8 ? 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/50' : 'text-green-400 bg-green-900/30 border border-green-700/50'}`}>
                      <ShieldCheck size={12} className="mr-1" />
                      {(pragmatics.confidence * 100).toFixed(0)}% Conf
                    </span>
                  )}
                  {isExpanded ? <ChevronDown size={18} className="text-pmdd-neutral" /> : <ChevronRight size={18} className="text-pmdd-neutral" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 py-4 bg-[#12161b] border-t border-pmdd-accent/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Pragmatics Column */}
                  {pragmatics.speech_acts && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-pmdd-soft uppercase tracking-wider border-b border-pmdd-accent/30 pb-1">Pragmatics</h4>
                      {pragmatics.speech_acts.map((act, i) => (
                        <div key={i} className="bg-pmdd-dark p-3 rounded border border-pmdd-accent/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-white font-medium">{act.category}</span>
                            <span className="text-xs text-pmdd-neutral">{(act.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <p className="text-xs text-pmdd-neutral italic">"{act.evidence}"</p>
                        </div>
                      ))}
                      {pragmatics.maxim_violations?.length > 0 && (
                        <div className="mt-2 text-xs text-yellow-500/80">
                          <strong>Gricean Violation:</strong> {pragmatics.maxim_violations[0].maxim}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Semantics Column */}
                  {semantics.semantic_fields && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-pmdd-soft uppercase tracking-wider border-b border-pmdd-accent/30 pb-1">Semantics</h4>
                      {semantics.semantic_fields.map((field, i) => (
                        <div key={i} className="bg-pmdd-dark p-3 rounded border border-pmdd-accent/20">
                          <span className="text-sm text-white font-medium">{field.word}</span>
                          <span className="text-xs text-pmdd-accent ml-2">→ {field.field}</span>
                          <p className="text-xs text-pmdd-neutral mt-1">{field.contextual_meaning}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Register Column */}
                  {register.formality_score !== undefined && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-pmdd-soft uppercase tracking-wider border-b border-pmdd-accent/30 pb-1">Register</h4>
                      <div className="bg-pmdd-dark p-3 rounded border border-pmdd-accent/20">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-pmdd-neutral">Formality:</span>
                          <span className="text-white">{(register.formality_score * 10).toFixed(1)} / 10</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-pmdd-neutral">Tenor:</span>
                          <span className="text-white truncate max-w-[120px]" title={register.tenor}>{register.tenor}</span>
                        </div>
                        <p className="text-xs text-pmdd-neutral italic border-t border-pmdd-accent/20 pt-2 mt-2">
                          "{register.evidence}"
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvidenceExplorer;
