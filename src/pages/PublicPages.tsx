import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const PageTemplate: React.FC<{ title: string; subtitle: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 mb-20"
    >
      <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mx-auto">
        <Sparkles size={12} />
        Ideal App Platform
      </div>
      <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-text-primary">{title}</h1>
      <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">{subtitle}</p>
    </motion.div>
    {children}
  </div>
);

export const SolutionsPage: React.FC = () => (
  <PageTemplate 
    title="Tailored Solutions" 
    subtitle="Discover how Ideal App transforms document creation across industries."
  >
    <div className="grid md:grid-cols-3 gap-8">
      {['Startups', 'Venture Capital', 'Consulting'].map((item, i) => (
        <div key={i} className="card p-10 space-y-6">
          <h3 className="text-2xl font-bold text-text-primary">{item}</h3>
          <p className="text-text-secondary font-light">Customized templates and AI workflows designed specifically for {item.toLowerCase()} professionals.</p>
          <Link to="/register" className="text-primary font-bold flex items-center gap-2 group">
            Learn more <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ))}
    </div>
  </PageTemplate>
);

export const FeaturesPage: React.FC = () => (
  <PageTemplate 
    title="Powerful Features" 
    subtitle="Everything you need to build professional business documents in minutes."
  >
    <div className="grid md:grid-cols-2 gap-12">
      {[
        { title: 'AI Content Engine', desc: 'Generate professional copy, financial projections, and strategic analysis with a single prompt.' },
        { title: 'Smart Designer', desc: 'Automated layouts that ensure your documents always look investor-ready and on-brand.' },
        { title: 'Asset Library', desc: 'Access over 50,000+ high-quality icons, images, and graphics for your presentations.' },
        { title: 'Live Collaboration', desc: 'Work with your team in real-time with shared workspaces and live cursors.' }
      ].map((f, i) => (
        <div key={i} className="flex gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
            <Sparkles size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-text-primary">{f.title}</h4>
            <p className="text-text-secondary font-light leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </PageTemplate>
);

export const PerksPage: React.FC = () => (
  <PageTemplate 
    title="Founder Perks" 
    subtitle="Exclusive benefits and resources for the Ideal App community."
  >
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { title: '50% Lifetime Discount', desc: 'Early supporters get 50% off all plans forever.' },
        { title: 'Priority Support', desc: 'Direct access to our founding team for any assistance.' },
        { title: 'Early Access', desc: 'Be the first to try new AI models and design features.' }
      ].map((p, i) => (
        <div key={i} className="card p-10 space-y-4 text-center">
          <h3 className="text-2xl font-bold text-text-primary">{p.title}</h3>
          <p className="text-text-secondary font-light">{p.desc}</p>
        </div>
      ))}
    </div>
  </PageTemplate>
);

export const PricingPage: React.FC = () => (
  <PageTemplate 
    title="Simple Pricing" 
    subtitle="Choose the plan that's right for your business growth."
  >
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { name: 'Starter', price: '$0', desc: 'For individual founders exploring ideas.' },
        { name: 'Pro', price: '$39', desc: 'For growing startups needing full access.' },
        { name: 'Enterprise', price: 'Custom', desc: 'For large teams and organizations.' }
      ].map((p, i) => (
        <div key={i} className={cn("card p-10 space-y-8 text-center", i === 1 && "border-primary ring-4 ring-primary/10")}>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-text-primary">{p.name}</h3>
            <p className="text-4xl font-display font-bold text-text-primary">{p.price}</p>
            <p className="text-sm text-text-secondary font-light">{p.desc}</p>
          </div>
          <Link to="/register" className={cn("w-full block py-4 rounded-2xl font-bold transition-all", i === 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface text-text-primary hover:bg-border")}>
            Get Started
          </Link>
        </div>
      ))}
    </div>
  </PageTemplate>
);
