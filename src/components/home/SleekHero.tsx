import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Layers, Layout, Zap, Rocket } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Research sources', color: 'bg-indigo-500' },
  { id: 2, label: 'Analyze findings', color: 'bg-purple-500' },
  { id: 3, label: 'Generate report', color: 'bg-blue-500' },
  { id: 4, label: 'Deliver output', color: 'bg-teal-500' }
];

export function SleekHeroMockup() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-24 border-t border-gray-100 mt-20 relative bg-[#F8FAFC]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 flex justify-center items-center opacity-30 pointer-events-none">
         <div className="w-[800px] h-[600px] bg-gradient-to-tr from-indigo-100 via-purple-50 to-white rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 border-b-slate-300 shadow-inner mb-8 transition-transform hover:scale-105 cursor-default">
            <span className="text-sm font-semibold text-slate-800">Latest Release: Agent Core v3.1</span>
            <div className="bg-slate-800 text-white rounded-full w-4 h-4 flex items-center justify-center">
              <ArrowRight size={10} />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 font-sans">
            Build AI Agents That <br/>
            <span className="text-indigo-600">Fully on Autopilot</span>
          </h2>
          
          <p className="text-lg text-slate-500 leading-relaxed max-w-lg mb-10">
            A reliable agent infrastructure that handles research, analysis, communication, and task execution with zero supervision.
          </p>
          
          <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-medium shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all select-none">
            Build Your Agent
            <div className="w-6 h-6 rounded bg-slate-700 flex justify-center items-center"><ArrowRight size={14}/></div>
          </button>
        </div>

        {/* Right Side UI Mockup (Ragnarok/Lindy style) */}
        <div className="relative h-[600px] w-full flex justify-center items-center">
           {/* Central Hub */}
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ type: 'spring', damping: 20 }}
             className="absolute z-20 w-32 h-32 bg-white rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] flex justify-center items-center"
           >
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex justify-center items-center shadow-inner shadow-indigo-400">
                 <Rocket className="text-white w-8 h-8"/>
              </div>
           </motion.div>

           {/* Workflow nodes */}
           {STEPS.map((step, idx) => {
             const angle = (idx * (360 / STEPS.length)) - 90;
             const radius = 180;
             const x = Math.cos(angle * (Math.PI / 180)) * radius;
             const y = Math.sin(angle * (Math.PI / 180)) * radius;

             return (
               <motion.div 
                 key={step.id}
                 initial={{ x: 0, y: 0, opacity: 0 }}
                 animate={{ x, y, opacity: 1 }}
                 transition={{ delay: 0.2 + (idx * 0.1), type: 'spring' }}
                 className="absolute z-10"
               >
                 {/* Connection line (CSS hack) */}
                 <svg className="absolute top-1/2 left-1/2 overflow-visible -z-10 opacity-20 pointer-events-none text-slate-400" width="0" height="0">
                   <line x1="0" y1="0" x2={-x} y2={-y} stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                 </svg>

                 <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-lg border border-slate-100 min-w-[200px]">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step.color} shadow-sm`}>
                     <Check size={16} />
                   </div>
                   <span className="font-semibold text-slate-700 text-sm">{step.label}</span>
                 </div>
               </motion.div>
             )
           })}

           {/* Floating Document mock */}
           <motion.div 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 160, x: 140, opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="absolute bg-white p-4 rounded-xl shadow-2xl border border-slate-100 z-30 w-48 rotate-6 hover:rotate-0 hover:scale-105 transition-transform cursor-default"
           >
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 bg-red-100 text-red-600 rounded flex justify-center items-center shadow-inner"><Layout size={16}/></div>
                 <span className="text-xs font-bold text-slate-800">PDF REPORT</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
                <div className="h-2 bg-slate-100 rounded-full w-4/6"></div>
              </div>
           </motion.div>
        </div>
      </div>
      
      {/* Logos Section */}
      <div className="mt-24 border-t border-slate-200/60 pt-12 text-center">
        <h3 className="text-slate-500 font-medium text-sm mb-8 uppercase tracking-widest">
          Trusted & Deployed by <span className="text-indigo-600 font-bold">300+</span> Technical Teams Worldwide
        </h3>
        {/* Placeholder for integration ticker which we are building separately */}
      </div>
    </div>
  );
}
