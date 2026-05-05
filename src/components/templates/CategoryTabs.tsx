import React from 'react'
import { useStore } from '../../store'

const ROW_ONE = [
  'All Templates',
  'Pitch Decks',
  'Business Plans',
  'Financial Models',
  'Marketing',
]
const ROW_TWO = ['One-Pagers', 'Memos', 'Data Rooms']

export default function CategoryTabs() {
  const { templateFilters, setTemplateFilters } = useStore()
  const activeCategory = templateFilters.category ?? 'All Templates'

  function select(cat: string) {
    setTemplateFilters({ category: cat === 'All Templates' ? '' : cat })
  }

  function TabButton({ label }: { label: string }) {
    const isActive =
      label === 'All Templates'
        ? !templateFilters.category || templateFilters.category === ''
        : templateFilters.category === label

    return (
      <button
        onClick={() => select(label)}
        className={`whitespace-nowrap text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-150 ${
          isActive
            ? 'bg-[#3B82F6] text-white shadow-sm'
            : 'text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#374151]'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {ROW_ONE.map((cat) => (
          <TabButton key={cat} label={cat} />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ROW_TWO.map((cat) => (
          <TabButton key={cat} label={cat} />
        ))}
      </div>
    </div>
  )
}
