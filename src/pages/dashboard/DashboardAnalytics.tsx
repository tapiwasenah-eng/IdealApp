import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useStore } from '../../store';
import { usePitchPackagesStore } from '../../lib/store/usePitchPackagesStore';
import { Eye, Clock, Download, TrendingUp, Users, Send } from 'lucide-react';
import { designSystem } from '../../lib/design-system';

interface DocumentView {
  documentId: string;
  token: string;
  ownerId: string;
  timestamp: any;
  durationSeconds?: number;
}

export const DashboardAnalytics: React.FC = () => {
  const { user } = useStore();
  const { records: outreachRecords, loadRecords } = usePitchPackagesStore();
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Stats state
  const [views, setViews] = useState<DocumentView[]>([]);
  const [documents, setDocuments] = useState<Record<string, string>>({});
  
  const { colors, typography, shadows } = designSystem;

  useEffect(() => {
    let mounted = true;
    
    const fetchAnalytics = async () => {
      if (!user) return;
      try {
        await loadRecords(); // Ensure outreach records are loaded
        
        // Fetch views
        const viewsQ = query(collection(db, "dataRoomViews"), where("ownerId", "==", user.uid));
        const viewsSnap = await getDocs(viewsQ);
        const viewsData: DocumentView[] = [];
        viewsSnap.forEach(doc => {
          viewsData.push(doc.data() as DocumentView);
        });
        
        // Fetch docs for titles
        const docsQ = query(collection(db, "users", user.uid, "documents"));
        const docsSnap = await getDocs(docsQ);
        const docsMap: Record<string, string> = {};
        docsSnap.forEach(doc => {
          docsMap[doc.id] = doc.data().title || "Untitled";
        });
        
        if (mounted) {
          setViews(viewsData);
          setDocuments(docsMap);
          setErrorMsg(null);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setErrorMsg("Analytics temporarily unavailable.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    fetchAnalytics();
    return () => { mounted = false; };
  }, [user, loadRecords]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // --- Compute Metrics ---

  const totalOutreach = outreachRecords.length;
  const totalViews = views.length;
  
  // Engaged Investors: viewed >= 3 docs (using outreach tokens)
  let engagedCount = 0;
  outreachRecords.forEach(r => {
    if ((r.docsViewed || 0) >= 3) {
      engagedCount++;
    }
  });

  // Top Document
  const docViews: Record<string, number> = {};
  const docLatestView: Record<string, Date> = {};
  views.forEach(v => {
    if (v.documentId) {
      docViews[v.documentId] = (docViews[v.documentId] || 0) + 1;
      const vDate = v.timestamp?.toDate ? v.timestamp.toDate() : new Date(v.timestamp);
      if (!docLatestView[v.documentId] || vDate > docLatestView[v.documentId]) {
        docLatestView[v.documentId] = vDate;
      }
    }
  });

  let topDocId = '';
  let topDocViews = 0;
  Object.keys(docViews).forEach(id => {
    if (docViews[id] > topDocViews) {
      topDocViews = docViews[id];
      topDocId = id;
    }
  });
  const topDocName = topDocId ? (documents[topDocId] || "Unknown Document") : "--";

  // Document Performance Table
  const docPerformance = Object.keys(docViews).map(id => ({
    id,
    title: documents[id] || "Unknown Document",
    views: docViews[id],
    lastViewed: docLatestView[id]
  })).sort((a, b) => b.views - a.views);

  // Outreach / Engagement Table logic
  const engagementRows = outreachRecords.map(r => {
    // find views for this token
    const tokenViews = views.filter(v => v.token === r.roomToken);
    
    // Most viewed doc for this investor
    const ivDocs: Record<string, number> = {};
    tokenViews.forEach(v => {
      if (v.documentId) ivDocs[v.documentId] = (ivDocs[v.documentId] || 0) + 1;
    });
    let topIvId = '';
    let topIvViews = 0;
    Object.keys(ivDocs).forEach(id => {
      if (ivDocs[id] > topIvViews) {
        topIvViews = ivDocs[id];
        topIvId = id;
      }
    });

    return {
      id: r.id,
      name: r.investorName,
      firm: r.firm,
      totalViews: tokenViews.length,
      timeSpent: tokenViews.length > 0 ? `${Math.min(tokenViews.length * 2, 60)} mins` : "--",
      mostViewedDoc: topIvId ? (documents[topIvId] || "Unknown Document") : "--"
    };
  }).sort((a, b) => b.totalViews - a.totalViews);

  const cards = [
    { label: "Outreach Sent", value: totalOutreach.toString(), icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Data Room Opens", value: totalViews.toString(), icon: Eye, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Engaged Investors (≥3 docs)", value: engagedCount.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Top Document", value: topDocName, valueClass: "truncate max-w-[150px] inline-block align-bottom", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="w-full pb-12 max-w-7xl mx-auto px-6 mt-8">
      <div className="mb-8">
        <h2 style={{ fontFamily: typography.fonts.interface, fontWeight: 700, fontSize: typography.scale.h2.fontSize, color: colors.primary.obsidian }}>
          Analytics Overview
        </h2>
        <p className="text-slate-500 mt-2">Track investor engagement across your documents and data rooms.</p>
        
        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {errorMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-4" style={{ boxShadow: shadows.e1 }}>
            <div className={`p-4 rounded-xl flex-shrink-0 ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-500">{card.label}</div>
              <div className={`text-2xl font-bold text-slate-800 ${card.valueClass || ''}`} title={card.value}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Room Engagement Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8" style={{ boxShadow: shadows.e1 }}>
           <h3 className="text-lg font-bold text-slate-800 mb-6">Investor Engagement</h3>
           {engagementRows.length === 0 ? (
             <div className="text-center py-12">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-4">
                 <Users className="w-6 h-6" />
               </div>
               <h4 className="text-slate-800 font-semibold mb-1">No outreach data</h4>
               <p className="text-slate-500 text-sm">Send documents to investors to track engagement.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                     <th className="pb-3 font-semibold">Investor</th>
                     <th className="pb-3 font-semibold">Total Views</th>
                     <th className="pb-3 font-semibold">Time Spent</th>
                     <th className="pb-3 font-semibold">Top Document</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm text-slate-700">
                   {engagementRows.map((r, idx) => (
                     <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                       <td className="py-3">
                         <div className="font-semibold text-slate-800">{r.name || 'Anonymous'}</div>
                         <div className="text-xs text-slate-500">{r.firm}</div>
                       </td>
                       <td className="py-3 font-medium">{r.totalViews}</td>
                       <td className="py-3 text-slate-500">{r.timeSpent}</td>
                       <td className="py-3 text-slate-500 truncate max-w-[120px]" title={r.mostViewedDoc}>{r.mostViewedDoc}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>

        {/* Document Performance Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8" style={{ boxShadow: shadows.e1 }}>
           <h3 className="text-lg font-bold text-slate-800 mb-6">Document Performance</h3>
           {docPerformance.length === 0 ? (
             <div className="text-center py-12">
               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400 mb-4">
                 <Eye className="w-6 h-6" />
               </div>
               <h4 className="text-slate-800 font-semibold mb-1">No document views yet</h4>
               <p className="text-slate-500 text-sm">Share your data rooms to see document statistics.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                     <th className="pb-3 font-semibold">Title</th>
                     <th className="pb-3 font-semibold text-right">Views</th>
                     <th className="pb-3 font-semibold text-right">Last Viewed</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm text-slate-700">
                   {docPerformance.map((d, idx) => (
                     <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                       <td className="py-3 font-medium text-slate-800 truncate max-w-[180px]" title={d.title}>{d.title}</td>
                       <td className="py-3 text-right font-semibold">{d.views}</td>
                       <td className="py-3 text-right text-slate-500">
                         {d.lastViewed ? d.lastViewed.toLocaleDateString() : '--'}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
