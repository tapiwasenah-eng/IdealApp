export interface GeneratedDocument {
  title: string
  companyName?: string
  documentType: string
  colorScheme: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  sections: DocumentSection[]
}

export interface DocumentSection {
  id: string
  type: string
  heading?: string
  subheading?: string
  body?: string
  backgroundColor?: string
  textColor?: string
  bullets?: string[]
  metrics?: Array<{
    label: string
    value: string
    trend?: 'up' | 'down' | 'neutral'
    color?: string
  }>
  tableData?: {
    headers: string[]
    rows: string[][]
  }
  layoutHint?: 'full_width' | 'two_column' | 'centered' | 'sidebar_right' | 'left-aligned' | 'footer'
}

export interface Document {
  id: string
  title: string
  type: string
  status: 'draft' | 'published' | 'archived' | 'in_progress' | 'completed' | 'generating' | 'error'
  ownerId: string
  collaborators: string[]
  canvasJSON: string | null
  createdAt: any // Firestore Timestamp or Date
  updatedAt: any
  workspaceId: string | null
  templateId?: string
}

export interface Template {
  id: string
  name?: string
  title: string
  description: string
  category: 'pitch-deck' | 'business-plan' | 'financial-model' | 'one-pager' | 'memo' | string
  industry?: string
  stage?: string
  popular?: boolean
  designStyle?: string
  badge?: string | null
  rating?: number
  pageCount?: number
  pages?: number
  reviews?: number
  isPremium?: boolean
  icon?: any
  thumbnailColor?: string
  canvasJSON?: string
  createdAt?: string
  colorScheme?: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  sections?: TemplateSection[]
  content?: {
    sections: any[]
  }
}

export interface TemplateSection {
  id: string;
  heading?: string;
  subheading?: string;
  type: 'text' | 'bullets' | 'table' | 'metrics' | 'cover' | 'divider' | string;
  body?: string;
  content?: string;
  bullets?: string[];
  tableData?: { headers: string[]; rows: string[][] };
  metrics?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[];
  layoutHint?: 'full_width' | 'two_column' | 'centered' | 'sidebar_right' | 'left-aligned' | 'footer';
  backgroundColor?: string;
  textColor?: string;
}
