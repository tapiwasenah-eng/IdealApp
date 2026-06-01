import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TEMPLATES } from '../data/templates';
import { useAuthStore } from '../store/authStore';
import { useDocumentStore } from '../lib/store/useDocumentStore';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../data/seo-schemas';
import { ArrowLeft, Star, FileText, CheckCircle2, Crown } from 'lucide-react';
import { designSystem } from '../lib/design-system';
import toast from 'react-hot-toast';

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile: userProfile } = useAuthStore();
  const { createDocumentFromTemplate } = useDocumentStore();
  
  const template = TEMPLATES.find(t => t.id === id);
  const isAnonymous = !user;
  const isPaidOrAdmin = userProfile?.plan === 'pro' || userProfile?.plan === 'studio' || userProfile?.role === 'admin';
  const isLocked = template?.isPremium && !isPaidOrAdmin;

  if (!template) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template not found</h1>
            <button onClick={() => navigate('/templates')} className="text-indigo-600 hover:underline">
              Back to templates
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const handleUse = async () => {
    if (isAnonymous) {
      navigate('/auth?mode=signup&redirect=templates');
      return;
    }
    if (isLocked) {
      navigate('/pricing');
      return;
    }
    try {
      toast.loading("Generating workspace...", { id: "gen-doc" });
      const newDocId = await createDocumentFromTemplate(template.id, template);
      toast.success("Workspace ready!", { id: "gen-doc", duration: 2000 });
      navigate(`/documents/${newDocId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create document", { id: "gen-doc" });
    }
  };

  return (
    <PageWrapper>
      {/* TODO: In the future, fetch `template` from CMS/DB (e.g. Strapi, Contentful) to populate this data. */}
      {/* TODO: Hydrate SEOHead props using real metadata provided by the CMS instead of static mappings. */}
      <SEOHead
        title={`${template.name} Template | IdealApp`}
        description={template.description}
        keywords={`${template.category} template, ${template.industry} template`}
      />
      
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          
          <Link to="/templates" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Hero & Sections */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {template.category}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                    {template.industry}
                  </span>
                  {template.isPremium && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
                      <Crown className="w-3 h-3" /> Pro
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                  {template.name}
                </h1>
                
                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
                  {template.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(template.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    ))}
                    <span className="ml-2 font-bold text-slate-700">{template.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <FileText className="w-5 h-5" />
                    {template.pageCount || (template.sections?.length || 0)} Sections
                  </div>
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">What's included in this template</h2>
                <div className="space-y-4">
                  {template.sections && template.sections.map((section: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 relative overflow-hidden group">
                      {idx > 2 && (
                        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                             <Crown className="w-3 h-3 text-amber-400" /> Start using to view full section
                           </span>
                        </div>
                      )}
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{section.heading}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {section.body ? section.body.substring(0, 100) + '...' : section.type + ' section format.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQ Section */}
              <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6 text-slate-600">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Can I customize the branding?</h4>
                    <p className="text-sm">Yes, you can apply your company's DNA (colors, typography, logo) to this and any other template automatically.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Can the AI write the content for me?</h4>
                    <p className="text-sm">Absolutely. Once you start using the template, our integrated AI can generate content based on your company DNA for each section.</p>
                  </div>
                  {/* TODO: Add more FAQs dynamically via CMS integration */}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r" style={{ background: designSystem.gradients.investorGlow }}></div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Start writing</h3>
                <p className="text-sm text-slate-500 mb-8">
                  Create a new document based on this template, complete with placeholder content and AI writing assistance.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Customizable sections
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    AI Auto-completion
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    PDF Export
                  </div>
                </div>
                
                <button
                  onClick={handleUse}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isAnonymous ? 'Sign Up to Use' : isLocked ? 'Upgrade to Pro' : 'Generate This Template Free'}
                </button>
                <p className="mt-4 text-xs text-center text-slate-400">
                  Requires a free account to save progress.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
