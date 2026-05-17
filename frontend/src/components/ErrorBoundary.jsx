import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL REACT ERROR CAUGHT BY BOUNDARY:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-obsidian text-slate-300 p-8 font-mono">
          <div className="max-w-2xl w-full bg-black/80 border border-rose-500/50 p-8 rounded-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse" />
            <div className="flex items-center gap-4 text-rose-500 mb-6">
              <AlertTriangle size={32} />
              <h1 className="text-xl tracking-widest uppercase font-bold">Semantic Observatory Runtime Failure</h1>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              A critical render fault occurred within the UI component tree. This is usually caused by an undefined variable, a failed animation context, or a recursive hook loop.
            </p>
            <div className="bg-black border border-white/10 p-4 rounded text-xs mb-6 overflow-auto max-h-[300px]">
              <div className="text-rose-400 mb-2 font-bold">{this.state.error && this.state.error.toString()}</div>
              <pre className="text-slate-500 whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 px-4 py-2 rounded text-sm transition-colors text-white"
            >
              <RefreshCw size={14} /> RELOAD OBSERVATORY
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
