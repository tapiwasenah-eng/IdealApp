// src/lib/utils.ts
import { format, formatDistanceToNow } from 'date-fns';

/* ── className merger ─────────────────────────────────────── */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/* ── Date helpers ─────────────────────────────────────────── */
export function formatDate(date: any): string {
  if (!date) return 'N/A';
  
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date?.toDate === 'function') {
    // Handle Firestore Timestamp
    d = date.toDate();
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  return format(d, 'MMM d, yyyy');
}

export function formatRelativeTime(date: any): string {
  if (!date) return 'N/A';
  
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date?.toDate === 'function') {
    // Handle Firestore Timestamp
    d = date.toDate();
  } else {
    d = new Date(date);
  }

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  return formatDistanceToNow(d, { addSuffix: true });
}

/* ── ID generation ────────────────────────────────────────── */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ── Text helpers ─────────────────────────────────────────── */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/* ── Avatar color from initial ────────────────────────────── */
const BRAND_COLORS = [
  '#3B82F6', // brand-blue
  '#8B5CF6', // brand-purple
  '#0D9488', // brand-teal
  '#F59E0B', // brand-orange
  '#10B981', // brand-green
  '#EC4899', // brand-pink
];

export function getInitialColor(letter: string): string {
  const idx = letter.toUpperCase().charCodeAt(0) % BRAND_COLORS.length;
  return BRAND_COLORS[idx];
}

/* ── Constants ────────────────────────────────────────────── */
export const TEMPLATE_CATEGORIES = [
  'All',
  'Pitch Deck',
  'Business Plan',
  'Investor Memo',
  'One-Pager',
  'Market Analysis',
  'Financial Model',
  'Executive Summary',
  'Go-to-Market',
  'OKRs & Roadmap',
] as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];

export const INDUSTRIES = [
  'SaaS / Software',
  'FinTech',
  'HealthTech',
  'EdTech',
  'CleanTech / Climate',
  'Consumer',
  'E-commerce',
  'AI / ML',
  'Web3 / Crypto',
  'DeepTech / Hardware',
  'Marketplace',
  'Media & Entertainment',
  'Real Estate',
  'Agriculture',
  'Logistics & Supply Chain',
  'Other',
] as const;

export type Industry = typeof INDUSTRIES[number];

export const COMPANY_STAGES = [
  'Idea / Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Growth',
  'Public',
] as const;

export type CompanyStage = typeof COMPANY_STAGES[number];

export const DESIGN_STYLES = [
  { id: 'modern',      label: 'Modern',      description: 'Clean lines, ample whitespace, minimal color' },
  { id: 'bold',        label: 'Bold',        description: 'High contrast, strong typography, vivid accents' },
  { id: 'corporate',   label: 'Corporate',   description: 'Professional, conservative, trust-inspiring' },
  { id: 'playful',     label: 'Playful',     description: 'Rounded shapes, bright palette, approachable feel' },
  { id: 'dark',        label: 'Dark Mode',   description: 'Dark backgrounds, glowing accents, premium look' },
  { id: 'minimal',     label: 'Minimal',     description: 'Typography-led, monochrome, editorial clarity' },
] as const;

export type DesignStyleId = typeof DESIGN_STYLES[number]['id'];

/* ── Badge styles ─────────────────────────────────────────── */
export const BADGE_STYLES: Record<string, string> = {
  Popular: 'bg-brand-blue/10 text-brand-blue',
  New:     'bg-brand-green/10 text-brand-green',
  Pro:     'bg-brand-purple/10 text-brand-purple',
  Free:    'bg-brand-teal/10 text-brand-teal',
  Hot:     'bg-brand-orange/10 text-brand-orange',
  Beta:    'bg-brand-pink/10 text-brand-pink',
};

export type BadgeLabel = keyof typeof BADGE_STYLES;
