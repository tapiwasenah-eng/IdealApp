import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Palette, 
  Globe, 
  Lock,
  ChevronRight,
  Save
} from 'lucide-react';
import { AppNav } from '../components/layout/AppNav';
import { useStore } from '../store';
import { toast } from 'sonner';
import SEOHead from '../components/Shared/SEOHead';
import { cn } from '../lib/utils';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'brand', label: 'Brand Kit', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Globe },
];

export default function SettingsPage({ inDashboard }: { inDashboard?: boolean }) {
  const { userProfile, user } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingPayPal, setIsTestingPayPal] = useState(false);
  const [payPalTestResult, setPayPalTestResult] = useState<{ status: 'success' | 'error', message: string } | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };

  const testPayPalConnection = async () => {
    setIsTestingPayPal(true);
    setPayPalTestResult(null);
    try {
      const response = await fetch('/api/paypal/test');
      const data = await response.json();
      if (data.status === 'ok') {
        setPayPalTestResult({ status: 'success', message: 'Successfully connected to PayPal!' });
        toast.success('PayPal connection successful');
      } else {
        setPayPalTestResult({ status: 'error', message: data.message });
        toast.error('PayPal connection failed');
      }
    } catch (error) {
      setPayPalTestResult({ status: 'error', message: 'Failed to connect to the server' });
      toast.error('Server connection error');
    } finally {
      setIsTestingPayPal(false);
    }
  };

  return (
    <div className={cn("bg-[#F9FAFB] pb-16 md:pb-0", inDashboard ? "flex-1" : "flex min-h-screen")}>
      {!inDashboard && <SEOHead
        title="Settings | Ideal App"
        description="Manage your Ideal App account settings, brand kit, and billing."
        noIndex={true}
      />}
      {!inDashboard && <AppNav />}

      <div className={cn("flex-1 flex flex-col", !inDashboard && "ml-0 md:ml-64")}>
        {/* Header */}
        <div className="py-6 px-6 md:py-8 md:px-10 bg-white border-b border-[#E5E7EB]">
          <h1 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight">Settings</h1>
          <p className="text-[#6B7280] mt-1">Manage your account and application preferences</p>
        </div>

        <div className="p-6 md:p-10 max-w-5xl">
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
                  <tab.icon className="w-4.5 h-4.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
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
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Bio</label>
                          <textarea
                            rows={4}
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-[#111827] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-100 flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'brand' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-[#111827] mb-2">Brand Kit</h3>
                      <p className="text-sm text-zinc-500 mb-8">Maintain consistency across all your documents.</p>
                      
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Brand Colors</label>
                          <div className="flex gap-3">
                            {['#4f46e5', '#111827', '#F8FAFC', '#10B981', '#F59E0B'].map((color) => (
                              <div key={color} className="group relative">
                                <div 
                                  className="w-12 h-12 rounded-xl border border-zinc-200 cursor-pointer shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {color}
                                </div>
                              </div>
                            ))}
                            <button className="w-12 h-12 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-indigo-400 hover:text-indigo-600 transition-all">
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Brand Logo</label>
                          <div className="w-full h-40 border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400">
                              <Palette className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-zinc-500">Click to upload or drag and drop</p>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">SVG, PNG or JPG (max. 5MB)</p>
                          </div>
                        </div>
                      </div>
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

                    <div>
                      <h3 className="text-xl font-bold text-[#111827] mb-6">Payment Methods</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-zinc-100 rounded flex items-center justify-center">
                              <span className="text-[10px] font-black italic">VISA</span>
                            </div>
                            <p className="text-sm font-medium text-zinc-900">•••• •••• •••• 4242</p>
                          </div>
                          <span className="text-xs text-zinc-400">Expires 12/28</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-100">
                      <h3 className="text-lg font-bold text-[#111827] mb-2">PayPal Integration</h3>
                      <p className="text-sm text-zinc-500 mb-4">Test your PayPal API credentials and webhook connection.</p>
                      
                      <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-zinc-700">Sandbox Connection</span>
                          </div>
                          <button 
                            onClick={testPayPalConnection}
                            disabled={isTestingPayPal}
                            className="px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold rounded-lg hover:bg-zinc-100 transition-all disabled:opacity-50"
                          >
                            {isTestingPayPal ? 'Testing...' : 'Test Connection'}
                          </button>
                        </div>

                        {payPalTestResult && (
                          <div className={`p-3 rounded-lg text-xs font-medium ${
                            payPalTestResult.status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {payPalTestResult.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-bold text-[#111827] mb-6">Security Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-500">
                              <Lock className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#111827]">Two-Factor Authentication</p>
                              <p className="text-xs text-zinc-500">Add an extra layer of security to your account.</p>
                            </div>
                          </div>
                          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Enable</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== 'profile' && activeTab !== 'brand' && activeTab !== 'billing' && activeTab !== 'security' && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300 mb-4">
                      {React.createElement(SETTINGS_TABS.find(t => t.id === activeTab)?.icon || User, { className: "w-8 h-8" })}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">Coming Soon</h3>
                    <p className="text-sm text-zinc-500 max-w-xs">We're working on bringing more settings to you soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
