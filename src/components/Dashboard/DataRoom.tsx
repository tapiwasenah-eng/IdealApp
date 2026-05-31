import React, { useState, useRef } from 'react';
import { 
  Share2, 
  Eye, 
  Lock, 
  Clock, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  Shield, 
  Settings, 
  Users,
  TrendingUp,
  FileText,
  Copy,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectStore } from '../../store/projectStore';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export const DataRoom: React.FC = () => {
  const { projects, filteredProjects, dataRoomLinks, loadDataRoomLinks, createDataRoomLink } = useProjectStore();
  const [activeTab, setActiveTab] = React.useState<'links' | 'analytics' | 'files'>('links');
  const [showModal, setShowModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    loadDataRoomLinks().catch(console.error);
  }, [loadDataRoomLinks]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', auth.currentUser?.uid || 'default');

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/data-room-links/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      toast.success('File uploaded to Data Room');
      // In a real app, you would load files list here
    } catch (err: any) {
      toast.error(err.message || 'File upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateLink = async () => {
    if (selectedDocs.length === 0) {
      toast.error('Select at least one document');
      return;
    }
    if (hasPassword && !password) {
      toast.error('Enter a password');
      return;
    }
    setIsSubmitting(true);
    try {
      const { publicUrl } = await createDataRoomLink({
        documentIds: selectedDocs,
        hasPassword,
        password,
        allowDownload: true,
        emailNotify: true
      });
      toast.success('Link created successfully');
      setShowModal(false);
      setSelectedDocs([]);
      setHasPassword(false);
      setPassword('');
      navigator.clipboard.writeText(publicUrl);
      toast.success('Link copied to clipboard');
    } catch(err: any) {
      toast.error(err.message || 'Failed to create link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: 'Total Views', value: '1,284', change: '+12%', icon: Eye, color: 'bg-blue-500' },
    { label: 'Active Links', value: dataRoomLinks.length.toString(), change: '+2', icon: Share2, color: 'bg-indigo-600' },
    { label: 'Avg. Time', value: '4m 32s', change: '-5%', icon: Clock, color: 'bg-emerald-500' },
    { label: 'Security Score', value: '98%', change: 'High', icon: Shield, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden pb-16 md:pb-0">
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Room</h1>
            <p className="text-slate-500 text-sm mt-1">Securely share your pitch decks and documents with investors.</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              id="data-room-file-upload" 
            />
            <button 
              onClick={() => document.getElementById('data-room-file-upload')?.click()} 
              disabled={uploading}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 border border-slate-200 transition-all shadow-sm"
            >
              <Upload className="w-5 h-5" />
              <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              <Plus className="w-5 h-5" />
              <span>Create Secure Link</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-xl text-white", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-1 rounded-full",
                  stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                )}>
                  {stat.change}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('links')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === 'links' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Active Links
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all",
              activeTab === 'analytics' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Analytics
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'links' ? (
          <div className="space-y-4">
            {dataRoomLinks.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No active links</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  Create a secure link to share your documents with investors and track their engagement.
                </p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                  Get Started
                </button>
              </div>
            ) : (
              dataRoomLinks.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{project.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            124 views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active for 3 days
                          </span>
                          <span className="flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Password Protected
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                        View Analytics
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {['JD', 'AS', 'MK', 'RL'][i-1]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        <span className="font-bold">Investor from Sequoia</span> viewed <span className="text-indigo-600">Seed Pitch Deck v2</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">2 hours ago • San Francisco, US</p>
                    </div>
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      4m 12s
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Engagement by Slide</h3>
              <div className="space-y-4">
                {[
                  { label: 'Problem', value: 95, color: 'bg-indigo-600' },
                  { label: 'Solution', value: 88, color: 'bg-indigo-600' },
                  { label: 'Market Size', value: 42, color: 'bg-amber-500' },
                  { label: 'Business Model', value: 76, color: 'bg-indigo-600' },
                  { label: 'Team', value: 92, color: 'bg-indigo-600' },
                ].map(slide => (
                  <div key={slide.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700">{slide.label}</span>
                      <span className="font-bold text-slate-900">{slide.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${slide.value}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full", slide.color)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Create Secure Link</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Documents to Share
                </label>
                <div className="space-y-2">
                  {projects.map(p => (
                    <label key={p.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-indigo-600 rounded"
                        checked={selectedDocs.includes(p.id!)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedDocs([...selectedDocs, p.id!]);
                          else setSelectedDocs(selectedDocs.filter(id => id !== p.id));
                        }}
                      />
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-slate-700 truncate">{p.title || 'Untitled Project'}</span>
                    </label>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-slate-500">No documents available.</p>
                  )}
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 rounded"
                    checked={hasPassword}
                    onChange={(e) => setHasPassword(e.target.checked)}
                  />
                  <span className="text-sm font-semibold text-slate-700">Require Password to View</span>
                </label>
                {hasPassword && (
                  <input 
                    type="text"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-3 w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none text-sm transition-all"
                  />
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-slate-700 font-semibold hover:bg-slate-200 rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateLink}
                disabled={isSubmitting || selectedDocs.length === 0}
                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? 'Creating...' : 'Create Link'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
