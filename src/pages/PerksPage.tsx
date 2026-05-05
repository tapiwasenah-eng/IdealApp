import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DollarSign, Users, BarChart2, Sun, Zap, Gift,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../data/seo-schemas';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const PERKS = [
  {
    icon: DollarSign,
    iconBg: 'bg-blue-500',
    title: '50% Lifetime Discount',
    desc: 'Early supporters get 50% off all plans forever. Lock in founder pricing today.',
    extra: (
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[#10B981]">$39/mo</span>
        <span className="text-[#9CA3AF] line-through text-sm">$79/mo</span>
      </div>
    ),
  },
  {
    icon: Users,
    iconBg: 'bg-teal-500',
    title: 'Exclusive Community',
    desc: 'Join our private Slack community with 500+ founders sharing insights and opportunities.',
    extra: null,
  },
  {
    icon: BarChart2,
    iconBg: 'bg-purple-500',
    title: 'Monthly Masterclasses',
    desc: 'Learn from successful entrepreneurs in exclusive monthly sessions on fundraising, growth, and more.',
    extra: null,
  },
  {
    icon: Sun,
    iconBg: 'bg-orange-500',
    title: 'Priority Support',
    desc: 'Skip the queue with dedicated priority support. Get responses from our team within 2 hours, guaranteed.',
    extra: null,
  },
  {
    icon: Zap,
    iconBg: 'bg-green-500',
    title: 'Early Access',
    desc: 'Be the first to try new features before public release. Shape the product roadmap with direct feedback.',
    extra: null,
  },
  {
    icon: Gift,
    iconBg: 'bg-pink-500',
    title: 'Founder Badge',
    desc: 'Earn an exclusive Founder badge on your profile, unlocking special perks and recognition in the community.',
    extra: null,
  },
];

export default function PerksPage({ hideWrapper = false }: { hideWrapper?: boolean }) {
  const content = (
    <>
      <SEOHead
        title="Platform Perks — AI Chat Consultant, Unlimited Exports & More"
        description="Discover Ideal App's platform perks: AI chat consultant, unlimited document exports, real-time collaboration, investor database access, integrated data rooms, and priority support."
        keywords="AI chat consultant startup, AI document platform benefits, pitch deck software perks, unlimited document exports, investor database access, data room integration, collaborative pitch deck tool"
        canonicalUrl="https://idealapp.technology/perks"
        ogImage="https://idealapp.technology/og/perks.png"
        structuredData={[organizationSchema, breadcrumbSchema('/perks', 'Perks')]}
      />
      {/* Animated dots keyframes */}
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        .dot-1 { animation: dot-bounce 1.4s infinite 0s; }
        .dot-2 { animation: dot-bounce 1.4s infinite 0.2s; }
        .dot-3 { animation: dot-bounce 1.4s infinite 0.4s; }
      `}</style>

        {/* Hero */}
        <section className="py-20 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-left">
              <h1 className="text-3xl md:text-5xl font-black text-[#111827] mb-4">
                Founder perks & benefits
              </h1>
              <p className="text-[#6B7280] text-base md:text-lg max-w-lg">
                Join our community of entrepreneurs and get exclusive access to resources, events,
                and networking opportunities.
              </p>
              <div className="mt-6 flex items-center gap-1.5">
                <span className="text-[#6B7280] font-medium">Coming soon</span>
                <span className="dot-1 text-[#3B82F6] text-xl font-black">.</span>
                <span className="dot-2 text-[#3B82F6] text-xl font-black">.</span>
                <span className="dot-3 text-[#3B82F6] text-xl font-black">.</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden"
            >
              <video
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Perk Cards */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PERKS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.08}
                  variants={fadeUp}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 ${p.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <p.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#111827] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{p.desc}</p>
                  {p.extra}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="max-w-xl mx-auto px-6 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                Join Ideal App Today
              </h2>
              <p className="text-blue-100 mb-8">
                Secure your founder pricing before it's gone.
              </p>
              <Link
                to="/auth?mode=signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </section>
    </>
  );

  if (hideWrapper) {
    return <div className="flex-1 overflow-y-auto bg-white">{content}</div>;
  }

  return <PageWrapper>{content}</PageWrapper>;
}
