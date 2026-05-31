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
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Fetch user profile from Firestore to get plan and usage
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    let plan = 'free';
    let aiRequestsToday = 0;
    let lastAiRequestDate = '';
    let role = 'user';

    if (userDoc.exists) {
      const data = userDoc.data()!;
      plan = data.plan || 'free';
      aiRequestsToday = data.aiRequestsToday || 0;
      lastAiRequestDate = data.lastAiRequestDate || '';
      role = data.role || 'user';
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
    console.error('Auth verification failed', error);
    return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
  }
};
