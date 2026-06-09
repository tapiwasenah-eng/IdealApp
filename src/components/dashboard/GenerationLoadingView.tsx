import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, FileText, LayoutTemplate, PenTool, CheckCircle } from 'lucide-react';

const STEPS = [
  { icon: FileText, text: 'Reading source material...' },
  { icon: LayoutTemplate, text: 'Selecting optimal structure...' },
  { icon: Brain, text: 'Applying investor heuristics...' },
  { icon: PenTool, text: 'Drafting document sections...' }
];

export function GenerationLoadingView({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 1500); // 1.5 seconds per step

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-obsidian/95 backdrop-blur-md px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm w-full"
      >
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          {/* Subtle pulse background */}
          <div className="absolute inset-0 bg-electric-violet/20 rounded-full animate-ping opacity-50" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-2 bg-electric-violet/30 rounded-full animate-ping opacity-50" style={{ animationDuration: '2s' }} />
          <div className="relative w-16 h-16 bg-electric-violet/10 border border-electric-violet/30 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-electric-violet animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-serif text-white mb-2">Building your document</h2>
        <p className="text-text-muted mb-12 text-sm">Please wait while our AI partner structures your material.</p>

        <div className="space-y-6 text-left">
          {STEPS.map((s, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isPending = idx > currentStep;

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isCompleted ? 'bg-plasma-green/20' : isActive ? 'bg-electric-violet/20' : 'bg-white/5'}`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-plasma-green" />
                  ) : (
                    <s.icon className={`w-4 h-4 ${isActive ? 'text-electric-violet animate-pulse' : 'text-slate-500'}`} />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors duration-500 ${isCompleted ? 'text-white' : isActive ? 'text-electric-violet' : 'text-slate-500'}`}>
                  {s.text}
                </span>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1.5 h-1.5 rounded-full bg-electric-violet ml-auto"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
