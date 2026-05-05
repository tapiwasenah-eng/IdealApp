import React from 'react';
import { 
  MoreVertical, 
  FileText, 
  Clock, 
  Share2, 
  Copy, 
  Trash2, 
  ExternalLink,
  Star,
  LayoutGrid,
  List as ListIcon,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectStore } from '../../store/projectStore';
import { cn, formatRelativeTime } from '../../lib/utils';
import type { ProjectData } from '../../services/projectService';

interface ProjectGridProps {
  onProjectClick: (project: ProjectData) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onProjectClick }) => {
  const { 
    filteredProjects, 
    currentView, 
    setCurrentView, 
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy 
  } = useProjectStore();

  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden pb-16 md:pb-0">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Projects</h1>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 rounded-xl text-sm w-64 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setCurrentView('grid')}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                currentView === 'grid' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentView('list')}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                currentView === 'list' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2" />

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm outline-none cursor-pointer"
          >
            <option value="updated">Last Updated</option>
            <option value="name">Name (A-Z)</option>
            <option value="created">Date Created</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {filteredProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-500 mb-8">
              {searchQuery 
                ? `We couldn't find any projects matching "${searchQuery}"`
                : "Get started by creating your first pitch deck or document."}
            </p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Create New Project</span>
            </button>
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            currentView === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onProjectClick(project)}
                  className={cn(
                    "group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-600/30 transition-all cursor-pointer",
                    currentView === 'list' && "flex items-center p-4 gap-6"
                  )}
                >
                  {currentView === 'grid' ? (
                    <>
                      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === project.id ? null : project.id);
                            }}
                            className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:bg-white transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-600" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeMenu === project.id && (
                            <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 overflow-hidden">
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  const { updateProject } = await import('../../services/projectService');
                                  const { getAuth } = await import('firebase/auth');
                                  const user = getAuth().currentUser;
                                  if(user) {
                                    await updateProject(user.uid, project.id!, { isInDataRoom: !project.isInDataRoom });
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Share2 className="w-4 h-4" /> {project.isInDataRoom ? 'Remove from Data Room' : 'Add to Data Room'}
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  // Call export pdf
                                  const { exportToPdf } = await import('../../services/exportService');
                                  // Note: we might not have a canvas instance here, so this would be a static export
                                  // but our exportService expects a canvas. For now, just alert or link to editor
                                  window.location.href = `/editor/${project.id}?export=true`;
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" /> Export as PDF
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" /> Duplicate
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if(window.confirm('Are you sure you want to delete this project?')) {
                                    const { getAuth } = await import('firebase/auth');
                                    const { deleteProject } = await import('../../services/projectService');
                                    const user = getAuth().currentUser;
                                    if(user) {
                                      await deleteProject(user.uid, project.id!);
                                      setActiveMenu(null);
                                    }
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Move to Trash
                              </button>
                            </div>
                          )}
                        </div>
                        {project.isInDataRoom && (
                          <div className="absolute bottom-3 left-3 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-wider shadow-lg">
                            Data Room
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 truncate flex-1">{project.title}</h3>
                          <button className="text-slate-300 hover:text-yellow-400 transition-colors ml-2">
                            <Star className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(project.updatedAt)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{project.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(project.updatedAt)}
                          </span>
                          {project.isInDataRoom && (
                            <span className="text-indigo-600 font-medium">In Data Room</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.tags?.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-medium hidden md:block">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === project.id ? null : project.id);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4 text-slate-600" />
                        </button>
                        {activeMenu === project.id && (
                            <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 overflow-hidden">
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  const { updateProject } = await import('../../services/projectService');
                                  const { getAuth } = await import('firebase/auth');
                                  const user = getAuth().currentUser;
                                  if(user) {
                                    await updateProject(user.uid, project.id!, { isInDataRoom: !project.isInDataRoom });
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Share2 className="w-4 h-4" /> {project.isInDataRoom ? 'Remove from Data Room' : 'Add to Data Room'}
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  window.location.href = `/editor/${project.id}?export=true`;
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" /> Export as PDF
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" /> Duplicate
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if(window.confirm('Are you sure you want to delete this project?')) {
                                    const { getAuth } = await import('firebase/auth');
                                    const { deleteProject } = await import('../../services/projectService');
                                    const user = getAuth().currentUser;
                                    if(user) {
                                      await deleteProject(user.uid, project.id!);
                                      setActiveMenu(null);
                                    }
                                  }
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Move to Trash
                              </button>
                            </div>
                          )}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
