import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GlassHeroCardProps {
  currentPrompt: {
    highlight1: string;
    color1: string;
    highlight2: string;
    color2: string;
  };
  promptIndex: number;
  onClick: () => void;
}

export const GlassHeroCard: React.FC<GlassHeroCardProps> = ({ currentPrompt, promptIndex, onClick }) => {
  return (
    <div className="relative group w-[300px] h-[200px] md:h-auto md:w-full md:max-w-3xl cursor-pointer mx-auto" onClick={onClick}>
      <motion.div
        className="relative w-full h-full rounded-3xl p-6 md:p-10 overflow-hidden flex flex-col justify-start transition-all duration-500 ease-out z-10 min-h-[200px] md:min-h-[220px]"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.25) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
        }}
        whileHover={{
          y: -4,
          boxShadow: '0 20px 40px 0 rgba(99, 102, 241, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Sand paper noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        
        {/* Inner glow gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-indigo-200/40 pointer-events-none"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        />

        <div className="relative z-20 w-full flex flex-col justify-start h-full">
          <p className="text-xs md:text-sm text-slate-400 font-light mb-4 uppercase tracking-wider shrink-0 static block">TRY THIS PROMPT</p>
          
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight flex flex-wrap gap-x-2 gap-y-2 items-center">
            <span>Create a</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`h1-${promptIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`inline-block ${currentPrompt.color1}`}
              >
                {currentPrompt.highlight1}
              </motion.span>
            </AnimatePresence>
            <span>for my</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={`h2-${promptIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`inline-block ${currentPrompt.color2}`}
              >
                {currentPrompt.highlight2}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      
      {/* Soft background glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-40 blur-2xl -z-10 rounded-3xl transition-all duration-500 group-hover:opacity-60" />
    </div>
  );
};
