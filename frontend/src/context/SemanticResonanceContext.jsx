import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const SemanticResonanceContext = createContext();

export const useResonance = () => useContext(SemanticResonanceContext);

export const SemanticResonanceProvider = ({ children }) => {
  const [resonanceState, setResonanceState] = useState({
    driftMagnitude: 0,
    systemicUncertainty: 0,
    rhetoricalPressure: 0,
    orchestrationState: 'idle', // idle, ingestion, analyzing, results
    intensityMultiplier: 1, // 1 = calm, 2+ = turbulent
    primaryHue: 'cyan', // cyan, amber, rose
    isStabilizing: false
  });

  const stabilizationTimer = useRef(null);

  const triggerStabilizationDecay = (targetIntensity, decaySeconds) => {
     if (stabilizationTimer.current) clearInterval(stabilizationTimer.current);
     
     const stepDelay = 100; // ms per step
     const totalSteps = (decaySeconds * 1000) / stepDelay;
     let currentStep = 0;
     
     setResonanceState(prev => ({ ...prev, isStabilizing: true }));

     stabilizationTimer.current = setInterval(() => {
        currentStep++;
        setResonanceState(prev => {
           if (currentStep >= totalSteps || prev.orchestrationState !== 'results') {
              clearInterval(stabilizationTimer.current);
              return { ...prev, intensityMultiplier: targetIntensity, isStabilizing: false };
           }
           
           // Exponential decay for realistic physical dampening
           const progress = currentStep / totalSteps;
           const easeOut = 1 - Math.pow(1 - progress, 3);
           const currentIntensity = prev.intensityMultiplier - ((prev.intensityMultiplier - targetIntensity) * easeOut * 0.05);
           
           return { ...prev, intensityMultiplier: Math.max(targetIntensity, currentIntensity) };
        });
     }, stepDelay);
  };

  const updateResonance = (data, state) => {
    if (!data || state !== 'results') {
      if (stabilizationTimer.current) clearInterval(stabilizationTimer.current);
      setResonanceState(prev => ({
        ...prev,
        orchestrationState: state,
        intensityMultiplier: state === 'analyzing' ? 1.2 : 1,
        primaryHue: 'cyan',
        isStabilizing: false
      }));
      return;
    }

    const math = data?.final_output?.math_scores || {};
    // Extract raw backend scores
    const rawEntropy = math.pragmatic_entropy || 0;
    
    // Determine drift and uncertainty dynamically if the specific keys are missing
    const uncert = math.systemic_uncertainty_index || Math.min(rawEntropy / 2.5, 0.95);
    const drift = math.pragmatic_drift_intensity || (rawEntropy > 1.0 ? Math.min(rawEntropy / 2, 0.85) : Math.min(rawEntropy / 4, 0.35));

    let hue = 'cyan';
    let peakMultiplier = 1;
    let baseTargetMultiplier = 1;
    let decayTime = 3;

    if (drift > 0.75) {
      hue = 'rose';
      peakMultiplier = 3.0 + (uncert * 2);
      baseTargetMultiplier = 1.8; // Retains residual stress
      decayTime = 12; // 10-14s for severe
    } else if (drift > 0.4) {
      hue = 'amber';
      peakMultiplier = 2.0 + uncert;
      baseTargetMultiplier = 1.3;
      decayTime = 7; // 6-8s for moderate
    } else {
      decayTime = 4; // 3-5s for mild
    }

    // Set immediate peak intensity for the initial shock
    setResonanceState({
      driftMagnitude: drift,
      systemicUncertainty: uncert,
      rhetoricalPressure: Math.min(1, drift * 1.2),
      orchestrationState: state,
      intensityMultiplier: peakMultiplier,
      primaryHue: hue,
      isStabilizing: true
    });

    // Start decay curve down to base target
    triggerStabilizationDecay(baseTargetMultiplier, decayTime);
  };

  useEffect(() => {
    return () => { if (stabilizationTimer.current) clearInterval(stabilizationTimer.current); };
  }, []);

  return (
    <SemanticResonanceContext.Provider value={{ resonanceState, updateResonance }}>
      {children}
    </SemanticResonanceContext.Provider>
  );
};
