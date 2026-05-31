// src/services/collaborationService.ts
import { nanoid } from 'nanoid';

interface Presence {
  userId: string;
  name: string;
  cursor: { x: number; y: number };
  activeSectionId?: string;
  lastActive: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  sectionId: string;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'export' | 'share';
  details: string;
  timestamp: string;
}

export const collaborationService = {
  // Presence handling
  async updatePresence(docId: string, presence: Presence) {
    // In a real app, this would update a Firestore 'presence' collection
    // console.log(`Updating presence for ${docId}:`, presence);
  },

  async getActiveUsers(docId: string): Promise<Presence[]> {
    // Mocking active users
    return [
      {
        userId: '1',
        name: 'John Doe',
        cursor: { x: 100, y: 200 },
        lastActive: Date.now(),
      },
      {
        userId: '2',
        name: 'Jane Smith',
        cursor: { x: 300, y: 400 },
        lastActive: Date.now(),
      },
    ];
  },

  // Commenting
  async addComment(docId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'resolved'>) {
    const newComment: Comment = {
      ...comment,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    // In a real app, this would save to a Firestore 'comments' collection
    return newComment;
  },

  async resolveComment(docId: string, commentId: string) {
    // In a real app, this would update the comment in Firestore
    return true;
  },

  // Activity Logging
  async logActivity(docId: string, log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const newLog: ActivityLog = {
      ...log,
      id: nanoid(),
      timestamp: new Date().toISOString(),
    };
    // In a real app, this would save to a Firestore 'activity' collection
    return newLog;
  },

  async getActivityLogs(docId: string): Promise<ActivityLog[]> {
    // Mocking activity logs
    return [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        action: 'create',
        details: 'Created the document',
        timestamp: new Date().toISOString(),
      },
    ];
  },
};
