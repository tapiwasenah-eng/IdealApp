import type { Request, Response, NextFunction } from "express";
import { verifyFirebaseIdToken } from "../firebaseAdmin.js";

export type AuthedUser = {
  uid: string;
  email?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) return res.status(401).json({ success: false, error: "Missing Authorization Bearer token" });

    const decoded = await verifyFirebaseIdToken(match[1]);
    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err: any) {
    console.error('requireAuth error:', err);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
