import React, { useEffect, useState, useRef } from 'react';
import { 
  Users, 
  FileText, 
  Shield, 
  Search,
  MoreVertical,
  Trash2,
  UserCheck,
  Filter,
  ArrowRight,
  BarChart3,
  Zap,
  Layout,
  Sparkles,
  Upload
} from 'lucide-react';
import { TopHeader } from './TopHeader';
import { collection, collectionGroup, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';
import { cn, formatDate } from '@/src/lib/utils';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';

export const SuperAdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'documents'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // We need to verify admin role to prevent missing permission errors
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not admin, the snapshot will fail with permissions error. 
    // Usually a higher level route guard stops this, but we'll add a try/catch or just catch errors via listener.
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), 
      (snapshot) => setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => {
        console.error(err);
        setError("Not authorized or permission denied.");
        setLoading(false);
      }
    );

    const docsUnsubscribe = onSnapshot(query(collectionGroup(db, 'documents'), orderBy('updated_at', 'desc')), 
      (snapshot) => {
        setAllDocs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Not authorized or permission denied.");
        setLoading(false);
      }
    );

    return () => {
      usersUnsubscribe();
      docsUnsubscribe();
    };
  }, []);

  const handleDeleteDoc = async (userId: string, docId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDoc(doc(db, 'users', userId, 'documents', docId));
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Only CSV and Excel files are supported.');
      return;
    }

    try {
      setIsUploading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated.');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/investors/import-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Successfully imported ${result.imported} investors!`);
      } else {
        throw new Error(result.error || 'Import failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error occurred during file upload');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = allDocs.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.ownerId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-surface/30">
      <TopHeader title="System Administration" />
      
      <div className="p-10 max-w-7xl mx-auto w-full space-y-12">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit">
              <Shield size={12} />
              Super Admin Access
            </div>
            <h2 className="text-[40px] font-bold text-text-primary tracking-tight leading-tight">System Administration</h2>
            <p className="text-lg text-text-secondary max-w-xl leading-relaxed">Manage global users, documents, and system permissions with full administrative control.</p>
          </div>
          <div className="flex gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-xl font-bold text-sm text-text-primary hover:bg-surface transition-all shadow-sm"
              title="Upload Vault Africa (CSV) or DACH Family Offices (XLSX) Data"
            >
              <Upload size={18} />
              {isUploading ? 'Uploading...' : 'Import Data'}
            </button>
            <div className="px-6 py-3 bg-white border border-border rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{users.length}</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Users</p>
            </div>
            <div className="px-6 py-3 bg-white border border-border rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-purple-600">{allDocs.length}</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Total Docs</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Search */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-b border-border pb-8">
            <div className="flex bg-white p-1 rounded-2xl border border-border shadow-sm">
              <button 
                onClick={() => setActiveTab('users')}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold text-sm transition-all",
                  activeTab === 'users' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-secondary hover:text-text-primary"
                )}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={cn(
                  "px-8 py-3 rounded-xl font-bold text-sm transition-all",
                  activeTab === 'documents' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-secondary hover:text-text-primary"
                )}
              >
                Documents
              </button>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              <button className="p-3 bg-white border border-border rounded-xl text-text-secondary hover:bg-surface transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {activeTab === 'users' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">User Information</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Role</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Joined Date</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-surface/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {user.displayName?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{user.displayName}</p>
                            <p className="text-xs text-text-secondary">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          user.role === 'admin' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-text-secondary font-medium">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className="p-3 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          title="Toggle Role"
                        >
                          <UserCheck size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-border shadow-sm overflow-hidden"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Document Title</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Owner ID</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Current Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary">Last Modified</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-text-secondary text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-surface/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                            <FileText size={24} />
                          </div>
                          <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{doc.title}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[10px] text-text-secondary font-mono bg-surface/20">
                        {doc.ownerId}
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          doc.status === 'Completed' ? "bg-emerald-100 text-emerald-700" :
                          doc.status === 'In Progress' ? "bg-orange-100 text-orange-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm text-text-secondary font-medium">
                        {formatDate(doc.updatedAt)}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleDeleteDoc(doc.userId || doc.ownerId, doc.id)}
                          className="p-3 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
