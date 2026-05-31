import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Users, Target, Globe, Award } from 'lucide-react';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="About Ideal App — IdealApp Technology Ltd, England & Wales"
        description="Ideal App is built by IdealApp Technology Ltd, registered in England and Wales. Our mission: give every founder access to world-class AI business document tools."
        keywords="about Ideal App, IdealApp Technology Ltd, UK AI startup tool, business document platform company, AI SaaS UK, startup tools company England"
        canonicalUrl="https://idealapp.technology/about"
        ogImage="https://idealapp.technology/og/about.png"
        structuredData={[organizationSchema, breadcrumbSchema('/about', 'About')]}
      />
      <PublicNav />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About Ideal App</h1>
            <p className="text-xl text-[#e0e7ff] leading-relaxed">
              We're on a mission to democratise professional business communication. 
              Founded by entrepreneurs, for entrepreneurs — Ideal App makes it possible 
              for any founder, operator, or team to produce investor-grade documents in minutes, not weeks.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-6 bg-[#e8eef8]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#352459] mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Every great business deserves a great pitch. But building pitch decks, business plans, 
                and financial models from scratch takes valuable time that founders should spend on 
                building their companies.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Ideal App combines AI-powered document generation with professional design templates 
                and an investor network of 2,500+ active investors — giving you everything you need 
                to fundraise, plan, and grow.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: '2,500+', sub: 'Active Investors' },
                { icon: Target, label: '180+', sub: 'Templates' },
                { icon: Globe, label: '40+', sub: 'Countries' },
                { icon: Award, label: '10k+', sub: 'Docs Created' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={sub} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <Icon className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-[#352459]">{label}</div>
                  <div className="text-sm text-gray-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#352459] mb-6 text-center">The Company</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-4 text-gray-600 leading-relaxed">
              <p>
                Ideal App is a product of <strong>IdealApp Technology Ltd.</strong>, a technology company incorporated in 
                England and Wales (Companies House). Our registered office is in the United Kingdom.
              </p>
              <p>
                We believe that the quality of a business document should not be determined by the size 
                of your team or budget. Whether you're a solo founder raising your first pre-seed round 
                or a growth-stage team preparing for Series B, Ideal App delivers the same professional 
                output in minutes.
              </p>
              <p>
                Our platform is built on a foundation of privacy and security. We are GDPR compliant, 
                and your data is never used to train AI models without your explicit consent.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6 bg-[#e8eef8]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#352459] mb-10 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Founder First', body: 'Every feature we build is designed with founders in mind. We think about your time, your stress, and your outcome.' },
                { title: 'Radical Transparency', body: "We're honest about what our AI can and can't do. We show you the logic, not just the output." },
                { title: 'Privacy by Design', body: 'Your business data is yours. We never sell it, share it, or use it to train models without consent.' },
              ].map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#352459] mb-2">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl font-bold text-[#352459] mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">Questions? Partnerships? Press inquiries?</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            Contact Us
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
