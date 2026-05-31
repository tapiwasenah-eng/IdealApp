// src/components/ui/AIModelSelector.tsx
import { useEffect, useRef, useState } from 'react'
import { getAIStatus, type AIStatusResponse, type ModelProvider } from '../../services/documentGenerator'
import { useStore } from '../../store'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModelOption {
  value: ModelProvider
  label: string
}

const MODEL_OPTIONS: ModelOption[] = [
  { value: 'auto', label: 'Auto (Best Available)' },
  { value: 'claude', label: 'Claude Sonnet 3.5' },
  { value: 'gemini', label: 'Gemini 2.0 Flash' }
]

// ─── Status Indicator ─────────────────────────────────────────────────────────

function StatusDot({ status }: { status: 'claude' | 'gemini' | 'none' }) {
  const colors: Record<string, string> = {
    claude: '#10b981', // green
    gemini: '#3b82f6', // blue
    none: '#ef4444'    // red
  }
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: colors[status],
        marginRight: 6,
        flexShrink: 0,
        boxShadow: `0 0 0 2px ${colors[status]}33`
      }}
    />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIModelSelector() {
  const [aiStatus, setAIStatus] = useState<AIStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Read/write preferred model from Zustand store
  const preferredModel = useStore((s) => s.preferredModel ?? 'auto')
  const setPreferredModel = useStore((s) => s.setPreferredModel)

  // Fetch AI status on mount
  useEffect(() => {
    getAIStatus()
      .then(setAIStatus)
      .catch(() => setAIStatus(null))
      .finally(() => setLoading(false))
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  // Derive active status
  const dotStatus: 'claude' | 'gemini' | 'none' = aiStatus?.claude
    ? 'claude'
    : aiStatus?.gemini
    ? 'gemini'
    : 'none'

  const displayLabel = loading
    ? 'Checking AI...'
    : aiStatus?.status === 'no_keys'
    ? 'No AI'
    : aiStatus?.primaryModel ?? 'AI Ready'

  const selectedOption =
    MODEL_OPTIONS.find((o) => o.value === preferredModel) ?? MODEL_OPTIONS[0]

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}
    >
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '5px 10px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(255,255,255,0.06)',
          color: '#e2e8f0',
          fontSize: 12,
          fontWeight: 500,
          cursor: loading ? 'default' : 'pointer',
          transition: 'background 0.15s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'
        }}
        aria-label="Select AI model"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {!loading && <StatusDot status={dotStatus} />}
        <span>{loading ? 'Checking AI…' : displayLabel}</span>
        <svg
          width={10}
          height={10}
          viewBox="0 0 10 10"
          fill="none"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
            marginLeft: 2,
            opacity: 0.6
          }}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          aria-label="AI model selection"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 200,
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 9999,
            overflow: 'hidden'
          }}
        >
          {/* Status banner */}
          {aiStatus && (
            <div style={{
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              fontSize: 11,
              color: '#94a3b8'
            }}>
              {aiStatus.claude && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                  <StatusDot status="claude" />
                  <span>Claude Sonnet 3.5 — available</span>
                </div>
              )}
              {aiStatus.gemini && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StatusDot status="gemini" />
                  <span>Gemini 2.0 Flash — available</span>
                </div>
              )}
              {!aiStatus.claude && !aiStatus.gemini && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StatusDot status="none" />
                  <span>No API keys configured</span>
                </div>
              )}
            </div>
          )}

          {/* Model options */}
          <div style={{ padding: '4px 0' }}>
            <div style={{
              padding: '4px 12px 2px',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#64748b'
            }}>
              Preferred Model
            </div>
            {MODEL_OPTIONS.map((option) => {
              const isSelected = preferredModel === option.value
              const isDisabled =
                (option.value === 'claude' && !aiStatus?.claude) ||
                (option.value === 'gemini' && !aiStatus?.gemini)

              return (
                <button
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      setPreferredModel(option.value)
                      setOpen(false)
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '7px 12px',
                    background: isSelected ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    color: isDisabled ? '#475569' : '#e2e8f0',
                    fontSize: 13,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled && !isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = isSelected ? 'rgba(255,255,255,0.08)' : 'transparent'
                    }
                  }}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="#10b981" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {isDisabled && !isSelected && (
                    <span style={{ fontSize: 10, color: '#475569' }}>unavailable</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer hint */}
          <div style={{
            padding: '6px 12px 8px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: 10,
            color: '#475569',
            lineHeight: 1.4
          }}>
            Add API keys in Secrets to enable models.
            <br />
            "Auto" uses Claude when available, else Gemini.
          </div>
        </div>
      )}
    </div>
  )
}

export default AIModelSelector
