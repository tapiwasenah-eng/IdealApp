# System Overview

## High-Level Architecture

IdealApp is a full-stack web application built primarily with React+Vite on the front-end and an Express server on the backend. The architecture is designed to handle document creation, AI-assisted editing, secure data room sharing, and investor outreach tracking.

- **Front-end**: React 18 with Vite, using Tailwind CSS for UI styling. State management uses Zustand. Animations via Framer Motion. 
- **Backend**: Express.js server running in a Node.js container, primarily acting as a secure proxy to AI providers (Gemini, OpenAI) and handling rate-limiting and authorization checks.
- **Database & Authentication**: Firebase Auth for user identity (Google SSO, Email/Password via Magic Link/Standard). Firestore for database persistence (users, usage limits, document/data room states - *Note: Much of the app state currently relies on local storage or mock hydration, which we are migrating fully to Firestore.*).
- **AI Pipeline**: Secure server-side integration heavily utilizing the `@google/genai` SDK for streaming document generation, completing inline edits (Gemini 3.5 Flash/Pro), and processing template data extraction.

## Main App Surfaces

1. **Onboarding (`/onboarding`)**: Captures foundational company data (Company DNA: name, industry, stage, mission, metrics) ensuring a "zero-to-value" start.
2. **Dashboard (`/dashboard`)**: The central authenticated hub providing an overview of documents, active data rooms, layout stats, and recent investor activity. Includes sub-tabs for DNA, Data Room management, Investors, and Outreach.
3. **Workspace / Editor (`/documents/:id`)**: The core AI-assisted deep editor. Features a block/section-based canvas using TipTap, alongside an AI Chat Rail (Assistant) that can generate, critique, or edit specific sections dynamically. Includes server-side export (`/api/export/pdf` and `/api/export/pptx`).
   - Uses optimized Firestore persistence: document metadata is stored centrally, while section contents are saved iteratively to nested `sections` subcollections to enable scalable, debounced saving.
4. **Data Room (`/data-room`, `/r/:roomId`)**: Secure, shared spaces for hosting pitch collateral. `r/:roomId` serves as the public-facing URL shared with investors, supporting password/access tracking. New links are created via `POST /api/data-room-links/create`. InvestorDataRoomView fetches actual document content live from `users/{uid}/documents` and logs analytics to `dataRoomViews`.
5. **Investor Explorer & Outreach (`/investors`, `/outreach`)**: CRM-like interfaces allowing founders to discover relevant investors, manage outreach pipelines, and track engagement. Integrates with PitchPackageBuilder to automatically generate secure data room links, associate them with outreach records, and dispatch emails via Resend (`/api/outreach/send`). The dashboard dynamically calculates metrics like 'time spent' and 'last opened' directly from the `dataRoomViews` collection.
6. **Templates (`/templates/:slug`)**: SEO-friendly public template pages showcasing specialized document structures (e.g., YC Seed Pitch, SaaS Series A).
7. **Pricing / Billing (`/pricing`)**: Presenting tiered upgrades (Free, Pro, Studio).
8. **Auth (`/auth`, `/signup`)**: Handles user login, signup, and session recovery.

## Key Stores & State Management (Zustand)

The app utilizes modular Zustand stores to manage complex, domain-specific state:

- **Auth & User (`authStore.ts` & `store.ts`)**: Manages the current authenticated user session, mirroring Firebase Auth state, and syncs user profiles (plan, role, limits) from Firestore.
- **Billing (`useBillingStore.ts`)**: Tracks the user's current subscription plan (`free`, `pro`, `studio`) and coordinates PlanGuard gating for premium features.
- **Documents (`useDocumentStore.ts`)**: Manages the local lifecycle of structured documents, active sections, block contents, and AI-driven content hydration.
- **Data Room (`useDataRoomStore.ts` / legacy implementations)**: Handles active shares, access permissions, and investor view analytics.
- **Investors / Outreach (`useInvestorStore.ts`)**: Acts as a lightweight CRM tracking investor stages, confidence scores, and historical interactions.
- **Notifications (`useNotificationStore.ts`)**: Centralized toast and asynchronous event alerting system.

## Critical Gaps for MVP Launch
- **Full Backend Data Sync**: While auth and user plans are synced to Firestore, documents, data rooms, and CRM states rely heavily on local storage or mock seed data. A robust Firestore persistence layer for these entities is mandatory to persist user work across devices securely.
- **Real Billing Webhooks**: Currently, upgrades just update the Firestore plan. We need actual Stripe/Paddle checkout sessions and webhooks to reconcile payments securely.
- **Data Room Analytics Loop**: The public data room view (`/r/:roomId`) needs to effectively log view durations and events back to the backend to power the dashboard metrics.
