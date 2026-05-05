import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  MoreVertical, 
  ExternalLink, 
  MapPin, 
  Globe, 
  Mail, 
  Linkedin,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Database,
  Building2,
  Users,
  Briefcase,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getInvestors, type Investor } from '../../services/investorService';
import { useProjectStore } from '../../store/projectStore';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

export const InvestorDatabase: React.FC = () => {
  const { importInvestorsFile, addInvestor } = useProjectStore();
  const [investors, setInvestors] = React.useState<Investor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [importing, setImporting] = React.useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [newInvestor, setNewInvestor] = useState<Partial<Investor>>({
    name: '', type: 'vc', country: '', sectors: [], website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!newInvestor.name) throw new Error("Name is required");
      await addInvestor(newInvestor);
      toast.success('Investor added successfully');
      setShowAddModal(false);
      setNewInvestor({ name: '', type: 'vc', country: '', sectors: [], website: '' });
      // reload
      setPage(0);
      const data = await getInvestors(filters, 0);
      setInvestors(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to add investor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    toast.info('Importing investors...');
    try {
      const importedCount = await importInvestorsFile(file);
      toast.success(`Successfully imported ${importedCount} investors!`);
      // Reload the first page
      setPage(0);
      const data = await getInvestors(filters, 0);
      setInvestors(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to import investors');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const [filters, setFilters] = React.useState({
    category: 'All Investors',
    country: 'All',
    round: 'All',
    sector: 'All'
  });
  const [page, setPage] = React.useState(0);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getInvestors(filters, page);
      setInvestors(data);
      setLoading(false);
    };
    fetch();
  }, [filters, page]);

  const categories = ['All Investors', 'Venture Capital', 'Family Offices', 'Angel Investors', 'Private Equity'];
  const rounds = ['All', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden pb-16 md:pb-0">
      <div className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Investor Database</h1>
            <p className="text-slate-500 text-sm mt-1">Access 10,000+ verified global investors and VCs.</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImport} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{importing ? 'Importing...' : 'Import List'}</span>
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
              <Plus className="w-4 h-4" />
              <span>Add Investor</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by name, firm, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 rounded-xl text-sm transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters(f => ({ ...f, category: cat }))}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  filters.category === cat 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {investors.map((investor, idx) => (
                <motion.div
                  key={investor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-600/30 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-600/20">
                        {investor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{investor.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Building2 className="w-3 h-3" />
                          <span>{investor.type.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{investor.country}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.sectors?.slice(0, 3).map(sector => (
                        <span key={sector} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                        <Globe className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                        <Linkedin className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wider">
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">1-25</span> of <span className="font-medium text-slate-900">10,432</span> investors
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, '...', 418].map((p, i) => (
                <button 
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                    p === page + 1 ? "bg-indigo-600 text-white" : "hover:bg-slate-100 text-slate-600"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setPage(p => p + 1)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add Investor</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                <input 
                  type="text"
                  required
                  value={newInvestor.name}
                  onChange={e => setNewInvestor({ ...newInvestor, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none text-sm transition-all"
                  placeholder="e.g. Sequoia Capital"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                <select 
                  value={newInvestor.type}
                  onChange={e => setNewInvestor({ ...newInvestor, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none text-sm transition-all bg-white"
                >
                  <option value="vc">Venture Capital</option>
                  <option value="angel">Angel Investor</option>
                  <option value="family-office">Family Office</option>
                  <option value="accelerator">Accelerator</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Country</label>
                <input 
                  type="text"
                  value={newInvestor.country}
                  onChange={e => setNewInvestor({ ...newInvestor, country: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none text-sm transition-all"
                  placeholder="e.g. United States"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 text-slate-700 font-semibold hover:bg-slate-200 rounded-xl transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Add Investor'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
