import React, { useEffect } from "react";
import { usePitchPackagesStore } from "../../../lib/store/usePitchPackagesStore";
import { designSystem } from "../../../lib/design-system";
import { useBillingStore } from "../../../lib/store/useBillingStore";
import { Mail, Clock, Eye, Lock, Sparkles } from "lucide-react";

export const OutreachTrackerPage: React.FC = () => {
  const { records, loadRecords, isLoading } = usePitchPackagesStore();
  const { colors, typography, shadows } = designSystem;
  const { currentPlan, openUpgradeModal } = useBillingStore();

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Meeting":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Interested":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Opened":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Sent":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto pb-20">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1
            style={{
              fontFamily: typography.fonts.interface,
              fontWeight: 600,
              fontSize: typography.scale.h2.fontSize,
              color: colors.primary.obsidian,
            }}
          >
            Outreach Tracker
          </h1>
          <p className="text-slate-500 mt-2 text-[15px] font-medium">
            Monitor investor engagement, data room analytics, and AI follow-up
            nudges.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2">
          <Mail size={16} /> New Pitch
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">Investor</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last Active</div>
          <div className="col-span-2">Time Spent</div>
          <div className="col-span-3">AI Nudge</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {records.map((record) => (
            <div
              key={record.id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors"
            >
              <div className="col-span-3">
                <p className="font-bold text-sm text-slate-800 font-sans">
                  {record.investorName}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {record.firm}
                </p>
              </div>
              <div className="col-span-2">
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusColor(record.status)}`}
                >
                  {record.status}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-slate-700 font-sans">
                  {record.lastOpened}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Sent {record.sentDate}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-slate-600">
                <Clock
                  size={14}
                  className={
                    record.timeSpent !== "--"
                      ? "text-indigo-500"
                      : "text-slate-300"
                  }
                />
                <span className="text-sm font-mono font-bold">
                  {record.timeSpent}
                </span>
              </div>
              <div className="col-span-3">
                {record.status === "Opened" && (
                  <button className="w-full px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors border border-indigo-100">
                    <span>Draft follow-up</span>
                    <Sparkles size={12} />
                  </button>
                )}
                {record.status === "Sent" && (
                  <p className="text-xs text-slate-400 italic">
                    Waiting for open...
                  </p>
                )}
                {record.status === "Meeting" && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Meeting booked
                  </span>
                )}
                {record.status === "Interested" && (
                  <button className="w-full px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-between transition-colors shadow-sm">
                    <span>Prep for meeting</span>
                    <Sparkles size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Teaser for Analytics */}
      <div className="mt-8 bg-gradient-to-br from-[#FAFAFF] to-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        <div className="absolute right-[-40px] opacity-20 transform rotate-12 pointer-events-none">
          <Eye size={180} className="text-indigo-300" />
        </div>

        <div className="relative z-20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#C9A84C] to-[#F5A623] text-white flex items-center justify-center font-bold text-[10px] shadow-sm uppercase tracking-wider">
              Pro
            </div>
            <h3 className="font-bold font-sans text-slate-800 text-lg">
              Slide-by-Slide Analytics
            </h3>
          </div>
          <p className="text-sm text-slate-600 font-medium max-w-md">
            See exactly which slides investors spend the most time on, and where
            they lose interest. Optimize your deck automatically.
          </p>
        </div>

        <div className="relative z-20">
          <button 
            onClick={() => currentPlan === 'free' ? openUpgradeModal('data_room_analytics') : null}
            className={`px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-sm ${currentPlan === 'free' ? '' : 'hidden'}`}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ size, className }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);
