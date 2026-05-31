import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { designSystem } from '../../lib/design-system';
import { useCompanyDNAStore, CompanyDNA } from '../../lib/store/useCompanyDNAStore';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export const CompanyDNAEditor: React.FC = () => {
  const { colors, typography, spacing, radii, shadows } = designSystem;
  const { dna, updateDNA, getStrengthPercentage, loadDNA } = useCompanyDNAStore();
  const strength = getStrengthPercentage();

  useEffect(() => {
    loadDNA();
  }, [loadDNA]);

  return (
    <div className="max-w-4xl mx-auto pb-32">
      
      {/* Header */}
      <div className="mb-10">
        <h1 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h2.fontSize, color: colors.primary.obsidian, letterSpacing: typography.scale.h2.letterSpacing }}>
          Company DNA
        </h1>
        <p className="text-slate-500 mt-2 text-[15px] max-w-2xl">
          Tell IdealApp about your company once. Every document you create — deck, memo, financial model — is pre-populated with your context. The AI remembers everything.
        </p>
      </div>

      {/* Strength Meter (Sticky) */}
      <div className="sticky top-[88px] z-20 bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200 mb-8 flex items-center justify-between shadow-sm">
        <div className="flex-1 mr-8">
          <div className="flex justify-between items-end mb-2">
            <span className="font-semibold text-slate-800">DNA Strength</span>
            <span style={{ fontFamily: typography.fonts.mono, fontWeight: 700, color: colors.primary.spaceIndigo }}>{strength}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500" style={{ width: `${strength}%` }}></div>
          </div>
        </div>
        <div className="flex flex-col gap-1 min-w-[240px]">
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
            <CheckCircle2 size={14} className="text-emerald-500"/> Personalised pitch deck
          </div>
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
            <CheckCircle2 size={14} className="text-emerald-500"/> Accurate financial model
          </div>
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
            <ShieldAlert size={14} className="text-amber-500"/> Investor-matched intro email (Add metrics)
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        
        <Section title="1. Company Identity">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" value={dna.identity.name} onChange={(v) => updateDNA('identity', { name: v })} />
            <Input label="Website" value={dna.identity.website} onChange={(v) => updateDNA('identity', { website: v })} />
            <Input label="One-word Tagline / Sector" value={dna.identity.tagline} onChange={(v) => updateDNA('identity', { tagline: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Founding Year" value={dna.identity.foundingYear} onChange={(v) => updateDNA('identity', { foundingYear: v })} />
              <Input label="HQ Location" value={dna.identity.hq} onChange={(v) => updateDNA('identity', { hq: v })} />
            </div>
          </div>
        </Section>

        <Section title="2. What You Do">
           <Input label="One-line Pitch (Used in investor outreach)" value={dna.whatYouDo.oneLinePitch} onChange={(v) => updateDNA('whatYouDo', { oneLinePitch: v })} />
           <TextArea label="Longer Description (The problem and your solution)" value={dna.whatYouDo.description} onChange={(v) => updateDNA('whatYouDo', { description: v })} />
        </Section>

        <Section title="3. Traction & Metrics">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <MetricInput label="MRR / ARR" value={dna.traction.mrr} onChange={(v) => updateDNA('traction', { mrr: v })} />
            <MetricInput label="Users / Customers" value={dna.traction.users} onChange={(v) => updateDNA('traction', { users: v })} />
            <MetricInput label="Growth Rate" value={dna.traction.growthRate} onChange={(v) => updateDNA('traction', { growthRate: v })} />
          </div>
          <Input label="Key Milestones (Comma separated)" value={dna.traction.milestones} onChange={(v) => updateDNA('traction', { milestones: v })} />
        </Section>

        <Section title="4. Fundraising">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Current Stage (e.g. Pre-seed, Seed)" value={dna.fundraising.stage} onChange={(v) => updateDNA('fundraising', { stage: v })} />
            <MetricInput label="Amount Raising" value={dna.fundraising.amountRaising} onChange={(v) => updateDNA('fundraising', { amountRaising: v })} />
          </div>
          <Input label="Use of Funds" value={dna.fundraising.useOfFunds} onChange={(v) => updateDNA('fundraising', { useOfFunds: v })} />
          <Input label="Previous Rounds & Lead Investors" value={dna.fundraising.previousRounds} onChange={(v) => updateDNA('fundraising', { previousRounds: v })} />
        </Section>

        <Section title="5. Market & Competition">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="TAM / SAM / SOM" value={dna.market.tam} onChange={(v) => updateDNA('market', { tam: v })} />
            <Input label="Target Customer" value={dna.market.targetCustomer} onChange={(v) => updateDNA('market', { targetCustomer: v })} />
            <Input label="Geography" value={dna.market.geography} onChange={(v) => updateDNA('market', { geography: v })} />
          </div>
          <Input label="Main Competitors" value={dna.competition.competitors} onChange={(v) => updateDNA('competition', { competitors: v })} />
          <Input label="Your Differentiators (The Moat)" value={dna.competition.differentiators} onChange={(v) => updateDNA('competition', { differentiators: v })} />
        </Section>

      </div>
    </div>
  );
};

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="bg-white p-8 rounded-[16px] border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 font-sans">{title}</h3>
      {children}
    </div>
  );
}

const Input: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="bg-white border border-slate-200 rounded-[12px] h-[44px] px-4 text-[15px] outline-none transition-all focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/15"
      />
    </div>
  )
}

const MetricInput: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono font-bold rounded-[12px] h-[44px] px-4 text-[15px] outline-none transition-all focus:border-emerald-500 focus:ring-[3px] focus:ring-emerald-500/20"
      />
    </div>
  )
}

const TextArea: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 mt-4">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <textarea 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="bg-white border border-slate-200 rounded-[12px] min-h-[120px] px-4 py-3 text-[15px] outline-none resize-y transition-all focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/15"
      />
    </div>
  )
}
