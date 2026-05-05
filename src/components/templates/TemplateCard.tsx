import React from 'react'
import { Star } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Template } from '../../types'
import { getInitialColor } from '../../utils'

interface TemplateCardProps {
  template: Template
  onUseTemplate: (template: Template) => void
  onPreview: (template: Template) => void
}

export default function TemplateCard({
  template,
  onUseTemplate,
  onPreview,
}: TemplateCardProps) {
  const initial = template.title[0]?.toUpperCase() ?? '?'
  const color = getInitialColor(initial)

  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Colored initial avatar */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-[#111827] leading-snug line-clamp-2">
              {template.title}
            </h3>
            {template.badge && (
              <Badge
                variant={
                  template.badge === 'Popular'
                    ? 'popular'
                    : template.badge === 'New'
                    ? 'new'
                    : 'pro'
                }
              >
                {template.badge}
              </Badge>
            )}
          </div>

          {/* Category + pages */}
          <p className="text-xs text-[#6B7280] mt-0.5">
            {template.category} · {template.pages}{' '}
            {template.pages === 1 ? 'page' : 'pages'}
          </p>
        </div>
      </div>

      {/* Description */}
      {template.description && (
        <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">
          {template.description}
        </p>
      )}

      {/* Star rating */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={
                i < Math.round(template.rating ?? 0)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-[#D1D5DB]'
              }
            />
          ))}
        </div>
        <span className="text-xs font-medium text-[#374151]">
          {(template.rating ?? 0).toFixed(1)}
        </span>
        <span className="text-xs text-[#9CA3AF]">
          ({template.reviews ?? 0})
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => onUseTemplate(template)}
        >
          Use Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(template)}
        >
          Preview
        </Button>
      </div>
    </div>
  )
}
