import React from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-[#352459] mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SEOHead
      title="Privacy Policy — Ideal App"
      description="Read Ideal App's privacy policy to understand how we collect, use, and protect your personal data."
      canonicalUrl="https://idealapp.technology/privacy"
      noIndex={true}
    />
    <PublicNav />
    <main className="pt-16">
      <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-[#e0e7ff]">Last updated: 1 April 2026</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <Section title="1. Who We Are">
          <p>Ideal App is a product of <strong>IdealApp Technology Ltd.</strong>, a company registered in England and Wales. Our registered office is in the United Kingdom. References to "we", "us", or "our" in this policy refer to IdealApp Technology Ltd.</p>
          <p>Our platform is accessible at <strong>https://idealapp.technology</strong>. For any privacy-related enquiries, please contact us at <a href="mailto:data@idealapp.technology" className="text-indigo-600 hover:underline">data@idealapp.technology</a>.</p>
        </Section>

        <Section title="2. What Data We Collect">
          <p>We collect and process the following categories of personal data:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Account data:</strong> Name, email address, password (hashed), profile picture.</li>
            <li><strong>Usage data:</strong> Pages visited, features used, documents created, timestamps.</li>
            <li><strong>Content data:</strong> Documents, templates, and files you create or upload.</li>
            <li><strong>Payment data:</strong> Billing information processed via PayPal (we do not store card details).</li>
            <li><strong>Communications:</strong> Messages you send us via email or contact forms.</li>
            <li><strong>Technical data:</strong> IP address, browser type, device information, cookies.</li>
          </ul>
        </Section>

        <Section title="3. Legal Basis for Processing (GDPR)">
          <p>We process your personal data under the following legal bases:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Contract performance:</strong> Processing necessary to provide the Ideal App service you've signed up for.</li>
            <li><strong>Legitimate interests:</strong> Improving our product, preventing fraud, and ensuring platform security.</li>
            <li><strong>Legal obligation:</strong> Compliance with applicable laws in England and Wales.</li>
            <li><strong>Consent:</strong> Marketing communications — you may withdraw consent at any time.</li>
          </ul>
        </Section>

        <Section title="4. How We Use Your Data">
          <p>We use your personal data to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide and maintain the Ideal App platform.</li>
            <li>Process your documents and generate AI-powered content.</li>
            <li>Send transactional emails (account notifications, billing receipts).</li>
            <li>Respond to support requests.</li>
            <li>Improve our products and services.</li>
            <li>Comply with legal obligations.</li>
          </ul>
          <p>We <strong>never</strong> use your document content to train AI models without your explicit consent.</p>
        </Section>

        <Section title="5. Data Sharing">
          <p>We do not sell your personal data. We may share data with:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Firebase (Google):</strong> Authentication and database infrastructure.</li>
            <li><strong>PayPal:</strong> Payment processing.</li>
            <li><strong>Google AI (Gemini):</strong> AI document generation — subject to Google's API terms.</li>
            <li><strong>Anthropic (Claude):</strong> Optional AI generation — subject to Anthropic's API terms.</li>
            <li><strong>Cloudinary:</strong> Media asset hosting.</li>
          </ul>
          <p>All third-party processors are bound by appropriate data processing agreements.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your personal data for as long as your account is active. If you delete your account, we will delete or anonymise your data within 30 days, except where we are required to retain it by law (e.g., financial records for 7 years under UK law).</p>
        </Section>

        <Section title="7. Your Rights (GDPR)">
          <p>As a data subject in the UK or EU, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Access:</strong> Request a copy of your personal data.</li>
            <li><strong>Rectification:</strong> Correct inaccurate data.</li>
            <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten").</li>
            <li><strong>Restriction:</strong> Limit how we use your data.</li>
            <li><strong>Portability:</strong> Receive your data in a machine-readable format.</li>
            <li><strong>Object:</strong> Object to processing based on legitimate interests.</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:data@idealapp.technology" className="text-indigo-600 hover:underline">data@idealapp.technology</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="8. Cookies">
          <p>We use essential cookies to keep you logged in and to remember your preferences. We also use analytics cookies (with your consent) to understand how people use our platform. For full details, see our <a href="/cookies" className="text-indigo-600 hover:underline">Cookie Policy</a>.</p>
        </Section>

        <Section title="9. Security">
          <p>We take reasonable technical and organisational measures to protect your personal data, including encryption in transit (HTTPS/TLS), encryption at rest in Firestore, and role-based access controls. For full details, see our <a href="/security" className="text-indigo-600 hover:underline">Security page</a>.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>We may update this policy from time to time. We will notify you by email or in-app notification of any material changes. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="11. Contact">
          <p>For privacy enquiries: <a href="mailto:data@idealapp.technology" className="text-indigo-600 hover:underline">data@idealapp.technology</a></p>
          <p>Postal address: IdealApp Technology Ltd., England and Wales, United Kingdom.</p>
          <p>You also have the right to lodge a complaint with the UK Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">ico.org.uk</a>.</p>
        </Section>
      </article>
    </main>
    <Footer />
  </div>
);

export default PrivacyPage;
