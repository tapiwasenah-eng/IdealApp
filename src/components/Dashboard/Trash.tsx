import React from 'react';
import { 
  FileText, 
  Trash2,
  RefreshCw,
  Search,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectStore } from '../../store/projectStore';
import { cn, formatRelativeTime } from '../../lib/utils';
import { restoreFromTrash, permanentlyDelete } from '../../services/projectService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const Trash: React.FC = () => {
  const { trashedProjects, currentView, setCurrentView } = useProjectStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredProjects = trashedProjects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await restoreFromTrash(user.uid, id);
      toast.success('Project restored');
    } catch (err) {
      toast.error('Failed to restore project');
    }
  };

  const handlePermanentDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (window.confirm('Are you sure you want to permanently delete this project? This action cannot be undone.')) {
      try {
        await permanentlyDelete(user.uid, id);
        toast.success('Project permanently deleted');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden pb-16 md:pb-0">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-slate-500" />
            Trash
          </h1>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search trash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 rounded-xl text-sm w-64 transition-all outline-none"
            />
          </div>
        </div>

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
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {filteredProjects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
              <Trash2 className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Trash is empty</h3>
            <p className="text-slate-500 mb-8">
              Items in the trash will remain here until you manually delete them.
            </p>
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
                  className={cn(
                    "group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default",
                    currentView === 'list' && "flex items-center p-4 gap-6"
                  )}
                >
                  {currentView === 'grid' ? (
                    <>
                      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden grayscale opacity-50 relative">
                        {project.thumbnail ? (
                          <img 
                            src={project.thumbnail} 
                            alt={project.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-slate-900 truncate flex-1 opacity-70">{project.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                           Deleted {formatRelativeTime(project.deletedAt)}
                        </div>
                      </div>
                      <div className="absolute right-0 top-0 w-full h-full bg-slate-900/10 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                         <button onClick={(e) => handleRestore(project.id!, e)} className="p-2 bg-white text-indigo-600 rounded-lg hover:scale-105 shadow-md flex items-center gap-2 font-semibold text-sm">
                           <RefreshCw className="w-4 h-4" /> Restore
                         </button>
                         <button onClick={(e) => handlePermanentDelete(project.id!, e)} className="p-2 bg-red-600 text-white rounded-lg hover:scale-105 shadow-md flex items-center gap-2 font-semibold text-sm">
                           <Trash2 className="w-4 h-4" /> Delete
                         </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 grayscale opacity-50">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0 opacity-70">
                        <h3 className="font-semibold text-slate-900 truncate">{project.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          Deleted {formatRelativeTime(project.deletedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                         <button onClick={(e) => handleRestore(project.id!, e)} className="p-2 hover:bg-slate-100 text-indigo-600 rounded-lg transition-colors">
                           <RefreshCw className="w-4 h-4" />
                         </button>
                         <button onClick={(e) => handlePermanentDelete(project.id!, e)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
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
