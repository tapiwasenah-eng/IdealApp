// src/components/templates/TemplateEditor.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Save,
  Download,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "../../store";
import { Template, DocumentSection } from "../../types";
import {
  extractFields,
  fillFields,
  getFieldProgress,
  TemplateField,
} from "../../lib/templateParser";
import { cn } from "../../lib/utils";
import { auth } from "../../lib/firebase";
import { exportGeneratedDocumentToPdf } from "../../services/exportService";

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

interface ProgressBarProps {
  filled: number;
  total: number;
  percentage: number;
}

function ProgressBar({ filled, total, percentage }: ProgressBarProps) {
  const color =
    percentage >= 70
      ? "bg-emerald-500"
      : percentage >= 30
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          {filled} of {total} fields completed
        </span>
        <span
          className={cn(
            "font-semibold",
            percentage >= 70
              ? "text-emerald-600"
              : percentage >= 30
                ? "text-amber-600"
                : "text-rose-600",
          )}
        >
          {percentage}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────

interface SectionPreviewCardProps {
  section: DocumentSection;
  fieldValues: Record<string, string>;
  onFieldClick: (fieldName: string) => void;
}

function SectionPreviewCard({
  section,
  fieldValues,
  onFieldClick,
}: SectionPreviewCardProps) {
  /**
   * Render a piece of text with {{field}} markers highlighted.
   * Filled fields → green, unfilled → amber/orange "pill" that is clickable.
   */
  function renderHighlightedText(text: string) {
    if (!text) return null;
    const parts = text.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);
    return parts.map((part, idx) => {
      const fieldMatch = part.match(/^\{\{([a-zA-Z0-9_]+)\}\}$/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const value = fieldValues[fieldName];
        const isFilled = value && value.trim() !== "";

        if (isFilled) {
          return (
            <span
              key={idx}
              className="text-emerald-600 font-medium cursor-pointer hover:underline"
              onClick={() => onFieldClick(fieldName)}
            >
              {value}
            </span>
          );
        }

        return (
          <button
            key={idx}
            className="inline-block mx-0.5 px-1.5 py-0.5 rounded text-xs font-medium
                       bg-amber-100 text-amber-700 border border-amber-300
                       hover:bg-amber-200 transition-colors cursor-pointer"
            onClick={() => onFieldClick(fieldName)}
          >
            {fieldName}
          </button>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }

  return (
    <div
      className="rounded-xl border border-gray-200 shadow-sm p-5 space-y-3 transition-all"
      style={{
        backgroundColor: section.backgroundColor || "#FFFFFF",
        color: section.textColor || "inherit",
      }}
    >
      {/* Section heading */}
      {section.heading && (
        <h3
          className="text-lg font-semibold leading-snug"
          style={{ color: section.textColor || "#111827" }}
        >
          {renderHighlightedText(section.heading)}
        </h3>
      )}

      {/* Subheading */}
      {section.subheading && (
        <p
          className="text-base"
          style={{
            color: section.textColor ? `${section.textColor}CC` : "#4B5563",
          }}
        >
          {renderHighlightedText(section.subheading)}
        </p>
      )}

      {/* Body */}
      {section.body && (
        <p
          className="text-sm whitespace-pre-line leading-relaxed"
          style={{
            color: section.textColor ? `${section.textColor}E6` : "#374151",
          }}
        >
          {renderHighlightedText(section.body)}
        </p>
      )}

      {/* Bullets */}
      {section.bullets && section.bullets.length > 0 && (
        <ul className="space-y-1">
          {section.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span
                className="mt-0.5 shrink-0"
                style={{ color: section.textColor || "#9CA3AF" }}
              >
                •
              </span>
              <span
                style={{
                  color: section.textColor
                    ? `${section.textColor}E6`
                    : "#374151",
                }}
              >
                {renderHighlightedText(bullet)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Metrics */}
      {section.metrics && section.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {section.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2"
            >
              <p className="text-xs text-gray-500 truncate">
                {renderHighlightedText(metric.label)}
              </p>
              <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
                {renderHighlightedText(metric.value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {section.tableData && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50">
              <tr>
                {section.tableData.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-3 py-2 font-semibold text-gray-600 border-b border-gray-200"
                  >
                    {renderHighlightedText(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.tableData.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-3 py-2 text-gray-700">
                      {renderHighlightedText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────

interface FieldFormProps {
  fields: TemplateField[];
  sections: DocumentSection[];
  fieldValues: Record<string, string>;
  onFieldChange: (fieldName: string, value: string) => void;
  focusedField: string | null;
}

function FieldForm({
  fields,
  sections,
  fieldValues,
  onFieldChange,
  focusedField,
}: FieldFormProps) {
  // Group fields by sectionId
  const grouped = useMemo(() => {
    const map = new Map<string, TemplateField[]>();
    for (const field of fields) {
      if (!map.has(field.sectionId)) map.set(field.sectionId, []);
      map.get(field.sectionId)!.push(field);
    }
    return map;
  }, [fields]);

  // Accordion state — all open by default
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    return new Set(sections.map((s) => s.id));
  });

  const fieldRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Scroll to focused field when triggered from preview click
  useEffect(() => {
    if (focusedField) {
      const el = fieldRefs.current.get(focusedField);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus?.();
      }
    }
  }, [focusedField]);

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }

  function getSectionTitle(sectionId: string): string {
    const section = sections.find((s) => s.id === sectionId);
    return section?.heading || sectionId;
  }

  function getSectionProgress(sectionId: string) {
    const sectionFields = grouped.get(sectionId) ?? [];
    const filled = sectionFields.filter(
      (f) => fieldValues[f.fieldName] && fieldValues[f.fieldName].trim() !== "",
    ).length;
    return { filled, total: sectionFields.length };
  }

  return (
    <div className="space-y-2">
      {sections
        .filter((s) => grouped.has(s.id))
        .map((section) => {
          const sectionFields = grouped.get(section.id) ?? [];
          const { filled, total } = getSectionProgress(section.id);
          const isOpen = openSections.has(section.id);

          return (
            <div
              key={section.id}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              {/* Accordion header */}
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                  <span className="font-medium text-gray-800 text-sm text-left">
                    {getSectionTitle(section.id)}
                  </span>
                </div>
                <span className="text-xs text-gray-500 ml-2 shrink-0">
                  {filled}/{total}
                  {filled === total && total > 0 && (
                    <CheckCircle2 className="inline ml-1 h-3.5 w-3.5 text-emerald-500" />
                  )}
                </span>
              </button>

              {/* Accordion body */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                  {sectionFields.map((field) => {
                    const isFilled =
                      fieldValues[field.fieldName] !== undefined &&
                      fieldValues[field.fieldName].trim() !== "";
                    const isFocused = focusedField === field.fieldName;

                    return (
                      <div
                        key={field.fieldName}
                        className={cn(
                          "space-y-1 rounded-lg p-2 -mx-2 transition-colors",
                          isFocused ? "bg-indigo-50" : "hover:bg-gray-50",
                        )}
                      >
                        <label
                          htmlFor={field.fieldName}
                          className={cn(
                            "block text-xs font-medium",
                            isFilled ? "text-emerald-600" : "text-gray-600",
                          )}
                        >
                          {field.displayLabel}
                          {isFilled && (
                            <CheckCircle2 className="inline ml-1 h-3 w-3 text-emerald-500" />
                          )}
                        </label>

                        {field.fieldType === "textarea" ? (
                          <textarea
                            id={field.fieldName}
                            ref={(el) => {
                              if (el)
                                fieldRefs.current.set(field.fieldName, el);
                            }}
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                                       text-gray-800 placeholder-gray-400 focus:outline-none
                                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                       resize-none transition-shadow"
                            placeholder={`Enter ${field.displayLabel.toLowerCase()}…`}
                            value={fieldValues[field.fieldName] ?? ""}
                            onChange={(e) =>
                              onFieldChange(field.fieldName, e.target.value)
                            }
                          />
                        ) : (
                          <input
                            id={field.fieldName}
                            type={
                              field.fieldType === "number" ? "text" : "text"
                            }
                            inputMode={
                              field.fieldType === "number" ? "decimal" : "text"
                            }
                            ref={(el) => {
                              if (el)
                                fieldRefs.current.set(field.fieldName, el);
                            }}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                                       text-gray-800 placeholder-gray-400 focus:outline-none
                                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                       transition-shadow"
                            placeholder={`Enter ${field.displayLabel.toLowerCase()}…`}
                            value={fieldValues[field.fieldName] ?? ""}
                            onChange={(e) =>
                              onFieldChange(field.fieldName, e.target.value)
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main TemplateEditor Component
// ──────────────────────────────────────────────

export interface TemplateEditorProps {
  template: Template;
  initialFields?: Record<string, string>;
  onFieldsChange?: (fields: Record<string, string>) => void;
  onGenerate: (fields: Record<string, string>) => void;
  onBack: () => void;
}

export function TemplateEditor({
  template,
  initialFields,
  onFieldsChange,
  onGenerate,
  onBack,
}: TemplateEditorProps) {
  const navigate = useNavigate();

  const {
    templateFieldValues,
    setTemplateFieldValues,
    setActiveTemplateId,
    updateFieldValue,
  } = useStore();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [autoFillPrompt, setAutoFillPrompt] = useState<string>("");
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );

  // Use local state if initialFields is provided, otherwise use store
  const [localFields, setLocalFields] = useState<Record<string, string>>(
    initialFields || {},
  );

  const currentFields = initialFields ? localFields : templateFieldValues;

  // Sync local fields with initialFields if they change
  useEffect(() => {
    if (initialFields) {
      setLocalFields(initialFields);
    }
  }, [initialFields]);

  // Register the active template on mount
  useEffect(() => {
    setActiveTemplateId(template.id);
  }, [template.id, setActiveTemplateId]);

  const fields = useMemo(
    () => extractFields(template.sections),
    [template.sections],
  );
  const progress = useMemo(
    () => getFieldProgress(template.sections, currentFields),
    [template.sections, currentFields],
  );

  const canGenerate = progress.percentage >= 30;

  // ── Field change handler ──
  const handleFieldChange = useCallback(
    (fieldName: string, value: string) => {
      if (onFieldsChange) {
        const newFields = { ...currentFields, [fieldName]: value };
        setLocalFields(newFields);
        onFieldsChange(newFields);
      } else {
        updateFieldValue(fieldName, value);
      }
    },
    [onFieldsChange, currentFields, updateFieldValue],
  );

  // ── Preview field click → focus the form field ──
  const handleFieldClickInPreview = useCallback((fieldName: string) => {
    setFocusedField(fieldName);
    // Reset after a tick so re-clicking the same field still triggers scroll
    setTimeout(() => setFocusedField(null), 800);
  }, []);

  // ── Auto-fill with AI ──
  const handleAutoFill = async () => {
    setIsAutoFilling(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/fill-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          templateId: template.id,
          sections: template.sections,
          currentValues: currentFields,
          userPrompt: autoFillPrompt,
        }),
      });

      if (!response.ok) throw new Error("Auto-fill request failed");

      const data = await response.json();
      if (data.fieldValues) {
        // Merge AI-filled values with existing (user values take priority)
        const merged: Record<string, string> = { ...data.fieldValues };
        for (const [key, value] of Object.entries(currentFields)) {
          if (value && value.trim() !== "") merged[key] = value;
        }

        if (onFieldsChange) {
          setLocalFields(merged);
          onFieldsChange(merged);
        } else {
          setTemplateFieldValues(merged);
        }
      }
    } catch (error) {
      console.error("Auto-fill failed:", error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  // ── Save draft to Firestore ──
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      if (initialFields) {
        // Just simulate save for now if in solutions page
        await new Promise((r) => setTimeout(r, 800));
      } else {
        const docId = template.id;
        const token = await auth.currentUser?.getIdToken();
        await fetch(`/api/documents/${docId}/draft`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ draftFields: currentFields }),
        });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (error) {
      console.error("Save draft failed:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Generate final document ──
  const handleGenerate = () => {
    if (!canGenerate) return;
    onGenerate(currentFields);
  };

  // ── Export directly (without canvas editing) ──
  const handleExportNow = async () => {
    const filledSections = fillFields(template.sections, templateFieldValues);
    try {
      const filename = template.title.replace(/\s+/g, "-").toLowerCase();
      await exportGeneratedDocumentToPdf(
        { title: template.title, sections: filledSections },
        filename,
      );
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {template.title}
            </h1>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">
            Powered by Claude Sonnet 4.6
          </span>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200
                       text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveStatus === "saved"
              ? "Saved!"
              : saveStatus === "error"
                ? "Error"
                : "Save Draft"}
          </button>
          <button
            onClick={handleExportNow}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200
                       text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Now
          </button>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              canGenerate
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed",
            )}
          >
            <FileText className="h-4 w-4" />
            Generate Document
            {!canGenerate && (
              <span className="text-xs opacity-70">
                (fill {30 - progress.percentage}% more)
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Main split layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Section preview (70%) */}
        <div className="flex-[7] overflow-y-auto p-6 space-y-4 border-r border-gray-200">
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-sm text-gray-500">
              Click any{" "}
              <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300">
                orange field
              </span>{" "}
              in the preview to jump to its form input →
            </p>

            {template.sections.map((section) => (
              <SectionPreviewCard
                key={section.id}
                section={section}
                fieldValues={currentFields}
                onFieldClick={handleFieldClickInPreview}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Field fill form (30%) */}
        <div className="flex-[3] flex flex-col overflow-hidden bg-white">
          {/* Form header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 space-y-3 shrink-0">
            <ProgressBar
              filled={progress.filled}
              total={progress.total}
              percentage={progress.percentage}
            />

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Describe your document context..."
                value={autoFillPrompt}
                onChange={(e) => setAutoFillPrompt(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              />
              <button
                onClick={handleAutoFill}
                disabled={
                  isAutoFilling ||
                  (!autoFillPrompt && Object.keys(currentFields).length === 0)
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                           bg-gradient-to-r from-indigo-600 to-indigo-600 text-white text-sm
                           font-medium shadow-sm hover:from-indigo-700 hover:to-indigo-700
                           transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Sparkles className="h-4 w-4" />
                {isAutoFilling ? "Auto-filling with AI…" : "Auto-fill with AI"}
              </button>
            </div>
          </div>

          {/* Scrollable field form */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <FieldForm
              fields={fields}
              sections={template.sections}
              fieldValues={currentFields}
              onFieldChange={handleFieldChange}
              focusedField={focusedField}
            />
          </div>

          {/* Bottom bar */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 shrink-0">
            {progress.percentage < 100 && (
              <button
                onClick={handleAutoFill}
                disabled={isAutoFilling}
                className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium
                           flex items-center justify-center gap-1.5 py-1 disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Auto-fill remaining {progress.total - progress.filled} fields
              </button>
            )}
            <p className="text-center text-xs text-gray-400 mt-1.5">
              Powered by Claude Sonnet 4.6
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
