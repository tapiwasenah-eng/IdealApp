import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Home, FileStack, Lock, Star, Send, Grid, 
  BarChart, Dna, Settings, Crown, ChevronDown, Bell 
} from 'lucide-react';
import { designSystem } from '../../lib/design-system';

import { PlanBadge } from './billing/PlanBadge';
import { useBillingStore } from '../../lib/store/useBillingStore';
import { NotificationsTray } from '../../components/dashboard/NotificationsTray';

export const DashboardLayout: React.FC = () => {
  const { colors, typography, spacing, shadows } = designSystem;
  const location = useLocation();
  const { currentPlan, openUpgradeModal } = useBillingStore();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: Home, exact: true },
    { name: 'Documents', path: '/dashboard/documents', icon: FileStack },
    { name: 'Data Room', path: '/dashboard/data-room', icon: Lock },
    { name: 'Investor Match', path: '/dashboard/investors', icon: Star, feature: 'investor_match_pro' },
    { name: 'Outreach Tracker', path: '/dashboard/outreach', icon: Send, feature: 'automated_outreach' },
    { name: 'Templates', path: '/dashboard/templates', icon: Grid },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart, feature: 'data_room_analytics' },
  ];

  const bottomNavItems = [
    { name: 'Company DNA', path: '/dashboard/dna', icon: Dna },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
    return (
      <NavLink
        to={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 group my-1`}
        style={{
          backgroundColor: isActive ? 'rgba(61, 53, 200, 0.08)' : 'transparent',
          color: isActive ? colors.primary.spaceIndigo : colors.neutral.slate[600],
        }}
      >
        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="group-hover:scale-110 transition-transform" />
        <span style={{ fontFamily: typography.fonts.interface, fontSize: typography.scale.bodyM.fontSize, fontWeight: isActive ? 600 : 500 }}>
          {item.name}
        </span>
        {item.feature && currentPlan === 'free' && (
          <span className="ml-auto" style={{ 
            background: designSystem.gradients.investorGlow,
            color: colors.primary.obsidian,
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '999px',
            textTransform: 'uppercase'
          }}>Pro</span>
        )}
      </NavLink>
    );
  }

  return (
    <div className="flex w-full h-screen bg-[#FAFAFF] text-slate-800 overflow-hidden">
      
      {/* Sidebar (256px) */}
      <div 
        className="w-[256px] h-full flex-shrink-0 flex flex-col border-r bg-white" 
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}
      >
        
        {/* Brand / Company Selector */}
        <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.bodyS.fontSize }}>Acme Corp</div>
              <PlanBadge />
            </div>
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Top Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {navItems.map(item => <NavItem key={item.name} item={item} />)}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="px-3 pb-4">
          <div className="space-y-0.5 mb-4">
            <div className="h-px w-full bg-slate-100 my-4"></div>
            {bottomNavItems.map(item => <NavItem key={item.name} item={item} />)}
          </div>
          
          {currentPlan === 'free' && (
            <button 
              onClick={() => openUpgradeModal()}
              className="w-full flex items-center justify-center gap-2" style={{
              background: designSystem.gradients.investorGlow,
              color: colors.primary.obsidian,
              padding: '12px',
              borderRadius: designSystem.radii.buttonPrimary,
              fontFamily: typography.fonts.interface,
              fontWeight: 600,
              fontSize: typography.scale.bodyS.fontSize,
              boxShadow: shadows.e1,
              transition: 'all 150ms'
            }}>
              <Crown size={16} />
              Upgrade to Pro
            </button>
          )}
          {currentPlan === 'pro' && (
            <NavLink 
              to="/pricing"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-3 font-semibold text-sm shadow-sm transition-all hover:bg-slate-800"
            >
              <Crown size={16} className="text-amber-400" />
              Upgrade to Studio
            </NavLink>
          )}
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden relative bg-[#FAFAFF]">
        {/* Header */}
        <header className="h-[72px] flex-shrink-0 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b sticky top-0 z-10" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h3.fontSize }}>
            Good morning, Founder ✦
          </h2>
          <div className="flex items-center gap-4">
            <NotificationsTray />
            <button style={{
              background: designSystem.gradients.aiAura,
              color: 'white',
              fontFamily: typography.fonts.interface,
              fontWeight: 600,
              fontSize: typography.scale.bodyS.fontSize,
              padding: '8px 16px',
              borderRadius: designSystem.radii.buttonSecondary,
              boxShadow: shadows.e1,
            }}>
              New Document
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};
