# IDEALAPP: TOTAL PRODUCT REDESIGN SPECIFICATION

## 1. DESIGN SYSTEM

### VISUAL IDENTITY DIRECTION
The intersection of Bloomberg Terminal sophistication, Linear's obsessive craftsmanship, and Arc Browser's visual originality. A premium intelligence platform for capital markets.

### COLOUR SYSTEM
#### Primary Palette
*   **Obsidian Black `#0A0A0F`**: Primary backgrounds, creates gravitas.
*   **Space Indigo `#3D35C8`**: Primary brand, actions, active states.
*   **Electric Violet `#6C47FF`**: AI features, premium tier, gradients.
*   **Cosmic White `#FAFAFF`**: Card surfaces, input backgrounds.
*   **Arctic White `#FFFFFF`**: Modal surfaces, clean zones.

#### Accent Palette
*   **Plasma Green `#00E5A0`**: Success states, investor-engaged status.
*   **Amber Signal `#F5A623`**: Warnings, in-review states, pending.
*   **Crimson Alert `#FF3B5C`**: Errors, critical actions, decline states.
*   **Investor Gold `#C9A84C`**: Premium tier features, match scores.
*   **Trust Blue `#2563EB`**: Links, secondary actions, sent states.

#### Gradient System
1.  **AI Aura**: Linear 135deg from `#6C47FF` to `#3D35C8` (AI features, chat, loading).
2.  **Investor Glow**: Linear 135deg from `#C9A84C` to `#F5A623` (Premium, investor features).
3.  **Document Depth**: Linear 180deg from `#0A0A0F` to `#1A1A2E` (Hero backgrounds).
4.  **Success Arc**: Linear 90deg from `#00E5A0` to `#2563EB` (Completion states).
5.  **Ghost Surface**: Linear 135deg from `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.02)` (Glassmorphism cards on dark).

### TYPOGRAPHY SYSTEM
*   **Display Font**: Instrument Serif or Canela Text (Editorial, trust).
*   **Interface Font**: Geist (Precision, craftsmanship).
*   **Monospace Font**: Geist Mono (Financials, code, metrics).

#### Type Scale (rem-based, 4px grid)
*   **Display**: 4rem / 64px, weight 400, tracking -0.04em, Instrument.
*   **H1**: 3rem / 48px, weight 600, tracking -0.03em, Geist.
*   **H2**: 2.25rem / 36px, weight 600, tracking -0.025em, Geist.
*   **H3**: 1.75rem / 28px, weight 600, tracking -0.02em, Geist.
*   **H4**: 1.25rem / 20px, weight 600, tracking -0.01em, Geist.
*   **Body L**: 1.0625rem / 17px, weight 400, leading 1.75, Geist.
*   **Body M**: 0.9375rem / 15px, weight 400, leading 1.7, Geist.
*   **Body S**: 0.8125rem / 13px, weight 400, leading 1.65, Geist.
*   **Label**: 0.6875rem / 11px, weight 600, tracking 0.08em, UPPERCASE.
*   **Metric**: 2.5rem / 40px, weight 700, Geist Mono.
*   **Micro**: 0.75rem / 12px, weight 500, Geist.

### SPACING & BORDER SYSTEM
*   **Base unit**: 4px (4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 160).
*   **Border Radius**: Cards 16px, Inputs 12px, Primary Buttons 10px, Secondary 8px, Pills 999px, Modals 20px.
*   **Borders**: 1px solid `rgba(255,255,255,0.08)` on dark, `rgba(0,0,0,0.08)` on light.

### SHADOW SYSTEM
*   **E0 (Flat)**: None.
*   **E1 (Raised)**: `0 1px 3px rgba(0,0,0,0.08)`.
*   **E2 (Hover)**: `0 4px 16px rgba(61,53,200,0.14)`.
*   **E3 (Float)**: `0 8px 32px rgba(0,0,0,0.16)`.
*   **E4 (Premium)**: `0 16px 48px rgba(108,71,255,0.24)`.

### ANIMATION SYSTEM
*   **Entrance**: `cubic-bezier(0.34, 1.56, 0.64, 1)`, 320ms.
*   **Exit**: `cubic-bezier(0.4, 0, 1, 1)`, 200ms.
*   **Hover**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, 150ms.
*   **Page Transition**: `cubic-bezier(0.22, 1, 0.36, 1)`, 400ms.
*   **AI Generation Pulse**: Keyframe animation (opacity 0.4 to 1.0), 2s infinite sine wave.
*   **Token Stream**: 80ms fade-in per word, 4px upward translate.

### GLASSMORPHISM SYSTEM
*   **Background**: `rgba(255,255,255,0.04)`.
*   **Border**: `rgba(255,255,255,0.10)`.
*   **Backdrop Filter**: `blur(20px) saturate(180%)`.
*   **Box Shadow**: `0 0 0 1px rgba(255,255,255,0.06) inset`.

---

## 2. HOMEPAGE REDESIGN

### 2.1 NAVIGATION
*   **Floating Glassmorphism**: Transparent at rest, activates on >80px scroll.
*   **Left**: Logo mark (custom SVG particle constellation) + "IdealApp" wordmark (Geist 600, White).
*   **Centre**: Products, Templates, Pricing, Investors, Blog. Geist Medium 15px.
*   **Right**: "Log in" ghost button + "Start free" primary button with AI Aura gradient shimmer.

### 2.2 HERO SECTION
*   **Background**: Interactive WebGL particle field forming a network graph (`#0A0A0F`). Repels on mouse movement.
*   **Eyebrow Text**: AI Aura pill badge: "✦ The AI venture platform for founders".
*   **Headline**: Instrument Serif 64px, White. "Your company's story, / told to the right investors." Animated staggering blur-to-sharp entrance.
*   **Sub-headline**: Geist 17px, White/60. "From first idea to funded round... connects you to the investors most likely to say yes."
*   **HERO PROMPT BAR**:
    *   Max-width 700px, glassmorphism card.
    *   Input cycling animated placeholders ("Describe your startup...").
    *   3 quick-start pills below: "📊 Pitch Deck" · "📋 Business Plan" · "💰 Financial Model".
    *   Right side: Model selector pill + "Generate →" button (AI Aura gradient).
*   **Social Proof Strip**: Ticker of logos. "500+ funded startups · $2.3B raised · 180+ templates".

### 2.3 LIVE DEMO SECTION ("Watch It Build")
*   **Layout**: Interactive terminal-style window on the left. Document preview stack on the right.
*   **Animation**: Typewriter streaming text on the left, updating document sections simultaneously on the right.
*   **Copy**: "6 sections generated in 22 seconds" + "Generate yours →".

### 2.4 FEATURE SHOWCASE (Scrollytelling)
*   **Layout**: Right side video player mapping to 6 active scroll cards on the left.
*   **Feature 1**: Chat-first creation.
*   **Feature 2**: Company DNA Memory (ambient intelligence).
*   **Feature 3**: Investor-grade output.
*   **Feature 4**: Intelligent Data Room.
*   **Feature 5**: Investor Matching Engine (Investor Gold treatment).
*   **Feature 6**: One-click Pitch Packages.

### 2.5 TEMPLATE GALLERY TEASER
*   **Layout**: 12 cards in 4-column grid. E2 hover shadows.
*   **Cards**: Preview thumbnail, name, tag, rating, "Use →" CTA.
*   **Bottom**: "Browse all 180+ templates →".

### 2.6 INVESTOR CONNECT SPOTLIGHT
*   **Design**: Dark background, Investor Glow aesthetics.
*   **Left**: Instrument Serif H1: "The right investors. Already matched. Ready to receive your deck."
*   **Right**: Mockup of blurred investor cards, glowing match score, gold Pro badge.
*   **CTA**: "Unlock Investor Connect →".

### 2.7 SOCIAL PROOF + METRICS
*   **Metrics**: 3 Glass cards ("180+ Templates", "10,000+ Investors", "< 30 seconds").
*   **Testimonials**: 3 founder cards with "Raised $X with IdealApp" Plasma Green badges.

### 2.8 PRICING TEASER
*   **Columns**: Starter, Pro, Studio. Pro card uses E4 premium glow.

### 2.9 FINAL CTA + FOOTER
*   **Headline**: Instrument Serif, "Your next funding round starts here."
*   **Footer**: 5 columns. Base mark: "Built for Founders. By Founders."

---

## 3. ONBOARDING FLOW

### SCREEN 3.1 — AUTH / SIGN UP
*   **Layout**: Full-screen dark background, light particle field.
*   **Content**: "Start building in seconds", "Your first pitch deck is free. No credit card."
*   **Primary Action**: "Continue with Google" (AI Aura gradient, 1-click SSO).
*   **Skip**: Immediate auth transition directly to Screen 3.3 if context collected.

### SCREEN 3.2 — COMPANY BOOTSTRAPPER (Maximum 3 Inputs)
*   **Layout**: Full screen, conversational chat bubble layout. Max-width 680px.
*   **Turn 1**: "Hey, I'm your IdealApp AI. Tell me about your company in one sentence..."
    *   *Action*: "Generate first draft →" CTA appears instantly upon typing.
*   **Turn 2 (Optional)**: "Want a stronger draft? Add your stage and raise amount →"
*   **Turn 3 (Optional)**: "Any key metrics? (revenue, users, growth rate)"
*   **Rule**: Skip to generation ALWAYS clearly highlighted.

### SCREEN 3.3 — GENERATION LOADING STATE
*   **Animation**: Vertical timeline of sections (Cover, Problem, Solution, Market, etc.). Sections pulse, then lock with a Plasma Green checkmark.
*   **Background**: Document silhouettes assembling.
*   **Copy**: "Building your investor-grade pitch deck... Usually takes 15–30s".

### SCREEN 3.4 — FIRST DOCUMENT VIEW (Aha Moment)
*   **Layout**: 3-column. (240px Nav, Flex Canvas, 380px Chat Rail).
*   **Canvas Entrance**: Cards animate sequentially (staggered 60ms, 20px translation).
*   **Tooltip**: Single spotlight on Chat Rail: "Your AI document partner is here."
*   **Checklist (Sidebar)**: "Generate document (✓), Set up DNA, Build data room, Match investors".

---

## 4. FOUNDER COMMAND CENTRE — DASHBOARD

### SCREEN 4.1 — DASHBOARD OVERVIEW
*   **Sidebar (256px)**: Brand dropdown, Overview, Documents, Data Room, Investor Match (Pro), Outreach Tracker (Pro), Templates, Analytics, DNA, Settings, Upgrade CTA.
*   **Header**: "Good morning, [Name] ✦", Date, "New Document" button.
*   **AI Nudges (Horizontal Cards)**:
    1.  "Your Series A deck hasn't been updated in 8 days..."
    2.  "You have 3 new investor matches..." (Pro Locked).
    3.  "Your data room was viewed 3 times today..."
*   **Metrics Row**: Documents Created, Outreach Ratio, Data Room Views, Match Score.
*   **Recent Documents**: Grid/List. Preview, Status Pill, Last Edited, Hover Actions (Edit, Share, Export).
*   **Investor Activity**: Mini table of tracker stats (blurred for free).
*   **Company DNA Widget**: Name, Sector, Stage, Key Metrics chips, Completeness Bar. "Your Company DNA is 60% complete."

### SCREEN 4.2 — COMPANY DNA EDITOR
*   **Purpose**: The central RAG context variables determining all AI quality.
*   **Sections**: Company Identity, What You Do, Traction & Metrics, Fundraising, Team, Market, Competitive Landscape, Branding.
*   **UX Pattern**: Form fields act as living memory nodes. "DNA Strength" meter scales as data is injected.

---

## 5. DOCUMENT WORKSPACE

### SCREEN 5.1 — DOCUMENT CANVAS + CHAT RAIL
*   **Section Navigator (Left)**: Drag-and-drop handles, completion dots, "Add section +" button.
*   **Document Canvas**: White cards. Target status dots. Inline editing rich-text block. E2 shadow hover states reveal `[Regenerate ↻]` and edit pen icons.
*   **Investor View Toggle**: Top right. Compresses the view entirely into an uninterrupted print-layout presentation.
*   **AI Chat Rail (Right)**:
    *   AI bubble (Slate/White glass), User bubble (Space Indigo).
    *   **Contextual Ghost Chips**: Suggested prompt queries hovering above input (e.g. "Add Unit Economics", "Make more conservative").
    *   Inline AI actions: AI generates new text in chat and presents `[Apply this change to Section 3 →]`.
*   **Collaboration**: CRDT Yjs WebSockets. Avatars floating with cursors.

### SCREEN 5.2 — EXPORT MODAL
*   **Options**: Download (PDF, DOCX, PPTX), Share Link (Password, Expiry, Tracking), Add to Data Room, Add to Pitch Package.
*   **Social Share**: "Share to X/Twitter" with auto-populated templates.
*   **Watermark**: "Built with IdealApp" (Toggle locked for free tier).

---

## 6. INTELLIGENT DATA ROOM

### SCREEN 6.1 — DATA ROOM HOME
*   **Layout**: Left folder tree (240px) + Right document area (flex).
*   **Top Bar**: Data Room name (editable), `[Invite]` button, `[Generate AI Summary]` button, `[Create Share Link]` button, Activity bell.
*   **Left Folder Tree**: Pre-structured (Pitch Materials, Financials, Legal, Product, Traction, Market, Team). Hover shows document count and last updated timestamp.
*   **Document View**: Grid/List toggles. Real-time search/sort.
*   **Document Card**: File type icon, Status chip (Private/Shared/NDA Required), View count, `AI Summary` button, 3-dot overflow menu.
*   **AI Summary Panel**: Slides from the right. "Investor Brief" (200 words), 5 Key Points. "Include in data room" toggle for investor-facing presentation.

### SCREEN 6.2 — SHARE LINK BUILDER
*   **Step 1 (Select Content)**: Checkbox list of folders/documents. Left selection, right preview.
*   **Step 2 (Set Permissions)**: View/Download toggle, NDA gate, Link expiry, Password protection, Investor tracking (Pro nudge).
*   **Step 3 (Personalise)**: Short message configuration, Subject line.
*   **Step 4 (Share)**: Generate link, Copy button, Direct Email dispatch (IdealApp branded tracking).

### SCREEN 6.3 — INVESTOR VIEW (Portal)
*   **Concept**: An impressive, highly professional destination. Not just a generic file dump.
*   **Design**: IdealApp-branded but customizable. Welcome message, card-style folders.
*   **Previews**: Documents display the AI Summary blurb. Clean inline PDF viewer (blocks downloads unless permitted).
*   **Action Tracking**: Page-level analytics, time spent per slide.
*   **CTAs**: `[Request access to more documents]`, `[Set up a call]` (Calendly linked).

---

## 7. INVESTOR MATCHING ENGINE

### SCREEN 7.1 — INVESTOR EXPLORER
*   **Layout**: Left filter panel (280px) + Right results area.
*   **Filter Panel**: Search, Investment Stage, Sector Focus, Geography, Check Size slider, Thesis keywords.
*   **AI Match Button ✦**: Primary engine. Analyzes the Company DNA against 10,000+ investors, ranks, and highlights match scores.
*   **Investor Card**: Logo, Firm/Name, Match score badge (Investor Gold), Match explanation (1 sentence), Tags, Recent check size.
*   **Pro Lock UX**: Cards 1–5 visible, 6–10 blurred at 50%, 11+ fully locked with Pro overlay.

### SCREEN 7.2 — INVESTOR PROFILE DRAWER
*   **Details**: Opens as a 480px right-side drawer. Preserves explorer context.
*   **Header & Thesis**: AI-extracted public thesis.
*   **Match Analysis**: Breaks down sector, stage, geography strengths vs weaknesses (e.g. "Check size: Your raise $1.5M, typical check $500K").
*   **Actionable**: `[Add to Outreach List]`, `[Generate Personalised Intro ✦]`, `[Open LinkedIn]`.

### SCREEN 7.3 — PITCH PACKAGE BUILDER
*   **Step 1 (Select Investors)**: Outreach lists + Recommended additions.
*   **Step 2 (Select Documents)**: Visual grid. Smart AI recommendation badges suggest best document combinations.
*   **Step 3 (Personalise Intros)**: Magic moment. AI generates a 3-sentence personalized email utilizing the investor thesis, Company DNA, and mutual connections. Inline edit capabilities.
*   **Step 4 (Review & Send)**: Scheduled sending. Confetti particle burst on dispatch.

### SCREEN 7.4 — OUTREACH TRACKER
*   **Format**: Full-width active tracking table.
*   **Funnel Summary**: Sent -> Opened -> Responded -> Meetings. Chart toggle visualizes a Sankey flow graph.
*   **Status Chips**: Sent (grey), Opened (blue), Active (amber), Interested (green), Responded (green bold), Meeting (gold trophy).
*   **AI Nudges**: Triggers based on activity. "Investor viewed model 3 times -> Send follow up?".

---

## 8. TEMPLATE GALLERY

*   **Architecture**: SEO-optimized engine targeting 200+ unique URLs (`/templates/[doc-type]/[industry]/[stage]`).
*   **Page Spec**: Live preview (first 3 slides), section breakdown, "Use this template" CTA (AI Aura gradient), FAQ block.
*   **Template Card**: Preview thumbnail, Header (H4), Category/Industry tag pills, Difficulty badge, Rating (5-star + count), `[Use Template]`/`[Preview]` buttons. E2 shadow hover.

---

## 9. PRICING & UPGRADE PATHS

### PRICING TIERS
*   **Starter (Free, forever)**: 5 documents/mo, 10 entry templates, Watermarked PDFs. Basic data room.
*   **Pro ($49/month or $490/year)**: Unlimited generation, Full 180+ templates, Unwatermarked PDF/DOCX/PPTX, Full Data Room (Tracking, NDAs), Investor matching & Pitch package sending (50/mo), Company DNA metrics.
*   **Studio ($199/month, Custom)**: Unlimited packages, White-label data room, API/CRM integration, SSO/SAML, Custom fine-tuned AI model.

### UPGRADE MOMENT DESIGN (CONTEXTUAL)
*   **Moment 1 (Volume)**: Generating 6th document. "Upgrade for unlimited".
*   **Moment 2 (Explorer)**: Viewing blurred investor #6. "10,000+ investors waiting".
*   **Moment 3 (Tracking)**: Trying to share tracked room. "See who opened what".
*   **Moment 4 (First Doc)**: Document complete interstitial. "Match it to investors".
*   **Moment 5 (Watermark)**: Export modal checkbox lock.

---

## 10. GROWTH ENGINE

*   **Mechanism 1 (Template SEO)**: Organic acquisition via dynamic template URLs.
*   **Mechanism 2 (Viral Share Loop)**: "Created with IdealApp" footprint on PDFs & Investor Data Room bottom banners. High-value investor views.
*   **Mechanism 3 (Referral)**: "Give a founder 3 documents, get 5 free runs."
*   **Mechanism 4 (Founder Wall)**: Opt-in public masonry gallery of successful funding rounds via IdealApp.
*   **Mechanism 5 (Accelerator Partnerships)**: Co-branded YC/Techstars cohort experiences.
*   **Mechanism 6 (Content Flywheel)**: Anatomy of pitch decks newsletter/LinkedIn push.

---

## 11. AI CHAT SYSTEM

### SYSTEM PROMPT ARCHITECTURE
*   Every context window injects: Company DNA (JSON), Current document content, Target section, History, Target investor properties.
*   Persona: "Expert investment banker/VC analyst with 20+ years experience... answer first, explain second."

### PROMPT-RESPONSE EXAMPLES
*   *Interaction*: "Make the problem section more compelling" -> *AI*: Rewrites section inserting quantified data gap and vivid scenario. *Chat Reply*: "I've rewritten your problem section... Want me to add a customer quote?"
*   *Interaction*: "Add a unit economics section" -> *AI*: Generates LTV:CAC, payback periods. *Chat Reply*: "Generated unit economics. Your LTV:CAC of 4.2x is strong. Payback is 14 months..."

### SUGGESTED PROMPT CHIPS
*   Floating dynamic context buttons.
*   *In Financials*: `[Add unit economics]`, `[Make more conservative]`, `[Stress test assumptions]`.

---

## 12. AMBIENT NOTIFICATION SYSTEM

*   **Investor Open Alert**: Real-time push, "Investor X just opened your data room."
*   **Deck Engagement**: "Investor X spent 7 minutes on your financials slide."
*   **AI Improvement Nudge**: "Your Series A deck hasn't been updated in 8 days. Want me to refresh the traction data?"
*   **Competitor Intelligence**: "Competitor X just raised $5M. Here is how it affects your positioning ->"
*   **Follow-Up Reminder**: 5-day silence check. "Want me to generate a follow-up email?"

---

## 13. COMPONENT LIBRARY

*   **Buttons**: 
    *   *Primary*: AI Aura background, Geist 600, 10px radius. Hover scale 1.01. 
    *   *Premium*: Investor Gold gradient, obsidian text, periodic 2-second shimmer delay.
*   **Inputs**: White bg, 12px radius, E1 shadow. Focus states glow with 3px indigo ring (`rgba(61,53,200,0.15)`).
*   **Status Chips**: 12px Geist, 6px/12px padding, fully rounded. Colors mapped per context (e.g. Draft = Slate-100/Slate-600, Engaged = Green-100/Green-700).
*   **Toasts**: Sliding E3 shadow boxes. Left border color correlates to states (Red=Error, Gold=Alert, Sparkle=AI Action). Auto-dismiss 4s.
*   **Modals**: 20px radius E3 card over `rgba(10,10,15,0.7)` backdrop blur. Spring entrance curve.

---

## 14. IMPLEMENTATION ROADMAP

### SPRINT 1 (Weeks 1-4): THE CORE LOOP
*   **Deliverables**: Homepage logic, 1-click Sign up, Chat-first Workspace (Forms eliminated).
*   **Goal**: 30 seconds to document creation. Achieve "Aha Moment".

### SPRINT 2 (Weeks 5-8): THE RETENTION LAYER
*   **Deliverables**: Dashboard, Company DNA widget, Data Room UI.
*   **Goal**: Recurring usage drivers. Embed AI Nudges and analytics.

### SPRINT 3 (Weeks 9-14): THE MONETISATION ENGINE
*   **Deliverables**: Investor Matching Explorer, Pricing Paywall paths, Pro Trial Logic.
*   **Goal**: Free-to-paid conversion friction optimization via targeted blurred results.

### SPRINT 4 (Weeks 15-20): THE GROWTH ENGINE
*   **Deliverables**: Pitch Packages builder, Outreach Tracker, Template Gallery dynamic SEO rendering.
*   **Goal**: Scale virality loops through shared URLs and exported PDF footprints.

### SPRINT 5 (Weeks 21-26): THE INTELLIGENCE LAYER
*   **Deliverables**: External enrichment logic, Ambient Notifications (Push/Email), Advanced System Prompts.
*   **Tech Spec Stack**: Next.js 14, Tailwind, Framer Motion, Claude 3.5 Sonnet API, Supabase, Yjs WebSockets, pgvector embeddings.
