import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Plus,
  LayoutDashboard,
  FileText,
  FolderLock,
  Users,
  Network,
  LayoutPanelLeft,
  BarChart3,
  Compass,
  Sparkles,
  Mic,
  LogIn,
  LogOut,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
// Adapting imports to match existing store
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../ui/Logo';
import { useBillingStore } from '../../lib/store/useBillingStore';

interface SidebarProps {
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

const navLinkBase =
  'group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors';
const navLinkInactive =
  'text-slate-300/80 hover:text-white hover:bg-white/5';
const navLinkActive =
  'text-white bg-white/10 border border-ideal-neon/40 shadow-nav-soft';

const Sidebar: React.FC<SidebarProps> = ({ onToggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const { openUpgradeModal } = useBillingStore();

  const handleCreateNew = () => {
    navigate('/dashboard/documents');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    if (signOut) signOut();
  };

  const handleVoiceAI = () => {
    navigate('/?aura=1');
  };

  const goPro = () => {
    openUpgradeModal();
  };

  return (
    <aside className="h-full flex flex-col bg-ideal-sidebar text-white shadow-sidebar-elevated overflow-hidden">
      {/* Top: Logo & brand */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/5 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="h-9 w-9 flex items-center justify-center rounded-2xl bg-black/40 ring-2 ring-white/10">
          <Logo size="lg" color="white" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-semibold tracking-[0.24em] text-slate-400 uppercase">
            The Ideal App
          </span>
          <span className="text-sm font-semibold text-white">
            Founder Command Center
          </span>
        </div>
      </div>

      {/* Scrollable navigation sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-hide">
        {/* My Projects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
              My Projects
            </span>
            <button
              type="button"
              onClick={handleCreateNew}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-ideal-neon text-black hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleCreateNew}
            className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-white/5 to-white/[0.02] px-3 py-3 text-left text-sm font-medium text-white shadow-nav-soft border border-white/10 hover:border-ideal-neon/50 hover:from-white/10 hover:to-white/[0.04] transition-colors"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-ideal-neon" />
              <span>Create New Workspace</span>
            </span>
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Cmd + N
            </span>
          </button>
        </div>

        {/* Core Tools */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Core Tools
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <LayoutDashboard className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Overview</span>
            </NavLink>
            <NavLink
              to="/dashboard/documents"
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <FileText className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Pitch Decks</span>
            </NavLink>
            <NavLink
              to="/dashboard/data-room"
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <FolderLock className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Data Rooms</span>
            </NavLink>
            <NavLink
              to="/dashboard/investors"
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <Users className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Investor Matching</span>
            </NavLink>
            <NavLink
              to="/dashboard/outreach"
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <Network className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Outreach Pipeline</span>
            </NavLink>
          </nav>
        </div>

        {/* Resources */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Resources
          </p>
          <nav className="space-y-1">
            <NavLink
              to="/dashboard/templates"
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <LayoutPanelLeft className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Templates</span>
            </NavLink>
            <NavLink
              to="/dashboard/analytics"
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <BarChart3 className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Analytics</span>
            </NavLink>
            <NavLink
              to="/dashboard/dna"
              className={({ isActive }) =>
                [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
              }
            >
              <Compass className="h-4 w-4 text-slate-300 group-hover:text-ideal-neon" />
              <span>Company DNA</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="border-t border-white/5 px-4 pb-4 pt-3 flex-shrink-0 space-y-3">
        {/* Go Pro */}
        <button
          type="button"
          onClick={goPro}
          className="flex w-full items-center justify-between rounded-2xl bg-ideal-neon text-black px-3 py-3 text-sm font-semibold shadow-nav-soft hover:bg-lime-300 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Go Pro</span>
          </span>
          <span className="rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ideal-neon">
            30% OFF
          </span>
        </button>

        {/* Auth + Theme row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Auth button */}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/40 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-black/70 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/40 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-black/70 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Log in</span>
            </button>
          )}

          {/* Settings placeholder */}
          <button
            type="button"
            onClick={() => navigate('/dashboard/settings')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 text-slate-200 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
