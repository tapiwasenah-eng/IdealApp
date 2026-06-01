import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import {
  Send, Lightbulb, LayoutDashboard, TrendingUp,
  Users, BarChart2, Move, Image as ImageIcon, FileText,
  Heart, Loader2, Star, ChevronRight, Plus, Globe, Sparkles, ChevronDown
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, softwareApplicationSchema, websiteSchema } from '../data/seo-schemas';
import { useStore } from '../store';
import { generateFromPrompt, documentService } from '../services/documentService';
import Button from '../components/ui/Button';
import AuthModal from '../components/auth/AuthModal';
import { BRAND_ASSETS } from '../lib/brandAssets';
import { aiService } from '../services/aiService';
import { exportService } from '../services/exportService';
import { nanoid } from 'nanoid';

import { useChatStore } from '../store/chatStore';
import { GlassHeroCard } from '../components/ui/GlassHeroCard';

// ─── Sub-components ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// ── Section 1: Hero ────────────────────────────────────────────────────────
const PROMPTS = [
  {
    text: "Create a ",
    highlight1: "financial model",
    color1: "text-violet-500",
    mid: " for my ",
    highlight2: "fintech company",
    color2: "text-[#14B8A6]",
    full: "Create a financial model for my fintech company"
  },
  {
    text: "Create a ",
    highlight1: "marketing strategy",
    color1: "text-[#F59E0B]",
    mid: " for my ",
    highlight2: "healthcare business",
    color2: "text-[#EF4444]",
    full: "Create a marketing strategy for my healthcare business"
  },
  {
    text: "Create a ",
    highlight1: "one pager",
    color1: "text-[#10B981]",
    mid: " for my ",
    highlight2: "AI startup",
    color2: "text-violet-500",
    full: "Create a one pager for my AI startup"
  },
  {
    text: "Create a ",
    highlight1: "information memorandum",
    color1: "text-[#8B5CF6]",
    mid: " for my ",
    highlight2: "marketplace",
    color2: "text-[#EC4899]",
    full: "Create a information memorandum for my marketplace"
  },
  {
    text: "Create a ",
    highlight1: "data room",
    color1: "text-[#EF4444]",
    mid: " for my ",
    highlight2: "B2B company",
    color2: "text-[#F59E0B]",
    full: "Create a data room for my B2B company"
  },
  {
    text: "Create a ",
    highlight1: "pitch deck",
    color1: "text-[#14B8A6]",
    mid: " for my ",
    highlight2: "SaaS startup",
    color2: "text-[#10B981]",
    full: "Create a pitch deck for my SaaS startup"
  }
];

function HeroSection({ 
  onPromptSubmit, 
  heroPrompt,
  onEdit,
  onDownload
}: { 
  onPromptSubmit: (p: any) => void, 
  heroPrompt: string,
  onEdit: (doc: any) => void,
  onDownload: (doc: any) => void
}) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Ideal');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Particle animation setup
  useEffect(() => {
    // Load CSS Houdini Paint Worklet for particles
    if ('paintWorklet' in CSS && (CSS as any).paintWorklet) {
      (CSS as any).paintWorklet.addModule(
        'https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js'
      ).catch(() => {
        console.log('Paint Worklet not supported, using fallback');
      });
    }

    const particlesBg = document.querySelector('.particles-background') as HTMLElement;
    if (!particlesBg) return;

    let animationFrame: number;
    let tick = 0;
    const animate = () => {
      tick += 0.016; // ~60fps
      particlesBg.style.setProperty('--animation-tick', String(tick % 1));
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      particlesBg.style.setProperty('--ring-x', String(x));
      particlesBg.style.setProperty('--ring-y', String(y));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const currentPrompt = PROMPTS[promptIndex];

  return (
    <div className="relative">
      {/* PARTICLES BACKGROUND - Fixed layer behind everything */}
      <div 
        className="particles-background" 
        aria-hidden="true"
        style={{ 
          clipPath: 'inset(0 0 0 0)',
          height: '110vh' // Only first viewport
        }}
      />
      
      <section 
        className="w-full relative z-10 overflow-x-hidden max-w-7xl mx-auto px-6 pt-16 pb-40 md:pt-32 md:pb-20 min-h-[105vh] md:min-h-[110vh] flex flex-col items-center justify-center hero-section transition-colors duration-500"
      >
      {/* Main Title and Hero Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="text-center mb-8 md:mb-12 w-full max-w-3xl mx-auto flex flex-col items-center mt-10 md:mt-0"
      >
        <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1 md:px-3.5 md:py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-sm mb-6 md:mb-8">
          <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-500" />
          <span className="text-xs md:text-sm font-medium text-slate-700">The AI-powered document builder</span>
        </div>
        <h1 className="leading-[1.1] font-extrabold tracking-[-0.04em] text-gray-900 mb-6 font-sans" style={{ fontSize: 'clamp(38px, 6vw, 64px)' }}>
          Your IdealApp to Build Anything
        </h1>
        <p className="text-[15px] sm:text-[17px] text-gray-500 max-w-2xl mx-auto leading-[1.7] opacity-75">
          Create, refine, and perfect professional documents with AI.
        </p>
        <div className="mt-8 text-sm text-gray-500 font-medium">
          Free to start · No credit card required · 180+ templates
        </div>
      </motion.div>

      {/* AI Demo Area - Now centered and main focus */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
        className="space-y-6 md:space-y-8 w-full max-w-4xl"
      >
        {/* Shimmering Card */}
        <div className="relative group w-full flex justify-center">
          <GlassHeroCard 
            currentPrompt={currentPrompt} 
            promptIndex={promptIndex} 
            onClick={() => onPromptSubmit(currentPrompt)} 
          />
        </div>

        {/* Chat Input Bar */}
        <div id="ai-prompt-bar" className="w-full flex justify-center px-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const val = (document.querySelector('#hero-chat-input') as HTMLInputElement)?.value;
              if (val?.trim()) {
                onPromptSubmit(val.trim());
              } else {
                onPromptSubmit('');
              }
            }}
            className="w-full max-w-[700px] flex flex-col md:flex-row bg-white rounded-3xl md:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-2 md:items-center relative"
          >

            
            {/* Main text input - Top on mobile, Middle on desktop */}
            <input 
              id="hero-chat-input"
              type="text" 
              placeholder="What kind of document do you want to create? e.g. 'A pitch deck for a B2B startup...'" 
              className="order-1 md:order-1 flex-1 min-w-0 bg-transparent px-4 pt-4 pb-2 md:py-3 outline-none text-slate-700 placeholder-slate-400 text-sm md:text-base resize-none"
            />

            {/* Bottom Actions Row (Mobile) / Left Actions (Desktop) */}
            <div className="order-2 md:order-2 flex items-center justify-between w-full md:w-auto p-2 md:p-0 pr-1 md:pr-3 shrink-0">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="w-10 h-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                  {showAttachMenu && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
                      <button 
                        type="button"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FileText size={16} /> Upload file/s
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" multiple />
                    </div>
                  )}
                </div>
                
              </div>

              {/* Mobile-only right actions */}
              <div className="flex items-center space-x-1 md:hidden">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowModelMenu(!showModelMenu)}
                    className="px-3 py-1.5 h-10 shrink-0 rounded-full border border-slate-200 bg-white shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                  >
                    <Sparkles size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">{selectedModel}</span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>
                  {showModelMenu && (
                    <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
                      {['Ideal', 'Claude 3.5 API', 'Gemini 1.5 Pro', 'GPT-4o'].map(m => (
                        <button 
                          type="button"
                          key={m}
                          onClick={() => { setSelectedModel(m); setShowModelMenu(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                        >
                          <span>{m}</span>
                          {m === 'Ideal' && <span className="font-light text-slate-400 text-[11px]">(selects best)</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  title="Web Search"
                  className={`shrink-0 transition-colors p-2 rounded-full ${webSearchEnabled ? 'bg-blue-50 text-blue-500' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                >
                  <Globe size={20} />
                </button>

                <button 
                  type="submit"
                  className="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Desktop-only right actions */}
            <div className="hidden md:flex order-3 flex-row justify-end items-center px-1 space-x-1 pl-2">
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowModelMenu(!showModelMenu)}
                  className="px-3 py-1.5 h-10 shrink-0 rounded-full border border-slate-200 bg-white shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <Sparkles size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">{selectedModel}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                {showModelMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1">
                    {['Ideal', 'Claude 3.5 API', 'Gemini 1.5 Pro', 'GPT-4o'].map(m => (
                      <button 
                        type="button"
                        key={m}
                        onClick={() => { setSelectedModel(m); setShowModelMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>{m}</span>
                        {m === 'Ideal' && <span className="font-light text-slate-400 text-[11px]">(selects best)</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="button"
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                title="Web Search"
                className={`mx-1 shrink-0 transition-colors p-2 rounded-full ${webSearchEnabled ? 'bg-blue-50 text-blue-500' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Globe size={20} />
              </button>

              <button 
                type="submit"
                className="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            
          </form>
        </div>
      </motion.div>
    </section>
    </div>
  );
}

// ── Section 1.5: Video Steps ──────────────────────────────────────────────
function VideoStepsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const STEPS = [
    {
      start: 0,
      end: 2.33,
      title: 'Describe',
      desc: 'Describe your document needs.',
    },
    {
      start: 2.33,
      end: 4.28,
      title: 'Generate',
      desc: 'Watch the AI generate your draft.',
    },
    {
      start: 4.28,
      end: 7.66,
      title: 'Refine',
      desc: 'Refine and perfect in the editor.',
    },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      
      if (currentTime >= 7.66) {
        video.currentTime = 0;
        // Optionally play if paused 
        video.play().catch(() => {});
        setActiveStep(0);
        return;
      }
      
      // Find the current step based on video time
      const stepIndex = STEPS.findIndex(step => currentTime >= step.start && currentTime < step.end);
      
      if (stepIndex !== -1) {
        setActiveStep(stepIndex);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const handleStepClick = (index: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = STEPS[index].start;
      videoRef.current.play();
      setActiveStep(index);
    }
  };

  return (
    <section ref={containerRef} className="py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Video Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden mx-auto border border-gray-100 bg-gray-50 shadow-2xl shadow-violet-500/5">
              <video
                ref={videoRef}
                src={BRAND_ASSETS.video.hero}
                autoPlay
                muted
                loop
                playsInline
                className="relative w-full aspect-video object-cover"
              />
            </div>
          </motion.div>

          {/* Steps Column */}
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                onClick={() => handleStepClick(i)}
                className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer group ${
                  activeStep === i 
                    ? 'bg-indigo-50/50 border border-indigo-100 border-l-[3px] border-l-indigo-600 shadow-sm shadow-indigo-100 scale-[1.02]' 
                    : 'bg-transparent border border-transparent opacity-40 hover:opacity-80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-all duration-500 ${
                    activeStep === i ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xl font-black transition-colors ${
                      activeStep === i ? 'text-indigo-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`mt-2 leading-relaxed transition-colors ${
                      activeStep === i ? 'text-violet-700' : 'text-gray-400'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 2: AI Prompt Bar ───────────────────────────────────────────────
function AIPromptBar({ 
  initialValue = '', 
  isCompact = false,
  onResponse
}: { 
  initialValue?: string, 
  isCompact?: boolean,
  onResponse?: (msg: string) => void
}) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile, guestUsageCount, incrementGuestUsageCount, setShowAuthModal } = useStore();

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const checkUsage = () => {
    if (!user) {
      if (guestUsageCount >= 3) {
        setShowAuthModal(true);
        return false;
      }
      incrementGuestUsageCount();
      return true;
    }
    
    if (userProfile?.subscription === 'free') {
      if (userProfile.usageCount >= 10) {
        // Show upgrade modal or similar
        return false;
      }
      return true;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;
    
    if (!checkUsage()) return;

    if (onResponse) {
      onResponse(value.trim());
      setValue('');
      return;
    }

    setLoading(true);
    try {
      const doc = await generateFromPrompt(value.trim());
      toast.success('Document generated successfully!', { id: 'gen1' });
      navigate(`/documents/${doc.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to generate document. Please try again.', { id: 'gen1' });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className={`${isCompact ? 'w-full' : 'max-w-7xl mx-auto px-6 mt-8 mb-6'}`}>
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl shadow-violet-500/10 px-4 py-3 md:px-6 md:py-4 flex items-center gap-4 focus-within:border-violet-400 transition-colors">
          <div className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0 relative overflow-hidden rounded-xl">
            <img
              src={BRAND_ASSETS.icons.aiIcon}
              alt="AI"
              className="absolute inset-0 w-full h-full object-contain p-2"
            />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe the document you need..."
            className="flex-1 outline-none text-[#111827] placeholder-[#9CA3AF] text-sm md:text-base bg-transparent"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-violet-600 text-white rounded-xl w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-70 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Section 3: Popular Templates ──────────────────────────────────────────
type BadgeVariant = 'Popular' | 'New' | 'Pro';

function Badge({ variant }: { variant: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    Popular: 'bg-green-100 text-[#10B981]',
    New: 'bg-green-100 text-[#10B981]',
    Pro: 'bg-purple-100 text-[#8B5CF6]',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[variant]}`}>
      {variant}
    </span>
  );
}

const TEMPLATES = [
  {
    initial: 'S',
    bg: 'bg-blue-500',
    title: 'SaaS Pitch Deck',
    desc: 'Professional investor presentation template',
    count: '15 slides',
    badge: 'Popular' as BadgeVariant,
  },
  {
    initial: 'E',
    bg: 'bg-green-500',
    title: 'E-commerce Business Plan',
    desc: 'Comprehensive business strategy document',
    count: '25 pages',
    badge: 'New' as BadgeVariant,
  },
  {
    initial: 'S',
    bg: 'bg-green-400',
    title: 'Startup Financial Model',
    desc: '3-year financial projections and analysis',
    count: '12 sheets',
    badge: 'Pro' as BadgeVariant,
  },
  {
    initial: 'M',
    bg: 'bg-pink-500',
    title: 'Marketing Strategy',
    desc: 'Complete marketing plan and roadmap',
    count: '18 pages',
    badge: 'Popular' as BadgeVariant,
  },
  {
    initial: 'T',
    bg: 'bg-teal-500',
    title: 'Tech One Pager',
    desc: 'Concise business overview document',
    count: '1 page',
    badge: 'New' as BadgeVariant,
  },
  {
    initial: 'I',
    bg: 'bg-yellow-400',
    title: 'Investment Memo',
    desc: 'Strategic investment analysis template',
    count: '8 sections',
    badge: 'Pro' as BadgeVariant,
  },
];

function PopularTemplates() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Founder tagline + demo CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <p className="text-lg text-[#6B7280] mb-6">Ideal App for Founders by Founders</p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-violet-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:bg-violet-700 shadow-lg shadow-violet-500/25 transition-all"
          >
            Book a Demo
          </button>
        </motion.div>

        <div className="mt-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#111827]">Popular Templates</h2>
            <p className="text-[#6B7280] mt-3">
              Get started with our most popular professional templates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TEMPLATES.map((t, i) => (
              <motion.div
                key={t.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.05}
                variants={fadeUp}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col"
                onClick={() => navigate('/solutions')}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${t.bg}`}
                  >
                    {t.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#111827] text-sm leading-tight">{t.title}</p>
                    <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{t.desc}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={12} className="text-[#f59e0b] fill-[#f59e0b]" />
                      ))}
                      <span className="text-[10px] text-gray-400 ml-1">5.0</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                  <span className="text-sm font-medium text-gray-500">{t.count}</span>
                  <button className="px-4 py-1.5 bg-[#f8fafc] text-[#4f46e5] text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors border border-indigo-100">
                    Preview
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/solutions')}
              className="text-violet-600 font-semibold hover:underline underline-offset-4 transition-all"
            >
              View All Templates →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section 4: Dashboard Preview ──────────────────────────────────────────
const DOC_CARDS = [
  { title: 'Q4 Pitch Deck', updated: 'Updated 2 hours ago', badge: 'In Progress', badgeColor: 'bg-orange-100 text-orange-600', iconBg: 'bg-orange-100' },
  { title: 'Business Plan 2024', updated: 'Updated 1 day ago', badge: 'Completed', badgeColor: 'bg-green-100 text-green-600', iconBg: 'bg-green-100' },
  { title: 'Marketing Strategy', updated: 'Updated 2 days ago', badge: 'Review', badgeColor: 'bg-blue-100 text-blue-600', iconBg: 'bg-blue-100' },
  { title: 'Financial Model', updated: 'Updated 3 days ago', badge: 'Completed', badgeColor: 'bg-green-100 text-green-600', iconBg: 'bg-green-100' },
];

const METRIC_CARDS = [
  { value: '24', label: 'Documents', valueColor: 'text-[#3B82F6]', bg: 'bg-blue-50' },
  { value: '8', label: 'In Progress', valueColor: 'text-[#F59E0B]', bg: 'bg-orange-50' },
  { value: '16', label: 'Completed', valueColor: 'text-[#10B981]', bg: 'bg-green-50' },
  { value: '5', label: 'Team Members', valueColor: 'text-[#8B5CF6]', bg: 'bg-purple-50' },
];

const DASHBOARD_FEATURES = [
  { icon: LayoutDashboard, label: 'Organized Workspaces', desc: 'Keep all your projects structured and accessible in dedicated workspaces.', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { icon: TrendingUp, label: 'Progress Tracking', desc: 'Monitor document status and team velocity at a glance.', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { icon: Users, label: 'Team Collaboration', desc: 'Invite teammates, assign roles, and collaborate in real time.', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
  { icon: BarChart2, label: 'Analytics & Insights', desc: 'Understand usage patterns and document performance over time.', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
];

function DashboardPreview() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#111827]">Your creative command center</h2>
          <p className="text-[#6B7280] mt-4 max-w-xl mx-auto">
            Manage all your documents, track progress, and collaborate with your team from one
            beautiful dashboard.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          variants={fadeUp}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB]">
            {/* Window chrome */}
            <div className="bg-white/40 backdrop-blur-xl px-4 py-3 flex items-center gap-2 border-b border-white/20">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 bg-white rounded-md px-3 py-1 text-xs text-[#9CA3AF] border border-[#E5E7EB]">
                app.idealapp.technology/dashboard
              </div>
            </div>

            {/* App body */}
            <div className="flex h-[176px] md:h-auto md:min-h-[320px] overflow-hidden">
              <div className="w-full overflow-hidden">
                <div className="origin-top-left scale-[0.55] md:scale-100 w-[182%] md:w-full flex">
                  {/* Sidebar */}
                  <div className="w-48 bg-[#F8FAFC] p-4 border-r border-[#E5E7EB] flex-shrink-0 hidden sm:block">
                    <p className="font-semibold text-[10px] md:text-xs text-[#111827] mb-3">Navigation</p>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-[10px] md:text-xs text-[#3B82F6] font-medium bg-blue-50 rounded-lg px-2 py-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Recent
                      </div>
                      <div className="flex items-center gap-2 text-[10px] md:text-xs text-[#6B7280] px-2 py-1.5 hover:bg-white rounded-lg cursor-pointer">
                        <Heart className="w-3.5 h-3.5" />
                        Favorites
                      </div>
                    </div>
                    <p className="font-semibold text-[10px] md:text-xs text-[#111827] mb-2">Workspaces</p>
                    <div className="space-y-1.5">
                      {[
                        { dot: 'bg-blue-500', label: 'Product Launch' },
                        { dot: 'bg-purple-500', label: 'Investor Deck' },
                        { dot: 'bg-green-500', label: 'Marketing Plan' },
                      ].map((w) => (
                        <div key={w.label} className="flex items-center gap-2 text-[10px] md:text-xs text-[#6B7280] px-2 py-1.5 hover:bg-white rounded-lg cursor-pointer">
                          <div className={`w-2 h-2 rounded-full ${w.dot}`} />
                          {w.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-4">
                    {/* Metric cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {METRIC_CARDS.map((m) => (
                        <div key={m.label} className={`${m.bg} rounded-xl p-3`}>
                          <p className={`text-2xl font-black ${m.valueColor}`}>{m.value}</p>
                          <p className="text-[10px] md:text-xs text-[#6B7280] mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Document cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      {DOC_CARDS.map((d) => (
                        <div key={d.title} className="bg-white rounded-xl border border-[#E5E7EB] p-3">
                          <div className="flex items-start gap-2">
                            <div className={`w-8 h-8 rounded-lg ${d.iconBg} flex items-center justify-center flex-shrink-0`}>
                              <FileText className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] md:text-xs font-semibold text-[#111827] truncate">{d.title}</p>
                              <p className="text-[10px] md:text-xs text-[#9CA3AF] mt-0.5">{d.updated}</p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className={`text-[10px] md:text-xs font-medium px-2 py-0.5 rounded-full ${d.badgeColor}`}>
                              {d.badge}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature cards below mockup */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DASHBOARD_FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
              variants={fadeUp}
              className="text-center"
            >
              <div className={`w-14 h-14 ${f.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <f.icon className={`w-7 h-7 ${f.iconColor}`} />
              </div>
              <p className="font-bold text-[#111827] mb-2">{f.label}</p>
              <p className="text-sm text-[#6B7280]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5: Editor Features ────────────────────────────────────────────
const EDITOR_FEATURES = [
  {
    icon: Move,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Drag & Drop Interface',
    desc: 'Rearrange elements, add new sections, and customize layouts with simple drag and drop.',
  },
  {
    icon: ImageIcon,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    title: 'Smart Asset Library',
    desc: 'Access thousands of icons, images, and graphics that automatically match your brand.',
  },
  {
    icon: Users,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Real-time Collaboration',
    desc: 'Work with your team simultaneously with live cursors, comments, and instant sync.',
  },
];

function EditorFeatures() {
  const [ballPos, setBallPos] = useState({ x: 80, y: 80 });
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    offsetRef.current = {
      x: e.clientX - ballPos.x,
      y: e.clientY - ballPos.y,
    };
    e.preventDefault();
  };

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.min(Math.max(0, e.clientX - offsetRef.current.x), rect.width - 64);
      const newY = Math.min(Math.max(0, e.clientY - offsetRef.current.y), rect.height - 64);
      setBallPos({ x: newX, y: newY });
    },
    []
  );

  const onMouseUp = () => {
    dragging.current = false;
  };

  return (
    <section id="features-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black text-[#111827]">Powerful editing made simple</h2>
          <p className="text-[#6B7280] mt-4">
            Fine-tune every detail with our intuitive editor. No design experience required.
          </p>
        </motion.div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
          {/* Left: feature list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h3 className="text-2xl font-bold text-[#111827] mb-8">Everything at your fingertips</h3>
            <div className="space-y-6">
              {EDITOR_FEATURES.map((f) => (
                <div key={f.title} className="flex gap-4">
                  <div className={`w-10 h-10 ${f.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 p-2.5`}>
                    <f.icon className={`w-full h-full ${f.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827]">{f.title}</p>
                    <p className="text-sm text-[#6B7280] mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: draggable demo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
          >
            <h3 className="text-xl font-bold text-[#111827] mb-2">Try the stress ball!</h3>
            <p className="text-[#6B7280] text-sm mb-4">
              Drag it around to see our smooth interactions in action.
            </p>
            <div
              ref={containerRef}
              className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl h-64 relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              <div
                className="bg-red-400 w-16 h-16 rounded-full absolute shadow-lg shadow-red-500/40 hover:scale-110 transition-transform"
                style={{ left: ballPos.x, top: ballPos.y }}
                onMouseDown={onMouseDown}
              />
            </div>
            <p className="text-sm italic text-[#6B7280] mt-3">
              This represents the fluid, intuitive experience of our editor
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Section 6: Testimonials ────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    initials: 'JS',
    bg: 'bg-blue-500',
    name: 'John Smith',
    title: 'CEO, TechCorp',
    quote:
      'The pitch deck template helped us raise $2M in Series A. Professional quality that impressed investors.',
  },
  {
    initials: 'MJ',
    bg: 'bg-green-500',
    name: 'Maria Johnson',
    title: 'Founder, StartupXYZ',
    quote:
      'Saved weeks of work. The financial model template is incredibly detailed and professional.',
  },
  {
    initials: 'DL',
    bg: 'bg-orange-500',
    name: 'David Lee',
    title: 'CMO, GrowthCo',
    quote:
      'Perfect for our marketing strategy presentation. Clean design and comprehensive content.',
  },
];

function StarRating() {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-[#111827]">What our users say</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.1}
              variants={fadeUp}
              className="bg-white rounded-xl p-6 border border-[#E5E7EB]"
            >
              <StarRating />
              <p className="text-[#111827] text-sm leading-relaxed mt-4">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-6">
                <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-[#111827] text-sm">{t.name}</p>
                  <p className="text-xs text-[#6B7280]">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 6.5: Brand DNA ────────────────────────────────────────────────
function BrandDNA() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-slate-900/20"
        >
          {/* Quote Mark */}
          <div className="absolute top-8 left-8 text-white/5 font-serif text-9xl leading-none select-none">
            “
          </div>
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8">
              The Ideal App DNA
            </span>
            
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-8 max-w-4xl mx-auto">
              "Let us not forget the roots Foundation as Founders if we look back to the first ever Unicorns. 
              Whereby our biggest misconception was always <span className="text-emerald-400">“Build it and they will come”</span>. 
              We support fast AI app builders, but we want you to build <span className="text-violet-400">‘Bankable’</span> apps"
            </h2>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-white/20" />
              <p className="text-slate-400 font-medium italic">
                Our Founding Philosophy
              </p>
              <div className="h-px w-12 bg-white/20" />
            </div>
          </div>

          {/* Bottom Quote Mark */}
          <div className="absolute bottom-8 right-8 text-white/5 font-serif text-9xl leading-none select-none rotate-180">
            “
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 7: Stats Bar ──────────────────────────────────────────────────
function StatsBar() {
  return (
    <section className="py-16 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-12 lg:gap-20"
        >
          <div className="text-center">
            <p className="text-4xl font-black text-violet-600">180+</p>
            <p className="text-[#6B7280] mt-1">Templates</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-[#10B981]">unlimited</p>
            <p className="text-[#6B7280] mt-1">Documents</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-[#F59E0B]">😊 Happy</p>
            <p className="text-[#6B7280] mt-1">Users</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Main HomePage ─────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [heroPrompt, setHeroPrompt] = useState('');

  const handlePromptSubmit = (prompt: any) => {
    const text = typeof prompt === 'string' ? prompt : prompt.full;
    navigate(`/generate`, { state: { prefill: { full: text } } });
  };

  const handleEditDocument = async (doc: any) => {
    if (!useStore.getState().user) {
      useStore.getState().setShowAuthModal(true);
      return;
    }

    const docId = nanoid();
    const newDoc = {
      id: docId,
      userId: useStore.getState().user!.uid,
      title: doc.title,
      sections: doc.sections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'business-document'
    };

    try {
      await documentService.createDocument(newDoc);
      navigate(`/editor/${docId}`);
    } catch (err) {
      console.error('Failed to create document:', err);
    }
  };

  const handleDownloadDocument = async (doc: any) => {
    try {
      await exportService.exportToPdf(doc, doc.title || 'document');
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <PageWrapper>
      <SEOHead
        title="AI-Powered Business Document Creator | Pitch Decks, Business Plans & More"
        description="Create investor-ready pitch decks, business plans, and financial models with AI. 54 templates, drag-and-drop editor, investor database, and data rooms. Free to start."
        keywords="AI pitch deck maker, AI business plan generator, pitch deck creator, AI document creator for startups, financial model generator, investor database, data room software, pitch deck builder online, AI document tools"
        canonicalUrl="https://idealapp.technology/"
        ogImage="https://idealapp.technology/og/home.png"
        structuredData={[organizationSchema, softwareApplicationSchema, websiteSchema]}
      />
      <HeroSection 
        onPromptSubmit={handlePromptSubmit} 
        heroPrompt={heroPrompt}
        onEdit={handleEditDocument}
        onDownload={handleDownloadDocument}
      />
      <VideoStepsSection />
      <PopularTemplates />
      <DashboardPreview />
      <EditorFeatures />
      <Testimonials />
      <BrandDNA />
      <StatsBar />
    </PageWrapper>
  );
}
