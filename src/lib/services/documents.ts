// src/lib/services/documents.ts

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useStore } from "../../store";
import type { Section, DocumentDoc, TemplateDoc } from "../../store";
import { track } from "../analytics";

export type SectionAIState = "idle" | "generating" | "generated";

interface LegacySection {
  id?: string;
  title?: string;
  heading?: string;
  content?: string;
  body?: string;
  ai_state?: SectionAIState;
  sectionsschema?: any;
  [key: string]: any;
}

export interface CreateDocumentOptions {
  status?: string;
  stage?: string | null;
  sector?: string | null;
}

export type RenderMode = 'text' | 'canvas';

export interface CreateWorkspaceFromTemplateInput {
  userId: string;
  template: TemplateDoc | any;
  companyDna?: { stage?: string; sector?: string };
  mode: RenderMode;
}

export interface CreateWorkspaceResult {
  docId: string;
  route: string;
}

export function inferRenderMode(template: any): RenderMode {
  const cat = (template.category || template.document_type || '').toLowerCase();
  if (cat.includes('pitch') || cat.includes('deck') || cat.includes('one-pager') || cat.includes('data-room')) {
    return 'canvas';
  }
  return 'text';
}

export async function createWorkspaceFromTemplate(input: CreateWorkspaceFromTemplateInput): Promise<CreateWorkspaceResult> {
  // Check user document limits
  const userDocsRef = collection(db, 'users', input.userId, 'documents');
  const q = query(userDocsRef);
  const snap = await getDocs(q);
  
  // Free tier limit (hardcoded for now, could be feature flagged)
  if (snap.size >= 5) {
    track('plan_limit_reached', { user_id: input.userId, limit_type: 'workspaces', current_value: snap.size, limit_value: 5 });
    throw new Error('FREEMIUM_LIMIT: You have reached the maximum of 5 free workspaces. Please upgrade to Pro.');
  }

  const docId = await createProject({
    userId: input.userId,
    name: input.template.name || input.template.title,
    document_type: input.template.document_type || input.template.category || 'custom',
    template: input.template,
    status: 'draft',
    stage: input.companyDna?.stage,
    sector: input.companyDna?.sector,
    sections: input.template.sections_schema || input.template.sections,
  });

  if (input.mode === 'canvas') {
     return { docId, route: `/editor/${docId}` }; 
  }

  return { docId, route: `/dashboard/documents/${docId}` };
}

/**
 * normalizeLegacySection
 *
 * Maps any historical section shapes (including template blueprints) into
 * the canonical Section interface: { id, title, content, ai_state }.
 */
export const normalizeLegacySection = (
  raw: LegacySection,
  index: number
): Section => {
  const id =
    typeof raw.id === "string" && raw.id.trim().length > 0
      ? raw.id
      : `section-${index}`;

  const titleSource =
    typeof raw.title === "string" && raw.title.trim().length > 0
      ? raw.title
      : typeof raw.heading === "string"
      ? raw.heading
      : typeof raw.type === "string"
      ? raw.type
      : "";

  const title = titleSource || `Section ${index + 1}`;

  const contentSource =
    typeof raw.content === "string"
      ? raw.content
      : typeof raw.body === "string"
      ? raw.body
      : "";

  const content = contentSource || "";

  const ai_state: SectionAIState =
    raw.ai_state === "generating" || raw.ai_state === "generated"
      ? raw.ai_state
      : "idle";

  return {
    id,
    title,
    content,
    ai_state,
  };
};

/**
 * normalizeLegacyDocument
 *
 * Given any Firestore document payload for a workspace document, normalize
 * legacy schema variations into the canonical DocumentDoc shape.
 */
export const normalizeLegacyDocument = (
  id: string,
  raw: any
): DocumentDoc => {
  const name =
    typeof raw.name === "string" && raw.name.trim().length > 0
      ? raw.name
      : "Untitled Document";

  const document_type =
    typeof raw.document_type === "string" && raw.document_type.trim().length > 0
      ? raw.document_type
      : typeof raw.documenttype === "string"
      ? raw.documenttype
      : "pitch_deck";

  const status =
    typeof raw.status === "string" && raw.status.trim().length > 0
      ? raw.status
      : "draft";

  let rawSections: any[] = [];

  if (Array.isArray(raw.sections)) {
    rawSections = raw.sections;
  } else if (Array.isArray(raw.sectionsschema)) {
    // Older builds stored blueprint arrays under sectionsschema
    rawSections = raw.sectionsschema;
  } else if (Array.isArray(raw.sections_schema)) {
    rawSections = raw.sections_schema;
  }

  const sections: Section[] = rawSections.map((s, idx) =>
    normalizeLegacySection(s, idx)
  );

  return {
    id,
    name,
    document_type,
    status,
    sections,
  };
};

/**
 * buildSectionFromTemplate
 *
 * Utility for mapping a template's sections_schema item into a canonical Section.
 */
const buildSectionFromTemplate = (
  tplSection: TemplateDoc["sections_schema"][number],
  index: number
): Section => {
  return normalizeLegacySection(
    {
      id: tplSection.id as string | undefined,
      title: tplSection.heading as string | undefined,
      heading: tplSection.heading as string | undefined,
      body: tplSection.body as string | undefined,
      content: "",
      ai_state: "idle",
    },
    index
  );
};

const buildDefaultSection = (): Section => ({
  id: "section-0",
  title: "Overview",
  content: "",
  ai_state: "idle",
});

/**
 * createProject
 *
 * Unified, strictly-sanitized creator for workspace documents.
 * All document creation flows (templates, manual, wizard) must depend on this.
 */
export async function createProject(options: {
  userId: string | null | undefined;
  name?: string | null;
  document_type?: string | null;
  template?: TemplateDoc | null;
  status?: string | null;
  stage?: string | null;
  sector?: string | null;
  sections?: LegacySection[] | null;
}): Promise<string> {
  const {
    userId,
    name,
    document_type,
    template = null,
    status,
    stage,
    sector,
    sections,
  } = options;

  if (!userId) {
    console.warn(
      "createProject called without a userId; aborting before Firestore write."
    );
    throw new Error("Missing userId in createProject");
  }

  const now = serverTimestamp();
  const baseName =
    typeof name === "string" && name.trim().length > 0
      ? name.trim()
      : template?.name && template.name.trim().length > 0
      ? template.name
      : "Untitled Document";

  const baseType =
    typeof document_type === "string" && document_type.trim().length > 0
      ? document_type.trim()
      : template?.document_type && template.document_type.trim().length > 0
      ? template.document_type
      : "pitch_deck";

  const safeStatus =
    typeof status === "string" && status.trim().length > 0
      ? status.trim()
      : "draft";

  let resolvedSections: Section[] = [];

  if (Array.isArray(sections) && sections.length > 0) {
    resolvedSections = sections.map((s, idx) => normalizeLegacySection(s, idx));
  } else if (template && Array.isArray(template.sections_schema)) {
    resolvedSections =
      template.sections_schema.length > 0
        ? template.sections_schema.map((tplSection, idx) =>
            buildSectionFromTemplate(tplSection, idx)
          )
        : [buildDefaultSection()];
  } else {
    resolvedSections = [buildDefaultSection()];
  }

  if (resolvedSections.length === 0) {
    resolvedSections.push(buildDefaultSection());
  }

  const docRef = doc(collection(db, "users", userId, "documents"));

  const payload: {
    name: string;
    document_type: string;
    status: string;
    sections: Section[];
    created_at: any;
    updated_at: any;
    template_id?: string | null;
    sector?: string | null;
    stage?: string | null;
  } = {
    name: baseName,
    document_type: baseType,
    status: safeStatus,
    sections: resolvedSections,
    created_at: now,
    updated_at: now,
    template_id: template?.id ?? null,
    sector: sector ?? template?.sector ?? null,
    stage: stage ?? template?.stage ?? null,
  };

  await setDoc(docRef, payload);

  if (template) {
    track("template_used", {
      template_id: template.id,
      document_id: docRef.id,
      document_type: template.document_type,
      workspace_id: docRef.id, // Emulating workspace ID with document ID (they map 1:1)
      source: "templatelibrary",
    });
    track("workspace_created", {
      workspace_id: docRef.id,
      source: "template"
    });
  } else {
    track("workspace_created", {
      workspace_id: docRef.id,
      document_type: baseType,
      source: "manual",
    });
  }

  const store = useStore.getState();
  const workspaceDoc: DocumentDoc = {
    id: docRef.id,
    name: payload.name,
    document_type: payload.document_type,
    status: payload.status,
    sections: payload.sections,
  };
  store.setWorkspaceDocument(workspaceDoc);

  return docRef.id;
}

/**
 * createDocumentFromTemplate
 *
 * Wrapper around createProject specifically for TemplateDoc inputs.
 * Preserved for backward compatibility while delegating to unified creator.
 */
export async function createDocumentFromTemplate(
  userId: string | null | undefined,
  template: TemplateDoc,
  options: CreateDocumentOptions = {}
): Promise<string> {
  return createProject({
    userId,
    name: template.name,
    document_type: template.document_type,
    template,
    status: options.status ?? "draft",
    stage: options.stage ?? null,
    sector: options.sector ?? template.sector ?? null,
    sections: template.sections_schema ?? null,
  });
}

/**
 * createEmptyDocument
 *
 * Convenience wrapper for a blank canonical DocumentDoc for the Docs Space.
 */
export async function createEmptyDocument(
  userId: string | null | undefined,
  name: string,
  document_type: string = "pitch_deck"
): Promise<string> {
  return createProject({
    userId,
    name,
    document_type,
    status: "draft",
    sections: [buildDefaultSection()],
  });
}

/**
 * fetchAndNormalizeDocument
 *
 * Helper to read a workspace document from Firestore and normalize any
 * legacy shapes into the canonical DocumentDoc before returning.
 */
export async function fetchAndNormalizeDocument(
  userId: string,
  documentId: string
): Promise<DocumentDoc | null> {
  try {
    const ref = doc(db, "users", userId, "documents", documentId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return null;
    }
    const raw = snap.data();
    return normalizeLegacyDocument(snap.id, raw);
  } catch (e) {
    console.error("Failed to fetch and normalize document", e);
    return null;
  }
}
