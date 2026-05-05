import React, { useState } from 'react';
import { PublicNav } from '../../components/layout/PublicNav';
import { Footer } from '../../components/layout/Footer';
import { Mail, MapPin, MessageSquare, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import SEOHead from '../../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../../data/seo-schemas';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In production, wire this to an email service or Firestore collection
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Contact Us — Support & Sales | Ideal App"
        description="Have questions about Ideal App? Contact our support or sales team for assistance with pitch decks, business plans, or enterprise solutions."
        keywords="contact Ideal App, Ideal App support, startup document help, sales Ideal App, customer service Ideal App"
        canonicalUrl="https://idealapp.technology/contact"
        structuredData={[organizationSchema, breadcrumbSchema('/contact', 'Contact')]}
      />
      <PublicNav />
      <main className="pt-16">
        <section className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-20 px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-[#e0e7ff]">We're here to help. Expect a response within 24 hours.</p>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-6">
            {[
              { icon: Mail, title: 'General Enquiries', value: 'hello@idealapp.technology' },
              { icon: MessageSquare, title: 'Support', value: 'support@idealapp.technology' },
              { icon: MapPin, title: 'Registered Office', value: 'IdealApp Technology Ltd.\nEngland and Wales\nUnited Kingdom' },
              { icon: Clock, title: 'Response Time', value: 'Within 24 hours on business days' },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#352459]">{title}</div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-[#352459]">Send a Message</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
              <input
                type="text" required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
              <textarea
                required rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30 resize-none"
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit" disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
