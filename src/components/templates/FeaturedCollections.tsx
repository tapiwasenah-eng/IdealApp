import React from 'react'
import { BarChart2, Zap, Gift } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

const COLLECTIONS = [
  {
    name: 'Investor Ready Pack',
    description:
      'Everything you need to raise your next round — pitch decks, financial models, data room templates, and investor memos, all aligned in one cohesive set.',
    count: 12,
    badge: 'Popular' as const,
    icon: BarChart2,
    color: 'bg-purple-500',
  },
  {
    name: 'Startup Kit',
    description:
      'Launch faster with a curated bundle covering your business plan, one-pager, go-to-market strategy, and financial projections — built for pre-seed and seed founders.',
    count: 18,
    badge: 'New' as const,
    icon: Zap,
    color: 'bg-green-500',
  },
  {
    name: 'Marketing Bundle',
    description:
      'Campaigns, briefs, channel playbooks, and content calendars. Everything a growth team needs to move from strategy to execution without starting from scratch.',
    count: 15,
    badge: 'Pro' as const,
    icon: Gift,
    color: 'bg-pink-500',
  },
]

export default function FeaturedCollections() {
  return (
    <section className="py-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#111827]">Featured Collections</h2>
        <p className="text-[#6B7280] text-sm mt-1">
          Curated bundles for specific goals — use one template or the whole set.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLLECTIONS.map(({ name, description, count, badge, icon: Icon, color }) => (
          <div
            key={name}
            className="bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4"
          >
            {/* Icon */}
            <div
              className={`${color} rounded-xl p-3 text-white w-fit`}
            >
              <Icon size={22} />
            </div>

            {/* Name + badge */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-xl font-bold text-[#111827] leading-snug">
                  {name}
                </h3>
                <Badge
                  variant={
                    badge === 'Popular'
                      ? 'popular'
                      : badge === 'New'
                      ? 'new'
                      : 'pro'
                  }
                >
                  {badge}
                </Badge>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F3F4F6]">
              <span className="text-sm text-[#6B7280] font-medium">
                {count} templates
              </span>
              <Button variant="outline" size="sm">
                Browse Collection
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
