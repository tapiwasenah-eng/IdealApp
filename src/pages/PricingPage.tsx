import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Check, ChevronDown, Sparkles, Layout, MousePointer2, Share2, Users, ShieldCheck, Zap } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, faqPricingSchema, breadcrumbSchema } from '../data/seo-schemas';
import { BRAND_ASSETS } from '../lib/brandAssets';
import { useAuthStore } from '../store/authStore';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const STARTER_FEATURES = [
  '3 documents / month',
  '5 templates',
  'Basic AI generation',
  'PDF export',
  'Community support',
  '1 workspace',
  'Email support',
];

const PRO_FEATURES = [
  { text: 'Unlimited documents', icon: BRAND_ASSETS.icons.canvasEditor },
  { text: '50+ templates', icon: BRAND_ASSETS.icons.templateLibrary },
  { text: 'Advanced AI generation', icon: BRAND_ASSETS.icons.aiGeneration },
  { text: 'PDF + DOCX export', icon: BRAND_ASSETS.icons.exportSharing },
  { text: 'Priority support' },
  { text: 'Custom branding' },
  { text: '5 team members', icon: BRAND_ASSETS.icons.teamCollaboration },
  { text: 'All workspaces' },
  { text: 'Analytics dashboard' },
  { text: 'API access' },
];

const ENTERPRISE_FEATURES = [
  { text: 'Everything in Pro' },
  { text: 'Unlimited team members', icon: BRAND_ASSETS.icons.teamCollaboration },
  { text: 'SSO & SAML', icon: BRAND_ASSETS.icons.securityPrivacy },
  { text: 'SLA guarantee' },
  { text: 'Dedicated support' },
  { text: 'White-label' },
  { text: 'Custom integrations' },
  { text: 'On-premise option' },
];

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period, and we won\'t charge you again after that.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 14-day money-back guarantee for Pro subscriptions. If you\'re not satisfied within the first 14 days, contact our support team and we\'ll issue a full refund — no questions asked.',
  },
  {
    q: 'What export formats are supported?',
    a: 'Pro and Enterprise plans support export to PDF, DOCX (Microsoft Word), and PNG. Starter plan supports PDF only. All plans support sharing via public link.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. We use AES-256 encryption for data at rest and TLS 1.3 in transit. We are SOC 2 Type II compliant and GDPR/CCPA ready. Your documents are never used to train AI models.',
  },
  {
    q: 'How does team collaboration work?',
    a: 'On Pro plans, you can invite up to 5 team members to your workspace. Team members can view, edit, and comment on documents in real time. Enterprise plans include unlimited members, role-based permissions, and SSO.',
  },
];

function FeatureItem({ text, isDark }: { text: string; isDark?: boolean }) {
  return (
    <li className="flex items-center gap-2.5">
      <div className={`w-5 h-5 rounded-full ${isDark ? 'bg-white/10' : 'bg-green-100'} flex items-center justify-center flex-shrink-0`}>
        <Check className={`w-3 h-3 ${isDark ? 'text-green-400' : 'text-green-600'}`} strokeWidth={3} />
      </div>
      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-[#374151]'}`}>{text}</span>
    </li>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
      >
        <span className="font-semibold text-[#111827] text-sm">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#6B7280] transition-transform duration-200 flex-shrink-0 ml-4 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <p className="text-sm text-[#6B7280] leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [annual, setAnnual] = useState(false);
  const [teamMembers, setTeamMembers] = useState(1);

  const baseProPrice = annual ? 31 : 39;
  const proPrice = baseProPrice * teamMembers;

  const handleStartTrial = async () => {
    const billingStr = annual ? 'annual' : 'monthly';
    const checkoutUrl = `/checkout?plan=pro&billing=${billingStr}&price=${proPrice}`;
    if (!user) {
      navigate(`/auth?mode=signup&redirect=${encodeURIComponent(checkoutUrl)}`);
      return;
    }
    navigate(checkoutUrl);
  };

  return (
    <PageWrapper>
      <SEOHead
        title="Pricing — Free, Pro ($12/mo) & Enterprise ($29/mo) Plans"
        description="Ideal App is free to start. Upgrade to Pro at $12/mo for unlimited documents, or Enterprise at $29/mo for full platform access including investor database and data rooms."
        keywords="AI pitch deck maker pricing, business plan software cost, free pitch deck tool, Gamma alternative cheaper, Beautiful.ai alternative, startup document software pricing, AI document creator free tier"
        canonicalUrl="https://idealapp.technology/pricing"
        ogImage="https://idealapp.technology/og/pricing.png"
        structuredData={[organizationSchema, faqPricingSchema, breadcrumbSchema('/pricing', 'Pricing')]}
      />
      {/* Hero */}
      <section className="py-20 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h1 className="text-3xl md:text-5xl font-black text-[#111827] mb-3">
                Simple, transparent pricing
              </h1>
              <p className="text-[#6B7280] text-lg md:text-xl">Start free. Scale as you grow.</p>
            </motion.div>

            {/* Toggle */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <span className={`text-sm font-medium ${!annual ? 'text-[#111827]' : 'text-[#6B7280]'}`}>
                Monthly
              </span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  annual ? 'bg-indigo-600' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    annual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${annual ? 'text-[#111827]' : 'text-[#6B7280]'}`}>
                Annual
              </span>
              {annual && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              )}
            </motion.div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Starter */}
              <motion.div
                initial="hidden"
                animate="visible"
                custom={0}
                variants={fadeUp}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-8"
              >
                <p className="font-bold text-[#111827] text-lg mb-1">Starter</p>
                <p className="text-[#6B7280] text-sm mb-6">Perfect for getting started</p>
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl md:text-5xl font-black text-[#111827]">$0</span>
                  <span className="text-[#6B7280] text-sm pb-2">/month</span>
                </div>
                <p className="text-xs text-indigo-600 font-medium mb-6 bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                  10 AI requests included. 3 requests as guest.
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full border-2 border-[#E5E7EB] text-[#111827] font-semibold py-3 rounded-xl hover:bg-[#F8FAFC] transition-all mb-8"
                >
                  Get Started Free
                </button>
                <ul className="space-y-3">
                  {STARTER_FEATURES.map((f) => (
                    <FeatureItem key={f} text={f} />
                  ))}
                </ul>
              </motion.div>

              {/* Pro (Most Popular) */}
              <motion.div
                initial="hidden"
                animate="visible"
                custom={1}
                variants={fadeUp}
                className="bg-white ring-2 ring-indigo-600 rounded-2xl p-8 relative"
              >
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-tr-2xl rounded-bl-xl">
                  Most Popular
                </div>
                <p className="font-bold text-[#111827] text-lg mb-1">Pro</p>
                <p className="text-[#6B7280] text-sm mb-6">For serious founders</p>
                
                {/* Team Member Selector */}
                <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-indigo-900">Team Members</span>
                    <span className="text-sm font-black text-indigo-600">{teamMembers}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-indigo-400 font-medium">1 member</span>
                    <span className="text-[10px] text-indigo-400 font-medium">Max 5</span>
                  </div>
                </div>

                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl md:text-5xl font-black text-indigo-600">${proPrice}</span>
                  <span className="text-[#6B7280] text-sm pb-2">/month</span>
                </div>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mb-4">
                  ${baseProPrice} per member / month
                </p>
                {annual && (
                  <p className="text-xs text-[#6B7280] mb-6">Billed ${proPrice * 12}/year</p>
                )}
                {!annual && <div className="mb-6" />}
                <button
                  onClick={handleStartTrial}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all mb-2"
                >
                  Start Pro Trial
                </button>
                <p className="text-center text-xs text-[#9CA3AF] mb-8">14-day free trial</p>
                <ul className="space-y-3">
                  {PRO_FEATURES.map((f) => (
                    <FeatureItem key={f.text} text={f.text} />
                  ))}
                </ul>
              </motion.div>

              {/* Enterprise */}
              <motion.div
                initial="hidden"
                animate="visible"
                custom={2}
                variants={fadeUp}
                className="bg-[#111827] text-white rounded-2xl p-8"
              >
                <p className="font-bold text-white text-lg mb-1">Enterprise</p>
                <p className="text-gray-400 text-sm mb-6">For large teams & orgs</p>
                <div className="flex items-end gap-1 mb-8">
                  <span className="text-4xl md:text-5xl font-black text-white">Custom</span>
                </div>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-white text-[#111827] font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all mb-8"
                >
                  Contact Sales
                </button>
                <ul className="space-y-3">
                  {ENTERPRISE_FEATURES.map((f) => (
                    <FeatureItem key={f.text} text={f.text} isDark />
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16 bg-white border-t border-[#E5E7EB]">
          <div className="max-w-3xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-10 text-center"
            >
              <h2 className="text-3xl font-black text-[#111827]">Frequently asked questions</h2>
              <p className="text-[#6B7280] mt-3">
                Everything you need to know about Ideal App pricing.
              </p>
            </motion.div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.05}
                  variants={fadeUp}
                >
                  <FAQItem q={faq.q} a={faq.a} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#F8FAFC] border-t border-[#E5E7EB]">
          <div className="max-w-xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-black text-[#111827] mb-3">
              Still have questions?
            </h2>
            <p className="text-[#6B7280] mb-6">
              Our team is happy to help you find the right plan for your business.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
            >
              Talk to Sales
            </button>
          </div>
        </section>
      </PageWrapper>
  );
}
