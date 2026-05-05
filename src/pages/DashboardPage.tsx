import { LayoutDashboard, Layout, FileText, Settings } from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from '../components/Dashboard/Sidebar';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { ProjectGrid } from '../components/Dashboard/ProjectGrid';
import { InvestorDatabase } from '../components/Dashboard/InvestorDatabase';
import { DataRoom } from '../components/Dashboard/DataRoom';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { subscribeToProjects } from '../services/projectService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEOHead from '../components/Shared/SEOHead';

import { Trash } from '../components/Dashboard/Trash';
import { LandingPage } from '../components/Dashboard/LandingPage';
import SettingsPage from './SettingsPage';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { setProjects } = useProjectStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const navigate = useNavigate();

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  React.useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToProjects(user.uid, (projects) => {
      setProjects(projects);
    });
    return () => unsubscribe();
  }, [user, setProjects]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'templates':
        return <div className="flex-1 overflow-y-auto"><LandingPage /></div>;
      case 'projects':
        return <ProjectGrid onProjectClick={(p) => navigate(`/editor/${p.id}`)} />;
      case 'investors':
        return <InvestorDatabase />;
      case 'dataroom':
        return <DataRoom />;
      case 'trash':
        return <Trash />;
      case 'settings':
        return <div className="flex-1 overflow-y-auto"><SettingsPage inDashboard /></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <SEOHead
        title="Dashboard | Ideal App"
        description="Your Ideal App dashboard."
        noIndex={true}
      />
      {/* Sidebar hidden on mobile by default, handled inside Sidebar component or using CSS */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <main className="flex-1 flex flex-col min-w-0 w-full md:w-auto h-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0 relative"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Mobile bottom navigation */}
        <div className="md:hidden border-t border-slate-200 bg-white absolute bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 pb-safe">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
            { id: 'templates', icon: Layout, label: 'Templates' },
            { id: 'projects', icon: FileText, label: 'Projects' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
