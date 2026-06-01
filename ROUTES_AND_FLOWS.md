# Routes and Flows

This document details the primary frontend routes, the key components rendered, the required access level, and the primary user journeys they support.

## Public / Unauthenticated Routes

| Route | Main Components | Auth Requirement | User Journey |
| :--- | :--- | :--- | :--- |
| `/` (Home) | `HomePage`, Hero, Feature highlights | Public | Marketing landing page. Converts anonymous traffic into signups. |
| `/auth` & `/signup` | `AuthPage`, `LoginForm`, `SignupForm` | Public | Authentication entry point. Users sign up via Google SSO or Email. |
| `/templates` | `TemplatesPage`, Template grids | Public | Discovery of document structures categorized by industry/stage. |
| `/templates/:slug` | `TemplateDetailPage`, SEO descriptions | Public | Deep link for a specific template. "Use Template" prompts login/signup. |
| `/solutions`, `/features` | `SolutionsPage`, `FeaturesPage` | Public | Marketing exploration for deeper product capabilities. |
| `/r/:roomId` | `InvestorDataRoomView` (or generic public viewer) | Public / Access-Gated | The destination for investors receiving a data room link. Fetches live document details and logs events to `dataRoomViews`. |

## Protected Routes (`<ProtectedRoute>`)

All protected routes require an active Authenticated session. Unauthenticated users are redirected to `/auth`.

| Route | Main Components | Auth/Plan Requirement | User Journey |
| :--- | :--- | :--- | :--- |
| `/onboarding` | `OnboardingFlow`, DNA setup | Auth | First-time zero-to-value flow. User inputs core company details to seed initial documents. |
| `/dashboard` | `DashboardLayout`, `DashboardOverview` | Auth | Central hub. User reviews high-level stats (e.g. total data room views dynamically computed), quick actions, and recent engagement. |
| `/dashboard/dna` | `CompanyDNAEditor` | Auth | Updating core company variables used by the AI across all generated collateral. |
| `/dashboard/data-room` | `DataRoomPage`, Access lists | Auth | Creating and managing secure sharing links, viewing access logs. |
| `/dashboard/investors` | `InvestorExplorerPage`, Filters | Auth | Exploring the investor database to build a target list. Includes `PitchPackageBuilder` which orchestrates calling `POST /api/data-room-links/create` to establish tracking, and `POST /api/outreach/send` to email investors. |
| `/dashboard/outreach` | `OutreachTrackerPage`, Kanban/List | Auth | Tracking conversations, emails sent, and pitch statuses. Uses dataRoomViews aggregate. |
| `/documents/:documentId` | `DocumentWorkspaceLayout`, `DocumentCanvas`, `AIChatRail`, `SectionEditor` | Auth | The deep work environment. Users utilize AI to write, refine, and structure their pitches. (Free tier limits apply here via backend checks). |
| `/pricing` | `PricingPage`, Plan grids | Auth | The upgrade path. Users view plan differences and choose to subscribe to Pro/Studio. |
| `/settings` | `SettingsPage`, Profile forms | Auth | Account management, notification settings, and billing portal access. |

## Route Guards & Access Control

1. **`ProtectedRoute` Wrapper**: Validates `isAuthenticated`. Redirects to `/auth` if false.
2. **`PlanGuard` Component**: Used within route components (e.g., specific AI features, custom domains sharing) to blur or block UI for users without `pro` or `studio` plans.
3. **Backend Middleware (`requireAuth`, `checkAiLimits`)**: Enforces authentication and rate-limiting per plan type on API routes like `/api/ai/complete` and `/api/fill-template`.

## Critical Gaps for MVP Launch
- **Deep Linking state for Auth**: When unauthenticated users click "Use Template" from `/templates/:slug`, the app currently routes to `/auth`. It needs to persist the `?intent=template_id` via localStorage or URL params so that upon successful login, the app immediately bootstraps the intended document rather than dropping them on a blank dashboard.
- **Investor Access Gating Mechanisms**: The `/r/:roomId` implementation needs real backend enforcement to validate passwords/email tokens against Firestore before serving the data room payload.
