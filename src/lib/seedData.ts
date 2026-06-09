import {
  collection,
  getDocs,
  addDoc,
  query,
  limit,
  writeBatch,
  doc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { INVESTORS } from '../data/investors'
import { TEMPLATES as SEED_TEMPLATES } from '../data/templates'
import { PitchTemplate, TemplateSector } from './firestoreTypes'

const templatesCol = collection(db, "templates");

export async function seedTemplatesIfEmpty() {
  const snap = await getDocs(templatesCol);
  if (!snap.empty) return;

  const now = Timestamp.now();

  const baseTemplates: Omit<PitchTemplate, "created_at" | "updated_at">[] = [
    {
      id: "saas-b2b-seed",
      name: "B2B SaaS Seed",
      sector: "saas",
      stage: "seed",
      complexity: "standard",
      body_markdown:
        "# Problem\n\nDescribe the workflow pain your customers feel today...\n\n# Solution\n\nExplain your product and how it automates or augments...\n\n# Traction\n\nShare proof points, pilots, or revenue...\n",
    },
    {
      id: "deeptech-spinout-seed",
      name: "DeepTech Spin-Out · Seed",
      sector: "deeptech",
      stage: "seed",
      complexity: "advanced",
      body_markdown:
        "# Origin\n\nHighlight the research, lab, or IP foundation...\n\n# Breakthrough\n\nDescribe what makes this non-obvious or defensible...\n",
    },
    {
      id: "fintech-b2b-payments",
      name: "Fintech B2B Payments Deck",
      sector: "fintech",
      stage: "series_a",
      complexity: "standard",
      body_markdown:
        "# Market\n\nExplain how money moves today and what is broken...\n",
    },
  ];

  await Promise.all(
    baseTemplates.map((tpl) =>
      setDoc(doc(templatesCol, tpl.id), {
        ...tpl,
        created_at: now,
        updated_at: now,
      })
    )
  );
}

export async function fetchTemplates() {
  const snap = await getDocs(templatesCol);
  return snap.docs.map((d) => d.data() as PitchTemplate);
}

let seeded = false

export async function seedTemplates(): Promise<void> {
  if (seeded) return
  seeded = true

  try {
    const templatesRef = collection(db, 'templates')
    const snap = await getDocs(query(templatesRef, limit(1)))

    if (!snap.empty) {
      // Already seeded — skip
      return
    }

    const writes = SEED_TEMPLATES.map((template) =>
      addDoc(templatesRef, template)
    )
    await Promise.all(writes)
    console.info('[seedData] Seeded', SEED_TEMPLATES.length, 'templates.')
  } catch (err) {
    console.warn('[seedData] Could not seed templates:', err)
  }
}

let investorsSeeded = false

export async function seedInvestors(): Promise<void> {
  if (investorsSeeded) return
  investorsSeeded = true

  try {
    const investorsRef = collection(db, 'investors')
    const snap = await getDocs(query(investorsRef, limit(1)))

    if (!snap.empty) {
      // Already seeded — skip
      return
    }

    const BATCH_SIZE = 400
    const chunks = []
    for (let i = 0; i < INVESTORS.length; i += BATCH_SIZE) {
      chunks.push(INVESTORS.slice(i, i + BATCH_SIZE))
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db)
      for (const investor of chunk) {
        const ref = doc(investorsRef)
        batch.set(ref, {
          ...investor,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
      await batch.commit()
    }

    console.info('[seedData] Seeded', INVESTORS.length, 'investors.')
  } catch (err) {
    console.warn('[seedData] Could not seed investors:', err)
  }
}
