import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Download, ExternalLink } from 'lucide-react';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const milestones = [
  { date: 'Q1 2026', title: 'Ideal App launches publicly', description: 'IdealApp Technology Ltd. launches Ideal App at idealapp.technology — an AI-powered business document platform supporting 180+ templates and a curated investor network of 2,500+ contacts.' },
  { date: 'Q4 2025', title: 'Beta programme with 200+ founders', description: 'Closed beta programme onboards 200 founders across the UK, US, and East Africa. Platform generates over 5,000 documents during the beta period.' },
  { date: 'Q3 2025', title: 'IdealApp Technology Ltd. incorporates Ideal App division', description: 'IdealApp Technology Ltd., registered in England and Wales, officially commences development of the Ideal App platform with a focus on AI document generation and investor connectivity.' },
];

const PressPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SEOHead
      title="Press & Media — News, Milestones & Media Kit | Ideal App"
      description="Official news, company milestones, and media resources for Ideal App. Download our media kit and stay updated on our latest announcements."
      keywords="Ideal App press, startup news, AI document platform media, Ideal App milestones, media kit startup"
      canonicalUrl="https://idealapp.technology/press"
      structuredData={[organizationSchema, breadcrumbSchema('/press', 'Press')]}
    />
    <PublicNav />
    <main className="pt-16">
      <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Press & Media</h1>
        <p className="text-xl text-[#e0e7ff] max-w-2xl mx-auto">
          News, milestones, and media resources for journalists and analysts covering Ideal App.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-[#352459] mb-8">Company Milestones</h2>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.title} className="flex gap-4">
                <div className="flex-shrink-0 w-24 pt-1">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{m.date}</span>
                </div>
                <div className="flex-1 pb-6 border-b border-gray-100">
                  <h3 className="font-bold text-[#352459] mb-1">{m.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#e8eef8] rounded-2xl p-6">
            <h3 className="font-bold text-[#352459] mb-3">Media Kit</h3>
            <p className="text-sm text-gray-600 mb-4">Download our brand assets, logos, product screenshots, and fact sheet.</p>
            <button className="flex items-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Download Media Kit
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-[#352459] mb-3">Press Contact</h3>
            <p className="text-sm text-gray-600 mb-1">For press inquiries, interview requests, and media coverage:</p>
            <a href="mailto:press@idealapp.technology" className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:underline">
              press@idealapp.technology <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-[#352459] mb-3">Company Facts</h3>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li><strong>Founded:</strong> 2025</li>
              <li><strong>Registered:</strong> England and Wales</li>
              <li><strong>Legal entity:</strong> IdealApp Technology Ltd.</li>
              <li><strong>Product:</strong> Ideal App</li>
              <li><strong>Website:</strong> idealapp.technology</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default PressPage;
