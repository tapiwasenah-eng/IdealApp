import {
  collection,
  getDocs,
  addDoc,
  query,
  limit,
  writeBatch,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { INVESTORS } from '../data/investors'
import { TEMPLATES as SEED_TEMPLATES } from '../data/templates'

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
