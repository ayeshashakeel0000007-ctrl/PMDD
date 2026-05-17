import React, { createContext, useContext, useState, useEffect } from 'react';

const ResearchWorkspaceContext = createContext();

export const useWorkspace = () => useContext(ResearchWorkspaceContext);

export const ResearchWorkspaceProvider = ({ children }) => {
  const [savedSnapshots, setSavedSnapshots] = useState([]);
  const [annotations, setAnnotations] = useState({}); // { clauseIdx: { text: '', flag: 'DISPUTE' } }
  const [comparisonTarget, setComparisonTarget] = useState(null); // ID of snapshot to compare against

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pmdd_research_workspace');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.snapshots) setSavedSnapshots(parsed.snapshots);
        if (parsed.annotations) setAnnotations(parsed.annotations);
      }
    } catch (e) {
      console.warn("Failed to load workspace state from localStorage.");
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('pmdd_research_workspace', JSON.stringify({ snapshots: savedSnapshots, annotations }));
    } catch (e) {
      console.warn("Failed to save workspace state to localStorage.");
    }
  }, [savedSnapshots, annotations]);

  const saveSnapshot = (results, metadata) => {
     if(!results) return;
     const id = `snap_${Date.now()}`;
     const newSnapshot = {
        id,
        timestamp: new Date().toISOString(),
        results,
        metadata: metadata || { name: 'Investigation Snapshot' }
     };
     setSavedSnapshots(prev => [newSnapshot, ...prev]);
  };

  const removeSnapshot = (id) => {
     setSavedSnapshots(prev => prev.filter(s => s.id !== id));
     if(comparisonTarget === id) setComparisonTarget(null);
  };

  const addAnnotation = (clauseIdx, data) => {
     setAnnotations(prev => ({
        ...prev,
        [clauseIdx]: { ...(prev[clauseIdx] || {}), ...data, timestamp: new Date().toISOString() }
     }));
  };

  const removeAnnotation = (clauseIdx) => {
     setAnnotations(prev => {
        const newAnn = { ...prev };
        delete newAnn[clauseIdx];
        return newAnn;
     });
  };

  return (
    <ResearchWorkspaceContext.Provider value={{
      savedSnapshots, saveSnapshot, removeSnapshot,
      annotations, addAnnotation, removeAnnotation,
      comparisonTarget, setComparisonTarget
    }}>
      {children}
    </ResearchWorkspaceContext.Provider>
  );
};
