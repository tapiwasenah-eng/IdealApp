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


