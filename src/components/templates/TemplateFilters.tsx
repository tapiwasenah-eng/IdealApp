import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../../store'
import {
  INDUSTRIES,
  COMPANY_STAGES,
  DESIGN_STYLES,
} from '../../constants'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function FilterSection({ title, children }: SectionProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border-b border-[#E5E7EB] pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold text-[#111827] mb-3"
        onClick={() => setExpanded((e) => !e)}
      >
        {title}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  )
}

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function FilterCheckbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition ${
          checked
            ? 'bg-[#3B82F6] border-[#3B82F6]'
            : 'border-[#D1D5DB] group-hover:border-[#3B82F6]'
        }`}
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 10 8"
          >
            <path
              d="M1 4l3 3 5-6"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-sm text-[#374151] group-hover:text-[#111827] transition">
        {label}
      </span>
    </label>
  )
}

export default function TemplateFilters() {
  const { templateFilters, setTemplateFilters } = useStore()

  function toggleItem(
    key: 'industry' | 'stage' | 'designStyle',
    value: string,
    checked: boolean
  ) {
    const current: string[] = (templateFilters[key] as string[]) ?? []
    setTemplateFilters({
      [key]: checked
        ? [...current, value]
        : current.filter((v) => v !== value),
    })
  }

  function clearAll() {
    setTemplateFilters({ industry: [], stage: [], designStyle: [] })
  }

  const hasFilters =
    (templateFilters.industry?.length ?? 0) > 0 ||
    (templateFilters.stage?.length ?? 0) > 0 ||
    (templateFilters.designStyle?.length ?? 0) > 0

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-[#111827]">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-[#3B82F6] hover:text-[#2563EB] transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Industry */}
      <FilterSection title="Industry">
        {INDUSTRIES.map((industry) => (
          <FilterCheckbox
            key={industry}
            label={industry}
            checked={(templateFilters.industry as string[])?.includes(industry) ?? false}
            onChange={(checked) => toggleItem('industry', industry, checked)}
          />
        ))}
      </FilterSection>

      {/* Company Stage */}
      <FilterSection title="Company Stage">
        {COMPANY_STAGES.map((stage) => (
          <FilterCheckbox
            key={stage}
            label={stage}
            checked={(templateFilters.stage as string[])?.includes(stage) ?? false}
            onChange={(checked) => toggleItem('stage', stage, checked)}
          />
        ))}
      </FilterSection>

      {/* Design Style */}
      <FilterSection title="Design Style">
        {DESIGN_STYLES.map((style) => (
          <FilterCheckbox
            key={style}
            label={style}
            checked={(templateFilters.designStyle as string[])?.includes(style) ?? false}
            onChange={(checked) => toggleItem('designStyle', style, checked)}
          />
        ))}
      </FilterSection>
    </div>
  )
}
