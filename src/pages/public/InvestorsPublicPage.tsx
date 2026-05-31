import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Lock, Users, Globe, TrendingUp, Building2 } from 'lucide-react';
import { useAppStore } from '@/src/lib/store';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const stats = [
  { icon: Users, value: '2,465', label: 'Verified Investors' },
  { icon: Globe, value: '40+', label: 'Countries Covered' },
  { icon: Building2, value: '800+', label: 'VC & PE Firms' },
  { icon: TrendingUp, value: '$2.4B+', label: 'Combined AUM Represented' },
];

const InvestorsPublicPage: React.FC = () => {
  const { userProfile } = useAppStore();
  const isEnterprise = userProfile?.subscription === 'enterprise';

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Investor Database — Connect with 2,500+ VCs & Angels"
        description="Access Ideal App's verified investor database. Find VCs, angel investors, and family offices across 40+ countries. Filter by stage, sector, and location."
        keywords="investor database, VC list, angel investor directory, startup fundraising database, venture capital database, find investors for startup"
        canonicalUrl="https://idealapp.technology/investors"
        ogImage="https://idealapp.technology/og/investors.png"
        structuredData={[organizationSchema, breadcrumbSchema('/investors', 'Investors')]}
      />
      <PublicNav />
      <main className="pt-16">
        <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Investor Network</h1>
            <p className="text-xl text-[#e0e7ff] max-w-2xl mx-auto">
              Access our curated database of 2,465 active investors — VCs, angels, family offices, and PE firms 
              across 40+ countries. Available exclusively on the Enterprise plan.
            </p>
          </div>
        </section>

        <section className="bg-[#e8eef8] py-12 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white rounded-2xl p-5 text-center shadow-sm">
                <Icon className="w-7 h-7 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#352459]">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          {isEnterprise ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">You have Enterprise access. View the full investor database from your dashboard.</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
              >
                Open Investor Database
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm max-w-2xl mx-auto">
              <Lock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#352459] mb-3">Enterprise Feature</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                The full investor database — including names, contact details, LinkedIn profiles, 
                investment thesis, and sector focus — is available exclusively on the 
                <strong> Enterprise plan</strong>. Upgrade to unlock instant access.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/pricing"
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Upgrade to Enterprise
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-8 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-100 font-semibold rounded-xl transition-colors"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-[#352459] mb-6 text-center">What You Get</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'VC & Angel Investors', body: 'Access 2,000+ VC partners and angel investors with full contact details, LinkedIn profiles, investment stage, and sector focus.' },
              { title: 'Family Offices', body: '208 verified family offices with investment thesis, preferred sectors, and direct contact information.' },
              { title: 'Smart Filtering', body: 'Filter by investment stage (pre-seed to Series C+), geography, sector, and ticket size to find your ideal investor match.' },
            ].map((f) => (
              <div key={f.title} className="bg-[#e8eef8] rounded-2xl p-6">
                <h3 className="font-bold text-[#352459] mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InvestorsPublicPage;
