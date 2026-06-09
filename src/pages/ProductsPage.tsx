import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, FileText, FolderLock, Target, Mail, Layers, 
  ChevronRight, Brain, ShieldCheck, Zap, Activity, Rocket, 
  BarChart, ListTodo, Users, CheckCircle
} from 'lucide-react';
import SEOHead from '../components/Shared/SEOHead';
import { useAppStore } from '../store/appStore';
import { track } from '../lib/analytics';
import { useStartInvestorDocFlow } from '../hooks/useStartInvestorDocFlow';

export default function ProductsPage() {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const [scrolled, setScrolled] = useState(false);
  const { start } = useStartInvestorDocFlow();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartPitchDeck = () => {
    track('doc_created', { source: 'products_hero' });
    start('products');
  };

  const handleDemoLink = () => {
    track('shared_link_created', { source: 'products_demo' });
    navigate('/auth?mode=signup'); // Demo link implementation for later, for now we will just log the track
  };

  const handleProductsDocs = () => {
    track('doc_created', { source: 'products_docs' });
    start('products');
  };

  const handleDataRoomShare = () => {
    track('shared_link_created', { source: 'products_dataroom' });
    if (user) {
      navigate('/dashboard/data-room?mode=share');
    } else {
      navigate('/signup?redirect=/dashboard/data-room&mode=share');
    }
  };

  const handleInvestorMatch = () => {
    track('investor_touchpoint_created', { source: 'products_investor_match' });
    if (user) {
      navigate('/dashboard/investors');
    } else {
      navigate('/signup?redirect=/dashboard/investors');
    }
  };

  const handleOutreach = () => {
    if (user) {
      navigate('/dashboard/outreach');
    } else {
      navigate('/signup?redirect=/dashboard/outreach');
    }
  };

  const handleBrowseTemplates = () => {
    navigate('/templates/community');
  };

  const handleCreateDoc = () => {
    if (user) {
      navigate('/dashboard/documents');
    } else {
      navigate('/signup');
    }
  };

  // Mini Chart data
  const chartData = [10, 25, 45, 60, 85, 110, 145, 180];

  return (
    <div className="relative min-h-screen bg-obsidian text-cosmic-white overflow-x-hidden bg-grain">
      <SEOHead 
        title="IdealApp Products – Ship Investor-Ready Docs, Data Rooms, and Investor Pipelines." 
        description="IdealApp is the complete Founder OS offering an AI document partner, integrated data rooms, investor matching, and outreach tracking." 
        canonicalUrl="/products" 
      />

      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-space-indigo/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-electric-violet/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-100px] w-[500px] h-[500px] bg-plasma-green/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar (simplified version matching home) */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
              <span className="font-serif font-bold text-white leading-none">I</span>
            </div>
            <span className="font-sans font-semibold text-white text-xl tracking-tight">IdealApp</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
            <a href="/products" className="text-white transition-colors">Products</a>
            <a href="/templates" className="hover:text-white transition-colors">Templates</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/investors" className="hover:text-white transition-colors">Investors</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="text-sm font-medium bg-white text-obsidian px-4 py-2 rounded-full hover:scale-105 transition-transform">
                Go to Dashboard
              </button>
            ) : (
              <>
                <a href="/auth?mode=signin" className="hidden sm:inline-flex text-sm font-medium text-text-muted hover:text-white transition-colors">Log in</a>
                <a href="/signup" className="text-sm font-medium bg-white text-obsidian px-4 py-2 rounded-full hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Start free
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 3) Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-button px-4 py-1.5 rounded-full mb-8 text-sm font-medium"
          >
            <span className="text-electric-violet">✧</span>
            <span>Founder OS • IdealApp</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif leading-tight mb-6"
          >
            Ship investor-ready docs in minutes, not weeks.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-4 mb-6 text-sm"
          >
             <div className="flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5">
                <span className="text-white/50">Docs shipped/mo:</span>
                <span className="text-plasma-green font-medium flex items-center gap-1">7 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg></span>
             </div>
             <div className="flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5">
                <span className="text-white/50">Docs in data rooms:</span>
                <span className="text-investor-gold font-medium">4</span>
             </div>
             <div className="flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5 hidden sm:flex">
                <span className="text-white/50">Investor touchpoints:</span>
                <span className="text-trust-blue font-medium">12/wk</span>
             </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto lg:mx-0 mb-10 font-sans"
          >
            Create, share, and track investor-ready docs from a single workspace. IdealApp brings together document creation, data rooms, investor matching, and outreach into one OS.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={handleStartPitchDeck}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-obsidian font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm"
            >
              Ship my first doc <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleDemoLink}
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-button font-medium hover:bg-white/5 transition-colors flex items-center justify-center text-sm"
            >
              View a live investor link <span className="ml-2 px-1.5 py-0.5 bg-electric-violet/20 text-electric-violet text-[10px] uppercase font-bold rounded">Demo view</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Mockup Cards */}
        <div className="flex-1 w-full relative h-[400px] lg:h-[500px] perspective-1000 hidden md:block">
          {/* Card 1: Documents */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-20 w-[300px] h-[200px] glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl z-10 bg-obsidian/80 backdrop-blur-xl"
            style={{ transform: 'rotateY(-10deg) rotateX(5deg)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-electric-violet/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-electric-violet" />
              </div>
              <div>
                <div className="text-sm font-medium">Pitch Deck.ideal</div>
                <div className="text-xs text-text-muted">Edited just now</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-white/5 rounded-full" />
              <div className="h-2 w-3/4 bg-white/5 rounded-full" />
              <div className="h-2 w-5/6 bg-white/5 rounded-full" />
            </div>
          </motion.div>

          {/* Card 2: Data Room */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-10 w-[320px] h-[220px] glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl z-20 bg-[#151A26]/90 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-trust-blue" />
                <span className="text-sm font-medium">Series A Data Room</span>
              </div>
              <span className="text-xs text-plasma-green bg-plasma-green/10 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-xs text-text-muted mb-1">Financials</div>
                <div className="text-sm">4 files</div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-xs text-text-muted mb-1">Legal</div>
                <div className="text-sm">12 files</div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Investor Match */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[280px] right-32 w-[280px] h-[160px] glass-panel border border-white/10 rounded-2xl p-4 shadow-2xl z-30 bg-[#0A0D14]/90 backdrop-blur-xl"
            style={{ transform: 'rotateY(5deg) rotateX(-5deg)' }}
          >
             <div className="flex justify-between items-start mb-3">
               <div>
                  <div className="text-sm font-semibold">Sequoia Capital</div>
                  <div className="text-xs text-text-muted">Enterprise SaaS</div>
               </div>
               <div className="text-xs font-bold text-investor-gold bg-investor-gold/10 px-2 py-1 rounded-full border border-investor-gold/20">
                 98% Match
               </div>
             </div>
             <div className="flex gap-2 mt-4">
                <div className="flex-1 h-8 bg-space-indigo text-white text-xs font-medium rounded-lg flex items-center justify-center">Save</div>
                <div className="flex-1 h-8 bg-white/10 text-white text-xs font-medium rounded-lg flex items-center justify-center border border-white/10">Email</div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* 4) Product Strip - Five Pillars */}
      <section id="pillars" className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-4 snap-x">
            {[
              { id: 'documents', icon: FileText, title: 'Documents Workspace', desc: 'From rough notes to investor-ready in under a day.', color: 'text-electric-violet', bg: 'bg-electric-violet/10' },
              { id: 'data-room', icon: FolderLock, title: 'Data Room', desc: 'Ship a structured room before your next call.', color: 'text-trust-blue', bg: 'bg-trust-blue/10' },
              { id: 'investor-match', icon: Target, title: 'Investor Match', desc: 'Skip the scraping, match by thesis instantly.', color: 'text-investor-gold', bg: 'bg-investor-gold/10' },
              { id: 'outreach', icon: Mail, title: 'Outreach Tracker', desc: 'The weekly cadence built for fundraising.', color: 'text-plasma-green', bg: 'bg-plasma-green/10' },
              { id: 'templates', icon: Layers, title: 'Template Library', desc: '0-to-1 without staring at a blank page.', color: 'text-space-indigo', bg: 'bg-space-indigo/10' }
            ].map((p) => (
              <div key={p.id} className="min-w-[320px] p-6 glass-card rounded-2xl border border-white/5 hover:border-white/20 transition-all snap-start group flex flex-col">
                <div className={`w-10 h-10 ${p.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <p.icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-1">{p.title}</h3>
                <p className="text-sm text-text-muted mb-4 flex-1">{p.desc}</p>
                <div className="mt-auto">
                   <a href={`#${p.id}`} className="text-xs font-medium text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
                     Explore <ChevronRight className="w-3 h-3" />
                   </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5) Growth-style "Case Study" Strip */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Built for compounding investor workflows.</h2>
          <p className="text-text-muted text-lg max-w-2xl font-sans">
            IdealApp is designed to create repeatable doc → data room → investor pipelines, not one-off projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
               <div className="text-sm font-medium text-text-muted mb-2">Time to first investor-ready doc</div>
               <div className="text-4xl font-serif text-white mb-4">3 days <span className="text-text-muted transition-colors hover:text-white">→</span> 30 mins</div>
               <div className="text-[10px] text-white/30 absolute bottom-4 right-6">Based on IdealApp usage patterns; illustrative only</div>
            </div>
            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
               <div className="text-sm font-medium text-text-muted mb-2">Docs per founder per month</div>
               <div className="text-4xl font-serif text-plasma-green mb-4">+3x</div>
               <div className="text-[10px] text-white/30 absolute bottom-4 right-6">Vs. manual workflows</div>
            </div>
            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
               <div className="text-sm font-medium text-text-muted mb-2">Investor touchpoints per week</div>
               <div className="text-4xl font-serif text-investor-gold mb-4">+40%</div>
               <div className="text-[10px] text-white/30 absolute bottom-4 right-6">Based on IdealApp usage patterns; illustrative only</div>
            </div>
            <div className="glass-panel p-6 rounded-3xl border border-space-indigo/20 flex flex-col justify-between relative overflow-hidden bg-space-indigo/5">
                <div className="text-sm font-medium text-white mb-4">Investor touchpoints</div>
                <div className="flex items-end gap-1 h-16 w-full mt-auto">
                  {chartData.map((val, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(val / 180) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex-1 bg-space-indigo/60 rounded-t-sm"
                    />
                  ))}
                </div>
                <div className="flex justify-between w-full mt-2 text-[10px] text-text-muted">
                   <span>W1</span><span>W8</span>
                </div>
            </div>
          </div>

          <div className="space-y-8">
             <div className="border-l-2 border-electric-violet/30 pl-5">
               <h4 className="text-white font-semibold mb-1">From chaos to cadence</h4>
               <p className="text-sm text-text-muted">Turn one-off fundraising sprints into a repeatable weekly cadence of updates and targeted investor touches.</p>
             </div>
             <div className="border-l-2 border-trust-blue/30 pl-5">
               <h4 className="text-white font-semibold mb-1">Docs that stay in sync</h4>
               <p className="text-sm text-text-muted">Your business plan, data room, and outreach CRM finally share the exact same source of truth.</p>
             </div>
             <div className="border-l-2 border-plasma-green/30 pl-5">
               <h4 className="text-white font-semibold mb-1">Repeatable pipelines</h4>
               <p className="text-sm text-text-muted">Maintain momentum round over round. Reuse proven templates and established pipelines for future raises.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 6) Detailed Product Sections */}
      <div className="space-y-32 py-20 bg-white/[0.005]">
        
        {/* 6.1 Documents */}
        <section id="documents" className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl border border-white/10 mb-2">
                <FileText className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Documents built for investor scrutiny.</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-electric-violet shrink-0 mt-0.5" />
                  <span className="text-text-muted">Draft pitch decks, info memos, and financial summaries using AI that's tuned by sector and stage.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-electric-violet shrink-0 mt-0.5" />
                  <span className="text-text-muted">Regenerate sections with chips like "Add cohort retention metrics" or "Tighten market narrative" instead of rewriting from scratch.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-electric-violet shrink-0 mt-0.5" />
                  <span className="text-text-muted">Export seamlessly into investor view and data room.</span>
                </li>
              </ul>
              <div className="pt-4">
                <button onClick={handleProductsDocs} className="px-6 py-3 rounded-full bg-electric-violet/10 text-electric-violet font-semibold hover:bg-electric-violet hover:text-white border border-electric-violet/20 transition-colors flex items-center gap-2 text-sm">
                  Draft my first doc <ArrowRight className="w-4 h-4" />
                </button>
              </div>
           </div>
           <div className="flex-1 w-full relative">
              <div className="glass-panel border border-white/10 p-6 rounded-3xl bg-[#0A0D14] flex gap-4 h-[350px]">
                 <div className="w-1/3 border-r border-white/5 pr-4 flex flex-col gap-3">
                    <div className="h-6 w-20 bg-white/10 rounded-md mb-2"></div>
                    <div className="h-8 w-full bg-white/5 rounded-lg border border-white/10 px-3 flex items-center text-xs text-white/70">Problem</div>
                    <div className="h-8 w-full bg-electric-violet/10 rounded-lg border border-electric-violet/20 px-3 flex items-center text-xs text-electric-violet">Solution</div>
                    <div className="h-8 w-full bg-white/5 rounded-lg border border-white/10 px-3 flex items-center text-xs text-white/70">Market</div>
                 </div>
                 <div className="w-2/3 flex flex-col relative">
                    <div className="text-lg font-medium text-white mb-4">The Solution</div>
                    <motion.div 
                      initial={{ opacity: 0.5 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="text-sm text-text-muted mb-4 space-y-2"
                    >
                      <div className="h-3 w-full bg-white/10 rounded-sm" />
                      <div className="h-3 w-5/6 bg-white/10 rounded-sm" />
                      <div className="h-3 w-4/6 bg-white/10 rounded-sm" />
                    </motion.div>

                    <div className="absolute bottom-0 right-0 left-0 bg-[#151A26] rounded-xl border border-white/10 p-3 ring-1 ring-white/5 shadow-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-electric-violet" />
                        <span className="text-xs font-medium text-white">AI Document Partner</span>
                      </div>
                      <div className="flex gap-2">
                        <motion.button 
                          className="px-3 py-1.5 bg-electric-violet text-white text-[10px] font-medium rounded-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✧ Tighten Narrative
                        </motion.button>
                        <button className="px-3 py-1.5 bg-white/5 text-slate-300 text-[10px] font-medium rounded-lg border border-white/5">Make concise</button>
                      </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6.2 Data Room */}
        <section id="data-room" className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl border border-white/10 mb-2">
                <FolderLock className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Data rooms that investors actually use.</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-trust-blue shrink-0 mt-0.5" />
                  <span className="text-text-muted">Opinionated structure (Legal, Financials, IP, HR & Team, Core Metrics).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-trust-blue shrink-0 mt-0.5" />
                  <span className="text-text-muted">Viewer activity (total files, active viewers, views per doc).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-trust-blue shrink-0 mt-0.5" />
                  <span className="text-text-muted">AI summaries of complex assets (e.g., terms, covenants, projections).</span>
                </li>
              </ul>
              <div className="pt-4">
                <button onClick={handleDataRoomShare} className="px-6 py-3 rounded-full bg-trust-blue/10 text-trust-blue font-semibold hover:bg-trust-blue hover:text-white border border-trust-blue/20 transition-colors flex items-center gap-2 text-sm">
                  Create an investor view <ArrowRight className="w-4 h-4" />
                </button>
              </div>
           </div>
           <div className="flex-1 w-full relative">
              <div className="glass-panel border border-white/10 p-6 rounded-3xl bg-[#0A0D14] flex flex-col h-[350px]">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                    <div>
                       <div className="text-lg font-medium text-white mb-1">Q3 Fundraise Data Room</div>
                       <div className="flex gap-4 text-xs text-text-muted">
                          <span>Total Files: 24</span>
                          <span>Active Viewers: 3</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4 flex-1">
                    <div className="w-1/3 flex flex-col gap-2">
                       <div className="text-xs text-white/50 mb-1">Directory</div>
                       <div className="px-3 py-2 bg-white/5 text-xs text-white rounded-lg border border-white/5">📁 Financials</div>
                       <div className="px-3 py-2 bg-transparent text-xs text-white/60">📁 Legal</div>
                       <div className="px-3 py-2 bg-transparent text-xs text-white/60">📁 HR & Team</div>
                    </div>
                    <div className="w-2/3 flex flex-col gap-3">
                       <div className="p-3 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group">
                          <div className="flex items-center gap-2 mb-2">
                             <BarChart className="w-4 h-4 text-slate-400" />
                             <span className="text-sm font-medium text-white">Q1-Q2_Financials.pdf</span>
                          </div>
                          <div className="text-[10px] text-text-muted">Added 2 days ago • 1.2MB</div>
                       </div>
                       <div className="p-3 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-white">Cap_Table_Current.xlsx</span>
                             </div>
                             <motion.div 
                               animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                               transition={{ repeat: Infinity, duration: 2 }}
                               className="text-[9px] font-bold bg-trust-blue/20 text-trust-blue px-1.5 py-0.5 rounded border border-trust-blue/30"
                             >
                               AI Summary
                             </motion.div>
                          </div>
                          <div className="text-[10px] text-text-muted">Added today • 540KB</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6.3 Investor Match */}
        <section id="investor-match" className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl border border-white/10 mb-2">
                <Target className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Investor Match, tuned to your company DNA.</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-investor-gold shrink-0 mt-0.5" />
                  <span className="text-text-muted">Match by thesis, stage, geography, and traction profile.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-investor-gold shrink-0 mt-0.5" />
                  <span className="text-text-muted">Explain "why it's a match" (B2B devtools thesis, recent similar investments).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-investor-gold shrink-0 mt-0.5" />
                  <span className="text-text-muted">One-click handoff to Outreach Tracker.</span>
                </li>
              </ul>
              <div className="pt-4">
                <button onClick={handleInvestorMatch} className="px-6 py-3 rounded-full bg-investor-gold/10 text-investor-gold font-semibold hover:bg-investor-gold hover:text-white border border-investor-gold/20 transition-colors flex items-center gap-2 text-sm">
                  See my top matches <ArrowRight className="w-4 h-4" />
                </button>
              </div>
           </div>
           <div className="flex-1 w-full relative h-[400px]">
              <div className="absolute top-0 right-10 z-10 flex items-center gap-2 bg-[#151A26] border border-white/10 px-4 py-2 rounded-full shadow-xl">
                 <Zap className="w-4 h-4 text-investor-gold" />
                 <span className="text-xs font-semibold text-white">DNA Sync Active</span>
              </div>
              <div className="relative mt-12 pl-10">
                 {/* Background card */}
                 <div className="absolute top-6 left-16 right-0 h-48 bg-[#0F141E] border border-white/5 rounded-3xl scale-95 opacity-50 z-0"></div>
                 {/* Foreground card */}
                 <motion.div 
                   initial={{ y: 50, opacity: 0 }}
                   whileInView={{ y: 0, opacity: 1 }}
                   viewport={{ once: true }}
                   className="relative bg-[#151A26] border border-white/10 p-6 rounded-3xl shadow-2xl z-10"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="text-lg font-semibold text-white">Horizon Ventures</div>
                          <div className="text-sm text-text-muted">Seed / Series A • New York</div>
                       </div>
                       <div className="text-xs font-bold text-investor-gold bg-investor-gold/10 px-3 py-1.5 rounded-full border border-investor-gold/20">
                          98% Match
                       </div>
                    </div>
                    <div className="space-y-3 mb-6">
                       <div className="text-xs font-medium text-slate-300">Why it's a match:</div>
                       <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-investor-gold mt-1.5 shrink-0" />
                          <p className="text-xs text-text-muted hover:text-white transition-colors">Has invested in 3 B2B SaaS startups in your exact sector.</p>
                       </div>
                       <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-investor-gold mt-1.5 shrink-0" />
                          <p className="text-xs text-text-muted hover:text-white transition-colors">Partner 'Sarah J.' actively writes about your market.</p>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <button className="flex-1 py-2 bg-white text-obsidian text-sm font-semibold rounded-xl">Save to Tracker</button>
                       <button className="flex-1 py-2 bg-white/5 text-white text-sm font-semibold rounded-xl border border-white/10 hover:bg-white/10">Draft Email</button>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* 6.4 Outreach Tracker */}
        <section id="outreach" className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl border border-white/10 mb-2">
                <Mail className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white">Outreach that runs like a real pipeline.</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-plasma-green shrink-0 mt-0.5" />
                  <span className="text-text-muted">Columns for To Contact, Contacted, Meeting, Evaluating, Term Sheet.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-plasma-green shrink-0 mt-0.5" />
                  <span className="text-text-muted">Next actions and dates on each investor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-plasma-green shrink-0 mt-0.5" />
                  <span className="text-text-muted">Weekly investor update cadence built in.</span>
                </li>
              </ul>
              <div className="pt-4">
                <button onClick={handleOutreach} className="px-6 py-3 rounded-full bg-plasma-green/10 text-plasma-green font-semibold hover:bg-plasma-green hover:text-white border border-plasma-green/20 transition-colors flex items-center gap-2 text-sm">
                  Create my investor pipeline <ArrowRight className="w-4 h-4" />
                </button>
              </div>
           </div>
           <div className="flex-1 w-full overflow-hidden rounded-3xl p-6 bg-[#0A0D14] border border-white/10 shadow-2xl pb-10">
              <div className="flex gap-6 w-[150%] md:w-full">
                 <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-400 mb-3 px-1 uppercase tracking-wider">To Contact</div>
                    <div className="space-y-3">
                       <div className="glass-panel border-white/10 p-4 rounded-2xl bg-white/[0.02]">
                          <div className="text-sm font-semibold text-white">Apex Capital</div>
                          <div className="text-xs text-text-muted mb-3">Partner: Mark V.</div>
                          <div className="text-[10px] font-medium text-slate-300 bg-white/5 px-2 py-1 rounded w-fit border border-white/5">Action: Draft intro</div>
                       </div>
                    </div>
                 </div>
                 <div className="flex-1">
                    <div className="text-xs font-semibold text-plasma-green mb-3 px-1 uppercase tracking-wider">Meeting</div>
                    <div className="space-y-3 relative">
                       <motion.div 
                         initial={{ y: 20, opacity: 0 }}
                         whileInView={{ y: 0, opacity: 1 }}
                         transition={{ delay: 0.2 }}
                         className="glass-panel border-plasma-green/30 p-4 rounded-2xl bg-plasma-green/5 relative z-10"
                       >
                          <div className="text-sm font-semibold text-white">Horizon Ventures</div>
                          <div className="text-xs text-text-muted mb-3">Partner: Sarah J.</div>
                          <div className="text-[10px] font-medium text-plasma-green bg-plasma-green/10 px-2 py-1 rounded w-fit border border-plasma-green/20">Action: Send deck</div>
                       </motion.div>
                    </div>
                 </div>
                 <div className="flex-1 opacity-50 hidden md:block">
                    <div className="text-xs font-semibold text-slate-400 mb-3 px-1 uppercase tracking-wider">Evaluating</div>
                    <div className="glass-panel border-white/5 p-4 rounded-2xl bg-white/[0.02] border-dashed">
                      <div className="h-4 w-1/2 bg-white/5 rounded mb-2"></div>
                      <div className="h-3 w-1/3 bg-white/5 rounded"></div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6.5 Templates */}
        <section id="templates" className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
           <div className="flex-1 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-xl border border-white/10 mb-2">
                <Layers className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-white">50+ investor-grade templates, plus your own.</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-space-indigo shrink-0 mt-0.5" />
                  <span className="text-text-muted">Templates across Pitch Decks, Financial Models, Legal Docs, Founder Memos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-space-indigo shrink-0 mt-0.5" />
                  <span className="text-text-muted">Filter by sector and stage.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-space-indigo shrink-0 mt-0.5" />
                  <span className="text-text-muted">Save anonymised docs as community templates (for Pro users).</span>
                </li>
              </ul>
              <div className="pt-4">
                <button onClick={handleBrowseTemplates} className="px-6 py-3 rounded-full bg-space-indigo/10 text-space-indigo font-semibold hover:bg-space-indigo hover:text-white border border-space-indigo/20 transition-colors flex items-center gap-2 text-sm">
                  Browse community templates <ArrowRight className="w-4 h-4" />
                </button>
              </div>
           </div>
           <div className="flex-1 w-full grid grid-cols-2 gap-4">
              {[
                { label: 'B2B SaaS Deck', badge: 'Founder Favorite', color: 'bg-investor-gold/10 text-investor-gold border-investor-gold/20' },
                { label: 'Pre-seed Memo', badge: '', color: '' },
                { label: 'Financials Base', badge: '', color: '' },
                { label: 'Cap Table (Safe)', badge: 'Trending', color: 'bg-electric-violet/10 text-electric-violet border-electric-violet/20' },
              ].map((t, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col h-full bg-[#151A26] relative overflow-hidden"
                >
                   {t.badge && (
                      <span className={`absolute top-0 right-0 text-[9px] font-bold px-2 py-1 rounded-bl-lg border-b border-l ${t.color}`}>
                        {t.badge}
                      </span>
                   )}
                   <FileText className="w-5 h-5 text-slate-400 mb-3" />
                   <h4 className="text-sm font-semibold text-white mb-1">{t.label}</h4>
                   <p className="text-[10px] text-text-muted mb-4 flex-1">Standard structural template.</p>
                   <button className="text-[10px] font-semibold text-space-indigo hover:text-white transition-colors text-left">
                     Use Template →
                   </button>
                </motion.div>
              ))}
           </div>
        </section>

      </div>

      {/* 7) Dynamic "Growth Narratives" Band */}
      <section className="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
           <div className="mb-12">
             <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">How founders use IdealApp</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
              
              <div className="glass-card p-8 rounded-3xl border border-white/5 group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden bg-gradient-to-b from-[#151A26] to-[#0A0D14]">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Activity className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-white tracking-wide">Fintech SaaS</span>
                 </div>
                 <p className="text-sm text-text-muted mb-4 leading-relaxed font-sans">
                   Going from scattered Google Docs and spreadsheets to a single seamless doc → data room → weekly investor update loop.
                 </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/5 group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden bg-gradient-to-b from-[#151A26] to-[#0A0D14]">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-plasma-green/10 flex items-center justify-center border border-plasma-green/20">
                      <Zap className="w-4 h-4 text-plasma-green" />
                    </div>
                    <span className="text-sm font-semibold text-white tracking-wide">DevTools</span>
                 </div>
                 <p className="text-sm text-text-muted mb-4 leading-relaxed font-sans">
                   Rapid iteration on technical decks with an AI document partner and consistent investor feedback synced instantly.
                 </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/5 group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden bg-gradient-to-b from-[#151A26] to-[#0A0D14]">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-electric-violet/10 flex items-center justify-center border border-electric-violet/20">
                      <Rocket className="w-4 h-4 text-electric-violet" />
                    </div>
                    <span className="text-sm font-semibold text-white tracking-wide">Consumer</span>
                 </div>
                 <p className="text-sm text-text-muted mb-4 leading-relaxed font-sans">
                   Using integrated data rooms to securely share live cohort metrics and retention charts with targeted consumer funds.
                 </p>
              </div>

           </div>
        </div>
      </section>

      {/* 8) Final CTA Bar */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-space-indigo/5 blur-[100px] rounded-full pointer-events-none" />
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 relative z-10">
          Ready to bring your next round into IdealApp?
        </h2>
        <p className="text-text-muted text-lg mb-10 relative z-10 font-sans">
          Start with one doc or a data room and build a repeatable pipeline.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
           <button 
             onClick={handleStartPitchDeck}
             className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-obsidian font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm"
           >
             Ship my first investor-ready doc <ArrowRight className="w-4 h-4" />
           </button>
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors flex items-center justify-center text-sm"
           >
             Explore all products →
           </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 text-center text-sm text-text-muted bg-[#0A0D14]">
        <p>© 2026 IdealApp Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
