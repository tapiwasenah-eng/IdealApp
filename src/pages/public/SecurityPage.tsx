import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Shield, Lock, Eye, Server, Key, AlertTriangle } from 'lucide-react';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const measures = [
  { icon: Lock, title: 'Encryption in Transit', body: 'All data between your browser and our servers is encrypted using TLS 1.3. We enforce HTTPS across all endpoints.' },
  { icon: Server, title: 'Encryption at Rest', body: 'All document data and personal information stored in Firebase Firestore is encrypted at rest using AES-256.' },
  { icon: Key, title: 'Authentication', body: 'Powered by Firebase Authentication. Passwords are hashed using bcrypt. We support multi-factor authentication.' },
  { icon: Eye, title: 'Access Controls', body: 'Role-based access control (RBAC) ensures users can only access their own data. Admin access is restricted to verified email addresses.' },
  { icon: Shield, title: 'Firestore Security Rules', body: 'Our Firestore database is protected by granular security rules that enforce data ownership and subscription-based feature access at the database level.' },
  { icon: AlertTriangle, title: 'Vulnerability Reporting', body: 'Found a security issue? Please disclose it responsibly to security@idealapp.technology. We aim to respond within 48 hours.' },
];

const SecurityPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SEOHead
      title="Security — How We Protect Your Data | Ideal App"
      description="Learn about Ideal App's security measures, including encryption, access controls, and data protection standards. Your business data is our priority."
      keywords="Ideal App security, data protection startup, encryption business documents, secure pitch deck software, startup data security"
      canonicalUrl="https://idealapp.technology/security"
      structuredData={[organizationSchema, breadcrumbSchema('/security', 'Security')]}
    />
    <PublicNav />
    <main className="pt-16">
      <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-20 px-6 text-center">
        <Shield className="w-14 h-14 mx-auto mb-4 text-[#a370fc]" />
        <h1 className="text-5xl font-bold mb-4">Security at Ideal App</h1>
        <p className="text-xl text-[#e0e7ff] max-w-2xl mx-auto">
          We take the security of your business data seriously. Here's how we protect it.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {measures.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-[#352459] mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#e8eef8] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#352459] mb-4">Compliance</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold mt-0.5">✓</span> <span><strong>GDPR compliant</strong> — Our data processing practices comply with the UK General Data Protection Regulation.</span></li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold mt-0.5">✓</span> <span><strong>No AI training on your data</strong> — We do not use your documents to train AI models without explicit consent.</span></li>
            <li className="flex items-start gap-2"><span className="text-indigo-600 font-bold mt-0.5">✓</span> <span><strong>Right to erasure</strong> — You can request deletion of all your data at any time via data@idealapp.technology.</span></li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Security concerns or responsible disclosure:</p>
          <a href="mailto:security@idealapp.technology" className="text-indigo-600 font-semibold hover:underline">security@idealapp.technology</a>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default SecurityPage;
