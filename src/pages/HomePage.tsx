import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, Slack, Briefcase, Calendar, Mail, FileText, 
  ArrowRight, Command, Zap, Layers, Cpu, Shield, 
  Database, Activity, Rocket, Key
} from 'lucide-react';
import { AuraVoiceGate } from '../components/home/AuraVoiceGate';

export default function HomePage() {
  const navigate = useNavigate();
  const [showVoiceGate, setShowVoiceGate] = useState(false);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-0 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar />

      <main className="max-w-[1240px] mx-auto px-6 pt-32 pb-40 space-y-32">
        <HeroSection onActivateVoice={() => setShowVoiceGate(true)} />
        <IntegrationTicker />
        <WorkflowSteps />
      </main>

      {showVoiceGate && (
        <AuraVoiceGate 
          onClose={() => setShowVoiceGate(false)} 
          onComplete={(transcript) => {
            setShowVoiceGate(false);
            navigate('/generate', { state: { prefill: { full: transcript } } });
          }} 
        />
      )}

      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300">
      <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Command size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Ragnarok AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="font-semibold text-sm text-slate-300 hover:text-white transition-colors">About</a>
          <a href="#" className="font-semibold text-sm text-slate-300 hover:text-white transition-colors">Pricing</a>
          <a href="#" className="font-semibold text-sm text-slate-300 hover:text-white transition-colors">Blog</a>
        </div>
        <div>
          <a href="#" className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 font-semibold text-sm hover:bg-white/10 text-white transition-colors shadow-sm">
             Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ onActivateVoice }: { onActivateVoice: () => void }) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center mt-12 md:mt-24">
      <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8 shadow-2xl">
        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
        <span className="text-sm font-semibold tracking-wide text-indigo-200">Latest Release: Agent Core v3.1</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-8 max-w-4xl">
        Build AI Agents That Run <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Fully on Autopilot
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mb-12">
        A reliable agent infrastructure that handles research, analysis, communication, and task execution with zero supervision. Experience real AI ownership.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
        <a href="#" className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold shadow-lg shadow-white/10 hover:bg-slate-100 transition-all w-full sm:w-auto">
          Get Started
          <ArrowRight size={18} />
        </a>
        
        <button 
          onClick={onActivateVoice}
          className="group relative flex items-center justify-center gap-3 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-8 py-4 rounded-xl font-bold hover:bg-indigo-600/30 hover:text-indigo-100 transition-all shadow-[0_0_20px_rgba(79,70,229,0.15)] w-full sm:w-auto overflow-hidden outline-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-indigo-600/10 to-indigo-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Sparkles size={20} className="animate-pulse text-indigo-400 group-hover:text-indigo-300" />
          <span>Try Voice AI</span>
        </button>
      </div>
    </section>
  );
}

function IntegrationTicker() {
  const integrations = [
    { name: 'Slack', icon: Slack },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Calendar', icon: Calendar },
    { name: 'Mail', icon: Mail },
    { name: 'FileText', icon: FileText },
  ];

  return (
    <section className="w-full pt-12 relative z-10">
      <h3 className="text-center font-medium text-slate-500 mb-10 text-sm uppercase tracking-widest">
        Trusted & Deployed by 300+ Technical Teams Worldwide
      </h3>
      
      <div className="relative w-full overflow-hidden">
        {/* Gradients to fade out the edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex whitespace-nowrap animate-marquee gap-6 w-max opacity-80">
          {[...integrations, ...integrations, ...integrations, ...integrations].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-6 py-3 cursor-default hover:bg-white/10 hover:border-white/20 transition-colors">
                <Icon size={20} className="text-slate-300" strokeWidth={2} />
                <span className="font-semibold text-slate-200 tracking-wide">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkflowSteps() {
  const steps = [
    {
      title: "Smart Task Execution",
      desc: "Agents break tasks into clear steps, validate reasoning, and execute with predictable accuracy. Fast and reliable.",
      icon: Zap
    },
    {
      title: "Flexible Integrations",
      desc: "Connect your existing stack. Internal APIs, CRMs, and workspaces synced instantly via seamless data layers.",
      icon: Layers
    },
    {
      title: "Instant Workflow Generation",
      desc: "Describe what you want done. The agent plans, drafts, and delivers production-ready outcomes automatically.",
      icon: Cpu
    }
  ];

  return (
    <section>
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Architected for Scale
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          From abstract reasoning to deterministic output, our infrastructure powers agents that never miss a step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <s.icon size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 mb-4">{s.title}</h3>
            <p className="text-slate-400 leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 py-16 border-t border-white/10 mt-24 relative z-10">
       <div className="max-w-[1240px] mx-auto px-6">
         <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
               <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                 <Command size={14} className="text-white" />
               </div>
               <span className="text-slate-300">&copy; 2026 Ragnarok AI. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
         </div>
       </div>
    </footer>
  );
}
