import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Zap,
  Layout,
  Cpu,
  PenTool,
  Palette,
  Download,
  Users,
  Settings,
  Brain,
  Shield,
  Keyboard,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, howToSchema, breadcrumbSchema } from '../data/seo-schemas';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: React.ReactNode;
  content: React.ReactNode;
}

const CATEGORIES = [
  'All',
  'Getting Started',
  'Templates',
  'AI Features',
  'Canvas Editor',
  'Export & Sharing',
  'Team Collaboration',
] as const;

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-indigo-100 border-l-4 border-indigo-600 rounded-r-xl my-4">
      <Star className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-[#352459]">{children}</div>
    </div>
  );
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl my-4">
      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800">{children}</div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
      </div>
      <div className="flex-1 text-sm text-gray-700 leading-relaxed pt-0.5">{children}</div>
    </div>
  );
}

function IconPlaceholder({ description, icon: Icon, color }: { description: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }) {
  return (
    <div
      className="w-full h-32 rounded-xl flex flex-col items-center justify-center gap-2 my-4"
      style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}
    >
      <Icon className="w-10 h-10" style={{ color }} />
      <span className="text-xs text-gray-500 italic">[{description}]</span>
    </div>
  );
}

const TUTORIALS: Tutorial[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Ideal App',
    description: 'Learn how to create your account, explore the dashboard, and create your first professional document.',
    category: 'Getting Started',
    readTime: 5,
    difficulty: 'Beginner',
    icon: <BookOpen className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Welcome to Ideal App! This guide walks you through everything you need to know to get up and running in under 5 minutes.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">1. Creating Your Account</h3>
        <Step n={1}>Navigate to <strong>idealapp.technology/signup</strong> and enter your email address and a secure password.</Step>
        <Step n={2}>Check your inbox for a verification email and click the confirmation link.</Step>
        <Step n={3}>Complete your profile: add your name, company name, and optionally your logo. This information is used to pre-fill documents automatically.</Step>

        <TipBox>You can sign up with Google for instant access — no email verification required.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">2. Exploring the Dashboard</h3>
        <p className="text-sm text-gray-700 mb-3">After logging in, you land on your Dashboard. The layout has three main areas:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
          <li><strong>Left sidebar</strong>: Navigate between workspaces, templates, and settings.</li>
          <li><strong>Main area</strong>: Your recent documents and activity feed.</li>
          <li><strong>Top bar</strong>: Quick actions — create a document, search, and your profile menu.</li>
        </ul>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">3. Creating Your First Document</h3>
        <Step n={1}>Click the purple <strong>"+ New Document"</strong> button in the top-right area of the dashboard.</Step>
        <Step n={2}>In the modal, choose <strong>Create Blank</strong> or pick a starting template.</Step>
        <Step n={3}>Give your document a title (e.g. "Q3 Investor Pitch") and choose a workspace folder.</Step>
        <Step n={4}>Click <strong>"Create Document"</strong> — you'll be taken straight to the editor.</Step>

        <TipBox>Press <code className="bg-indigo-100 px-1 rounded text-xs">Ctrl+N</code> (or <code className="bg-indigo-100 px-1 rounded text-xs">⌘N</code> on Mac) anywhere in the app to quickly create a new document.</TipBox>

        <IconPlaceholder description="Dashboard overview screenshot showing workspaces and recent documents" icon={BookOpen} color="#4f46e5" />
      </div>
    ),
  },
  {
    id: 'understanding-dashboard',
    title: 'Understanding the Dashboard',
    description: 'Deep dive into workspaces, document management, activity metrics, and dashboard customisation.',
    category: 'Getting Started',
    readTime: 6,
    difficulty: 'Beginner',
    icon: <Layout className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">The dashboard is your command centre. Understanding it fully will save you significant time as your document library grows.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Workspaces</h3>
        <p className="text-sm text-gray-700 mb-3">Workspaces are folders that help you organise documents by project, client, or team. Each workspace has a colour label for quick identification.</p>
        <Step n={1}>Click <strong>"+ New Workspace"</strong> in the left sidebar to create a workspace.</Step>
        <Step n={2}>Give it a descriptive name like "Acme Corp" or "Q4 Campaigns".</Step>
        <Step n={3}>Drag existing documents into workspaces by hovering over a document card and clicking the <strong>Move</strong> icon.</Step>

        <WarnBox>Deleting a workspace does NOT delete the documents inside it — they move to "My Documents" automatically.</WarnBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Document Management</h3>
        <p className="text-sm text-gray-700 mb-3">Right-click any document card or click the three-dot menu to access these actions:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
          <li><strong>Rename</strong>: Edit the title inline.</li>
          <li><strong>Duplicate</strong>: Creates an identical copy in the same workspace.</li>
          <li><strong>Move to workspace</strong>: Reassign to a different folder.</li>
          <li><strong>Archive</strong>: Hide from main view but keep accessible.</li>
          <li><strong>Delete</strong>: Permanently remove (requires confirmation).</li>
        </ul>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Metrics & Activity</h3>
        <p className="text-sm text-gray-700 mb-3">The metrics cards at the top of the dashboard show:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
          <li><strong>Documents Created</strong>: Total count this month.</li>
          <li><strong>Templates Used</strong>: How many unique templates you've applied.</li>
          <li><strong>Exports</strong>: PDF/DOCX exports this month.</li>
          <li><strong>Collaborators</strong>: People with access to your documents.</li>
        </ul>

        <TipBox>Pin your most-used documents by clicking the star icon on a document card. Pinned documents appear at the top of the dashboard.</TipBox>
      </div>
    ),
  },
  {
    id: 'using-templates',
    title: 'Using Templates Effectively',
    description: 'How to browse, filter, and customise professional templates to match your brand and needs.',
    category: 'Templates',
    readTime: 7,
    difficulty: 'Beginner',
    icon: <Layout className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Ideal App includes 180+ professionally designed templates covering pitch decks, business plans, proposals, legal documents, and more. Here's how to get the most out of them.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Browsing Templates</h3>
        <Step n={1}>Navigate to <strong>Templates</strong> in the top navigation bar.</Step>
        <Step n={2}>Use the category tabs (All, Pitch Decks, Business Plans, etc.) to filter by document type.</Step>
        <Step n={3}>Use the search bar to find templates by keyword — for example, "series A" will surface pitch deck templates designed for early-stage fundraising.</Step>
        <Step n={4}>Sort by <strong>Popular</strong> (highest rated), <strong>Newest</strong>, or <strong>A–Z</strong>.</Step>

        <TipBox>Hover over any template card to preview it and see the page count, category, and user rating before committing.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Customising a Template</h3>
        <p className="text-sm text-gray-700 mb-3">Once in the editor with a template loaded:</p>
        <Step n={1}>Click any text block to edit it directly. Replace placeholder text with your own content.</Step>
        <Step n={2}>Open the <strong>Brand Colors</strong> panel on the right sidebar to swap the template's colour palette with your brand colours.</Step>
        <Step n={3}>Replace logo placeholders by clicking the image area and selecting <strong>"Upload Image"</strong>.</Step>
        <Step n={4}>Adjust fonts via the Typography panel — choose from 20+ professional font pairings.</Step>

        <WarnBox>Editing a template creates a NEW document — the original template is never modified. You can always start fresh from the same template.</WarnBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Premium Templates</h3>
        <p className="text-sm text-gray-700 mb-3">Templates marked with a gold <strong>PRO</strong> badge require a Pro or Enterprise subscription. They include:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
          <li>Advanced data visualisation slides</li>
          <li>Financial model tables with formulas</li>
          <li>Multi-page legal agreements</li>
          <li>Executive presentation decks with animations</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'ai-document-generation',
    title: 'AI-Powered Document Generation',
    description: 'Write effective prompts to generate complete, professional documents using Ideal App\'s AI engine.',
    category: 'AI Features',
    readTime: 8,
    difficulty: 'Intermediate',
    icon: <Cpu className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Ideal App\'s AI generation engine can create a full, structured document from a single prompt. The better your prompt, the better your output.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">How to Use AI Generation</h3>
        <Step n={1}>From the dashboard, click the <strong>"Generate with AI"</strong> button (sparkle icon).</Step>
        <Step n={2}>Select the document type from the dropdown (pitch deck, business plan, proposal, etc.).</Step>
        <Step n={3}>Write your prompt in the text area — be specific and descriptive.</Step>
        <Step n={4}>Click <strong>"Generate"</strong> and wait 10–30 seconds for the document to be created.</Step>
        <Step n={5}>Review the generated document in the editor and make any adjustments.</Step>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Writing Effective Prompts</h3>
        <p className="text-sm text-gray-700 mb-3">The AI works best with prompts that include these elements:</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li><strong>Company name and industry</strong>: "SolarTech, a B2B solar energy management SaaS company"</li>
          <li><strong>Target audience</strong>: "for Series A investors" or "for enterprise procurement teams"</li>
          <li><strong>Key metrics or facts</strong>: "$2M ARR, 140% net revenue retention, 500 customers"</li>
          <li><strong>Tone</strong>: "professional and authoritative" or "friendly and conversational"</li>
          <li><strong>Specific requirements</strong>: "include a competitive analysis slide" or "emphasise the founding team"</li>
        </ul>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-4">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Example Prompt</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            "Create a Series A pitch deck for Lumos, a B2B SaaS company that helps mid-market retailers optimise inventory using AI. We have $1.8M ARR, 120 paying customers, and 180% net dollar retention. Our main competitors are Relex and Blue Yonder. Tone should be confident and data-driven. Include market size, problem/solution, product overview, traction, team, and ask slides."
          </p>
        </div>

        <TipBox>After generation, use the AI "Refine" tool to adjust tone, add more detail to specific sections, or translate the document into another language.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Supported Document Types</h3>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
          <li>Pitch Decks (investor, sales, partner)</li>
          <li>Business Plans (lean canvas, full plan)</li>
          <li>Executive Summaries</li>
          <li>Marketing Proposals</li>
          <li>Project Proposals</li>
          <li>HR Documents (job descriptions, offer letters)</li>
          <li>Financial Summaries</li>
          <li>One-pagers and Fact Sheets</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'canvas-editor',
    title: 'Mastering the Canvas Editor',
    description: 'Complete guide to the toolbar, shapes, text formatting, images, layers, alignment, and keyboard shortcuts.',
    category: 'Canvas Editor',
    readTime: 12,
    difficulty: 'Intermediate',
    icon: <PenTool className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">The Ideal App canvas editor is powered by Fabric.js, giving you pixel-precise control over every element of your document.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">The Toolbar</h3>
        <p className="text-sm text-gray-700 mb-3">The left toolbar contains your primary drawing tools:</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li><strong>Select (V)</strong>: Click and drag to select objects. Hold Shift to multi-select.</li>
          <li><strong>Text (T)</strong>: Click anywhere on the canvas to add a text box. Double-click existing text to edit.</li>
          <li><strong>Rectangle (R)</strong>: Click and drag to draw a rectangle. Hold Shift for a perfect square.</li>
          <li><strong>Image (I)</strong>: Opens a file picker to upload an image, or paste from clipboard.</li>
          <li><strong>Pen (P)</strong>: Freehand drawing mode for annotations and sketches.</li>
        </ul>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Working with Text</h3>
        <Step n={1}>Select the Text tool and click on the canvas to place a text box.</Step>
        <Step n={2}>Type your content. Use the formatting bar at the top to change font, size, weight, and alignment.</Step>
        <Step n={3}>To change text colour, select the text and click the colour swatch in the properties panel.</Step>
        <Step n={4}>Resize the text box by dragging the handles. The text reflows automatically.</Step>

        <TipBox>Double-click any text element while in Select mode to jump directly into edit mode without switching tools.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Layers</h3>
        <p className="text-sm text-gray-700 mb-3">Every element on the canvas is a "layer" with a stacking order. To manage layers:</p>
        <Step n={1}>Click the Layers icon in the bottom-left of the toolbar to open the layers panel.</Step>
        <Step n={2}>Drag layers up or down to reorder them.</Step>
        <Step n={3}>Click the eye icon to hide/show a layer without deleting it.</Step>
        <Step n={4}>Lock a layer by clicking the padlock icon to prevent accidental edits.</Step>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Alignment & Distribution</h3>
        <p className="text-sm text-gray-700 mb-3">Select two or more objects, then use the alignment bar that appears:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
          <li><strong>Align Left/Center/Right</strong>: Align selected objects horizontally.</li>
          <li><strong>Align Top/Middle/Bottom</strong>: Align selected objects vertically.</li>
          <li><strong>Distribute Horizontally/Vertically</strong>: Space objects evenly.</li>
        </ul>

        <WarnBox>Alignment is relative to the selection bounding box, not the canvas. To align to the canvas edge, select one object and use Ctrl+Shift+A to open the absolute alignment panel.</WarnBox>
      </div>
    ),
  },
  {
    id: 'brand-colors',
    title: 'Working with Brand Colors',
    description: 'Set up a custom colour scheme to maintain brand consistency across all your documents.',
    category: 'Canvas Editor',
    readTime: 5,
    difficulty: 'Beginner',
    icon: <Palette className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Consistent brand colours make your documents instantly recognisable. Ideal App lets you save your brand palette and apply it to any template or canvas element.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Setting Up Your Brand Palette</h3>
        <Step n={1}>Go to <strong>Settings → Brand Kit</strong> from the dashboard sidebar.</Step>
        <Step n={2}>Click <strong>"Add Colour"</strong> and enter your hex codes (e.g. <code className="bg-indigo-100 px-1 rounded text-xs">#4f46e5</code> for primary purple).</Step>
        <Step n={3}>Label each colour (Primary, Secondary, Accent, Text, Background).</Step>
        <Step n={4}>Upload your logo in SVG or PNG format (transparent background recommended).</Step>
        <Step n={5}>Save your brand kit — it's now available in every document.</Step>

        <TipBox>Enter your website URL in Brand Kit settings and Ideal App will automatically extract your brand colours using AI colour detection.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Applying Brand Colours in the Editor</h3>
        <p className="text-sm text-gray-700 mb-3">In the canvas editor, your brand palette appears at the top of every colour picker. To apply a brand colour:</p>
        <Step n={1}>Select an object (text, shape, or background).</Step>
        <Step n={2}>Click the colour swatch in the properties panel.</Step>
        <Step n={3}>Your saved brand colours appear as swatches at the top. Click to apply.</Step>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Swapping Colours Across a Document</h3>
        <p className="text-sm text-gray-700 mb-3">To replace a colour used throughout the document:</p>
        <Step n={1}>Open <strong>Edit → Find & Replace Colour</strong>.</Step>
        <Step n={2}>Click the "From" swatch and select the colour you want to replace.</Step>
        <Step n={3}>Click the "To" swatch and choose the replacement colour.</Step>
        <Step n={4}>Click <strong>"Replace All"</strong> — all instances update instantly.</Step>
      </div>
    ),
  },
  {
    id: 'exporting',
    title: 'Exporting Your Documents',
    description: 'Export to PDF, DOCX, or PNG with full control over quality, resolution, and formatting.',
    category: 'Export & Sharing',
    readTime: 5,
    difficulty: 'Beginner',
    icon: <Download className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Ideal App supports multiple export formats to suit different use cases — from print-ready PDFs to editable DOCX files.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Export Formats</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li><strong>PDF</strong>: Best for sharing, printing, and sending to investors or clients. Preserves all formatting exactly.</li>
          <li><strong>DOCX (Word)</strong>: Editable in Microsoft Word or Google Docs. Best for documents that recipients need to edit.</li>
          <li><strong>PNG</strong>: High-resolution image of each page. Best for social media or presentations.</li>
          <li><strong>SVG</strong>: Vector format — perfect for logos and graphics embedded in other tools.</li>
        </ul>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">How to Export</h3>
        <Step n={1}>In the editor, click the <strong>"Export"</strong> button in the top bar.</Step>
        <Step n={2}>Select your desired format from the dropdown.</Step>
        <Step n={3}>Configure options — for PDF: choose page size, margin, and orientation. For PNG: choose DPI (72 for screen, 300 for print).</Step>
        <Step n={4}>Click <strong>"Download"</strong>. The file downloads immediately.</Step>

        <TipBox>For investor pitch decks, export as PDF at 300 DPI for crisp, professional quality. Attach to emails directly — no need to compress.</TipBox>

        <WarnBox>DOCX export approximates the design using Microsoft Office styles. Complex canvas layouts with overlapping elements may not convert perfectly — always review the DOCX output before sharing.</WarnBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Exporting Multiple Pages</h3>
        <p className="text-sm text-gray-700 mb-3">Multi-page documents export all pages by default. To export specific pages:</p>
        <Step n={1}>In the export dialog, click <strong>"Select Pages"</strong>.</Step>
        <Step n={2}>Check or uncheck individual pages from the thumbnail list.</Step>
        <Step n={3}>Click Export to download only the selected pages.</Step>
      </div>
    ),
  },
  {
    id: 'collaboration',
    title: 'Collaboration Features',
    description: 'Share documents, set permissions, and edit in real-time with your team.',
    category: 'Team Collaboration',
    readTime: 7,
    difficulty: 'Intermediate',
    icon: <Users className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Ideal App supports real-time collaboration so your team can work on documents simultaneously — no more version conflicts or emailed attachments.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Sharing a Document</h3>
        <Step n={1}>Open the document in the editor and click the <strong>"Share"</strong> button in the top bar.</Step>
        <Step n={2}>Enter the email addresses of collaborators. Press Enter after each address.</Step>
        <Step n={3}>Set the permission level for each collaborator: <strong>View</strong>, <strong>Comment</strong>, or <strong>Edit</strong>.</Step>
        <Step n={4}>Click <strong>"Send Invite"</strong> — collaborators receive an email with a direct link.</Step>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Permission Levels</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li><strong>View</strong>: Can see the document and export it, but cannot make changes.</li>
          <li><strong>Comment</strong>: Can add comments and suggestions but cannot edit content.</li>
          <li><strong>Edit</strong>: Full editing access. Cannot delete the document or change sharing settings.</li>
          <li><strong>Admin</strong>: Full access including document management and sharing settings.</li>
        </ul>

        <TipBox>Use <strong>"Share Link"</strong> to generate a read-only public link that anyone can view without logging in. Useful for sharing with external stakeholders.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Real-time Editing</h3>
        <p className="text-sm text-gray-700 mb-3">When multiple people are editing simultaneously:</p>
        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
          <li>Each collaborator's cursor is visible in a different colour with their name label.</li>
          <li>Changes sync in real-time — typically within 300ms.</li>
          <li>If two people edit the same text simultaneously, a conflict resolution dialog appears.</li>
        </ul>

        <WarnBox>Real-time collaboration requires a Pro or Enterprise subscription. Free users can share view-only links but cannot co-edit.</WarnBox>
      </div>
    ),
  },
  {
    id: 'template-customisation',
    title: 'Template Customisation Deep Dive',
    description: 'Advanced techniques for modifying templates and saving your own custom versions for reuse.',
    category: 'Templates',
    readTime: 9,
    difficulty: 'Intermediate',
    icon: <Settings className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Go beyond basic editing — learn how to deeply customise templates and save them as reusable starting points for your team.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Replacing Template Sections</h3>
        <Step n={1}>Open a template-based document in the editor.</Step>
        <Step n={2}>In the left panel, switch to the <strong>"Structure"</strong> view to see all sections as an outline.</Step>
        <Step n={3}>Click any section to jump to it. You can drag sections to reorder them.</Step>
        <Step n={4}>Right-click a section to duplicate it, delete it, or convert it to a different section type.</Step>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Replacing Placeholder Images</h3>
        <p className="text-sm text-gray-700 mb-3">Templates include placeholder images with dashed borders. To replace them:</p>
        <Step n={1}>Click the placeholder image — a <strong>"Replace Image"</strong> button appears.</Step>
        <Step n={2}>Choose from: <strong>Upload from device</strong>, <strong>Search stock photos</strong> (Unsplash integration), or <strong>Paste URL</strong>.</Step>
        <Step n={3}>The new image maintains the original dimensions and position. Use the crop handle to adjust framing.</Step>

        <TipBox>Select multiple placeholder images and click "Replace All Placeholders" to upload all images at once using a bulk upload dialog.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Saving as a Custom Template</h3>
        <p className="text-sm text-gray-700 mb-3">Once you've customised a template to your liking, save it as a reusable template for your team:</p>
        <Step n={1}>Click <strong>File → Save as Template</strong>.</Step>
        <Step n={2}>Give your template a name, description, and category.</Step>
        <Step n={3}>Choose visibility: <strong>Personal</strong> (only you) or <strong>Team</strong> (visible to all workspace members).</Step>
        <Step n={4}>Your template now appears in the Templates gallery under <strong>"My Templates"</strong>.</Step>
      </div>
    ),
  },
  {
    id: 'advanced-ai-prompts',
    title: 'Advanced AI Prompts',
    description: 'Expert-level prompt engineering techniques to get the best possible AI-generated documents.',
    category: 'AI Features',
    readTime: 10,
    difficulty: 'Advanced',
    icon: <Brain className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">The difference between a mediocre AI-generated document and a great one is almost entirely in the prompt. These advanced techniques will elevate your results significantly.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">The PACT Framework</h3>
        <p className="text-sm text-gray-700 mb-3">Structure every prompt using the PACT framework:</p>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li><strong>P — Purpose</strong>: What is this document for? Who will read it?</li>
          <li><strong>A — Audience</strong>: Be specific about the reader's background, level of knowledge, and goals.</li>
          <li><strong>C — Context</strong>: Your company, product, market, metrics, and differentiators.</li>
          <li><strong>T — Tone</strong>: Professional/casual, formal/conversational, data-heavy/narrative.</li>
        </ul>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-4">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Weak Prompt vs. Strong Prompt</p>
          <p className="text-xs text-red-600 font-medium mb-1">❌ Weak: "Make a pitch deck for my startup"</p>
          <p className="text-xs text-green-700 font-medium">✅ Strong: "Create a 12-slide Series A pitch deck for Aria, a mental health SaaS platform targeting HR teams at companies with 500–5000 employees. We have 2,400 paying customers, $3.2M ARR, 115% NRR. Our differentiation is clinically validated content partnerships with 3 major hospital networks. The audience is healthcare-focused VC funds. Tone: warm but data-driven."</p>
        </div>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Iterative Refinement</h3>
        <p className="text-sm text-gray-700 mb-3">Don't try to get a perfect document in one generation. Use the Refine tool to iterate:</p>
        <Step n={1}>Generate an initial document with a strong base prompt.</Step>
        <Step n={2}>Review the output and identify the 2–3 sections that need the most improvement.</Step>
        <Step n={3}>Use <strong>Section Refine</strong> (right-click any section → "Refine with AI") to regenerate just that section with a more specific prompt.</Step>
        <Step n={4}>Use the <strong>Tone Adjuster</strong> to globally shift the document's voice without regenerating content.</Step>

        <TipBox>The AI retains context from your earlier prompts within a session. Reference previous content: "Make the Market Size slide consistent with the TAM numbers I mentioned in the Overview section."</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Adding Custom Data</h3>
        <p className="text-sm text-gray-700 mb-3">For documents that need real numbers and statistics:</p>
        <Step n={1}>Click <strong>"Add Context"</strong> before generating to upload a PDF, paste data, or connect a spreadsheet.</Step>
        <Step n={2}>The AI will use your provided data as the source of truth for all metrics.</Step>
        <Step n={3}>It will also flag any contradictions between your prompt and the uploaded data.</Step>
      </div>
    ),
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy Guide',
    description: 'How Ideal App protects your data with encryption, access controls, and compliance frameworks.',
    category: 'Getting Started',
    readTime: 6,
    difficulty: 'Beginner',
    icon: <Shield className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Your documents often contain sensitive business information. Here's how Ideal App protects them.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Encryption</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li><strong>At rest</strong>: All documents and user data are encrypted using AES-256.</li>
          <li><strong>In transit</strong>: All communications use TLS 1.3 — the most secure version of the protocol.</li>
          <li><strong>AI processing</strong>: Your content is encrypted during AI processing and is never used to train AI models.</li>
        </ul>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Access Controls</h3>
        <p className="text-sm text-gray-700 mb-3">Control who can see and edit your documents:</p>
        <Step n={1}>Go to <strong>Settings → Security</strong> to enable Two-Factor Authentication (2FA).</Step>
        <Step n={2}>Use workspace-level permissions to restrict which team members can access which project folders.</Step>
        <Step n={3}>Enable <strong>"Require Authentication for Shared Links"</strong> in document sharing settings to ensure only logged-in users can access your links.</Step>

        <TipBox>Enterprise users can enable IP allowlisting to restrict access to Ideal App from approved corporate networks only.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Your Rights & Data Control</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li><strong>Data export</strong>: Export all your documents and account data at any time from Settings → Privacy → Export My Data.</li>
          <li><strong>Account deletion</strong>: Delete your account and all associated data permanently from Settings → Account → Delete Account.</li>
          <li><strong>GDPR</strong>: Ideal App is fully GDPR compliant. EU data is stored on European servers (Frankfurt).</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts & Power Tips',
    description: 'Master the keyboard shortcuts and hidden features that professional users rely on.',
    category: 'Canvas Editor',
    readTime: 4,
    difficulty: 'Intermediate',
    icon: <Keyboard className="w-5 h-5" />,
    content: (
      <div>
        <p className="text-gray-700 mb-4">Power users who master keyboard shortcuts work 3–5× faster in the editor. Here are all the shortcuts you need.</p>

        <h3 className="font-bold text-gray-900 text-base mb-3">Global Shortcuts</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ['Ctrl+N / ⌘N', 'New document'],
            ['Ctrl+S / ⌘S', 'Save'],
            ['Ctrl+Z / ⌘Z', 'Undo'],
            ['Ctrl+Shift+Z / ⌘⇧Z', 'Redo'],
            ['Ctrl+/ / ⌘/', 'Command palette'],
            ['Ctrl+K / ⌘K', 'Quick search'],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded font-mono flex-shrink-0">{key}</code>
              <span className="text-xs text-gray-600">{desc}</span>
            </div>
          ))}
        </div>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Editor Shortcuts</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ['V', 'Select tool'],
            ['T', 'Text tool'],
            ['R', 'Rectangle tool'],
            ['I', 'Image tool'],
            ['P', 'Pen tool'],
            ['Ctrl+G / ⌘G', 'Group selected'],
            ['Ctrl+Shift+G / ⌘⇧G', 'Ungroup'],
            ['Ctrl+D / ⌘D', 'Duplicate'],
            ['Delete / Backspace', 'Delete selected'],
            ['Ctrl+A / ⌘A', 'Select all'],
            ['Ctrl+Shift+A / ⌘⇧A', 'Deselect all'],
            ['[', 'Send backward'],
            [']', 'Bring forward'],
            ['Ctrl+[ / ⌘[', 'Send to back'],
            ['Ctrl+] / ⌘]', 'Bring to front'],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center gap-2">
              <code className="text-xs bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded font-mono flex-shrink-0">{key}</code>
              <span className="text-xs text-gray-600">{desc}</span>
            </div>
          ))}
        </div>

        <TipBox>Hold <code className="bg-indigo-100 px-1 rounded text-xs">Space</code> at any time to temporarily switch to the pan tool, then release to return to your previous tool. This is much faster than clicking the pan button.</TipBox>

        <h3 className="font-bold text-gray-900 text-base mb-3 mt-6">Hidden Features</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li><strong>Smart guides</strong>: Drag an element near another — blue guide lines appear for pixel-perfect alignment.</li>
          <li><strong>Copy style</strong>: Select an object, press <code className="bg-gray-100 px-1 rounded text-xs">Ctrl+Alt+C</code>, then select another object and press <code className="bg-gray-100 px-1 rounded text-xs">Ctrl+Alt+V</code> to paste its style.</li>
          <li><strong>Zoom to selection</strong>: Select objects and press <code className="bg-gray-100 px-1 rounded text-xs">Ctrl+Shift+H</code> to zoom the canvas to fit your selection.</li>
          <li><strong>Pixel nudge</strong>: Arrow keys move selected objects 1px. Hold Shift to move 10px at a time.</li>
        </ul>
      </div>
    ),
  },
];

function DifficultyBadge({ level }: { level: 'Beginner' | 'Intermediate' | 'Advanced' }) {
  const styles = {
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-blue-100 text-blue-700',
    Advanced: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[level]}`}>
      {level}
    </span>
  );
}

export default function TutorialsPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return TUTORIALS;
    return TUTORIALS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  return (
    <PageWrapper>
      <SEOHead
        title="Tutorials — How to Create Pitch Decks, Business Plans & More"
        description="Step-by-step tutorials for creating pitch decks, business plans, financial models, and data rooms with Ideal App. Get started in minutes with our how-to guides."
        keywords="how to create a pitch deck, how to write a business plan, financial model tutorial, data room setup guide, AI document tutorial, pitch deck how to, startup document guide, Ideal App tutorial"
        canonicalUrl="https://idealapp.technology/tutorials"
        ogImage="https://idealapp.technology/og/tutorials.png"
        structuredData={[organizationSchema, howToSchema, breadcrumbSchema('/tutorials', 'Tutorials')]}
      />
      <div className="min-h-screen bg-[#e8eef8]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#352459] to-indigo-800 text-white py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            <BookOpen className="w-4 h-4 text-[#a370fc]" />
            {TUTORIALS.length} Tutorials
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Learn Ideal App</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Step-by-step guides to help you create professional documents faster.
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-indigo-100 hover:text-[#3730a3] border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tutorial cards */}
        <div className="space-y-4">
          {filtered.map((tutorial, i) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Card header */}
              <button
                onClick={() => setExpandedId(expandedId === tutorial.id ? null : tutorial.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
              >
                {/* Icon area */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #e0e7ff, #c4b5f4)' }}
                >
                  <div className="text-indigo-600">{tutorial.icon}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-900">{tutorial.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{tutorial.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <DifficultyBadge level={tutorial.difficulty} />
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {tutorial.readTime} min read
                    </span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{tutorial.category}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-gray-400">
                  {expandedId === tutorial.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedId === tutorial.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      {tutorial.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-10 text-white text-center"
        >
          <CheckCircle className="w-10 h-10 mx-auto mb-4 text-[#a370fc]" />
          <h2 className="text-2xl font-bold mb-2">Ready to start creating?</h2>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            You've got the knowledge — now put it into practice. Create your first professional document in minutes.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#3730a3] font-bold rounded-xl hover:bg-indigo-100 transition-colors"
          >
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  </PageWrapper>
  );
}
