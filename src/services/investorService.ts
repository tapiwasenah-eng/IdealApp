import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy, limit, startAfter, writeBatch,
  serverTimestamp, getCountFromServer
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Investor {
  id: string;
  name: string;
  type: 'vc' | 'angel' | 'family-office' | 'accelerator' | 'other';
  country: string;
  round: string;
  sectors: string[];
  website?: string;
  linkedin?: string;
  email?: string;
  description?: string;
  portfolio?: string[];
  createdAt?: any;
  updatedAt?: any;
}

const INVESTORS_COLLECTION = 'investors';
const BATCH_SIZE = 400; // Firestore batch limit is 500

export async function getInvestors(
  filters: { category?: string; country?: string; round?: string; sector?: string } = {},
  page = 0,
  pageSize = 25
): Promise<Investor[]> {
  try {
    let q = query(collection(db, INVESTORS_COLLECTION), limit(pageSize));
    if (filters.country && filters.country !== 'All') {
      q = query(q, where('country', '==', filters.country));
    }
    if (filters.category && filters.category !== 'All Investors') {
      const typeMap: Record<string, string> = {
        'Venture Capital': 'vc', 'Family Offices': 'family-office', 'Angel Investors': 'angel',
      };
      const type = typeMap[filters.category];
      if (type) q = query(q, where('type', '==', type));
    }
    if (filters.sector && filters.sector !== 'All Sectors') {
      q = query(q, where('sectors', 'array-contains', filters.sector));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Investor));
  } catch (e) {
    console.error('Failed to fetch investors:', e);
    return [];
  }
}

export async function getInvestorById(id: string): Promise<Investor | null> {
  try {
    const snap = await getDoc(doc(db, INVESTORS_COLLECTION, id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Investor) : null;
  } catch {
    return null;
  }
}

export async function addInvestor(data: Omit<Investor, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, INVESTORS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function importInvestors(records: Omit<Investor, 'id'>[]): Promise<{ imported: number; skipped: number }> {
  let imported = 0;
  let skipped = 0;
  const chunks: Omit<Investor, 'id'>[][] = [];
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    chunks.push(records.slice(i, i + BATCH_SIZE));
  }
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    for (const record of chunk) {
      if (!record.type) { skipped++; continue; }
      const ref = doc(collection(db, INVESTORS_COLLECTION));
      batch.set(ref, { ...record, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      imported++;
    }
    await batch.commit();
  }
  return { imported, skipped };
}

export async function updateInvestor(id: string, data: Partial<Investor>): Promise<void> {
  await updateDoc(doc(db, INVESTORS_COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteInvestor(id: string): Promise<void> {
  await deleteDoc(doc(db, INVESTORS_COLLECTION, id));
}

export async function getInvestorStats(): Promise<{ total: number; byType: Record<string, number> }> {
  try {
    const snap = await getCountFromServer(collection(db, INVESTORS_COLLECTION));
    return { total: snap.data().count, byType: {} };
  } catch {
    return { total: 0, byType: {} };
  }
}

// File parsing utilities
export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)/g) ?? [];
    return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? '').replace(/^"|"$/g, '').trim()]));
  });
}

export async function parseXLSX(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const { read, utils } = await import('xlsx');
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = utils.sheet_to_json<Record<string, string>>(sheet, { raw: false, defval: '' });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
