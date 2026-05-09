import React from 'react';
import { Network, Activity, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-pmdd-accent/30">
      {/* Background Topology / Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pmdd-dark via-[#1e252d] to-[#12161b] z-0"></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pmdd-accent to-transparent z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-pmdd-accent/20 px-4 py-2 rounded-full border border-pmdd-accent/40 mb-8">
          <Activity size={16} className="text-pmdd-soft" />
          <span className="text-sm text-pmdd-soft tracking-wider uppercase font-semibold">Deterministic Validation Active</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
          Pragmatic Meaning <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pmdd-soft to-pmdd-neutral">Drift Detector</span>
        </h1>
        
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-pmdd-neutral mx-auto mb-10 leading-relaxed">
          An adaptive, interpretable linguistic intelligence system powered by theory-driven agentic reasoning and deterministic mathematical validation.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#dashboard" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-pmdd-dark bg-pmdd-soft hover:bg-white transition-colors duration-200">
            Launch System
            <ArrowRight size={18} className="ml-2" />
          </a>
          <a href="#architecture" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-pmdd-accent text-base font-medium rounded-lg text-pmdd-bg hover:bg-pmdd-accent/20 transition-colors duration-200">
            View Architecture
            <Network size={18} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
