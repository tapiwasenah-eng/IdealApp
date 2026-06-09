import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Sidebar from '../../components/layout/Sidebar';
import { useBillingStore } from '../../lib/store/useBillingStore';

export const DashboardLayout: React.FC = () => {
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

  return (
    <div className="flex w-full h-screen bg-ideal-charcoal text-slate-100 overflow-hidden font-sans">
      <div className="w-72 h-full flex-shrink-0 relative z-10">
        <Sidebar />
      </div>

      <div className="flex-1 h-full flex flex-col overflow-hidden relative bg-ideal-charcoal">
        <main className="flex-1 overflow-y-auto w-full">
          <Outlet context={{ openNewDoc: () => setIsNewDocModalOpen(true) }} />
        </main>
      </div>

      {isNewDocModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0E0E11] rounded-2xl border border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl">
            {/* Modal header loader bar */}
            <div className="flex items-center gap-1 p-4 pb-0">
              <div className="h-1 flex-1 bg-indigo-600 rounded-full"></div>
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
              <div className="h-1 w-6 bg-slate-800 rounded-full"></div>
              <button 
                className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setIsNewDocModalOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-8">
              <h2 className="text-2xl font-serif text-slate-50 mb-2">Bring your existing material</h2>
              <p className="text-slate-400 mb-8 text-sm">Start with what you have. We'll run a first-pass AI summary automatically.</p>

              <div className="space-y-4">
                <button className="w-full text-left p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Upload size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">Upload existing deck</h3>
                    <p className="text-xs text-slate-500 mt-1">PDF, PPTX, or DOCX</p>
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setIsNewDocModalOpen(false); navigate('/dashboard/templates'); }} className="text-left p-4 rounded-xl border border-slate-800 bg-slate-800/30 hover:bg-slate-800 transition-colors flex items-center justify-between group">
                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm">Start from template</h3>
                      <p className="text-xs text-slate-500 mt-1">IdealApp winners</p>
                    </div>
                    <File size={16} className="text-slate-400 group-hover:text-slate-300" />
                  </button>

                  <button className="text-left p-4 rounded-xl border border-slate-800 bg-slate-800/30 hover:bg-slate-800 transition-colors flex items-center justify-between group">
                    <div>
                      <h3 className="font-semibold text-slate-200 text-sm">Start from blank</h3>
                      <p className="text-xs text-slate-500 mt-1">Empty workspace</p>
                    </div>
                    <Plus size={16} className="text-slate-400 group-hover:text-slate-300" />
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setIsNewDocModalOpen(false)}
                  className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-slate-200 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

