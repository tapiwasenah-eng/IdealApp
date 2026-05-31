import React, { useState } from 'react';
import { designSystem } from '../../../lib/design-system';
import { useBillingStore, PlanType } from '../../../lib/store/useBillingStore';
import { useAuthStore } from '../../../store/authStore';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { currentPlan } = useBillingStore();
  const { updateSubscription } = useAuthStore();
  const { typography, colors, shadows } = designSystem;

  const handleSelectPlan = async (plan: PlanType) => {
    // TODO: Redirect to Stripe checkout for real billing
    try {
      await updateSubscription(plan);
      toast.success(`Successfully upgraded to ${plan.toUpperCase()} plan.`);
    } catch (e: any) {
      toast.error('Failed to update plan. Make sure you are logged in.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFF] py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h1.fontSize, color: colors.primary.obsidian }}>
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-500 mt-4 leading-relaxed font-sans">
            Start fundraising for free. Upgrade when you need active investor matching, automated outreach, and slide-level analytics.
          </p>
          
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-slate-200 rounded-full p-1 relative transition-colors focus:outline-none"
              style={{ backgroundColor: isAnnual ? colors.primary.obsidian : '#e2e8f0' }}
            >
              <div 
                className="w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300"
                style={{ transform: isAnnual ? 'translateX(24px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2 ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annually <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold rounded-full">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          
          {/* Free Tier */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col hover:border-slate-300 transition-colors">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-sans mb-2">Free</h3>
              <p className="text-sm text-slate-500 h-10">Everything you need to prep your data room.</p>
            </div>
            <div className="mb-8">
              <span className="text-5xl font-bold font-sans text-slate-900">$0</span>
              <span className="text-slate-500 font-medium ml-2">/ month</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Includes</p>
              <ul className="space-y-4">
                {[
                  '1 Data Room',
                  'Basic templates & document builder',
                  'Match with up to 5 investors',
                  'Manual outbound tracking'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleSelectPlan('free')}
              className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm transition-colors border ${currentPlan === 'free' ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-default' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
              disabled={currentPlan === 'free'}
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* Pro Tier (Popular) */}
          <div className="bg-slate-900 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl" style={{ boxShadow: shadows.e3 }}>
            <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
              <div className="px-3 py-1 bg-gradient-to-r from-[#C9A84C] to-[#F5A623] text-white text-[10px] uppercase font-bold tracking-widest rounded-full shadow-sm">
                Most Popular
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white font-sans mb-2">Pro</h3>
              <p className="text-sm text-slate-400 h-10">Active fundraising with AI tracking and unlimited matches.</p>
            </div>
            <div className="mb-8">
              <div className="flex items-end">
                <span className="text-5xl font-bold font-sans text-white">${isAnnual ? '49' : '59'}</span>
                <span className="text-slate-400 font-medium ml-2 pb-1">/ month</span>
              </div>
              {isAnnual && <p className="text-xs text-amber-500 mt-2 font-medium">Billed $588 annually</p>}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-4">Everything in Free, plus</p>
              <ul className="space-y-4">
                {[
                  'Unlimited AI Investor Matches',
                  'Slide-by-slide Analytics',
                  'Automated outreach & follow-ups',
                  'Smart access controls (NDA/Email wall)',
                  'Custom domains'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CheckCircle2 size={12} className="text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleSelectPlan('pro')}
              className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 ${currentPlan === 'pro' ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-white text-slate-900 hover:bg-slate-100 shadow-md'}`}
              disabled={currentPlan === 'pro'}
            >
              {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Studio Tier */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col hover:border-slate-300 transition-colors">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-sans mb-2">Studio</h3>
              <p className="text-sm text-slate-500 h-10">For agencies, accelerators, or serial founders.</p>
            </div>
            <div className="mb-8">
               <div className="flex items-end">
                <span className="text-5xl font-bold font-sans text-slate-900">${isAnnual ? '149' : '179'}</span>
                <span className="text-slate-500 font-medium ml-2 pb-1">/ month</span>
              </div>
              {isAnnual && <p className="text-xs text-slate-400 mt-2 font-medium">Billed $1,788 annually</p>}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Everything in Pro, plus</p>
              <ul className="space-y-4">
                {[
                  'Unlimited companies / data rooms',
                  'Team collaboration seats',
                  'White-labeled branding',
                  'Priority support',
                  'API Access (Soon)'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button 
              onClick={() => handleSelectPlan('studio')}
              className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm transition-colors border ${currentPlan === 'studio' ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-default' : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-50 shadow-sm'}`}
              disabled={currentPlan === 'studio'}
            >
              {currentPlan === 'studio' ? 'Current Plan' : 'Upgrade to Studio'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
