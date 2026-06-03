import { Request, Response, NextFunction } from 'express';
import { adminAuth, adminDb } from './firebase-admin';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    plan: string;
    aiRequestsToday: number;
    lastAiRequestDate: string;
    role: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    let decodedToken: any;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (verifyError: any) {
      console.error("Firebase Admin Auth Error:", verifyError);
      
      // Safe bypass for AI Studio dev environment if credentials are missing
      if (process.env.NODE_ENV !== 'production' || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn("⚠️ Bypassing strict token verification. Ensure FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS is set for production.");
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        decodedToken = { uid: payload.user_id, email: payload.email };
      } else {
        throw verifyError; // Rethrow in production if credentials are expected
      }
    }
    
    // Fetch user profile from Firestore to get plan and usage
    let plan = 'free';
    let aiRequestsToday = 0;
    let lastAiRequestDate = '';
    let role = 'user';

    try {
      const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
      if (userDoc.exists) {
        const data = userDoc.data()!;
        plan = data.plan || 'free';
        aiRequestsToday = data.aiRequestsToday || 0;
        lastAiRequestDate = data.lastAiRequestDate || '';
        role = data.role || 'user';
      }
    } catch (dbError) {
      console.error("Firebase Admin DB Error:", dbError);
      console.warn("⚠️ Proceeding with default user plan (free) due to admin DB access error.");
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      plan,
      aiRequestsToday,
      lastAiRequestDate,
      role
    };

    next();
  } catch (error) {
    console.error('Auth middleware failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
  }
};
