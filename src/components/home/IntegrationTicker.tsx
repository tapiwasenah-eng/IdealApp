import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, Slack, Calendar, BarChart2, Briefcase, Mail } from 'lucide-react';

const INTEGRATIONS = [
  { icon: FileText, label: 'PDF', color: 'text-red-500' },
  { icon: FileSpreadsheet, label: 'XLSX', color: 'text-green-600' },
  { icon: FileText, label: 'DOCX', color: 'text-blue-600' },
  { icon: Calendar, label: 'Calendly', color: 'text-blue-500' },
  { icon: Calendar, label: 'Cal.com', color: 'text-gray-800' },
  { icon: BarChart2, label: 'PostHog', color: 'text-orange-500' },
  { icon: BarChart2, label: 'Mixpanel', color: 'text-indigo-500' },
  { icon: Slack, label: 'Slack', color: 'text-purple-600' },
  { icon: Briefcase, label: 'HubSpot', color: 'text-orange-600' },
  { icon: Briefcase, label: 'Pipedrive', color: 'text-green-500' },
  { icon: Mail, label: 'Google', color: 'text-blue-500' },
];

export function IntegrationTicker() {
  return (
    <div className="w-full overflow-hidden bg-white/50 backdrop-blur-sm border-t border-b border-gray-100 py-8 relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10"></div>

      <div className="flex w-[200%] gap-12 items-center">
        {/* We animate this container sliding left infinitely */}
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 items-center uppercase tracking-wider font-semibold text-sm"
        >
          {/* Double the list for seamless loop */}
          {[...INTEGRATIONS, ...INTEGRATIONS].map((Integration, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0 opacity-70 hover:opacity-100 transition-opacity">
              <div className={`p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 ${Integration.color}`}>
                <Integration.icon size={24} strokeWidth={2} />
              </div>
              <span className="text-gray-500">{Integration.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
