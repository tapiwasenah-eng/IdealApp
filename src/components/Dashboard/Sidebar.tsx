import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Database, 
  Share2, 
  Settings, 
  Trash2, 
  Plus,
  ChevronRight,
  Folder,
  Users,
  CreditCard,
  HelpCircle,
  Shield,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import toast from 'react-hot-toast';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { workspaces, selectedWorkspace, setSelectedWorkspace } = useProjectStore();
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = React.useState('');

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const isAdmin = profile?.role === 'admin' || 
                  user?.email === 'vault.africa@vault.africa' || 
                  user?.email === 'tapiwa@builtit.technology';

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'templates', icon: LayoutDashboard, label: 'Templates' },
    { id: 'projects', icon: FileText, label: 'My Projects' },
    { id: 'investors', icon: Database, label: 'Investor Database' },
    { id: 'dataroom', icon: Share2, label: 'Data Room' },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', icon: Shield, label: 'Admin Panel' });
  }

  const secondaryItems = [
    { id: 'trash', icon: Trash2, label: 'Trash' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 h-screen bg-[#F8FAFC] text-slate-600 flex flex-col border-r border-[#E5E7EB]">
      <div className="p-6">
        <Logo variant="full" size="xl" color="dark" href="/" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'admin') {
                  navigate('/admin');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-violet-50 text-violet-700 font-semibold" 
                  : "hover:bg-white hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                activeTab === item.id ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workspaces</span>
            <button 
              onClick={() => {
                setIsCreatingWorkspace(true);
              }}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setSelectedWorkspace(null);
                setActiveTab('projects');
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                selectedWorkspace === null ? "text-violet-700 bg-violet-50 font-semibold" : "hover:bg-white hover:text-slate-900"
              )}
            >
              <Folder className={cn("w-4 h-4", selectedWorkspace === null ? "text-violet-600" : "text-slate-400")} />
              <span className="text-sm">All Projects</span>
            </button>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setSelectedWorkspace(ws.id);
                  setActiveTab('projects');
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                  selectedWorkspace === ws.id ? "text-violet-700 bg-violet-50 font-semibold" : "hover:bg-white hover:text-slate-900"
                )}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ws.color || '#6366f1' }} />
                <span className="text-sm truncate flex-1 text-left">{ws.name}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
            {isCreatingWorkspace && (
              <div className="px-3 py-2 mt-2 bg-white rounded-lg border border-slate-200">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Workspace name..."
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (newWorkspaceName.trim()) {
                        useProjectStore.getState().addWorkspace({
                          id: Math.random().toString(36).substring(7),
                          name: newWorkspaceName.trim(),
                          color: '#6366f1'
                        });
                        setNewWorkspaceName('');
                        setIsCreatingWorkspace(false);
                      }
                    } else if (e.key === 'Escape') {
                      setIsCreatingWorkspace(false);
                      setNewWorkspaceName('');
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsCreatingWorkspace(false);
                      setNewWorkspaceName('');
                    }, 200);
                  }}
                  className="w-full bg-transparent text-sm text-slate-700 font-medium outline-none"
                />
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-1 pt-4 border-t border-[#E5E7EB]">
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                activeTab === item.id ? "bg-violet-50 text-violet-700 font-semibold" : "hover:bg-white hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-violet-600" : "text-slate-400")} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="bg-white rounded-xl p-4 mb-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-600 capitalize">{profile?.subscription || 'Free'} Plan</span>
            <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded uppercase font-bold">Active</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-violet-500 h-full w-1/4" />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Storage usage</p>
        </div>
        
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs uppercase">
            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.displayName || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

