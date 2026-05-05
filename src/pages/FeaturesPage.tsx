// src/pages/FeaturesPage.tsx
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FEATURE_SECTIONS, BRAND_ASSETS } from '../lib/brandAssets';
import * as Icons from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, softwareApplicationSchema, breadcrumbSchema } from '../data/seo-schemas';

function FeatureSection({ feature, index }: { feature: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isReversed = index % 2 === 1;

  // Get the icon component dynamically
  const IconComponent = (Icons as any)[feature.iconName] || Icons.HelpCircle;

  return (
    <section
      ref={ref}
      id={feature.id}
      className="relative py-20 md:py-32 overflow-hidden bg-white"
    >
      {/* Subtle background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-40 pointer-events-none`} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
          {/* Text content */}
          <motion.div
            className={isReversed ? 'lg:col-start-2' : ''}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Icon + label */}
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                <img 
                  src={feature.icon} 
                  alt="" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="text-sm font-bold text-indigo-600 tracking-wider uppercase">
                {feature.title}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {feature.subtitle}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
              {feature.description}
            </p>

            {/* Bullet points */}
            <ul className="space-y-5">
              {feature.bullets.map((bullet: string, i: number) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                >
                  <div className="mt-1.5 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Icons.Check className="w-3 h-3 text-indigo-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{bullet}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Feature illustration */}
          <motion.div
            className={`relative ${isReversed ? 'lg:col-start-1' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="relative rounded-3xl overflow-hidden">
              {feature.video ? (
                <video
                  src={feature.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="relative w-full aspect-[4/3] object-cover"
                />
              ) : (
                <img
                  src={feature.featureImage}
                  alt={feature.title}
                  className="relative w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <PageWrapper>
      <SEOHead
        title="Features — AI Document Generation, Canvas Editor & 54 Templates"
        description="Explore Ideal App's AI document generation, drag-and-drop canvas editor, 54 professional templates, real-time collaboration, and integrated investor database."
        keywords="AI document generation, drag and drop pitch deck editor, pitch deck templates, business plan software features, AI presentation tool, startup document platform, financial model templates, data room software"
        canonicalUrl="https://idealapp.technology/features"
        ogImage="https://idealapp.technology/og/features.png"
        structuredData={[organizationSchema, softwareApplicationSchema, breadcrumbSchema('/features', 'Features')]}
      />
      <div className="bg-white">
        {/* Page header */}
        <section className="relative pt-24 pb-20 text-center overflow-hidden border-b border-gray-50">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.05),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.05),transparent_50%)]" />

          <motion.div
            className="relative max-w-4xl mx-auto px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
              <Icons.Zap className="w-4 h-4 text-indigo-600" />
              <span className="text-xs text-indigo-700 font-bold uppercase tracking-widest">Platform Features</span>
            </div>

            <h1 className="text-3xl md:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">
              Everything you need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-600">
                succeed
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From AI-powered document generation to enterprise-grade security,
              Ideal App gives you the complete toolkit to create professional
              venture documents in minutes.
            </p>
          </motion.div>
        </section>

        {/* Feature sections — alternating layout */}
        <div className="divide-y divide-gray-50">
          {FEATURE_SECTIONS.map((feature, index) => (
            <FeatureSection key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <section className="relative py-32 text-center bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03),transparent_70%)]" />
          
          <div className="relative max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Ready to create something amazing?
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
              Join thousands of entrepreneurs and teams who use Ideal App to create
              professional documents faster than ever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/auth"
                className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
              >
                Start Free Trial
                <Icons.ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="/pricing"
                className="px-10 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-2xl border border-gray-200 transition-all shadow-sm"
              >
                View Pricing
              </motion.a>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
