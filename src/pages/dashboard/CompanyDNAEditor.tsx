import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { designSystem } from '../../lib/design-system';
import { useCompanyDNAStore, CompanyDNA } from '../../lib/store/useCompanyDNAStore';
import { CheckCircle2, ShieldAlert, Save, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { fetchCompanyDNA } from '../../lib/dashboardService';
import { db } from '../../lib/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { companyDnaCollection } from '../../lib/dashboardCollections';
import { CompanyDNAProfile } from '../../lib/dashboardTypes';

export const CompanyDNAEditor: React.FC = () => {
  const { colors, typography, spacing, radii, shadows } = designSystem;
  const { dna, updateDNA, getStrengthPercentage, loadDNA } = useCompanyDNAStore();
  const user = useAppStore(state => state.user);
  
  const [profile, setProfile] = useState<CompanyDNAProfile | null>(null);
  const [name, setName] = useState("");
  const [sector, setSector] = useState<string>("general");
  const [stage, setStage] = useState<string>("pre_seed");
  const [geo, setGeo] = useState("");
  const [arr, setArr] = useState<string>("");
  const [growthRate, setGrowthRate] = useState<string>("");
  const [customers, setCustomers] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  function computeProfileCompleteness() {
    const required: { key: string; label: string; filled: boolean }[] = [
      { key: "name", label: "Company name", filled: !!name.trim() },
      { key: "sector", label: "Sector", filled: !!sector },
      { key: "stage", label: "Stage", filled: !!stage },
      { key: "geo", label: "Geography", filled: !!geo.trim() },
    ];

    const optional: { key: string; filled: boolean }[] = [
      { key: "arr", filled: !!arr.trim() },
      { key: "growthRate", filled: !!growthRate.trim() },
      { key: "customers", filled: !!customers.trim() },
    ];

    const requiredFilled = required.filter((f) => f.filled).length;
    const requiredTotal = required.length;
    const optionalFilled = optional.filter((f) => f.filled).length;
    const optionalTotal = optional.length;

    const requiredScore = requiredTotal === 0 ? 0 : (requiredFilled / requiredTotal) * 70;
    const optionalScore = optionalTotal === 0 ? 0 : (optionalFilled / optionalTotal) * 30;

    const completeness = Math.round(requiredScore + optionalScore);
    const missingRequired = required.filter((f) => !f.filled).map((f) => f.label);

    return {
      completeness,
      missingFields: missingRequired,
    };
  }

  const { completeness: strength, missingFields: missing } = computeProfileCompleteness();

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;

    const load = async () => {
      setLoadError(null);
      try {
        const existing = await fetchCompanyDNA(user.uid);
        if (!cancelled && existing) {
          setProfile(existing);
          setName(existing.name ?? "");
          setSector(existing.sector ?? "general");
          setStage(existing.stage ?? "pre_seed");
          setGeo(existing.geo ?? "");
          setArr((existing as any).arr ?? (existing as any).metrics?.mrr ?? "");
          setGrowthRate((existing as any).growthRate ?? (existing as any).metrics?.growthRate ?? "");
          setCustomers((existing as any).customers ?? (existing as any).metrics?.users ?? "");
        }
      } catch (err) {
        console.error("Failed to load Company DNA profile", err);
        if (!cancelled) {
          setLoadError("We could not load your existing Company DNA profile.");
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const { completeness, missingFields } = computeProfileCompleteness();
      const now = Timestamp.now();

      const id = profile?.id ?? user.uid;
      const docRef = doc(companyDnaCollection, id);

      const payload: any = {
        id,
        owner_uid: user.uid,
        name: name.trim() || "Untitled Company",
        sector,
        stage,
        geo: geo.trim(),
        profile_completeness: completeness,
        missing_fields: missingFields,
        updated_at: now,
        arr: arr.trim() || undefined,
        growthRate: growthRate.trim() || undefined,
        customers: customers.trim() || undefined,
        full_dna: dna
      };

      await setDoc(docRef, payload, { merge: true });
      setProfile(payload);
      setSaveSuccess("Company DNA saved.");
    } catch (err) {
      console.error("Failed to save Company DNA", err);
      setSaveError("We could not save your Company DNA. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      
      <form onSubmit={handleSave}>
      {loadError && (
        <div className="mb-6 p-4 rounded-xl bg-crimson-alert/10 border border-crimson-alert/20 text-crimson-alert text-sm">
          {loadError}
        </div>
      )}
      {saveError && (
        <div className="mb-6 p-4 rounded-xl bg-crimson-alert/10 border border-crimson-alert/20 text-crimson-alert text-sm">
          {saveError}
        </div>
      )}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm">
          {saveSuccess}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h2.fontSize, color: colors.primary.obsidian, letterSpacing: typography.scale.h2.letterSpacing }}>
            Company DNA
          </h1>
          <p className="text-slate-500 mt-2 text-[15px] max-w-2xl">
            Tell IdealApp about your company once. Every document you create — deck, memo, financial model — is pre-populated with your context. The AI remembers everything.
          </p>
        </div>
        <button 
          type="submit"
          disabled={saving || !!loadError}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
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
             {missing.length === 0 ? <CheckCircle2 size={14} className="text-emerald-500"/> : <ShieldAlert size={14} className="text-amber-500"/>} 
             Core Profile ({missing.length === 0 ? 'Complete' : `Missing ${missing.length}`})
          </div>
          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
             {arr || growthRate || customers ? <CheckCircle2 size={14} className="text-emerald-500"/> : <ShieldAlert size={14} className="text-slate-300"/>} 
             Financial Metrics
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        
        <Section title="1. Company Identity">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" value={name} onChange={setName} />
            <Input label="Website" value={dna.identity.website} onChange={(v) => updateDNA('identity', { website: v })} />
            <Input label="One-word Tagline / Sector" value={sector} onChange={setSector} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Founding Year" value={dna.identity.foundingYear} onChange={(v) => updateDNA('identity', { foundingYear: v })} />
              <Input label="HQ Location" value={geo} onChange={setGeo} />
            </div>
          </div>
        </Section>

        <Section title="2. What You Do">
           <Input label="One-line Pitch (Used in investor outreach)" value={dna.whatYouDo.oneLinePitch} onChange={(v) => updateDNA('whatYouDo', { oneLinePitch: v })} />
           <TextArea label="Longer Description (The problem and your solution)" value={dna.whatYouDo.description} onChange={(v) => updateDNA('whatYouDo', { description: v })} />
        </Section>

        <Section title="3. Traction & Metrics">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <MetricInput label="MRR / ARR" value={arr} onChange={setArr} />
            <MetricInput label="Users / Customers" value={customers} onChange={setCustomers} />
            <MetricInput label="Growth Rate" value={growthRate} onChange={setGrowthRate} />
          </div>
          <Input label="Key Milestones (Comma separated)" value={dna.traction.milestones} onChange={(v) => updateDNA('traction', { milestones: v })} />
        </Section>

        <Section title="4. Fundraising">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Current Stage (e.g. Pre-seed, Seed)" value={stage} onChange={setStage} />
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
      </form>
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
