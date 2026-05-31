import React, { useEffect } from "react";
import { useInvestorStore } from "../../../lib/store/useInvestorStore";
import { designSystem } from "../../../lib/design-system";
import { InvestorFiltersPanel } from "./InvestorFiltersPanel";
import { InvestorCard } from "./InvestorCard";
import { InvestorProfileDrawer } from "./InvestorProfileDrawer";
import { PitchPackageBuilder } from "./PitchPackageBuilder";
import { Search } from "lucide-react";

export const InvestorExplorerPage: React.FC = () => {
  const { investors, selectedInvestorId, filters, setFilters, loadInvestors, isLoading } =
    useInvestorStore();
  const { colors, typography, shadows } = designSystem;

  useEffect(() => {
    loadInvestors();
  }, [loadInvestors]);

  const filteredInvestors = investors.filter((inv) => {
    if (
      filters.search &&
      !inv.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !inv.firm.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      <InvestorFiltersPanel />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b bg-white border-slate-100 shadow-sm z-10 flex items-center justify-between flex-shrink-0">
          <div>
            <h1
              style={{
                fontFamily: typography.fonts.interface,
                fontWeight: 600,
                fontSize: typography.scale.h3.fontSize,
                color: colors.primary.obsidian,
              }}
            >
              Investor Match
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              We've found {filteredInvestors.length} matches based on your
              Company DNA.
            </p>
          </div>

          <div className="relative w-64">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search investors or firms..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFF]">
          <div className="max-w-5xl mx-auto space-y-4 pb-20">
            {filteredInvestors.map((investor) => (
              <InvestorCard key={investor.id} investor={investor} />
            ))}
          </div>
        </div>
      </div>

      <InvestorProfileDrawer />
    </div>
  );
};
