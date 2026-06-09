import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../components/Shared/SEOHead';
import { useAppStore } from '../store/appStore';

export default function PricingPage() {
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const [scrolled, setScrolled] = useState(false);
  const [usersCount, setUsersCount] = useState(1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian text-cosmic-white overflow-x-hidden bg-grain">
      <SEOHead title="IdealApp Pricing" description="Choose the perfect plan for your startup" canonicalUrl="/pricing" />

      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-space-indigo/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-electric-violet/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'glass-panel py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-space-indigo to-electric-violet flex items-center justify-center">
              <span className="font-serif font-bold text-white leading-none">I</span>
            </div>
            <span className="font-sans font-semibold text-white text-xl tracking-tight">IdealApp</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="text-sm font-medium bg-white text-obsidian px-4 py-2 rounded-full hover:scale-105 transition-transform">
                Go to Dashboard
              </button>
            ) : (
              <button onClick={() => navigate('/signup')} className="text-sm font-medium bg-white text-obsidian px-4 py-2 rounded-full hover:scale-105 transition-transform">
                Sign Up Free
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Plans Section */}
      <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-6"><span className="text-gradient-aura">Simple Pricing</span></h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-sans">
            Choose the right plan to accelerate your fundraising journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Free Plan */}
          <div className="glass-panel border border-white/10 rounded-[2rem] p-10 flex flex-col h-full">
            <h3 className="text-2xl font-semibold mb-2 text-white">Free</h3>
            <p className="text-sm text-text-muted mb-6 h-10">Perfect for solo founders exploring the platform.</p>
            <div className="text-4xl font-serif mb-8">$0 <span className="text-lg text-text-muted font-sans">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3">
                <span className="text-plasma-green mt-1">✔</span>
                <span className="text-slate-300">3 AI Document Generations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-plasma-green mt-1">✔</span>
                <span className="text-slate-300">1 Active Data Room</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-plasma-green mt-1">✔</span>
                <span className="text-slate-300">Basic Investor Match (Top 5)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-plasma-green mt-1">✔</span>
                <span className="text-slate-300">Outreach Tracker (limit 10)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-plasma-green mt-1">✔</span>
                <span className="text-slate-300">Standard Templates Access</span>
              </li>
            </ul>
            <button onClick={handleGetStarted} className="w-full py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="glass-panel border border-electric-violet/40 rounded-[2rem] p-10 flex flex-col relative overflow-hidden bg-electric-violet/5 h-full transform lg:-translate-y-4 shadow-2xl shadow-electric-violet/10">
            <div className="absolute top-0 right-0 bg-electric-violet text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              Recommended
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-white">Pro</h3>
            <p className="text-sm text-text-muted mb-6 h-10">Everything you need to successfully close your round.</p>
            <div className="text-4xl font-serif mb-6 text-gradient-aura">${49 * usersCount} <span className="text-lg text-text-muted font-sans">/mo</span></div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300 border border-white/10 px-3 py-1 rounded-full">{usersCount} {usersCount === 1 ? 'User' : 'Users'}</span>
                <span className="text-xs text-text-muted">$49 per user</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={usersCount} 
                onChange={(e) => setUsersCount(parseInt(e.target.value))}
                className="w-full appearance-none bg-white/10 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-electric-violet cursor-pointer"
              />
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3">
                <span className="text-electric-violet mt-1">✔</span>
                <span className="text-slate-300">Unlimited AI Documents</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-violet mt-1">✔</span>
                <span className="text-slate-300">Unlimited Data Rooms & Analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-violet mt-1">✔</span>
                <span className="text-slate-300">Global VC Database Matching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-violet mt-1">✔</span>
                <span className="text-slate-300">Unlimited CRM Connections</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-violet mt-1">✔</span>
                <span className="text-slate-300">Premium Export Options</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-electric-violet mt-1">✔</span>
                <span className="text-slate-300">Priority Support</span>
              </li>
            </ul>
            <button onClick={() => navigate('/dashboard')} className="w-full py-4 rounded-xl bg-white text-obsidian font-semibold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel border border-white/10 rounded-[2rem] p-10 flex flex-col h-full">
            <h3 className="text-2xl font-semibold mb-2 text-white">Enterprise</h3>
            <p className="text-sm text-text-muted mb-6 h-10">Advanced security, custom workflows, and dedicated support.</p>
            <div className="text-4xl font-serif mb-8">Custom</div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3">
                <span className="text-investor-gold mt-1">✔</span>
                <span className="text-slate-300">SSO & Advanced Governance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-investor-gold mt-1">✔</span>
                <span className="text-slate-300">Custom AI Models</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-investor-gold mt-1">✔</span>
                <span className="text-slate-300">White-label Data Rooms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-investor-gold mt-1">✔</span>
                <span className="text-slate-300">Dedicated Account Manager</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-investor-gold mt-1">✔</span>
                <span className="text-slate-300">Bespoke Onboarding</span>
              </li>
            </ul>
            <button onClick={() => window.location.href = 'mailto:sales@idealapp.com'} className="w-full py-4 rounded-xl font-medium bg-space-indigo text-white hover:bg-space-indigo/80 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 mt-12 text-center text-sm text-text-muted">
        <p>© 2026 IdealApp Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
