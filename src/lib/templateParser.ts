// src/lib/templateParser.ts

import { DocumentSection } from '../types';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type FieldType = 'text' | 'number' | 'textarea';

export interface TemplateField {
  fieldName: string;       // raw snake_case name, e.g. "company_name"
  displayLabel: string;    // Title Case display, e.g. "Company Name"
  sectionId: string;       // which section first defines this field
  fieldType: FieldType;
}

export interface FieldProgress {
  filled: number;
  total: number;
  percentage: number;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Extract every {{field_name}} pattern from an arbitrary string. */
function extractFieldsFromString(text: string): string[] {
  if (!text) return [];
  const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

/** Convert snake_case to Title Case for display labels. */
function toTitleCase(snakeCase: string): string {
  return snakeCase
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Infer the field type from the field name using keyword matching. */
function inferFieldType(fieldName: string): FieldType {
  const lower = fieldName.toLowerCase();

  const textareaKeywords = [
    'description',
    'statement',
    'summary',
    'background',
    'overview',
    'approach',
    'strategy',
    'detail',
    'note',
    'explanation',
    'rationale',
    'methodology',
    'plan',
    'pitch',
    'bio',
  ];

  const numberKeywords = [
    'amount',
    'value',
    'cost',
    'price',
    'revenue',
    'count',
    'rate',
    'percentage',
    'pct',
    'margin',
    'budget',
    'salary',
    'mrr',
    'arr',
    'ltv',
    'cac',
    'tam',
    'sam',
    'som',
    'aov',
    'acv',
    'burn',
    'raise',
    'valuation',
    'runway',
    'growth',
    'churn',
    'size',
    'headcount',
    'months',
    'days',
    'years',
    'year',
    'q1',
    'q2',
    'q3',
    'q4',
    'y1',
    'y2',
    'y3',
  ];

  if (textareaKeywords.some((kw) => lower.includes(kw))) return 'textarea';
  if (numberKeywords.some((kw) => lower.includes(kw))) return 'number';
  return 'text';
}

// ──────────────────────────────────────────────
// Core Functions
// ──────────────────────────────────────────────

/**
 * Scans all section content (heading, subheading, body, bullets, metrics,
 * and tableData) and returns a deduplicated array of TemplateField objects.
 *
 * Fields that appear in multiple sections are attributed to the FIRST section
 * in which they appear.
 */
export function extractFields(sections: DocumentSection[]): TemplateField[] {
  const seen = new Map<string, TemplateField>();

  for (const section of sections) {
    const rawFields: string[] = [];

    // Collect raw field names from all text-bearing properties
    if (section.heading)    rawFields.push(...extractFieldsFromString(section.heading));
    if (section.subheading) rawFields.push(...extractFieldsFromString(section.subheading));
    if (section.body)       rawFields.push(...extractFieldsFromString(section.body));

    if (section.bullets) {
      for (const bullet of section.bullets) {
        rawFields.push(...extractFieldsFromString(bullet));
      }
    }

    if (section.metrics) {
      for (const metric of section.metrics) {
        rawFields.push(...extractFieldsFromString(metric.label));
        rawFields.push(...extractFieldsFromString(metric.value));
      }
    }

    if (section.tableData) {
      for (const header of section.tableData.headers) {
        rawFields.push(...extractFieldsFromString(header));
      }
      for (const row of section.tableData.rows) {
        for (const cell of row) {
          rawFields.push(...extractFieldsFromString(cell));
        }
      }
    }

    // Register each unique field
    for (const fieldName of rawFields) {
      if (!seen.has(fieldName)) {
        seen.set(fieldName, {
          fieldName,
          displayLabel: toTitleCase(fieldName),
          sectionId: section.id,
          fieldType: inferFieldType(fieldName),
        });
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * Returns a new sections array with all {{field_name}} placeholders replaced
 * by the corresponding value from fieldValues. Fields without a value are left
 * as-is. Performs a deep clone of the input so the original is never mutated.
 */
export function fillFields(
  sections: DocumentSection[],
  fieldValues: Record<string, string>
): DocumentSection[] {
  const cloned: DocumentSection[] = JSON.parse(JSON.stringify(sections));

  function replaceInString(text: string): string {
    if (!text) return text;
    return text.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, fieldName) => {
      return fieldValues[fieldName] !== undefined ? fieldValues[fieldName] : match;
    });
  }

  for (const section of cloned) {
    if (section.heading)    section.heading    = replaceInString(section.heading);
    if (section.subheading) section.subheading = replaceInString(section.subheading);
    if (section.body)       section.body       = replaceInString(section.body);

    if (section.bullets) {
      section.bullets = section.bullets.map(replaceInString);
    }

    if (section.metrics) {
      section.metrics = section.metrics.map((m) => ({
        ...m,
        label: replaceInString(m.label),
        value: replaceInString(m.value),
      }));
    }

    if (section.tableData) {
      section.tableData = {
        headers: section.tableData.headers.map(replaceInString),
        rows: section.tableData.rows.map((row) => row.map(replaceInString)),
      };
    }
  }

  return cloned;
}

/**
 * Counts how many unique template fields have been filled in fieldValues.
 * Returns a progress object with filled count, total count, and percentage.
 */
export function getFieldProgress(
  sections: DocumentSection[],
  fieldValues: Record<string, string>
): FieldProgress {
  const fields = extractFields(sections);
  const total = fields.length;

  if (total === 0) return { filled: 0, total: 0, percentage: 100 };

  const filled = fields.filter(
    (f) => fieldValues[f.fieldName] !== undefined && fieldValues[f.fieldName].trim() !== ''
  ).length;

  return {
    filled,
    total,
    percentage: Math.round((filled / total) * 100),
  };
}

/**
 * Returns a human-readable preview string for a single section.
 * Filled fields are shown with their value; unfilled fields are shown as "___".
 * Uses only the section body and bullets for brevity.
 */
export function getSectionPreview(
  section: DocumentSection,
  fieldValues: Record<string, string>
): string {
  function previewString(text: string): string {
    if (!text) return '';
    return text.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, fieldName) => {
      const value = fieldValues[fieldName];
      return value && value.trim() !== '' ? value : '___';
    });
  }

  const lines: string[] = [];

  if (section.heading) {
    lines.push(`# ${previewString(section.heading)}`);
  }

  if (section.subheading) {
    lines.push(previewString(section.subheading));
  }

  if (section.body) {
    lines.push('');
    lines.push(previewString(section.body));
  }

  if (section.bullets && section.bullets.length > 0) {
    lines.push('');
    for (const bullet of section.bullets) {
      lines.push(`• ${previewString(bullet)}`);
    }
  }

  if (section.metrics && section.metrics.length > 0) {
    lines.push('');
    for (const metric of section.metrics) {
      lines.push(`[${previewString(metric.label)}: ${previewString(metric.value)}]`);
    }
  }

  return lines.join('\n');
}
