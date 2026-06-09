// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  FolderLock,
  Users,
  Network,
  Sparkles,
  BarChart3,
  Compass,
  Mic,
  LogIn,
  Sun,
  Moon,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

// TODO: swap to your final SVG if different
const STAR_LOGO =
  'https://res.cloudinary.com/ddchlkkbl/image/upload/q_auto/f_auto/v1780989869/IdealApp_New_Logo_f6ozqa.svg';

// Rotating prompt variants for the typewriter line
const PROMPTS = [
  'Create a Fintech Pitch Deck',
  'Draft an investor update memo',
  'Summarize my latest board meeting',
  'Prepare a Series A data room overview',
];

const INTEGRATION_ICONS = [
  // For now just use Lucide icons or your own SVGs in-place of GitHub, Slack, etc.
  // You can replace these with real brand icons.
  FileText,
  FolderLock,
  Users,
  Network,
  BarChart3,
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Typewriter / rotating prompt state
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');
  const [isHoveringPrompt, setIsHoveringPrompt] = useState(false);

  const activePrompt = PROMPTS[activeIndex];

  // Basic typewriter effect that cycles through PROMPTS
  useEffect(() => {
    if (isHoveringPrompt) return; // freeze on hover

    const current = activePrompt;

    if (phase === 'typing') {
      if (displayText.length < current.length) {
        const id = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1));
        }, 45);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase('pausing'), 1200);
      return () => clearTimeout(id);
    }

    if (phase === 'pausing') {
      const id = setTimeout(() => setPhase('deleting'), 600);
      return () => clearTimeout(id);
    }

    if (phase === 'deleting') {
      if (displayText.length > 0) {
        const id = setTimeout(
          () => setDisplayText((t) => t.slice(0, t.length - 1)),
          30
        );
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => {
        setActiveIndex((i) => (i + 1) % PROMPTS.length);
        setPhase('typing');
      }, 200);
      return () => clearTimeout(id);
    }
  }, [phase, displayText, activePrompt, isHoveringPrompt]);

  const handlePromptClick = (prompt: string) => {
    useAppStore.getState().setInitialPrompt(prompt);
    navigate('/wizard');
  };

  const handleSubmit = () => {
    const prompt = displayText || activePrompt;
    handlePromptClick(prompt);
  };

  const handleCreateNew = () => {
    if (!user) {
      navigate('/auth?mode=signup');
      return;
    }
    navigate('/dashboard/documents');
  };

  const handleGoPro = () => {
    navigate('/pricing');
  };

  const handleVoiceAI = () => {
    useAppStore.getState().setAuraVoiceOpen(true);
  };

  const handleLogin = () => {
    if (user) {
      navigate('/dashboard/documents');
    } else {
      navigate('/auth?mode=signin');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((v) => !v);
  };

  return (
    <div className="min-h-screen bg-ideal-charcoal text-ideal-text flex">
      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex inset-y-0 left-0 z-40 w-72 flex-col bg-ideal-sidebar text-white shadow-sidebar-elevated overflow-hidden">
        {/* Brand header */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-9 w-9 flex items-center justify-center rounded-2xl bg-black/40 ring-2 ring-white/10 overflow-hidden">
            <img src={STAR_LOGO} alt="IdealApp logo" className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-ideal-muted uppercase">
              THE IDEAL APP
            </span>
            <span className="text-sm font-semibold text-white">
              Founder Control Center
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 space-y-6 scrollbar-hide">
          {/* MY PROJECTS */}
          <section className="px-5">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-ideal-muted uppercase mb-3 text-left">
              MY PROJECTS
            </p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-black/40 border border-white/15 text-sm font-semibold text-white py-2.5 hover:bg-white/10 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>CREATE NEW</span>
            </button>
          </section>

          {/* CORE TOOLS */}
          <section className="px-5">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-ideal-muted uppercase mb-2.5 text-left">
              CORE TOOLS
            </p>
            <nav className="space-y-1 text-sm">
              <button
                type="button"
                onClick={() => navigate('/dashboard/documents')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-200"
              >
                <FileText className="h-4 w-4 text-slate-300" />
                <span>Pitch Decks</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/data-room')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-200"
              >
                <FolderLock className="h-4 w-4 text-slate-300" />
                <span>Data Rooms</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/investors')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-200"
              >
                <Users className="h-4 w-4 text-slate-300" />
                <span>Investor Matching</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/outreach')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-200"
              >
                <Network className="h-4 w-4 text-slate-300" />
                <span>Outreach Pipeline</span>
              </button>
            </nav>
          </section>

          {/* RESOURCES */}
          <section className="px-5 pb-4">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-ideal-muted uppercase mb-2.5 text-left">
              RESOURCES
            </p>
            <nav className="space-y-1 text-sm">
              <button
                type="button"
                onClick={() => navigate('/templates')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-200"
              >
                <Sparkles className="h-4 w-4 text-slate-300" />
                <span>Templates</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/analytics')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-200"
              >
                <BarChart3 className="h-4 w-4 text-slate-300" />
                <span>Analytics</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/community')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-slate-200"
              >
                <Compass className="h-4 w-4 text-slate-300" />
                <span>Community</span>
              </button>
            </nav>
          </section>
        </div>

        {/* FOOTER: GO PRO, VOICE AI, LOGIN + THEME TOGGLE */}
        <div className="mt-auto px-4 pt-3 pb-4 space-y-3 border-t border-white/5 flex-shrink-0">
          {/* GO PRO */}
          <button
            type="button"
            onClick={handleGoPro}
            className="w-full flex items-center justify-between rounded-2xl bg-ideal-neon text-black px-3 py-2 shadow-[0_12px_40px_rgba(205,231,27,0.65)] hover:bg-lime-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-black text-ideal-neon text-xs font-bold leading-none">
                ◆
              </span>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-xs font-semibold">GO PRO</span>
                <span className="text-[10px] font-medium opacity-95">
                  Unlock Global VC Data
                </span>
              </div>
            </div>
            <span className="rounded-full bg-ideal-neon text-black text-[10px] font-extrabold tracking-[0.18em] px-2 py-0.5 border border-black/10">
              30% OFF
            </span>
          </button>

          {/* TRY VOICE AI */}
          <button
            type="button"
            onClick={handleVoiceAI}
            className="w-full flex items-center justify-between rounded-2xl bg-white/5 text-ideal-text px-3 py-2 text-[11px] font-semibold hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-ideal-neon" />
              <span>TRY VOICE AI</span>
            </span>
            <span className="uppercase text-[9px] text-ideal-muted tracking-[0.18em]">
              BETA
            </span>
          </button>

          {/* LOG IN + THEME TOGGLE */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogin}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-3 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-ideal-text hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" />
              <span>{user ? 'DASHBOARD' : 'LOG IN'}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 text-ideal-muted hover:text-white hover:border-ideal-neon/60"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN HERO AREA */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col items-center justify-center px-6 py-10 border-l border-white/5">
        <section className="relative w-full max-w-6xl rounded-hero-xl bg-ideal-hero shadow-hero-card pt-16 pb-20 px-8 md:px-16" style={{ minHeight: '600px' }}>
          {/* North Star */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <img
              src={STAR_LOGO}
              alt="IdealApp north star"
              className="h-10 w-10 opacity-95"
            />
          </div>

          {/* Headline */}
          <div className="mt-14 text-center">
            <p className="font-serif text-ideal-text">
              <span className="text-base align-middle mr-1 text-ideal-text">
                The
              </span>
              <span className="text-4xl md:text-5xl font-semibold text-ideal-gold">
                Ideal App <span className="font-serif text-3xl md:text-4xl text-ideal-text ml-1 tracking-tight">for Founders by Investors</span>
              </span>
            </p>
            <p className="mt-4 text-sm md:text-base text-ideal-muted">
              Your north star to a polished document in minutes.
            </p>
          </div>

          {/* Chat Card */}
          <div className="mt-14 flex justify-center relative z-10">
            <div className="w-full max-w-4xl bg-black/85 rounded-[26px] border border-black/70 shadow-hero-card">
              {/* Prompt row */}
              <div
                className="px-7 pt-6 pb-4 flex items-center justify-between gap-4 cursor-text"
                onMouseEnter={() => setIsHoveringPrompt(true)}
                onMouseLeave={() => setIsHoveringPrompt(false)}
                onClick={() =>
                  handlePromptClick(displayText || activePrompt)
                }
              >
                <p className="text-sm md:text-base text-ideal-text font-medium select-none">
                  {displayText || activePrompt}
                  <span className="border-r-[1.5px] border-ideal-gold ml-1 animate-pulse" />
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                  }}
                  className="h-10 w-10 shrink-0 rounded-full bg-ideal-neon text-black flex items-center justify-center hover:bg-lime-300 transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom rail */}
              <div className="px-7 pb-5 flex items-center justify-between text-xs text-ideal-muted">
                <button
                  type="button"
                  className="flex items-center gap-2 text-ideal-text"
                >
                  <span className="h-6 w-6 rounded-full bg-black/70 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.12em] uppercase hover:text-white transition-colors"
                >
                  <span className="inline-flex h-4 w-4 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 mr-1" />
                  <span className="text-ideal-text select-none">
                    IDEAL picks best model
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Voice AI CTA */}
          <div className="mt-6 flex justify-center relative z-10">
            <button
              type="button"
              onClick={handleVoiceAI}
              className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-obsidian hover:opacity-80 transition-opacity"
            >
              <Mic className="h-4 w-4" />
              <span>Try Voice AI instead</span>
            </button>
          </div>

          {/* Scrolling integration logos */}
          <div className="absolute bottom-10 left-0 w-full overflow-hidden">
            <div className="flex gap-16 px-10 animate-[scrollLogos_40s_linear_infinite]">
              {[...INTEGRATION_ICONS, ...INTEGRATION_ICONS, ...INTEGRATION_ICONS, ...INTEGRATION_ICONS, ...INTEGRATION_ICONS, ...INTEGRATION_ICONS].map((Icon, idx) => (
                <Icon
                  key={idx}
                  className="h-7 w-7 opacity-[0.15] text-obsidian flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
