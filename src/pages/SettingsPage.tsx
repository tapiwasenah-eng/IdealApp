import React, { useState } from 'react';
import { User, CreditCard, Building2, Link as LinkIcon, Save, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { designSystem } from '../lib/design-system';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile & Account', icon: User },
  { id: 'company', label: 'Company & DNA', icon: Building2 },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'billing', label: 'Plan & Billing', icon: CreditCard },
];

export default function SettingsPage({ inDashboard }: { inDashboard?: boolean }) {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { colors, typography } = designSystem;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  return (
    <div className={cn("pb-16 md:pb-0 w-full max-w-5xl mx-auto mt-8", inDashboard ? "px-6" : "px-0")}>
      <div className="mb-8">
        <h1 style={{ fontFamily: typography.fonts.interface, fontWeight: 700, fontSize: typography.scale.h2.fontSize, color: colors.primary.obsidian }}>
          Settings
        </h1>
        <p className="text-slate-500 mt-2">Manage your account and workspace preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 flex-shrink-0 flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-auto lg:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden mb-12">
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-6">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.displayName || ''}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end">
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                    {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-2">Company & DNA</h3>
                  <p className="text-sm text-zinc-500 mb-6">Manage your company's core information and identity.</p>
                  
                  <div className="p-6 border border-zinc-200 rounded-2xl bg-zinc-50 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-zinc-800">DNA Completeness</div>
                      <div className="text-indigo-600 font-bold">60%</div>
                    </div>
                    <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm text-zinc-500 mt-4">Complete your Company DNA to generate highly personalized investor documents.</p>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 text-sm">
                      Open DNA Editor <ArrowRight size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Company Name</label>
                      <input type="text" placeholder="Acme Inc." className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Website</label>
                      <input type="url" placeholder="https://acme.inc" className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end">
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                    {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-6">Integrations</h3>
                  
                  <div className="space-y-4">
                    <div className="p-5 border border-zinc-200 rounded-xl flex flex-col md:flex-row gap-4 justify-between md:items-center">
                      <div>
                        <h4 className="font-bold text-zinc-800">Calendar / Booking URL</h4>
                        <p className="text-sm text-zinc-500">Embed your scheduling link in data rooms.</p>
                      </div>
                      <input type="url" placeholder="https://cal.com/founder" className="w-full md:w-64 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm" />
                    </div>
                    
                    <div className="p-5 border border-zinc-200 rounded-xl flex flex-col md:flex-row gap-4 justify-between md:items-center">
                      <div>
                        <h4 className="font-bold text-zinc-800">Slack Webhook</h4>
                        <p className="text-sm text-zinc-500">Get notified when investors view documents.</p>
                      </div>
                      <input type="url" placeholder="https://hooks.slack.com/..." className="w-full md:w-64 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm" />
                    </div>

                    <div className="p-5 border border-zinc-200 rounded-xl flex flex-col md:flex-row gap-4 justify-between md:items-center">
                      <div>
                        <h4 className="font-bold text-zinc-800 flex items-center gap-2">CRM Export <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-black tracking-widest uppercase">Coming Soon</span></h4>
                        <p className="text-sm text-zinc-500">Sync investor interactions to HubSpot or Salesforce.</p>
                      </div>
                      <button disabled className="px-4 py-2 bg-zinc-100 text-zinc-400 font-semibold rounded-lg text-sm cursor-not-allowed">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end">
                  <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50">
                    {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-2">Subscription Plan</h3>
                  <div className="mt-6 p-4 md:p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-center md:text-left">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-[#111827]">Pro Founder Plan</p>
                        <p className="text-sm text-indigo-600 font-medium">$39/month • Next billing on May 4, 2026</p>
                      </div>
                    </div>
                    <button className="w-full md:w-auto px-5 py-2 bg-white border border-indigo-200 text-indigo-600 font-bold rounded-xl text-sm hover:bg-indigo-100 transition-all shadow-sm">
                      Manage Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
