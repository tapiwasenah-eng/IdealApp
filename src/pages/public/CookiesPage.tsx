import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const CookiesPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SEOHead
      title="Cookie Policy — Ideal App"
      description="Learn how Ideal App uses cookies to improve your experience on our platform."
      canonicalUrl="https://idealapp.technology/cookies"
      noIndex={true}
    />
    <PublicNav />
    <main className="pt-16">
      <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-[#e0e7ff]">Last updated: 1 April 2026</p>
        </div>
      </section>
      <article className="max-w-3xl mx-auto px-6 py-16 space-y-8 text-gray-600 leading-relaxed">
        <div>
          <h2 className="text-xl font-bold text-[#352459] mb-3">What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work efficiently and to provide information to website operators.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#352459] mb-3">Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#e8eef8]">
                  <th className="text-left px-4 py-2 text-[#352459] font-semibold">Cookie</th>
                  <th className="text-left px-4 py-2 text-[#352459] font-semibold">Type</th>
                  <th className="text-left px-4 py-2 text-[#352459] font-semibold">Purpose</th>
                  <th className="text-left px-4 py-2 text-[#352459] font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { name: 'firebase-auth', type: 'Essential', purpose: 'Keeps you logged in', duration: 'Session' },
                  { name: '__session', type: 'Essential', purpose: 'Session management', duration: 'Session' },
                  { name: 'ia_theme', type: 'Functional', purpose: 'Remembers your UI preferences', duration: '1 year' },
                  { name: '_ga', type: 'Analytics', purpose: 'Google Analytics — usage statistics (with consent)', duration: '2 years' },
                  { name: '_fbp', type: 'Marketing', purpose: 'Facebook Pixel (with consent)', duration: '90 days' },
                ].map((c) => (
                  <tr key={c.name} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-xs">{c.name}</td>
                    <td className="px-4 py-2">{c.type}</td>
                    <td className="px-4 py-2">{c.purpose}</td>
                    <td className="px-4 py-2">{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#352459] mb-3">Managing Cookies</h2>
          <p>You can control and/or delete cookies as you wish — see <a href="https://www.aboutcookies.org" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">aboutcookies.org</a> for details. Removing essential cookies may affect the functionality of the Service.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#352459] mb-3">Contact</h2>
          <p>Questions about our use of cookies: <a href="mailto:data@idealapp.technology" className="text-indigo-600 hover:underline">data@idealapp.technology</a>.</p>
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default CookiesPage;
