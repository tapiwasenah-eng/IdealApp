// src/services/documentGenerator.ts
// Client-side service — mirrors the server Zod schemas as TypeScript types

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModelProvider = 'claude' | 'gemini' | 'auto'

export type SectionType =
  | 'cover'
  | 'executive_summary'
  | 'problem'
  | 'solution'
  | 'market_analysis'
  | 'business_model'
  | 'traction'
  | 'financial_projections'
  | 'team'
  | 'competition'
  | 'roadmap'
  | 'investment_ask'
  | 'appendix'
  | 'swot_grid'
  | 'text_section'

export type LayoutHint = 'full_width' | 'two_column' | 'centered' | 'sidebar_right'
export type FontStyle = 'modern' | 'classic' | 'bold' | 'minimal'
export type TrendDirection = 'up' | 'down' | 'neutral'

export interface SectionMetric {
  label: string
  value: string
  trend?: TrendDirection
  color?: string
}

export interface SectionTableData {
  headers: string[]
  rows: string[][]
}

export interface DocumentSection {
  id: string
  type: SectionType
  heading: string
  subheading?: string
  body: string
  bullets?: string[]
  metrics?: SectionMetric[]
  tableData?: SectionTableData
  backgroundColor?: string
  textColor?: string
  layoutHint?: LayoutHint
}

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface GeneratedDocument {
  title: string
  subtitle?: string
  companyName: string
  sections: DocumentSection[]
  colorScheme: ColorScheme
  fontStyle: FontStyle
  estimatedPages: number
  generatedBy: 'claude' | 'gemini'
  confidence: number
}

export interface GenerateDocumentParams {
  documentType: string
  companyName: string
  industry: string
  description: string
  stage: string
  targetAudience?: string
  keyMetrics?: string
  additionalContext?: string
}

export interface GenerateDocumentResponse {
  success: boolean
  document?: GeneratedDocument
  error?: string
}

export interface GenerateFromPromptResponse {
  success: boolean
  document?: GeneratedDocument
  extractedParams?: GenerateDocumentParams
  error?: string
}

export interface EditSectionResponse {
  success: boolean
  section?: DocumentSection
  error?: string
}

export interface FillTemplateResponse {
  success: boolean
  sections?: DocumentSection[]
  error?: string
}

export interface AIStatusResponse {
  claude: boolean
  gemini: boolean
  primaryModel: string
  status: 'ready' | 'no_keys'
}

// ─── API Base ─────────────────────────────────────────────────────────────────

const API_BASE = '/api'

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`)
  }
  return data as T
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Generate a complete venture document from structured parameters.
 * Uses Claude Sonnet 3.5 by default, falls back to Gemini 2.0 Flash.
 */
export async function generateDocument(
  params: GenerateDocumentParams,
  preferredModel: ModelProvider = 'auto'
): Promise<GenerateDocumentResponse> {
  return apiFetch<GenerateDocumentResponse>('/generate-document', {
    method: 'POST',
    body: JSON.stringify({
      ...params,
      preferredModel: preferredModel === 'auto' ? undefined : preferredModel
    })
  })
}

/**
 * Generate a document from a natural language prompt.
 * The server extracts structured params then calls the generation pipeline.
 */
export async function generateFromPrompt(
  prompt: string,
  preferredModel: ModelProvider = 'auto'
): Promise<GenerateFromPromptResponse> {
  return apiFetch<GenerateFromPromptResponse>('/generate-from-prompt', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      preferredModel: preferredModel === 'auto' ? undefined : preferredModel
    })
  })
}

/**
 * AI-powered section editing. Pass the current section and an instruction;
 * receive the rewritten section back.
 */
export async function editSection(
  section: DocumentSection,
  instruction: string,
  companyContext?: string
): Promise<EditSectionResponse> {
  return apiFetch<EditSectionResponse>('/edit-section', {
    method: 'POST',
    body: JSON.stringify({
      section,
      editInstruction: instruction,
      companyContext
    })
  })
}

/**
 * Fill a template's blank/placeholder sections with AI-generated content
 * tailored to the provided company info.
 */
export async function fillTemplate(
  templateSections: DocumentSection[],
  companyInfo: {
    companyName: string
    industry: string
    stage: string
    description: string
  }
): Promise<FillTemplateResponse> {
  return apiFetch<FillTemplateResponse>('/fill-template', {
    method: 'POST',
    body: JSON.stringify({
      templateSections,
      ...companyInfo
    })
  })
}

/**
 * Check which AI providers are currently available (based on server env keys).
 */
export async function getAIStatus(): Promise<AIStatusResponse> {
  return apiFetch<AIStatusResponse>('/ai-status')
}
