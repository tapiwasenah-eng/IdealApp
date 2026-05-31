# Firestore Schema

This document outlines the Firestore collections, subcollections, and data structures implemented in IdealApp for the core MVP experience.

## `users` (Collection)
Stores user identity, plan entitlements, AI usage limits, and application state.
- **Document ID**: `uid` (from Firebase Auth)
- **Fields**:
  - `email`: string
  - `displayName`: string
  - `photoURL`: string
  - `plan`: string (`'free' | 'pro' | 'studio'`)
  - `role`: string (`'user' | 'admin'`)
  - `aiRequestsToday`: number
  - `lastAiRequestDate`: string (ISO date string)
  - `createdAt`: ISO timestamp

### `users/{userId}/documents` (Subcollection)
Stores structured documents (like pitch decks) owned by the user.
- **Document ID**: `documentId` (e.g. timestamp or UUID string)
- **Fields**:
  - `title`: string
  - `companyName`: string
  - `type`: string
  - `sections`: array of objects `{ id, title, content, status }`

### `users/{userId}/investors` (Subcollection)
Stores the user's CRM instance of saved/targeted investors.
- **Document ID**: `investorId`
- **Fields**:
  - `name`, `firm`, `role`, `thesis`, `checkSize`: strings
  - `matchScore`: number
  - `stageTags`, `sectorTags`: array of strings
  - `isLocked`: boolean

### `users/{userId}/outreach` (Subcollection)
Stores pitch packages sent to specific investors and tracks the status of interactions.
- **Document ID**: `outreachId`
- **Fields**:
  - `investorId`, `investorName`, `firm`: string
  - `sentDate`, `lastOpened`, `timeSpent`: string 
  - `docsViewed`: number
  - `status`: string (`Sent`, `Opened`, `Interested`, etc.)

*(Note: In the future, outreach will be directly tied to data room analytics rather than manual string updates, but this allows MVP state persistence.)*


## `dataRoomLinks` (Collection)
Stores shared links (Data Rooms) created by founders, linking multiple documents.
- **Document ID**: Auto-generated
- **Fields**:
  - `token`: string (Used for the `/r/:token` public URL path)
  - `ownerId`: string (Reference to user ID)
  - `documentIds`: array of strings
  - `hasPassword`: boolean
  - `passwordHash`: string (null if none)
  - `expiresAt`: Timestamp (null if never)
  - `allowDownload`: boolean
  - `viewCount`: number
  - `accessLog`: array of objects `{ timestamp, type }`

## `dataRoomViews` (Collection)
Analytics logging for every time a specific document inside a data room is viewed.
- **Document ID**: Auto-generated
- **Fields**:
  - `linkId`: string
  - `token`: string
  - `ownerId`: string
  - `documentId`: string
  - `durationSeconds`: number (for future engagement tracking)
  - `timestamp`: Timestamp

## Recommended Firebase Console Indexes
To ensure optimal performance for queries across these collections, the following Composite Indexes should be created:

1. **Collection**: `dataRoomLinks`
   - `ownerId` (Ascending)
   - `createdAt` (Descending)
   *(Enables fast dashboard fetching of a user's data rooms, sorted by newest).*

2. **Collection**: `dataRoomViews`
   - `ownerId` (Ascending)
   - `timestamp` (Descending)
   *(Enables building dashboard analytics metrics easily).*

## Potential Considerations & Future Roadmap
- **Scaling Document Edits**: The document `sections` field is an array of objects holding HTML/JSON. This is perfect for MVP scale (a 15-slide pitch deck won't exceed the 1MB Firestore limit). However, if documents grow into 100-page memos, we should move `sections` to its own subcollection to avoid hitting the document size limit and reduce write payloads.
- **Counters & Hot Collections**: The generic `viewCount` field on `dataRoomLinks` is updated incrementally on login. If a link goes viral, updating this single document multiple times a second could lead to contention (Firestore 1 write/sec limit). If high traffic is expected, we may refactor `viewCount` using Distributed Counters or relying purely on aggregations of the `dataRoomViews` collection.
