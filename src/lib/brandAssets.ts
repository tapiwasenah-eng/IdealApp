// src/lib/brandAssets.ts

export const BRAND_ASSETS = {
  // ─── Large Feature Illustrations (16:9 hero-sized) ─────────────────
  features: {
    aiGeneration: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    templateLibrary: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    canvasEditor: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&q=80',
    exportSharing: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    teamCollaboration: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    securityPrivacy: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
  },

  // ─── Small Universal Icons (square, transparent BG) ────────────────
  icons: {
    aiGeneration: 'https://api.dicebear.com/7.x/shapes/svg?seed=ai&backgroundColor=4f46e5&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    templateLibrary: 'https://api.dicebear.com/7.x/shapes/svg?seed=template&backgroundColor=0ea5e9&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    canvasEditor: 'https://api.dicebear.com/7.x/shapes/svg?seed=editor&backgroundColor=ec4899&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    exportSharing: 'https://api.dicebear.com/7.x/shapes/svg?seed=export&backgroundColor=f97316&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    teamCollaboration: 'https://api.dicebear.com/7.x/shapes/svg?seed=team&backgroundColor=10b981&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    securityPrivacy: 'https://api.dicebear.com/7.x/shapes/svg?seed=security&backgroundColor=06b6d4&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    pitchDeck: 'https://api.dicebear.com/7.x/shapes/svg?seed=pitch&backgroundColor=8b5cf6&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    businessPlan: 'https://api.dicebear.com/7.x/shapes/svg?seed=business&backgroundColor=f59e0b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    aiIcon: 'https://api.dicebear.com/7.x/shapes/svg?seed=aiLogo&backgroundColor=4f46e5&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
  },

  // ─── Original Detailed Icons (square, dark BG) ────────────────────
  iconsOriginal: {
    brandMain: 'https://api.dicebear.com/7.x/shapes/svg?seed=brandMain&backgroundColor=1e293b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    aiGeneration: 'https://api.dicebear.com/7.x/shapes/svg?seed=ai&backgroundColor=1e293b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    templateLibrary: 'https://api.dicebear.com/7.x/shapes/svg?seed=template&backgroundColor=1e293b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    canvasEditor: 'https://api.dicebear.com/7.x/shapes/svg?seed=editor&backgroundColor=1e293b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    exportSharing: 'https://api.dicebear.com/7.x/shapes/svg?seed=export&backgroundColor=1e293b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    teamCollaboration: 'https://api.dicebear.com/7.x/shapes/svg?seed=team&backgroundColor=1e293b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
    securityPrivacy: 'https://api.dicebear.com/7.x/shapes/svg?seed=security&backgroundColor=1e293b&shape1Color=ffffff&shape2Color=ffffff&shape3Color=ffffff',
  },

  // ─── Supplemental Brand Images ─────────────────────────────────────
  supplemental: {
    heroMain: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    dashboardPreview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    editorPreview: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  },

  // ─── Product Previews (for Solutions cards) ───────────────────────
  productPreviews: {
    businessPlan: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    pitchDeck: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    marketingPlan: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    'business-plan': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'pitch-deck': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'marketing-plan': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },

  // ─── Hero Video ────────────────────────────────────────────────────
  video: {
    hero: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    editor: '',
    aiDocBuilder: '',
    perks: '',
    exportSharing: '',
    teamCollaboration: '',
    securityPrivacy: '',
    templateLibrary: '',
    canvasEditor: '',
  },
} as const;

// Feature section data with imagery — used by FeaturesPage, nav dropdowns, footer, etc.
export const FEATURE_SECTIONS = [
  {
    id: 'ai-generation',
    title: 'AI Document Generation',
    subtitle: 'From prompt to polished document in seconds',
    description: 'Harness the power of advanced AI to transform your ideas into professionally formatted documents. Our dual-engine AI understands context, matches your tone, and delivers publication-ready first drafts.',
    bullets: [
      'Natural language prompts — describe what you need in plain English',
      'Context-aware content generation with industry-specific knowledge',
      'Automatic tone and style matching to your brand voice',
      'Instant first drafts that are 90% ready for final review',
    ],
    featureImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    iconName: 'Sparkles',
    icon: BRAND_ASSETS.icons.aiGeneration,
    iconOriginal: BRAND_ASSETS.iconsOriginal.aiGeneration,
    gradient: 'from-indigo-500/10 to-teal-500/10',
    video: BRAND_ASSETS.video.aiDocBuilder,
  },
  {
    id: 'template-library',
    title: 'Template Library',
    subtitle: '180+ professionally designed templates',
    description: 'Browse our curated collection of industry-specific templates covering business plans, pitch decks, proposals, invoices, reports, and more. Every template is fully customizable and regularly updated.',
    bullets: [
      '180+ curated templates across 50+ industry categories',
      'Industry-specific designs built by domain experts',
      'Regularly updated content reflecting current best practices',
      'One-click customization — swap colors, fonts, and content instantly',
    ],
    featureImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    iconName: 'Layout',
    icon: BRAND_ASSETS.icons.templateLibrary,
    iconOriginal: BRAND_ASSETS.iconsOriginal.templateLibrary,
    gradient: 'from-blue-500/10 to-indigo-500/10',
    video: BRAND_ASSETS.video.templateLibrary,
  },
  {
    id: 'canvas-editor',
    title: 'Canvas Editor',
    subtitle: 'Visual editing with pixel-perfect control',
    description: 'Our powerful canvas editor puts you in complete control. Drag and drop content blocks, adjust typography, apply brand colors, and see changes in real-time with our live preview engine.',
    bullets: [
      'Drag-and-drop content blocks for intuitive layout design',
      'Real-time live preview — see exactly what your audience sees',
      'Advanced typography controls with 50+ font families',
      'Brand color theming with one-click palette application',
    ],
    featureImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&q=80',
    iconName: 'MousePointer2',
    icon: BRAND_ASSETS.icons.canvasEditor,
    iconOriginal: BRAND_ASSETS.iconsOriginal.canvasEditor,
    gradient: 'from-purple-500/10 to-pink-500/10',
    video: BRAND_ASSETS.video.canvasEditor,
  },
  {
    id: 'export-sharing',
    title: 'Export & Sharing',
    subtitle: 'Share your work anywhere, any format',
    description: 'Export your documents in any format your audience needs. Generate shareable links with optional password protection, track version history, and maintain full control over who sees your work.',
    bullets: [
      'Export to PDF, DOCX, and PNG with pixel-perfect rendering',
      'Public share links with custom slugs and branding',
      'Password-protected sharing for confidential documents',
      'Complete version history with one-click rollback',
    ],
    featureImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    iconName: 'Share2',
    icon: BRAND_ASSETS.icons.exportSharing,
    iconOriginal: BRAND_ASSETS.iconsOriginal.exportSharing,
    gradient: 'from-orange-500/10 to-red-500/10',
    video: BRAND_ASSETS.video.exportSharing,
  },
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    subtitle: 'Work together in real-time',
    description: 'Invite your team to collaborate on documents in real-time. Leave inline comments, manage permissions with role-based access, and track every change with a comprehensive activity audit log.',
    bullets: [
      'Live multi-user editing with colored cursor indicators',
      'Inline comments and threaded discussions on any element',
      'Role-based permissions — viewer, editor, admin levels',
      'Activity audit log tracking every change and who made it',
    ],
    featureImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    iconName: 'Users',
    icon: BRAND_ASSETS.icons.teamCollaboration,
    iconOriginal: BRAND_ASSETS.iconsOriginal.teamCollaboration,
    gradient: 'from-green-500/10 to-teal-500/10',
    video: BRAND_ASSETS.video.teamCollaboration,
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    subtitle: 'Enterprise-grade protection for your data',
    description: 'Your documents deserve the highest level of protection. We use AES-256 encryption, maintain SOC 2 Type II compliance, and are fully GDPR & CCPA ready. Your data is never used for AI training.',
    bullets: [
      'AES-256 encryption for data at rest and in transit',
      'SOC 2 Type II compliant infrastructure and processes',
      'Full GDPR & CCPA compliance with data residency options',
      'Your data is never used for AI model training — guaranteed',
    ],
    featureImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80',
    iconName: 'ShieldCheck',
    icon: BRAND_ASSETS.icons.securityPrivacy,
    iconOriginal: BRAND_ASSETS.iconsOriginal.securityPrivacy,
    gradient: 'from-cyan-500/10 to-blue-500/10',
    video: BRAND_ASSETS.video.securityPrivacy,
  },
] as const;
