import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Zap, Bug, Plus, Sparkles } from 'lucide-react';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const changelog = [
  {
    version: '2.0.0',
    date: 'April 1, 2026',
    label: 'major',
    items: [
      { type: 'new', text: 'Rebranded to "Ideal App"' },
      { type: 'new', text: '180+ professional templates across 50+ categories' },
      { type: 'new', text: 'Investor database with 2,500+ verified investors (Enterprise)' },
      { type: 'new', text: 'Data Room with shareable links, expiry dates, and view analytics' },
      { type: 'new', text: 'Public pages: About, Blog, Press, Contact, Privacy, Terms, Security' },
      { type: 'improved', text: 'Complete mobile responsive overhaul — no horizontal scroll' },
      { type: 'improved', text: 'Hero card shimmer hover now shows white card with drop shadow' },
      { type: 'improved', text: 'AI prompt bar redesigned for all screen sizes' },
    ],
  },
  {
    version: '1.5.0',
    date: 'February 15, 2026',
    label: 'feature',
    items: [
      { type: 'new', text: 'Dashboard workspaces — group projects by team or initiative' },
      { type: 'new', text: 'Fabric.js v6 canvas editor with undo/redo and layer management' },
      { type: 'new', text: 'AI assistant inside the editor — generate sections with Gemini' },
      { type: 'improved', text: 'Faster document generation — average 2.3s per document' },
      { type: 'fixed', text: 'Fixed PDF export quality on Retina displays' },
    ],
  },
  {
    version: '1.0.0',
    date: 'January 1, 2026',
    label: 'major',
    items: [
      { type: 'new', text: 'Initial public beta launch' },
      { type: 'new', text: 'Firebase Auth — email/password login and signup' },
      { type: 'new', text: '11 starter templates (pitch decks, business plans, financial models)' },
      { type: 'new', text: 'PayPal subscription billing (Free, Pro, Enterprise)' },
      { type: 'new', text: 'Responsive public website with full pricing page' },
    ],
  },
];

const typeConfig = {
  new: { icon: Plus, color: 'text-green-600 bg-green-50', label: 'New' },
  improved: { icon: Zap, color: 'text-blue-600 bg-blue-50', label: 'Improved' },
  fixed: { icon: Bug, color: 'text-orange-600 bg-orange-50', label: 'Fixed' },
};

const labelConfig = {
  major: 'bg-indigo-600 text-white',
  feature: 'bg-blue-600 text-white',
  fix: 'bg-orange-500 text-white',
};

const ChangelogPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SEOHead
      title="Changelog — Product Updates & New Features | Ideal App"
      description="Stay up to date with the latest Ideal App features, improvements, and bug fixes. We ship updates regularly to improve your document creation experience."
      keywords="Ideal App changelog, product updates, new features, AI document platform updates"
      canonicalUrl="https://idealapp.technology/changelog"
      structuredData={[organizationSchema, breadcrumbSchema('/changelog', 'Changelog')]}
    />
    <PublicNav />
    <main className="pt-16">
      <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-20 px-6 text-center">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#a370fc]" />
        <h1 className="text-5xl font-bold mb-4">Changelog</h1>
        <p className="text-xl text-[#e0e7ff]">Every update, improvement, and fix — documented.</p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {changelog.map((release) => (
          <div key={release.version}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-[#352459]">v{release.version}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${labelConfig[release.label as keyof typeof labelConfig]}`}>
                {release.label}
              </span>
              <span className="text-sm text-gray-400 ml-auto">{release.date}</span>
            </div>
            <div className="space-y-2">
              {release.items.map((item, i) => {
                const { icon: Icon, color, label } = typeConfig[item.type as keyof typeof typeConfig];
                return (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${color}`}>
                      <Icon className="w-3 h-3" />{label}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
    <Footer />
  </div>
);

export default ChangelogPage;
