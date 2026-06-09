import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X, Star } from 'lucide-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useStore } from '../../store'
import { Template } from '../../types'
import { getInitialColor } from '../../utils'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

// Gradient palette for slide previews
const SLIDE_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-indigo-500 to-purple-700',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-cyan-600',
]

// Simulated section names per category
const SECTION_NAMES: Record<string, string[]> = {
  'Pitch Decks': [
    'Cover',
    'Problem',
    'Solution',
    'Market Size',
    'Product',
    'Traction',
    'Business Model',
    'Team',
    'Ask',
  ],
  'Business Plans': [
    'Executive Summary',
    'Company Overview',
    'Market Analysis',
    'Product & Services',
    'Marketing Strategy',
    'Operations',
    'Financial Projections',
    'Appendix',
  ],
  'Financial Models': [
    'Assumptions',
    'Revenue Model',
    'Income Statement',
    'Balance Sheet',
    'Cash Flow',
    'Scenarios',
    'Charts & KPIs',
  ],
  Marketing: [
    'Objectives',
    'Audience',
    'Messaging',
    'Channels',
    'Budget',
    'Creative Brief',
    'KPIs',
  ],
  'One-Pagers': ['Hero', 'Value Prop', 'Benefits', 'Social Proof', 'CTA'],
  Memos: ['Summary', 'Metrics', 'Progress', 'Challenges', 'Ask'],
  'Data Rooms': [
    'Index',
    'Legal',
    'Financials',
    'Product',
    'Team',
    'Commercial',
    'IP',
    'Appendix',
  ],
}

interface TemplatePreviewModalProps {
  template: Template
  onClose: () => void
}

export default function TemplatePreviewModal({
  template,
  onClose,
}: TemplatePreviewModalProps) {
  const navigate = useNavigate()
  const { user, setShowAuthModal } = useStore()
  const [slideIndex, setSlideIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const sections =
    SECTION_NAMES[template.category] ??
    Array.from({ length: Math.min(template.pages, 6) }, (_, i) => `Section ${i + 1}`)

  const totalSlides = Math.min(sections.length, 6)
  const currentSection = sections[slideIndex] ?? 'Overview'
  const gradient = SLIDE_GRADIENTS[slideIndex % SLIDE_GRADIENTS.length]
  const initial = template.title[0]?.toUpperCase() ?? '?'
  const color = getInitialColor(initial)

  function prevSlide() {
    setSlideIndex((i) => (i - 1 + totalSlides) % totalSlides)
  }

  function nextSlide() {
    setSlideIndex((i) => (i + 1) % totalSlides)
  }

  async function handleUse() {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    setLoading(true)
    try {
      const { createWorkspaceFromTemplate, inferRenderMode } = await import('../../lib/services/documents')
      const result = await createWorkspaceFromTemplate({
        userId: user.uid,
        template: {
          ...template,
          name: `${template.title} (Copy)`,
          document_type: template.category,
        },
        mode: inferRenderMode(template)
      })
      toast.success('Document created from template!')
      onClose()
      navigate(result.route)
    } catch (err: any) {
      console.error(err)
      if (err.message?.includes('FREEMIUM_LIMIT')) {
        toast.error('You have reached the maximum of 5 free workspaces. Please upgrade to Pro.')
      } else {
        toast.error('Failed to create document. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen onClose={onClose} size="xl" title="">
      <div className="flex flex-col md:flex-row gap-0 -mt-2">
        {/* ── Left: Slide Preview (60%) ── */}
        <div className="md:w-[60%] flex flex-col gap-4 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-[#E5E7EB] pb-6 md:pb-0">
          {/* Slide canvas */}
          <div
            className={`relative bg-gradient-to-br ${gradient} rounded-2xl aspect-[16/10] flex flex-col items-center justify-center text-white overflow-hidden select-none`}
          >
            {/* Watermark grid */}
            <div className="absolute inset-0 opacity-10 grid grid-cols-6 grid-rows-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-white/30" />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                {initial}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
                {template.category}
              </p>
              <h3 className="text-2xl font-bold leading-tight mb-2">
                {currentSection}
              </h3>
              <p className="text-sm opacity-70">
                {template.title}
              </p>
            </div>

            {/* Nav arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center backdrop-blur-sm transition"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center backdrop-blur-sm transition"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dot navigation */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === slideIndex
                    ? 'w-5 h-2 bg-[#3B82F6]'
                    : 'w-2 h-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Section list */}
          <div className="flex flex-wrap gap-1.5">
            {sections.slice(0, 9).map((section, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(Math.min(i, totalSlides - 1))}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${
                  i === slideIndex
                    ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                    : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#3B82F6] hover:text-[#3B82F6]'
                }`}
              >
                {section}
              </button>
            ))}
            {sections.length > 9 && (
              <span className="text-xs px-2.5 py-1 rounded-full border border-[#E5E7EB] text-[#9CA3AF]">
                +{sections.length - 9} more
              </span>
            )}
          </div>
        </div>

        {/* ── Right: Template Details (40%) ── */}
        <div className="md:w-[40%] flex flex-col gap-5 pt-6 md:pt-0 md:pl-6">
          {/* Title + badge */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-2xl font-bold text-[#111827] leading-tight">
                {template.title}
              </h2>
              <button
                onClick={onClose}
                className="text-[#9CA3AF] hover:text-[#374151] transition mt-1 flex-shrink-0"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
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

          {/* Star rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={
                    i < Math.round(template.rating ?? 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-[#D1D5DB]'
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#111827]">
              {(template.rating ?? 0).toFixed(1)}
            </span>
            <span className="text-sm text-[#6B7280]">
              ({template.reviews ?? 0} reviews)
            </span>
          </div>

          {/* Metadata grid */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {[
              { label: 'Category', value: template.category },
              { label: 'Industry', value: template.industry },
              { label: 'Pages', value: `${template.pages} ${template.pages === 1 ? 'page' : 'pages'}` },
              { label: 'Design Style', value: template.designStyle },
              { label: 'Stage', value: template.stage },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-0.5">
                  {label}
                </dt>
                <dd className="font-medium text-[#111827]">{value ?? '—'}</dd>
              </div>
            ))}
          </dl>

          {/* Description */}
          {template.description && (
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {template.description}
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-2 mt-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleUse}
              disabled={loading}
            >
              {loading ? 'Creating…' : 'Use This Template'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onClose}
            >
              Close
            </Button>
          </div>

          {/* Trust note */}
          <p className="text-xs text-[#9CA3AF] text-center">
            Free to use · No credit card required
          </p>
        </div>
      </div>
    </Modal>
  )
}
