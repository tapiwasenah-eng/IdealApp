import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Users, 
  Plus,
  Sparkles,
  Zap,
  BarChart3,
  Layout,
  TrendingUp
} from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { DocumentGrid } from './DocumentGrid';
import { TopHeader } from './TopHeader';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { createProject } from '../../services/projectService';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const Dashboard: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const { projects } = useProjectStore();
  const navigate = useNavigate();

  const handleCreateWorkspace = async () => {
    if (!currentUser) return;
    
    try {
      const id = await createProject(currentUser.uid, {
        title: 'Untitled Project',
        workspaceId: null,
        templateId: null,
        canvasData: JSON.stringify({ version: "6.0.0", objects: [] }),
        sections: [],
        status: 'draft',
        isInDataRoom: false,
        thumbnail: '',
        tags: ['New']
      });
      
      toast.success('Project created!');
      navigate(`/editor/${id}`);
    } catch (error: any) {
      toast.error('Failed to create project');
    }
  };

  const activeProjects = projects.filter(p => !p.deletedAt);
  const metrics = [
    { label: 'Total Projects', value: activeProjects.length, icon: FileText, color: 'blue' as const },
    { label: 'Drafts', value: activeProjects.filter(d => d.status === 'draft').length, icon: Clock, color: 'orange' as const },
    { label: 'Completed', value: activeProjects.filter(d => d.status === 'final').length, icon: CheckCircle2, color: 'green' as const },
    { label: 'Team Members', value: 1, icon: Users, color: 'purple' as const }, // Assuming 1 for selected workspace fallback
  ];

  const recentProjects = activeProjects
    .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0))
    .slice(0, 6);

  return (
    <div className="flex-1 flex flex-col bg-slate-50/50 overflow-y-auto">
      <TopHeader title="Dashboard" />
      
      <div className="px-4 md:px-8 pt-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-indigo-600/10 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
              <Sparkles size={12} />
              Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Founder'}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Your creative command center</h2>
            <p className="text-sm md:text-base text-slate-500 max-w-xl">Manage all your projects, track progress, and collaborate with your team.</p>
          </div>
          <button 
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <MetricsCard {...metric} />
            </motion.div>
          ))}
        </div>

        {/* Investor Insights Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Investor Insights</h3>
                <p className="text-sm text-slate-500">Real-time data from our global investor database.</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/dashboard?tab=investors')}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-all"
            >
              Access Database
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Verified Investors</p>
              <p className="text-3xl font-black text-slate-900">{useProjectStore.getState().investors?.length > 0 ? useProjectStore.getState().investors.length.toLocaleString() : '10,432'}</p>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold">
                <TrendingUp size={12} />
                <span>+12 this week</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active VCs</p>
              <p className="text-3xl font-black text-slate-900">2,841</p>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                <CheckCircle2 size={12} />
                <span>Global coverage</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Capital</p>
              <p className="text-3xl font-black text-slate-900">$4.2B+</p>
              <p className="text-xs text-slate-400">Estimated AUM</p>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Recent Projects</h3>
            <button 
              onClick={() => navigate('/dashboard?tab=projects')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all
            </button>
          </div>
          
          <DocumentGrid documents={recentProjects} loading={false} />
        </div>

        {/* Quick Tips / Resources */}
        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {[
            { icon: Zap, title: 'Quick Start', desc: 'Learn how to use AI to generate your first pitch deck in minutes.', color: 'blue', tab: 'templates' },
            { icon: Layout, title: 'Template Library', desc: 'Browse our collection of professional business templates.', color: 'purple', tab: 'templates' },
            { icon: BarChart3, title: 'Analytics', desc: 'Track your document engagement and viewer metrics in real-time.', color: 'emerald', tab: 'dataroom' },
          ].map((tip) => (
            <div 
              key={tip.title} 
              onClick={() => navigate(`/dashboard?tab=${tip.tab}`)}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all",
                tip.color === 'blue' ? "bg-blue-50 text-blue-600" :
                tip.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"
              )}>
                <tip.icon size={20} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{tip.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
