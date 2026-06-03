import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Copy, Star, Crown, ExternalLink } from 'lucide-react';

const COMMUNITY_TEMPLATES = [
  {
    id: 'startup-pitch',
    title: 'Startup Pitch Deck (Seed)',
    category: 'Startups',
    author: 'Vault.Africa',
    isPro: false,
    rating: 4.9,
    uses: 1240,
    coverColor: 'from-blue-500 to-indigo-600',
    type: 'pitch-deck'
  },
  {
    id: 'saas-financial',
    title: 'SaaS Financial Model v3',
    category: 'Finance',
    author: 'FinTech Labs',
    isPro: true,
    rating: 5.0,
    uses: 890,
    coverColor: 'from-emerald-400 to-teal-500',
    type: 'financial-model'
  },
  {
    id: 'marketing-roadmap',
    title: '2024 Marketing Roadmap',
    category: 'Marketing',
    author: 'GrowthHackers',
    isPro: false,
    rating: 4.7,
    uses: 3200,
    coverColor: 'from-orange-400 to-pink-500',
    type: 'strategy'
  },
  {
    id: 'b2b-sales-deck',
    title: 'B2B Enterprise Sales Deck',
    category: 'Sales',
    author: 'SalesOpsHQ',
    isPro: true,
    rating: 4.8,
    uses: 650,
    coverColor: 'from-purple-500 to-fuchsia-600',
    type: 'pitch-deck'
  },
  {
    id: 'product-req',
    title: 'Product Requirements Doc',
    category: 'Product',
    author: 'PM Network',
    isPro: false,
    rating: 4.9,
    uses: 2100,
    coverColor: 'from-sky-400 to-blue-500',
    type: 'document'
  },
  {
    id: 'investor-update',
    title: 'Monthly Investor Update',
    category: 'Startups',
    author: 'IdealApp Team',
    isPro: false,
    rating: 5.0,
    uses: 4500,
    coverColor: 'from-slate-700 to-slate-900',
    type: 'document'
  }
];

export function TemplatesGallery() {
  const navigate = useNavigate();

  const handleRemix = (template: typeof COMMUNITY_TEMPLATES[0]) => {
    // In a real app, this would duplicate the template to user's workspace
    // Navigate to editor with this template predefined
    navigate('/app', { state: { prefill: { text: `Remixing ${template.title}...` }, templateId: template.id } });
  };

  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Community Templates</h2>
            <p className="text-slate-500 max-w-xl text-lg">
              Remix top performing documents crafted by the community. Free users can access community templates, Pro users unlock premium ones.
            </p>
          </div>
          <button onClick={() => navigate('/solutions')} className="mt-6 md:mt-0 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
            View all 180+ templates <ExternalLink size={16}/>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {COMMUNITY_TEMPLATES.map((tmpl, idx) => (
            <motion.div 
              key={tmpl.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default"
            >
              {/* Graphic Cover */}
              <div className={`h-40 bg-gradient-to-br ${tmpl.coverColor} p-6 relative overflow-hidden flex flex-col justify-between`}>
                <div className="flex justify-between items-start relative z-10">
                   <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wide">
                     {tmpl.category}
                   </div>
                   {tmpl.isPro && (
                     <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded tracking-wide text-[10px] font-black flex items-center gap-1 shadow-sm">
                       <Crown size={12}/> PRO
                     </div>
                   )}
                </div>
                <h3 className="text-white font-bold text-xl leading-tight relative z-10 w-4/5 pt-8">{tmpl.title}</h3>
                
                {/* Decorative shapes */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              </div>

              {/* Meta & Actions */}
              <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                     By <span className="text-slate-800">{tmpl.author}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
                     <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400"/> {tmpl.rating}</span>
                     <span>{tmpl.uses.toLocaleString()} copies</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleRemix(tmpl)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900"
                >
                  <Copy size={16} /> Remix Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
