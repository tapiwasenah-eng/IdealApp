import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useStore } from '../../store';
import { Eye, Clock, FileText, TrendingUp, Users, Send } from 'lucide-react';
import { designSystem } from '../../lib/design-system';

interface DocumentStat {
  id: string;
  title: string;
  views: number;
  lastViewed: Date | null;
}

interface InvestorStat {
  id: string;
  name: string;
  views: number;
  timeSpent: string;
  topDocId: string | null;
  topDocTitle: string | null;
  lastViewed: Date | null;
}

export const DashboardAnalytics: React.FC = () => {
  const { user } = useStore();
  const [loading, setLoading] = useState(true);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);
  
  const [stats, setStats] = useState({
    outreachSent: 0,
    totalViews: 0,
    engagedInvestors: 0,
    topDocument: 'None',
  });
  
  const [investorEngagement, setInvestorEngagement] = useState<InvestorStat[]>([]);
  const [documentPerformance, setDocumentPerformance] = useState<DocumentStat[]>([]);
  
  const { colors, typography, shadows } = designSystem;

  useEffect(() => {
    let mounted = true;
    const fetchAnalytics = async () => {
      if (!user) return;
      try {
        // 1. Fetch outreach
        const outreachQ = query(collection(db, "users", user.uid, "outreach"));
        const outreachSnap = await getDocs(outreachQ);
        const outreachCount = outreachSnap.size;
        
        const outreachMap = new Map<string, any>();
        outreachSnap.forEach(doc => {
          const d = doc.data();
          if (d.roomToken) {
            outreachMap.set(d.roomToken, { ...d, id: doc.id });
          }
        });

        // 2. Fetch data room views
        const viewsQ = query(collection(db, "dataRoomViews"), where("ownerId", "==", user.uid));
        const viewsSnap = await getDocs(viewsQ);
        
        let totalOpens = 0;
        
        const viewsByToken = new Map<string, { viewCount: number, docs: Map<string, number>, latest: any }>();
        const viewsByDoc = new Map<string, { viewCount: number, latest: any }>();
        
        viewsSnap.forEach(vDoc => {
          const vData = vDoc.data();
          totalOpens++;
          
          if (vData.token) {
            if (!viewsByToken.has(vData.token)) {
              viewsByToken.set(vData.token, { viewCount: 0, docs: new Map(), latest: null });
            }
            const tokenStats = viewsByToken.get(vData.token)!;
            tokenStats.viewCount++;
            if (vData.documentId) {
              tokenStats.docs.set(vData.documentId, (tokenStats.docs.get(vData.documentId) || 0) + 1);
            }
            if (!tokenStats.latest || (vData.timestamp && vData.timestamp > tokenStats.latest)) {
              tokenStats.latest = vData.timestamp;
            }
          }
          
          if (vData.documentId) {
            if (!viewsByDoc.has(vData.documentId)) {
              viewsByDoc.set(vData.documentId, { viewCount: 0, latest: null });
            }
            const docStats = viewsByDoc.get(vData.documentId)!;
            docStats.viewCount++;
            if (!docStats.latest || (vData.timestamp && vData.timestamp > docStats.latest)) {
              docStats.latest = vData.timestamp;
            }
          }
        });

        // 3. Compute Engaged Investors (>= 3 docs viewed)
        let engagedCount = 0;
        const invStats: InvestorStat[] = [];
        
        for (const [token, stats] of viewsByToken.entries()) {
          if (stats.docs.size >= 3) {
            engagedCount++;
          }
          
          let topDocId: string | null = null;
          let maxViews = -1;
          for (const [dId, c] of stats.docs.entries()) {
            if (c > maxViews) {
               maxViews = c;
               topDocId = dId;
            }
          }
          
          let name = "Anonymous Investor";
          if (outreachMap.has(token)) {
            const o = outreachMap.get(token);
            name = o.investorName || o.firm || "Anonymous Investor";
          }
          
          const timeSpent = stats.viewCount > 0 ? `${Math.min(stats.viewCount * 2, 60)} mins` : "--";
          
          invStats.push({
            id: token,
            name,
            views: stats.viewCount,
            timeSpent,
            topDocId,
            topDocTitle: null, // will fill later
            lastViewed: stats.latest ? (stats.latest.toDate ? stats.latest.toDate() : new Date(stats.latest)) : null
          });
        }
        
        // Sort investor stats by latest view
        invStats.sort((a, b) => {
          if (!a.lastViewed) return 1;
          if (!b.lastViewed) return -1;
          return b.lastViewed.getTime() - a.lastViewed.getTime();
        });

        // 4. Compute Top document
        // Fetch document titles
        let topGlobalDocId: string | null = null;
        let maxGlobalViews = -1;
        const docStats: DocumentStat[] = [];
        
        const docTitleMap = new Map<string, string>();
        
        for (const [docId, stats] of viewsByDoc.entries()) {
           if (stats.viewCount > maxGlobalViews) {
               maxGlobalViews = stats.viewCount;
               topGlobalDocId = docId;
           }
           let title = "Unknown Document";
           try {
             const dSnap = await getDoc(doc(db, "users", user.uid, "documents", docId));
             if (dSnap.exists() && dSnap.data().title) {
               title = dSnap.data().title;
             }
             docTitleMap.set(docId, title);
           } catch(e) {
             console.error("error fetching doc", e);
           }
           
           docStats.push({
             id: docId,
             title,
             views: stats.viewCount,
             lastViewed: stats.latest ? (stats.latest.toDate ? stats.latest.toDate() : new Date(stats.latest)) : null
           });
        }
        
        docStats.sort((a, b) => b.views - a.views);
        
        // Fill topDoc titles for investors
        invStats.forEach(inv => {
           if (inv.topDocId && docTitleMap.has(inv.topDocId)) {
             inv.topDocTitle = docTitleMap.get(inv.topDocId)!;
           } else {
             inv.topDocTitle = "Unknown Document";
           }
        });
        
        let topDocName = "None";
        if (topGlobalDocId && docTitleMap.has(topGlobalDocId)) {
          topDocName = docTitleMap.get(topGlobalDocId)!;
        }

        if (mounted) {
          setStats({
            outreachSent: outreachCount,
            totalViews: totalOpens,
            engagedInvestors: engagedCount,
            topDocument: topDocName,
          });
          setInvestorEngagement(invStats);
          setDocumentPerformance(docStats);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
           setErrorMSG("Analytics temporarily unavailable.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAnalytics();
    return () => { mounted = false; };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }
  
  if (errorMSG) {
      return (
          <div className="flex justify-center items-center h-64 text-slate-500">
             {errorMSG}
          </div>
      )
  }

  const cards = [
    { label: "Outreach Sent", value: stats.outreachSent.toString(), icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Data Room Opens", value: stats.totalViews.toString(), icon: Eye, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Engaged Investors", value: stats.engagedInvestors.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: "Top Document", value: stats.topDocument, icon: FileText, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="w-full h-full pb-12 max-w-7xl mx-auto px-6 mt-8 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-100">
          Analytics Overview
        </h2>
        <p className="text-slate-400 mt-2">Track investor engagement across your documents and data rooms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-[#151A26] rounded-2xl p-6 border border-white/5 flex items-center gap-4 hover:border-white/20 transition-colors">
            <div className={`p-4 rounded-xl flex-shrink-0 bg-white/5`}>
              <card.icon className={`w-6 h-6 text-white`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-slate-400 truncate">{card.label}</div>
              <div className="text-2xl font-bold text-slate-100 truncate" title={card.value}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Room Engagement */}
        <div className="bg-[#151A26] rounded-2xl border border-white/5 overflow-hidden">
           <div className="p-6 border-b border-white/5">
             <h3 className="text-lg font-semibold text-slate-100">Data Room Engagement</h3>
           </div>
           
           {investorEngagement.length === 0 ? (
             <div className="text-center py-12">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 text-slate-400 mb-4">
                 <TrendingUp className="w-8 h-8" />
               </div>
               <h4 className="text-slate-200 font-semibold mb-1">No views yet</h4>
               <p className="text-slate-500 text-sm">Share your data room links to start tracking engagement.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#0F141E] text-slate-500 font-medium border-b border-white/5">
                     <tr>
                        <th className="px-6 py-4">Investor</th>
                        <th className="px-6 py-4">Total Views</th>
                        <th className="px-6 py-4">Time Spent</th>
                        <th className="px-6 py-4">Top Doc</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {investorEngagement.map((inv) => (
                        <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4 justify-center font-medium text-slate-200">{inv.name}</td>
                           <td className="px-6 py-4">{inv.views}</td>
                           <td className="px-6 py-4">{inv.timeSpent}</td>
                           <td className="px-6 py-4 text-slate-400 truncate max-w-[150px]" title={inv.topDocTitle || ''}>
                             {inv.topDocTitle}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
           )}
        </div>

        {/* Document Performance */}
        <div className="bg-[#151A26] rounded-2xl border border-white/5 overflow-hidden">
           <div className="p-6 border-b border-white/5">
             <h3 className="text-lg font-semibold text-slate-100">Document Performance</h3>
           </div>
           
           {documentPerformance.length === 0 ? (
             <div className="text-center py-12">
               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 text-slate-400 mb-4">
                 <FileText className="w-8 h-8" />
               </div>
               <h4 className="text-slate-200 font-semibold mb-1">No documents viewed</h4>
               <p className="text-slate-500 text-sm">Documents inside your data rooms will appear here.</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-[#0F141E] text-slate-500 font-medium border-b border-white/5">
                     <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Total Views</th>
                        <th className="px-6 py-4">Last Viewed</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {documentPerformance.map((doc) => (
                        <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4 font-medium text-slate-200 truncate max-w-[150px]" title={doc.title}>
                             {doc.title}
                           </td>
                           <td className="px-6 py-4">{doc.views}</td>
                           <td className="px-6 py-4 text-slate-400">
                             {doc.lastViewed ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(doc.lastViewed) : '--'}
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
