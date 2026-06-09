import { collection, doc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { TemplateDoc } from '../store';
import { TemplateSector, PitchTemplate } from "./firestoreTypes";
import { TEMPLATES } from "../data/templates";

const templatesCol = collection(db, "templates");

function inferSectorFromCategory(category?: string): TemplateSector {
  const c = category?.toLowerCase() ?? "";
  if (c.includes("saas")) return "saas";
  if (c.includes("deeptech") || c.includes("ai") || c.includes("ml")) return "deeptech";
  if (c.includes("fintech") || c.includes("finance")) return "fintech";
  if (c.includes("marketplace")) return "b2b_marketplace";
  if (c.includes("climate") || c.includes("energy") || c.includes("sustainability")) return "climate";
  if (c.includes("health")) return "healthcare";
  if (c.includes("consumer") || c.includes("brand") || c.includes("d2c") || c.includes("ecommerce")) return "consumer";
  return "general";
}

function inferStageFromTitle(title?: string): string {
  const t = title?.toLowerCase() ?? "";
  if (t.includes("pre-seed") || t.includes("pre seed")) return "pre_seed";
  if (t.includes("series a")) return "series_a";
  if (t.includes("series b")) return "series_b_plus";
  return "seed";
}

function inferComplexity(template: any): "light" | "standard" | "advanced" {
  const pages = template.pageCount ?? 10;
  if (pages <= 8) return "light";
  if (pages >= 18) return "advanced";
  return "standard";
}

function normalizeDocType(category?: string): string {
  const c = category?.toLowerCase() ?? "";
  if (c.includes("pitch deck") || c.includes("pitch")) return "pitch_deck";
  if (c.includes("business plan")) return "business_plan";
  if (c.includes("memo")) return "founder_memo";
  if (c.includes("financial")) return "financial_model";
  if (c.includes("data room") || c.includes("dataroom")) return "data_room";
  if (c.includes("legal") || c.includes("hr") || c.includes("employee")) return "employee_handbook";
  if (c.includes("one pager")) return "one_pager";
  return "pitch_deck";
}

function toCategoryLabel(category?: string): string {
  return category || "Pitch Decks";
}

export async function migrateTemplatesFromLocal() {
  const snap = await getDocs(templatesCol);
  const now = Timestamp.now();

  const writes = TEMPLATES.map((tpl: any) => {
    const id = tpl.id ?? tpl.slug ?? tpl.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!id) return null;

    const docRef = doc(templatesCol, id);

    const data: TemplateDoc = {
      name: tpl.name ?? tpl.title ?? "Untitled Template",
      document_type: normalizeDocType(tpl.category),
      category: toCategoryLabel(tpl.category),
      sector: inferSectorFromCategory(tpl.industry ?? tpl.category),
      sector_tags: [inferSectorFromCategory(tpl.industry ?? tpl.category)],
      stage: inferStageFromTitle(tpl.name ?? tpl.title),
      stage_tags: [inferStageFromTitle(tpl.name ?? tpl.title)],
      complexity: inferComplexity(tpl),
      is_premium: !!tpl.isPremium,
      is_community: false,
      rating: tpl.rating ?? 0,
      page_count: tpl.pageCount ?? 0,
      sections_schema: (tpl.sections ?? []).map((s: any) => {
        if (!s.tableData) return s;
        // Firestore does not support nested arrays (string[][]), which tableData.rows uses.
        // We serialize it to avoid the error. It's not consumed yet, but preserves data.
        return {
          ...s,
          tableDataJson: JSON.stringify(s.tableData),
          tableData: null // delete the nested array version
        };
      }),
      version: 1,
      created_at: tpl.createdAt ? Timestamp.fromDate(new Date(tpl.createdAt)) : now,
      updated_at: now,
    };

    return setDoc(docRef, data, { merge: true });
  }).filter(Boolean);

  await Promise.all(writes as Promise<unknown>[]);
}
