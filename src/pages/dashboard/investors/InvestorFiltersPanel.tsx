import React from "react";
import { useInvestorStore } from "../../../lib/store/useInvestorStore";
import { designSystem } from "../../../lib/design-system";

export const InvestorFiltersPanel: React.FC = () => {
  const { colors, typography } = designSystem;
  const { filters, setFilters } = useInvestorStore();

  return (
    <div
      className="w-[280px] h-full flex-shrink-0 border-r bg-white overflow-y-auto"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div className="p-5 border-b border-slate-100">
        <h3
          style={{
            fontFamily: typography.fonts.interface,
            fontWeight: 600,
            fontSize: typography.scale.bodyM.fontSize,
            color: colors.primary.obsidian,
          }}
        >
          Filters
        </h3>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Stage
          </h4>
          <div className="space-y-2">
            {["Pre-seed", "Seed", "Series A", "Series B+"].map((stage) => (
              <label
                key={stage}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">{stage}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Sector focus
          </h4>
          <div className="space-y-2">
            {[
              "AI/ML",
              "Enterprise SaaS",
              "LegalTech",
              "Fintech",
              "Consumer",
            ].map((sector) => (
              <label
                key={sector}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Check Size ($M)
          </h4>
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={filters.checkSizeMax / 1000000}
            onChange={(e) =>
              setFilters({
                checkSizeMax: parseFloat(e.target.value) * 1000000,
              })
            }
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Any</span>
            <span>
              Up to $
              {filters.checkSizeMax >= 20000000
                ? "20M+"
                : (filters.checkSizeMax / 1000000).toFixed(1) + "M"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
