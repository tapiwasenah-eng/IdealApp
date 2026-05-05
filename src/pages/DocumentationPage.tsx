import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Menu,
  X,
  BookOpen,
  Zap,
  Layout,
  Layers,
  PenTool,
  Cpu,
  Download,
  Users,
  Crown,
  Code,
  Keyboard,
  HelpCircle,
  List,
  ChevronRight,
  ExternalLink,
  Info,
  AlertTriangle,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import SEOHead from '../components/Shared/SEOHead';
import { organizationSchema, breadcrumbSchema } from '../data/seo-schemas';

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  subsections?: { id: string; title: string }[];
}

const SECTIONS: DocSection[] = [
  { id: 'introduction', title: 'Introduction', icon: <BookOpen className="w-4 h-4" /> },
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    icon: <Zap className="w-4 h-4" />,
    subsections: [
      { id: 'qs-account', title: 'Creating an Account' },
      { id: 'qs-first-doc', title: 'First Document' },
      { id: 'qs-export', title: 'Exporting' },
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Layout className="w-4 h-4" />,
    subsections: [
      { id: 'dash-workspaces', title: 'Workspaces' },
      { id: 'dash-documents', title: 'Document Management' },
      { id: 'dash-metrics', title: 'Metrics' },
    ],
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: <Layers className="w-4 h-4" />,
    subsections: [
      { id: 'tpl-browsing', title: 'Browsing Templates' },
      { id: 'tpl-customising', title: 'Customising Templates' },
      { id: 'tpl-creating', title: 'Creating Custom Templates' },
    ],
  },
  {
    id: 'canvas-editor',
    title: 'Canvas Editor',
    icon: <PenTool className="w-4 h-4" />,
    subsections: [
      { id: 'ce-tools', title: 'Tools' },
      { id: 'ce-layers', title: 'Layers' },
      { id: 'ce-text', title: 'Text Formatting' },
      { id: 'ce-shapes', title: 'Shapes & Lines' },
      { id: 'ce-images', title: 'Images' },
    ],
  },
  {
    id: 'ai-generation',
    title: 'AI Generation',
    icon: <Cpu className="w-4 h-4" />,
    subsections: [
      { id: 'ai-prompt', title: 'Prompt Syntax' },
      { id: 'ai-types', title: 'Document Types' },
      { id: 'ai-limits', title: 'Limits & Quotas' },
    ],
  },
  {
    id: 'export',
    title: 'Export',
    icon: <Download className="w-4 h-4" />,
    subsections: [
      { id: 'exp-formats', title: 'Formats' },
      { id: 'exp-options', title: 'Options' },
      { id: 'exp-quality', title: 'Quality Settings' },
    ],
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    icon: <Users className="w-4 h-4" />,
    subsections: [
      { id: 'col-sharing', title: 'Sharing' },
      { id: 'col-permissions', title: 'Permissions' },
      { id: 'col-realtime', title: 'Real-time Editing' },
    ],
  },
  {
    id: 'access-tiers',
    title: 'Access Tiers',
    icon: <Crown className="w-4 h-4" />,
    subsections: [
      { id: 'at-free', title: 'Free Plan' },
      { id: 'at-pro', title: 'Pro Plan' },
      { id: 'at-enterprise', title: 'Enterprise Plan' },
    ],
  },
  { id: 'api', title: 'API Reference', icon: <Code className="w-4 h-4" /> },
  { id: 'shortcuts', title: 'Keyboard Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
  { id: 'faq', title: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'changelog', title: 'Changelog', icon: <List className="w-4 h-4" /> },
];

function Note({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warn' }) {
  if (type === 'warn') {
    return (
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl my-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 p-4 bg-indigo-100/60 border border-indigo-600/20 rounded-xl my-4">
      <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-[#352459]">{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-600 border-b border-gray-100 last:border-0">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  return (
    <pre className="bg-[#1e1e2e] rounded-xl p-4 overflow-x-auto my-4">
      <code className="text-[#cdd6f4] text-xs font-mono leading-relaxed">{code}</code>
    </pre>
  );
}

function Screenshot({ description }: { description: string }) {
  return (
    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center my-4 border-2 border-dashed border-gray-300">
      {/* SCREENSHOT: {description} — to be added from Google AI Studio */}
      <p className="text-gray-400 text-sm text-center px-4">[Screenshot: {description}]</p>
    </div>
  );
}

const SECTION_CONTENT: Record<string, React.ReactNode> = {
  introduction: (
    <div>
      <p className="text-gray-700 text-base leading-relaxed mb-4">
        <strong>Ideal App</strong> is an AI-powered document creation platform that helps businesses create professional documents — pitch decks, business plans, proposals, contracts, and more — in minutes. Whether you start from a blank canvas, choose from 180+ templates, or generate with AI, Ideal App gives you the tools to produce polished, brand-consistent documents without design experience.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        This documentation covers all features of the Ideal App platform. Use the sidebar to navigate to specific topics, or use the search box to find answers quickly.
      </p>
      <h3 className="font-bold text-gray-900 text-lg mb-3 mt-6">Core Concepts</h3>
      <ul className="space-y-3 text-gray-700">
        <li className="flex gap-3"><ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" /><div><strong>Documents</strong> — The fundamental unit. A document contains one or more pages with content.</div></li>
        <li className="flex gap-3"><ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" /><div><strong>Workspaces</strong> — Folders that organise your documents by project, client, or team.</div></li>
        <li className="flex gap-3"><ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" /><div><strong>Templates</strong> — Pre-designed starting points. Apply a template and customise to match your brand.</div></li>
        <li className="flex gap-3"><ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" /><div><strong>Canvas Editor</strong> — The visual editing environment powered by Fabric.js. Drag, resize, and style elements with pixel precision.</div></li>
        <li className="flex gap-3"><ChevronRight className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" /><div><strong>AI Generation</strong> — Describe your document in plain language and let the AI build a complete structured draft.</div></li>
      </ul>
      <Note>Ideal App is built by IdealApp Technology Ltd., registered in England and Wales. For support, contact <a href="mailto:hello@idealapp.technology" className="text-indigo-600 hover:underline">hello@idealapp.technology</a>.</Note>
    </div>
  ),

  'quick-start': (
    <div>
      <p className="text-gray-700 mb-4">Get up and running with Ideal App in under 5 minutes.</p>

      <h3 id="qs-account" className="font-bold text-gray-900 text-lg mb-3">Creating an Account</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 text-sm">
        <li>Visit <a href="https://idealapp.technology/signup" className="text-indigo-600 hover:underline">idealapp.technology/signup</a> and enter your email and password, or click "Continue with Google".</li>
        <li>If signing up with email, check your inbox and click the verification link.</li>
        <li>Complete the onboarding flow: enter your name, company, and optionally upload your logo.</li>
      </ol>
      <Screenshot description="Sign-up page with email and Google OAuth options" />

      <h3 id="qs-first-doc" className="font-bold text-gray-900 text-lg mb-3 mt-8">Creating Your First Document</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 text-sm">
        <li>From the Dashboard, click <strong>"+ New Document"</strong>.</li>
        <li>Choose <strong>Create Blank</strong> for a fresh canvas or <strong>From Template</strong> to start with a design.</li>
        <li>Enter a title and select a workspace, then click <strong>"Create Document"</strong>.</li>
        <li>You are taken to the editor. Begin adding content.</li>
      </ol>

      <h3 id="qs-export" className="font-bold text-gray-900 text-lg mb-3 mt-8">Exporting Your Document</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
        <li>In the editor, click <strong>"Export"</strong> in the top bar.</li>
        <li>Select a format: PDF, DOCX, PNG, or SVG.</li>
        <li>Configure options and click <strong>"Download"</strong>.</li>
      </ol>
    </div>
  ),

  dashboard: (
    <div>
      <p className="text-gray-700 mb-4">The Dashboard is your central hub for managing all documents and workspaces.</p>

      <h3 id="dash-workspaces" className="font-bold text-gray-900 text-lg mb-3">Workspaces</h3>
      <p className="text-sm text-gray-700 mb-3">Workspaces are colour-labelled folders. Use them to separate documents by client, project, or department. Each workspace is private to your account unless shared.</p>
      <Table
        headers={['Action', 'How to']}
        rows={[
          ['Create workspace', 'Click "+ New Workspace" in the left sidebar'],
          ['Rename workspace', 'Right-click workspace name → Rename'],
          ['Delete workspace', 'Right-click workspace name → Delete (documents are moved to "My Documents")'],
          ['Change colour', 'Click the colour dot next to the workspace name'],
        ]}
      />

      <h3 id="dash-documents" className="font-bold text-gray-900 text-lg mb-3 mt-8">Document Management</h3>
      <p className="text-sm text-gray-700 mb-3">Documents are shown as cards in the main area. Each card shows a thumbnail preview, title, last modified date, and status badge.</p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
        <li><strong>Open</strong>: Click the document card.</li>
        <li><strong>Duplicate</strong>: Hover → three-dot menu → Duplicate.</li>
        <li><strong>Move</strong>: Hover → three-dot menu → Move to Workspace.</li>
        <li><strong>Archive</strong>: Hover → three-dot menu → Archive.</li>
        <li><strong>Delete</strong>: Hover → three-dot menu → Delete (requires confirmation).</li>
      </ul>

      <h3 id="dash-metrics" className="font-bold text-gray-900 text-lg mb-3 mt-8">Metrics</h3>
      <p className="text-sm text-gray-700 mb-3">The metrics panel at the top of the dashboard shows your current billing period's usage:</p>
      <Table
        headers={['Metric', 'Description', 'Resets']}
        rows={[
          ['Documents Created', 'Total new documents this period', 'Monthly'],
          ['AI Generations', 'Number of AI-generated documents', 'Monthly'],
          ['Exports', 'Total PDF/DOCX/PNG exports', 'Monthly'],
          ['Collaborators', 'Unique collaborators with active access', 'Never'],
        ]}
      />
    </div>
  ),

  templates: (
    <div>
      <h3 id="tpl-browsing" className="font-bold text-gray-900 text-lg mb-3">Browsing Templates</h3>
      <p className="text-sm text-gray-700 mb-3">Navigate to <strong>Templates</strong> in the top nav to browse all 180+ templates. Use category filters, search, and sorting to find what you need.</p>
      <Note>Templates marked with a gold PRO badge require a Pro or Enterprise subscription.</Note>

      <h3 id="tpl-customising" className="font-bold text-gray-900 text-lg mb-3 mt-8">Customising Templates</h3>
      <p className="text-sm text-gray-700 mb-3">After selecting a template and opening the editor:</p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
        <li>Click any text to edit it inline.</li>
        <li>Click image placeholders to replace with your own images.</li>
        <li>Use the Brand Colors panel to apply your colour palette across the entire document at once.</li>
        <li>Use the Typography panel to change fonts globally.</li>
      </ul>

      <h3 id="tpl-creating" className="font-bold text-gray-900 text-lg mb-3 mt-8">Creating Custom Templates</h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
        <li>Design a document in the editor and click <strong>File → Save as Template</strong>.</li>
        <li>Set a name, category, description, and visibility (Personal or Team).</li>
        <li>Your template appears in the Templates gallery under "My Templates".</li>
      </ol>
    </div>
  ),

  'canvas-editor': (
    <div>
      <p className="text-gray-700 mb-4">The Canvas Editor provides a Fabric.js-powered design surface with a full toolset for precise document layout.</p>

      <h3 id="ce-tools" className="font-bold text-gray-900 text-lg mb-3">Tools</h3>
      <Table
        headers={['Tool', 'Shortcut', 'Description']}
        rows={[
          ['Select', 'V', 'Click or drag to select objects. Shift+click to multi-select.'],
          ['Text', 'T', 'Add a new text box. Double-click existing text to edit.'],
          ['Rectangle', 'R', 'Draw rectangles. Hold Shift for squares.'],
          ['Image', 'I', 'Upload or paste an image from clipboard.'],
          ['Pen', 'P', 'Freehand drawing for annotations.'],
          ['Pan', 'Space (hold)', 'Temporarily pan the canvas view.'],
        ]}
      />

      <h3 id="ce-layers" className="font-bold text-gray-900 text-lg mb-3 mt-8">Layers</h3>
      <p className="text-sm text-gray-700 mb-3">The layers panel (bottom-left toolbar) shows all objects on the current page in stacking order.</p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
        <li>Drag layers to reorder them.</li>
        <li>Click the eye icon to show/hide a layer.</li>
        <li>Click the padlock icon to lock a layer against edits.</li>
        <li>Double-click a layer name to rename it.</li>
      </ul>

      <h3 id="ce-text" className="font-bold text-gray-900 text-lg mb-3 mt-8">Text Formatting</h3>
      <p className="text-sm text-gray-700 mb-3">Select a text object and the formatting toolbar appears above the canvas:</p>
      <Table
        headers={['Option', 'Description']}
        rows={[
          ['Font family', 'Choose from 20+ curated typefaces'],
          ['Font size', 'Enter size in pixels or use +/- buttons'],
          ['Weight', 'Regular, Medium, Semibold, Bold, Extrabold'],
          ['Colour', 'Brand palette swatches + full colour picker'],
          ['Alignment', 'Left, Center, Right, Justify'],
          ['Line height', 'Adjust leading for readability'],
          ['Letter spacing', 'Expand or condense character spacing'],
        ]}
      />

      <h3 id="ce-shapes" className="font-bold text-gray-900 text-lg mb-3 mt-8">Shapes & Lines</h3>
      <p className="text-sm text-gray-700 mb-3">Rectangle is the primary shape tool. For circles, use the shape library in the toolbar:</p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
        <li>Click the Shape icon in the toolbar to open the shape library.</li>
        <li>Available shapes: Rectangle, Circle, Triangle, Line, Arrow, Diamond, Star.</li>
        <li>Each shape has fill colour, stroke colour, stroke width, opacity, and corner radius (for rectangles).</li>
      </ul>

      <h3 id="ce-images" className="font-bold text-gray-900 text-lg mb-3 mt-8">Images</h3>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
        <li><strong>Upload</strong>: Click the Image tool and select a file from your device (JPEG, PNG, SVG, GIF supported).</li>
        <li><strong>Paste</strong>: Copy an image to clipboard and press Ctrl+V in the editor.</li>
        <li><strong>Stock photos</strong>: Click the Unsplash icon in the toolbar to search and insert free stock photos.</li>
        <li><strong>Crop</strong>: Double-click an image to enter crop mode. Drag to reframe.</li>
      </ul>
      <Note>Maximum uploaded image size is 10MB. Images are automatically compressed to optimise document size.</Note>
    </div>
  ),

  'ai-generation': (
    <div>
      <p className="text-gray-700 mb-4">Ideal App's AI generation system creates structured, formatted documents from natural language prompts.</p>

      <h3 id="ai-prompt" className="font-bold text-gray-900 text-lg mb-3">Prompt Syntax</h3>
      <p className="text-sm text-gray-700 mb-3">Prompts are free-form natural language. No special syntax is required, but including the following improves quality:</p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
        <li>Document type (e.g., "pitch deck", "business plan", "invoice")</li>
        <li>Audience (e.g., "for Series A VCs", "for HR managers")</li>
        <li>Company and product description</li>
        <li>Key metrics or specific data points to include</li>
        <li>Desired tone (professional, conversational, technical)</li>
        <li>Specific sections or slides to include</li>
      </ul>
      <CodeBlock code={`// Example prompt
Create a 10-slide Series A pitch deck for CloudSync, a B2B cloud storage
management platform for engineering teams. We have $2.1M ARR, 95 customers
(average ACV $22k), and 140% NRR. Target audience: enterprise SaaS VCs.
Include: problem, solution, market size, product, traction, team, and ask.
Tone: confident and data-driven.`} language="text" />

      <h3 id="ai-types" className="font-bold text-gray-900 text-lg mb-3 mt-8">Supported Document Types</h3>
      <Table
        headers={['Type', 'Description', 'Avg Generation Time']}
        rows={[
          ['Pitch Deck', '8–15 slides, investor-ready', '15–25s'],
          ['Business Plan', '10–20 page structured plan', '25–40s'],
          ['Executive Summary', '1–2 page overview', '8–12s'],
          ['Marketing Proposal', 'Campaign overview with goals & budget', '12–20s'],
          ['Project Proposal', 'Scope, timeline, deliverables', '12–18s'],
          ['One-pager', 'Single page fact sheet', '5–10s'],
          ['Job Description', 'Role, requirements, benefits', '6–10s'],
          ['HR Policy', 'Company policy document', '10–15s'],
        ]}
      />

      <h3 id="ai-limits" className="font-bold text-gray-900 text-lg mb-3 mt-8">Limits & Quotas</h3>
      <Table
        headers={['Plan', 'AI Generations / Month', 'Max Document Length']}
        rows={[
          ['Free', '5', '10 pages'],
          ['Pro', '50', '50 pages'],
          ['Enterprise', 'Unlimited', '100 pages'],
        ]}
      />
      <Note type="warn">AI generation consumes quota even if you discard the generated document. Use the preview feature before committing to a generation.</Note>
    </div>
  ),

  export: (
    <div>
      <h3 id="exp-formats" className="font-bold text-gray-900 text-lg mb-3">Export Formats</h3>
      <Table
        headers={['Format', 'Best For', 'Fidelity', 'File Size']}
        rows={[
          ['PDF', 'Sharing, printing, archiving', 'Perfect', 'Small–Medium'],
          ['DOCX', 'Editable handoffs to Microsoft Word', 'Good (complex layouts may simplify)', 'Small'],
          ['PNG', 'Individual page images for social/web', 'Perfect', 'Medium–Large'],
          ['SVG', 'Vector artwork, logos, diagrams', 'Perfect (vector)', 'Very Small'],
        ]}
      />

      <h3 id="exp-options" className="font-bold text-gray-900 text-lg mb-3 mt-8">Export Options</h3>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
        <li><strong>Page range</strong>: All pages or a custom selection.</li>
        <li><strong>Page size</strong> (PDF): A4, US Letter, custom dimensions.</li>
        <li><strong>Orientation</strong> (PDF): Portrait or landscape.</li>
        <li><strong>Margins</strong> (PDF): None, small (0.25in), standard (0.5in), wide (1in).</li>
        <li><strong>Include crop marks</strong> (PDF): For professional print production.</li>
        <li><strong>Embed fonts</strong> (PDF): Ensures text renders correctly on any device.</li>
      </ul>

      <h3 id="exp-quality" className="font-bold text-gray-900 text-lg mb-3 mt-8">Quality Settings</h3>
      <Table
        headers={['Setting', 'DPI', 'Best For']}
        rows={[
          ['Screen (default)', '72 DPI', 'Digital sharing, email, web'],
          ['High quality', '150 DPI', 'Large screen displays, retina'],
          ['Print ready', '300 DPI', 'Professional print production'],
        ]}
      />
    </div>
  ),

  collaboration: (
    <div>
      <h3 id="col-sharing" className="font-bold text-gray-900 text-lg mb-3">Sharing</h3>
      <p className="text-sm text-gray-700 mb-3">To share a document, open it in the editor and click <strong>Share</strong> in the top bar. You can:</p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 mb-4">
        <li><strong>Invite by email</strong>: Send invites with specific permissions to collaborators.</li>
        <li><strong>Copy share link</strong>: Generate a link with view-only, comment, or edit access.</li>
        <li><strong>Require login</strong>: Restrict shared link access to authenticated users only.</li>
        <li><strong>Set expiry</strong>: Shared links can expire after 24h, 7d, 30d, or never.</li>
      </ul>

      <h3 id="col-permissions" className="font-bold text-gray-900 text-lg mb-3 mt-8">Permissions</h3>
      <Table
        headers={['Role', 'View', 'Comment', 'Edit', 'Share', 'Delete']}
        rows={[
          ['Viewer', '✓', '✗', '✗', '✗', '✗'],
          ['Commenter', '✓', '✓', '✗', '✗', '✗'],
          ['Editor', '✓', '✓', '✓', '✗', '✗'],
          ['Admin', '✓', '✓', '✓', '✓', '✓'],
        ]}
      />

      <h3 id="col-realtime" className="font-bold text-gray-900 text-lg mb-3 mt-8">Real-time Editing</h3>
      <p className="text-sm text-gray-700 mb-3">Ideal App supports concurrent editing with:</p>
      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
        <li>Presence indicators (avatar bubbles) showing who's in the document.</li>
        <li>Cursor positions of all active editors visible in real-time.</li>
        <li>Conflict resolution dialog if two editors modify the same element simultaneously.</li>
        <li>Sync latency typically &lt;300ms on a standard connection.</li>
      </ul>
      <Note type="warn">Real-time collaboration requires Pro or Enterprise. Free users can share links but not co-edit.</Note>
    </div>
  ),

  'access-tiers': (
    <div>
      <Table
        headers={['Feature', 'Free', 'Pro', 'Enterprise']}
        rows={[
          ['Documents', '5 total', 'Unlimited', 'Unlimited'],
          ['Workspaces', '1', '10', 'Unlimited'],
          ['Templates', '20 standard', '180+ incl. premium', '180+ + custom'],
          ['AI Generations', '5/month', '50/month', 'Unlimited'],
          ['Export formats', 'PDF only', 'PDF, DOCX, PNG, SVG', 'All + bulk'],
          ['Collaborators', '0', '5 per document', 'Unlimited'],
          ['Real-time editing', '✗', '✓', '✓'],
          ['Brand Kit', '✗', '✓', '✓'],
          ['Custom templates', '✗', '✓', '✓'],
          ['API access', '✗', '✗', '✓'],
          ['SSO / SAML', '✗', '✗', '✓'],
          ['SLA', 'Best effort', '99.5%', '99.9%'],
          ['Support', 'Community', 'Email (48h)', 'Dedicated + SLA'],
        ]}
      />
    </div>
  ),

  api: (
    <div>
      <p className="text-gray-700 mb-4">The Ideal App REST API is planned for Enterprise tier users. It will enable programmatic document creation, template management, and export.</p>
      <Note>The API is currently in private beta. Contact <a href="mailto:hello@idealapp.technology" className="text-indigo-600 hover:underline">hello@idealapp.technology</a> to request early access.</Note>

      <h3 className="font-bold text-gray-900 text-lg mb-3 mt-6">Planned Endpoints</h3>
      <CodeBlock code={`POST   /v1/documents          Create a new document
GET    /v1/documents/:id      Get document metadata
PUT    /v1/documents/:id      Update document
DELETE /v1/documents/:id      Delete document
POST   /v1/documents/:id/export  Export document to PDF/DOCX
GET    /v1/templates          List available templates
POST   /v1/ai/generate        AI document generation`} />

      <h3 className="font-bold text-gray-900 text-lg mb-3 mt-6">Authentication</h3>
      <p className="text-sm text-gray-700 mb-3">The API will use Bearer token authentication. Tokens are generated in <strong>Settings → API → Generate Token</strong>.</p>
      <CodeBlock code={`curl -X GET https://api.idealapp.technology/v1/documents \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`} />
    </div>
  ),

  shortcuts: (
    <div>
      <h3 className="font-bold text-gray-900 text-lg mb-3">Global Shortcuts</h3>
      <Table
        headers={['Shortcut', 'Action']}
        rows={[
          ['Ctrl/⌘ + N', 'New document'],
          ['Ctrl/⌘ + S', 'Save'],
          ['Ctrl/⌘ + Z', 'Undo'],
          ['Ctrl/⌘ + Shift + Z', 'Redo'],
          ['Ctrl/⌘ + /', 'Open command palette'],
          ['Ctrl/⌘ + K', 'Quick search'],
          ['?', 'Show keyboard shortcuts panel'],
        ]}
      />

      <h3 className="font-bold text-gray-900 text-lg mb-3 mt-6">Editor Shortcuts</h3>
      <Table
        headers={['Shortcut', 'Action']}
        rows={[
          ['V', 'Select tool'],
          ['T', 'Text tool'],
          ['R', 'Rectangle tool'],
          ['I', 'Image tool'],
          ['P', 'Pen tool'],
          ['Space (hold)', 'Pan canvas'],
          ['Ctrl/⌘ + D', 'Duplicate selection'],
          ['Ctrl/⌘ + G', 'Group objects'],
          ['Ctrl/⌘ + Shift + G', 'Ungroup'],
          ['[ / ]', 'Send backward / Bring forward'],
          ['Ctrl/⌘ + [ / ]', 'Send to back / Bring to front'],
          ['Delete / Backspace', 'Delete selection'],
          ['Arrow keys', 'Nudge 1px'],
          ['Shift + Arrow keys', 'Nudge 10px'],
          ['Ctrl/⌘ + A', 'Select all'],
          ['Ctrl/⌘ + Shift + H', 'Zoom to selection'],
          ['Ctrl/⌘ + 0', 'Zoom to fit'],
          ['Ctrl/⌘ + =', 'Zoom in'],
          ['Ctrl/⌘ + -', 'Zoom out'],
        ]}
      />
    </div>
  ),

  faq: (
    <div className="space-y-5">
      {[
        {
          q: 'Is my data private?',
          a: 'Yes. All documents are encrypted at rest (AES-256) and in transit (TLS 1.3). Your content is never used to train AI models and is not shared with third parties.',
        },
        {
          q: 'Can I use Ideal App offline?',
          a: 'The editor works offline for documents already loaded in your browser. Changes sync to the cloud when your connection is restored. AI generation and collaboration require an internet connection.',
        },
        {
          q: 'What happens to my documents if I downgrade my plan?',
          a: 'Your documents are never deleted when downgrading. You retain full read access to all documents. However, if you exceed the free plan document limit, you cannot create new documents until you upgrade or delete existing ones.',
        },
        {
          q: 'Who owns the AI-generated content?',
          a: 'You own all content generated by the AI using your prompts. Ideal App claims no intellectual property rights over user-generated or AI-generated content.',
        },
        {
          q: 'Can I import documents from other tools?',
          a: 'You can import DOCX files (Microsoft Word) and PDF files. The import process converts content to editable canvas elements. Complex formatting may require manual adjustment after import.',
        },
        {
          q: 'How do I cancel my subscription?',
          a: 'Go to Settings → Billing → Cancel Subscription. You retain Pro features until the end of the current billing period. No cancellation fees apply.',
        },
        {
          q: 'Is there a limit on document file size?',
          a: 'Individual documents are limited to 500MB including all embedded assets. Individual uploaded images are limited to 10MB each.',
        },
      ].map(({ q, a }) => (
        <div key={q} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-1.5">{q}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      ))}
    </div>
  ),

  changelog: (
    <div className="space-y-6">
      {[
        {
          version: 'v1.5.0',
          date: 'April 2026',
          type: 'Major',
          changes: [
            'Added 180+ professional document templates across 50+ categories',
            'Launched AI generation with support for 8 document types',
            'New canvas editor with Fabric.js v6 — improved performance and rendering',
            'Real-time collaboration for Pro and Enterprise users',
            'Brand Kit feature: save colours, fonts, and logos for auto-application',
          ],
        },
        {
          version: 'v1.4.0',
          date: 'March 2026',
          type: 'Minor',
          changes: [
            'Export to DOCX with improved formatting fidelity',
            'Workspace management with colour labels',
            'Document duplication from the dashboard',
            'Improved mobile responsiveness across dashboard and editor',
          ],
        },
        {
          version: 'v1.3.0',
          date: 'February 2026',
          type: 'Minor',
          changes: [
            'Unsplash stock photo integration in the image tool',
            'Bulk image replace for template placeholders',
            'Keyboard shortcut improvements',
            'Performance: initial editor load time reduced by 40%',
          ],
        },
      ].map(({ version, date, type, changes }) => (
        <div key={version} className="border-l-4 border-indigo-600 pl-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-900 text-base">{version}</h3>
            <span className="text-xs text-gray-500">{date}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${type === 'Major' ? 'bg-indigo-100 text-[#3730a3]' : 'bg-gray-100 text-gray-600'}`}>
              {type}
            </span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {changes.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      ))}
    </div>
  ),
};

export default function DocumentationPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const mainRef = useRef<HTMLDivElement>(null);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase();
    return SECTIONS.filter((s) => s.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    setMobileSidebarOpen(false);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const Sidebar = () => (
    <nav className="w-64 flex-shrink-0">
      <div className="sticky top-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search docs…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-indigo-600 transition"
          />
        </div>

        {/* Nav items */}
        <div className="space-y-0.5">
          {filteredSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  activeSection === section.id
                    ? 'bg-indigo-100 text-[#3730a3]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-gray-400">{section.icon}</span>
                {section.title}
              </button>
              {section.subsections && activeSection === section.id && (
                <div className="ml-6 mt-0.5 space-y-0.5">
                  {section.subsections.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        const el = document.getElementById(sub.id);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:text-indigo-600 rounded-md transition-colors"
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );

  return (
    <PageWrapper>
      <SEOHead
        title="Documentation — Ideal App Platform Guide & API Reference"
        description="Full documentation for the Ideal App platform. Learn how to use the AI document editor, API integrations, template system, collaboration features, and more."
        keywords="Ideal App documentation, AI document platform guide, pitch deck software docs, API reference, document editor guide, startup platform documentation"
        canonicalUrl="https://idealapp.technology/docs"
        ogImage="https://idealapp.technology/og/docs.png"
        structuredData={[organizationSchema, breadcrumbSchema('/docs', 'Documentation')]}
      />
      <div className="min-h-screen bg-[#e8eef8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Documentation</h1>
          <div className="flex-1" />
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-4 overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <div ref={mainRef} className="flex-1 min-w-0 space-y-12">
          {SECTIONS.map(({ id, title, icon }) => (
            <section
              key={id}
              id={id}
              ref={(el) => { sectionRefs.current[id] = el; }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  {icon}
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
              </div>
              {SECTION_CONTENT[id] ?? (
                <p className="text-gray-500 text-sm">Documentation for this section is coming soon.</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  </PageWrapper>
  );
}
