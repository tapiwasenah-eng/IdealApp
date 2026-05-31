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

const TermsPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SEOHead
      title="Terms of Service — Ideal App"
      description="Read Ideal App's terms of service. Understand your rights and responsibilities when using our AI document platform."
      canonicalUrl="https://idealapp.technology/terms"
      noIndex={true}
    />
    <PublicNav />
    <main className="pt-16">
      <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-[#e0e7ff]">Last updated: 1 April 2026. Governing law: England and Wales.</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <Section title="1. Acceptance of Terms">
          <p>By accessing or using Ideal App ("the Service") at idealapp.technology, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
          <p>These Terms constitute a legally binding agreement between you and <strong>IdealApp Technology Ltd.</strong>, a company incorporated in England and Wales.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>Ideal App is an AI-powered business document creation platform. It provides tools for creating, editing, and sharing professional business documents including pitch decks, business plans, financial models, and other document types.</p>
        </Section>

        <Section title="3. Account Registration">
          <p>You must register an account to access most features of the Service. You agree to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide accurate and current information during registration.</li>
            <li>Keep your password secure and not share it with third parties.</li>
            <li>Notify us immediately of any unauthorised use of your account.</li>
            <li>Be responsible for all activity that occurs under your account.</li>
          </ul>
        </Section>

        <Section title="4. Subscription and Payment">
          <p>Certain features require a paid subscription. Subscriptions are available on monthly or annual billing cycles. All payments are processed via PayPal and are subject to PayPal's terms.</p>
          <p>Subscriptions automatically renew unless cancelled before the renewal date. Refunds are provided at our discretion — to request a refund, contact support@idealapp.technology within 7 days of billing.</p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You must not use the Service to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Create content that is fraudulent, misleading, or defamatory.</li>
            <li>Violate any applicable law or regulation.</li>
            <li>Infringe upon any intellectual property rights.</li>
            <li>Attempt to reverse-engineer, hack, or disrupt the Service.</li>
            <li>Use automated tools to harvest data without our written consent.</li>
          </ul>
        </Section>

        <Section title="6. Intellectual Property">
          <p><strong>Your content:</strong> You retain ownership of all documents and content you create using Ideal App. By using the Service, you grant IdealApp Technology Ltd. a limited licence to host and display your content solely for the purpose of providing the Service.</p>
          <p><strong>Our content:</strong> The Ideal App platform, templates, and software are proprietary to IdealApp Technology Ltd. and protected by copyright. You may not copy, distribute, or create derivative works without our written permission.</p>
        </Section>

        <Section title="7. AI-Generated Content Disclaimer">
          <p>Ideal App uses AI to generate document content. AI-generated content may contain errors, inaccuracies, or outdated information. You are solely responsible for reviewing and verifying all AI-generated content before use. IdealApp Technology Ltd. does not warrant the accuracy, completeness, or fitness for purpose of any AI-generated output.</p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>To the maximum extent permitted by law, IdealApp Technology Ltd. shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability to you shall not exceed the amount paid by you to IdealApp Technology Ltd. in the twelve months preceding the claim.</p>
        </Section>

        <Section title="9. Termination">
          <p>We may suspend or terminate your account at our discretion for breach of these Terms. You may delete your account at any time from your Settings page.</p>
        </Section>

        <Section title="10. Governing Law">
          <p>These Terms shall be governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </Section>

        <Section title="11. Changes">
          <p>We reserve the right to update these Terms at any time. We will provide at least 14 days' notice of material changes. Continued use of the Service after changes constitutes acceptance.</p>
        </Section>

        <Section title="12. Contact">
          <p>For any questions about these Terms: <a href="mailto:legal@idealapp.technology" className="text-indigo-600 hover:underline">legal@idealapp.technology</a> or <a href="mailto:hello@idealapp.technology" className="text-indigo-600 hover:underline">hello@idealapp.technology</a>.</p>
        </Section>
      </article>
    </main>
    <Footer />
  </div>
);

export default TermsPage;
