import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function checkExportLimit(userId: string): Promise<boolean> {
  if (!userId) return true; // Allow for anonymous if not handled

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  let exportsThisMonth = 0;
  if (userSnap.exists()) {
    const data = userSnap.data();
    exportsThisMonth = data.exportsThisMonth || 0;
    
    // Reset if it's a new month (simplified check)
    const lastExportDate = data.lastExportDate?.toDate?.();
    if (lastExportDate && lastExportDate.getMonth() !== new Date().getMonth()) {
      exportsThisMonth = 0;
    }
    
    // Check Pro logic - if they have plan: 'pro', allow
    if (data.plan === 'pro') return true;
  }

  if (exportsThisMonth >= 3) {
    import('./analytics').then(({ track }) => {
      track('plan_limit_reached', { user_id: userId, limit_type: 'exports', current_value: exportsThisMonth, limit_value: 3 });
    });
    throw new Error("FREEMIUM_LIMIT: You’ve hit your 3 free exports this month. Upgrade to Pro for unlimited exports.");
  }

  // Increment
  if (!userSnap.exists()) {
    await setDoc(userRef, { exportsThisMonth: 1, lastExportDate: new Date() }, { merge: true });
  } else {
    await updateDoc(userRef, {
      exportsThisMonth: exportsThisMonth === 0 ? 1 : increment(1),
      lastExportDate: new Date()
    });
  }

  return true;
}
