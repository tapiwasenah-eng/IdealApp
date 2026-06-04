import { Router } from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss';
import { Resend } from 'resend';
import { AssemblyAI } from 'assemblyai';
import { requireAuth, AuthenticatedRequest } from '../authMiddleware';
import { adminDb } from '../firebase-admin';

// NOTE: Helmet / CORS are assumed to be wired in your main server file (server/index.ts).
// Keep this file focused on route logic only for Google AI Studio compatibility.

const router = Router();

let assemblyAIClient: AssemblyAI | null = null;
if (process.env.ASSEMBLYAI_API_KEY) {
  assemblyAIClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
}

// ------------------------------------------------------------------
// AssemblyAI Voice Integration
// ------------------------------------------------------------------

router.get('/aura-token', requireAuth, async (req, res) => {
  try {
    if (!process.env.ASSEMBLYAI_API_KEY) {
      return res.status(503).json({ error: 'AssemblyAI API key is missing.' });
    }

    const response = await fetch('https://streaming.assemblyai.com/v3/token', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expires_in: 60 })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Failed to mint AssemblyAI token:', text);
      return res.status(response.status).json({ error: 'Failed to mint AssemblyAI token' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error minting AssemblyAI token:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/audio-to-deck', requireAuth, async (req, res) => {
  try {
    const { audioUrl } = req.body;
    if (!audioUrl) return res.status(400).json({ error: 'audioUrl is required' });
    if (!assemblyAIClient) return res.status(503).json({ error: 'AssemblyAI API key missing' });

    const transcript = await assemblyAIClient.transcripts.transcribe({
      audio: audioUrl,
      language_detection: true,
      speech_model: 'universal-3-pro' as any, // Cast to any to bypass strict type checking
      // fallback_models: ['universal-2'],
      speaker_labels: true,
    });
    
    return res.json({ success: true, transcript });
  } catch (error) {
    console.error('AssemblyAI Transcription error:', error);
    return res.status(500).json({ error: 'Failed to process audio' });
  }
});

// ------------------------------------------------------------------
// Infrastructure, Cyber Security & Email
// ------------------------------------------------------------------

// Strict Cyber Security measures Hardcoded per route basis
router.use(helmet());
router.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // strict limiting
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Resend Email Setup for transactional emails from our launch domain
// Assume RESEND_API_KEY is available in the environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') return xss(input);
  if (typeof input === 'object' && input !== null) {
    if (Array.isArray(input)) return input.map(sanitizeInput);
    const sanitizedObj: any = {};
    for (const key in input) {
      sanitizedObj[key] = sanitizeInput(input[key]);
    }
    return sanitizedObj;
  }
  return input;
};

// ------------------------------------------------------------------
// AI Environment Variables & Initialization
// ------------------------------------------------------------------
// Documenting Environment Variable Lookup:
// The backend reads API keys using process.env. Priority is given to:
// 1. GEMINI_API_KEY
// 2. GOOGLE_API_KEY
// 3. VITE_GEMINI_API_KEY (fallback)
const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('⚠️ No Gemini API key found, using rich fallback document mode when necessary.');
}

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// General API rate limiting (per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});

// Deep Domain Knowledge Base Directory for Predictive Fallback Hydration
type SectorKey = 'fintech' | 'saas' | 'e-commerce' | 'marketplace' | 'deeptech' | 'default';

interface SectorKnowledge {
  problem: string;   // HTML
  solution: string;  // HTML
  metrics: string[];
  marketAngle?: string; // optional HTML snippet
}

const SECTOR_KNOWLEDGE_BASE: Record<SectorKey, SectorKnowledge> = {
  fintech: {
    problem: `<ul>
      <li><strong>Fragmented Ecosystems:</strong> Financial institutions operate on siloed legacy cores, blocking real‑time, cross‑border settlement and reconciliation.</li>
      <li><strong>Compliance Drag:</strong> Constantly shifting KYC/AML, PSD2 and MiFID II rules create manual review bottlenecks and audit exposure.</li>
      <li><strong>Fraud & Security Risk:</strong> Centralized transaction hubs and batch monitoring pipelines make it harder to detect sophisticated fraud patterns in real time.</li>
    </ul>`,
    solution: `<p>The platform introduces a unified, API‑first orchestration layer that embeds compliance and fraud rules directly into the transaction flow. 
    It normalizes data across counterparties, applies machine‑learning risk scoring on every event, and exposes a clean interface for product teams to launch new financial products safely.</p>`,
    metrics: [
      'Total Payment Volume (TPV)',
      'Net Take Rate (%)',
      'Fraud Losses as % of TPV',
      'Average KYC Approval Time (minutes)',
      'Customer Acquisition Cost (CAC)',
      'Payback Period (months)',
    ],
    marketAngle: `<p>Initial wedge focuses on high‑growth fintechs and mid‑market banks seeking to modernize payment rails without re‑platforming core banking systems.</p>`,
  },
  saas: {
    problem: `<ul>
      <li><strong>Data Fragmentation:</strong> Customer and revenue data is dispersed across CRMs, billing systems, and support tools, preventing a single source of truth.</li>
      <li><strong>Seat Under‑Utilization:</strong> Flat‑rate licensing causes low activation and makes it difficult to align pricing with realized value.</li>
      <li><strong>Integration Friction:</strong> Legacy APIs and brittle webhooks slow down onboarding and limit cross‑tool automation.</li>
    </ul>`,
    solution: `<p>The product provides a usage‑based, AI‑assisted workspace that unifies product analytics, billing, and CRM signals into one live account view. 
    It recommends right‑sized plans, auto‑orchestrates lifecycle emails, and exposes a developer‑friendly integration surface.</p>`,
    metrics: [
      'Monthly Recurring Revenue (MRR)',
      'Net Revenue Retention (NRR)',
      'Logo Retention (%)',
      'LTV:CAC Ratio',
      'Average Time‑to‑Value (days)',
    ],
    marketAngle: `<p>Go‑to market starts with PLG‑driven B2B SaaS teams managing 50–500 accounts per CSM, where even small retention lifts create outsized revenue impact.</p>`,
  },
  'e-commerce': {
    problem: `<ul>
      <li><strong>Margin Compression:</strong> Rising acquisition costs and discounts erode unit economics for online merchants.</li>
      <li><strong>Inventory Blind Spots:</strong> Disconnected inventory, demand forecasting, and merchandising tools lead to stockouts and dead stock.</li>
      <li><strong>Fragmented Customer Journey:</strong> Experiences are inconsistent across web, mobile, and marketplaces, harming repeat purchase behaviour.</li>
    </ul>`,
    solution: `<p>The platform stitches together storefront events, order data, and marketing channels into a single decision engine that optimizes merchandising, pricing, and campaigns in real time.</p>`,
    metrics: [
      'Gross Merchandise Volume (GMV)',
      'Gross Margin (%)',
      'Repeat Purchase Rate (%)',
      'Average Order Value (AOV)',
      'Return Rate (%)',
    ],
    marketAngle: `<p>Initial target is digitally native vertical brands (DNVBs) doing $5–50M GMV that need enterprise‑grade intelligence without a full data team.</p>`,
  },
  marketplace: {
    problem: `<ul>
      <li><strong>Cold Start & Liquidity:</strong> New marketplaces struggle to reach sufficient buyer–seller density in key categories and geos.</li>
      <li><strong>Trust & Safety:</strong> Poor vetting and dispute resolution mechanics drive churn and regulatory risk.</li>
      <li><strong>Unit Economics Clarity:</strong> It is hard to see which cohorts, categories, or geos actually compound value over time.</li>
    </ul>`,
    solution: `<p>The product offers a full liquidity and trust stack: dynamic pricing tools, reputation scoring, dispute workflows, and liquidity dashboards that highlight where to invest supply and demand spend.</p>`,
    metrics: [
      'Take Rate (%)',
      'Match Rate (%)',
      'Time‑to‑First Transaction (days)',
      'Repeat Transaction Rate (%)',
      'GMV per Active User',
    ],
    marketAngle: `<p>Launch focus is B2B services and niche B2C verticals where offline marketplaces already exist but are unstructured and opaque.</p>`,
  },
  deeptech: {
    problem: `<ul>
      <li><strong>Long R&D Cycles:</strong> Multi‑year research and validation timelines create financing gaps and execution risk.</li>
      <li><strong>CapEx‑Heavy Infrastructure:</strong> Building and scaling hardware or lab capacity requires precise capital planning.</li>
      <li><strong>Commercialization Uncertainty:</strong> Teams often lack a clear path from core IP to repeatable revenue.</li>
    </ul>`,
    solution: `<p>The company provides an operating system for deeptech ventures: milestones planning, capital efficiency analytics, and partnership mapping to compress time from lab to market.</p>`,
    metrics: [
      'Milestones Achieved vs Planned (%)',
      'Runway (months) at Current Burn',
      'CapEx Utilization (%)',
      'Non‑Dilutive Funding Secured ($)',
    ],
    marketAngle: `<p>Target customers are deeptech startups at Seed–Series B that need to communicate progress credibly to technical and financial stakeholders.</p>`,
  },
  default: {
    problem: `<ul>
      <li><strong>Operational Inefficiency:</strong> Manual workflows and fragmented tools drive unnecessary overhead and slow decision‑making.</li>
      <li><strong>Lack of Data Visibility:</strong> Metrics are scattered across spreadsheets and dashboards, making it hard to align on priorities.</li>
      <li><strong>Scaling Bottlenecks:</strong> Processes that work for a small team break as headcount and customer volume increase.</li>
    </ul>`,
    solution: `<p>The platform centralizes core workflows, automates repetitive tasks, and surfaces the few metrics that matter for each team.</p>`,
    metrics: [
      'Time Saved per Workflow (minutes)',
      'Employee NPS',
      'Operational Margin (%)',
      'Cycle Time per Core Process',
    ],
    marketAngle: `<p>Ideal customers are growing teams that have outgrown basic productivity tools but do not yet have a dedicated operations or data function.</p>`,
  },
};

// Plan limit helpers
const getPlanLimits = (plan: string) => {
  switch (plan) {
    case 'studio':
      return 1000;
    case 'pro':
      return 100;
    case 'free':
    default:
      return 10;
  }
};

const checkAiLimits = async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    const user = req.user!;
    const today = new Date().toISOString().split('T')[0];
    let aiRequestsToday = user.aiRequestsToday || 0;

    if (user.lastAiRequestDate !== today) {
      aiRequestsToday = 0;
    }

    const limit = getPlanLimits(user.plan);
    if (aiRequestsToday >= limit) {
      return res.status(429).json({
        error: `AI daily limit reached for your ${user.plan} plan. Please upgrade to continue.`,
      });
    }

    try {
      await adminDb.collection('users').doc(user.uid).set(
        {
          aiRequestsToday: aiRequestsToday + 1,
          lastAiRequestDate: today,
        },
        { merge: true },
      );
    } catch (updateError: any) {
      console.warn('⚠️ Could not update user AI limits in DB:', updateError.message);
    }

    next();
  } catch (error) {
    console.error('Error checking AI limits:', error);
    next(error);
  }
};


// Helper: infer sector from free‑form industry string
const detectSectorKey = (industryRaw?: string | null): SectorKey => {
  const industry = (industryRaw || '').toLowerCase();
  if (industry.includes('fintech') || industry.includes('payments') || industry.includes('bank')) {
    return 'fintech';
  }
  if (industry.includes('saas') || industry.includes('software')) {
    return 'saas';
  }
  if (industry.includes('e-commerce') || industry.includes('ecommerce') || industry.includes('retail')) {
    return 'e-commerce';
  }
  if (industry.includes('marketplace') || industry.includes('two-sided')) {
    return 'marketplace';
  }
  if (industry.includes('deeptech') || industry.includes('semiconductor') || industry.includes('biotech')) {
    return 'deeptech';
  }
  return 'default';
};

// Helper: build rich fallback deck
const buildFallbackDeck = (params: {
  companyName?: string;
  industry?: string;
  stage?: string;
  description?: string;
  audience?: string;
}) => {
  const { companyName, industry, stage, description, audience } = params;
  const name = companyName || 'Your Company';
  const sectorKey = detectSectorKey(industry);
  const sectorData = SECTOR_KNOWLEDGE_BASE[sectorKey];

  const metricsList = sectorData.metrics
    .map((m) => `<li>${m}</li>`)
    .join('');

  return {
    title: `${name} – ${industry || 'Venture'} Pitch Deck`,
    sections: [
      {
        title: 'My Company',
        content: `<p><strong>${name}</strong> operates in the ${industry || 'technology'} space at the ${
          stage || 'early'
        } stage. The mandate is: ${description || 'Describe your company focus here.'}</p>`,
      },
      {
        title: 'The Problem',
        content: `<p>The target customers face a set of structural pain points that make the status quo unsustainable.</p>${sectorData.problem}`,
      },
      {
        title: 'Our Solution',
        content: sectorData.solution,
      },
      {
        title: 'Market Opportunity',
        content:
          sectorData.marketAngle ||
          `<p>The market for this category is expanding as buyers shift from legacy tools to modern, AI‑powered platforms.</p>`,
      },
      {
        title: 'Business Model',
        content: `<p>The business model is designed to align pricing with realized value and unlock durable, compounding revenue.</p><ul>${metricsList}</ul>`,
      },
      {
        title: 'Traction & Milestones',
        content: `<p>Key milestones track product readiness, market validation, and revenue scale. Focus on: early design partners, live deployments, and repeatable sales motions.</p>`,
      },
      {
        title: 'Financial Projections',
        content: `<p>Financial projections should present a credible 3–5 year path that aligns headcount, R&D, and go‑to‑market investment with revenue and margin outcomes.</p>`,
      },
    ],
  };
};

// ----------------------------
// /generate-document
// ----------------------------
router.post(
  '/generate-document',
  requireAuth,
  generalLimiter,
  checkAiLimits as any,
  async (req, res) => {
    try {
      const { documentType, companyName, industry, stage, description, audience } = req.body;

      const sectorKey = detectSectorKey(industry);
      const sectorData = SECTOR_KNOWLEDGE_BASE[sectorKey];

      const prompt = `You are an expert venture writer creating investor‑grade documents.

You are writing a ${documentType || 'pitch deck'} for:
- Company Name: ${companyName || 'Startup Inc.'}
- Industry: ${industry || 'Technology'}
- Stage: ${stage || 'Seed'}
- Description: ${description || 'A technology company'}
- Audience: ${audience || 'Institutional investors'}

Use realistic, sector‑specific language grounded in the following context:

Sector: ${sectorKey}
Key pain points (do not repeat verbatim, rephrase them naturally in prose and lists):
${sectorData.problem.replace(/<[^>]+>/g, '')}

Key solution themes (rephrase and expand where useful):
${sectorData.solution.replace(/<[^>]+>/g, '')}

Key metrics to highlight and track:
${sectorData.metrics.join(', ')}

IMPORTANT CONSTRAINTS:
1. Follow either Sequoia's canonical pitch deck flow or a YC‑style memo structure.
2. Do NOT use generic clichés like "Every great company starts by identifying a critical problem."
3. Be specific and concrete—use metrics, cohorts, and operational detail.
4. OUTPUT FORMAT: Return ONLY a valid JSON object with this exact shape:

{
  "title": "Document Title",
  "sections": [
    { "title": "My Company", "content": "HTML content" },
    { "title": "The Problem", "content": "HTML content" },
    { "title": "Our Solution", "content": "HTML content" },
    { "title": "Market Opportunity", "content": "HTML content" },
    { "title": "Business Model", "content": "HTML content" },
    { "title": "Traction & Milestones", "content": "HTML content" },
    { "title": "Financial Projections", "content": "HTML content" }
  ]
}

The "content" fields should be HTML strings (paragraphs, lists, bold text where useful).`;

      let content = '';
      let useGemini = !openai && !!genAI;

      if (openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
          });
          content = completion.choices[0]?.message?.content || '';
        } catch (e) {
          if (genAI) useGemini = true;
          else throw e;
        }
      }

      if (useGemini && genAI) {
        try {
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
          });
          const result = await model.generateContent(prompt);
          content = result.response.text();
        } catch (errFlash: any) {
          try {
            const fallbackModel = genAI.getGenerativeModel({
              model: 'gemini-1.0-pro',
            });
            const fallbackResult = await fallbackModel.generateContent(prompt);
            content = fallbackResult.response.text();
          } catch (errPro: any) {
            content = JSON.stringify(
              buildFallbackDeck({
                companyName,
                industry,
                stage,
                description,
                audience,
              }),
            );
          }
        }
      }

      if (!content) {
        content = JSON.stringify(
          buildFallbackDeck({
            companyName,
            industry,
            stage,
            description,
            audience,
          }),
        );
      }

      let parsedData;
      try {
        const cleanContent = content
          .replace(/^```json\s*/im, '')
          .replace(/```$/m, '')
          .trim();
        parsedData = JSON.parse(cleanContent);
      } catch {
        parsedData = buildFallbackDeck({
          companyName,
          industry,
          stage,
          description,
          audience,
        });
      }

      res.status(200).json({ success: true, content: parsedData });
    } catch (globalError: any) {
      console.error('Error in /generate-document:', globalError);
      const fallback = buildFallbackDeck(req.body || {});
      res.status(200).json({ success: true, content: fallback });
    }
  },
);

// ----------------------------
// /chat-document
// ----------------------------

router.post(
  '/chat-document',
  requireAuth,
  generalLimiter,
  checkAiLimits as any,
  async (req, res) => {
    try {
      const { documentId, prompt, activeSection, documentContext } = req.body;

      const companyName = documentContext?.companyName || documentContext?.title || 'Your Company';
      const industry = documentContext?.industry || 'Technology';
      const sectorKey = detectSectorKey(industry);
      const sectorData = SECTOR_KNOWLEDGE_BASE[sectorKey];

      const sectionTitle = activeSection || 'the document';

      const chipPrompt = (prompt || '').toLowerCase();

      let behavior: 'metrics' | 'risks' | 'tighten' | 'milestones' | 'downside' | 'generic' =
        'generic';
      if (chipPrompt.includes('cohort') || chipPrompt.includes('retention')) {
        behavior = 'metrics';
      } else if (chipPrompt.includes('risk') || chipPrompt.includes('mitigation')) {
        behavior = 'risks';
      } else if (chipPrompt.includes('tighten') || chipPrompt.includes('concise')) {
        behavior = 'tighten';
      } else if (chipPrompt.includes('milestone') || chipPrompt.includes('roadmap')) {
        behavior = 'milestones';
      } else if (chipPrompt.includes('downside') || chipPrompt.includes('worst case')) {
        behavior = 'downside';
      }

      const baseContext = `You are the AI Document Partner inside IdealApp, assisting with a venture document.
Company: ${companyName}
Industry: ${industry} (sector: ${sectorKey})
Active section: ${sectionTitle}

Sector pain points (for context, paraphrase rather than copy):
${sectorData.problem.replace(/<[^>]+>/g, '')}

Key metrics for this sector:
${sectorData.metrics.join(', ')}

Current document snapshot (JSON):
${JSON.stringify(documentContext || {}, null, 2).slice(0, 6000)}
`;

      let systemInstruction = '';
      if (behavior === 'metrics') {
        systemInstruction = `The user wants you to add cohort/retention metrics and make the section more data‑driven. Add or adjust bullet points with clear, measurable KPIs relevant to ${sectorKey}.`;
      } else if (behavior === 'risks') {
        systemInstruction = `The user wants you to highlight key risks and mitigations. Add a short "Risks & Mitigations" sub‑section with 3–5 concise bullets.`;
      } else if (behavior === 'tighten') {
        systemInstruction = `The user wants you to tighten the language. Make the section sharper and more concise, without losing key information.`;
      } else if (behavior === 'milestones') {
        systemInstruction = `The user wants clearer execution milestones. Add a sequenced list of milestones with timeframes and owners.`;
      } else if (behavior === 'downside') {
        systemInstruction = `The user wants a downside scenario. Briefly outline a realistic downside case and how the team would respond.`;
      } else {
        systemInstruction = `Improve the clarity, specificity, and investor readiness of the active section.`;
      }

      const chatPrompt = `${baseContext}

User request:
"${prompt || ''}"

INSTRUCTIONS:
1. Focus exclusively on improving "${sectionTitle}".
2. Evaluate the request against standard business frameworks like the Sequoia Pitch Canvas or YC Memo:
   - Does it convey a distinct advantage?
   - Is it too generic? Act as a soundboard to raise the bar before applying the edit.
3. For large sections, briefly summarize the core point, then explain the proposed changes in the \`reply\` field.
4. Return JSON ONLY with the following shape:

{
  "reply": "Your brief summary of the section and explanation of what you are changing based on framework principles (1-3 sentences).",
  "updatedSectionContent": "The full updated HTML content for the active section."
}

5. Use sector‑specific language and metrics. Eliminate boilerplate (e.g., "Every great company starts...").
6. Keep output strictly parseable JSON (no markdown fences).`;

      // If no model keys at all, operate in offline mode
      if (!openai && !genAI) {
        const offlineReply = `Offline mode: I cannot call live AI models right now, but here is a sector‑aware suggestion for ${sectionTitle}. Focus on metrics like ${sectorData.metrics
          .slice(0, 3)
          .join(', ')} and make sure you clearly articulate the problem, your differentiated solution, and how this translates into durable margin.`;
        return res.status(200).json({
          reply: offlineReply,
          updatedSectionContent: undefined,
        });
      }

      let rawChat;
      let useGemini = !openai && !!genAI;

      if (openai) {
        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: chatPrompt },
            ],
            response_format: { type: 'json_object' },
          });
          rawChat = completion.choices[0]?.message?.content || '';
        } catch (e) {
          if (genAI) useGemini = true;
          else throw e;
        }
      }

      if (useGemini && genAI) {
        const promptText = `${systemInstruction}\\n\\n${chatPrompt}`;
        try {
          const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
          });
          const result = await model.generateContent(promptText);
          rawChat = result.response.text();
        } catch (errFlash: any) {
          try {
            const fallbackModel = genAI.getGenerativeModel({
              model: 'gemini-1.0-pro',
            });
            const fallbackResult = await fallbackModel.generateContent(promptText);
            rawChat = fallbackResult.response.text();
          } catch (errPro: any) {
            rawChat = JSON.stringify({
              reply:
                'AI chat is temporarily unavailable. Please adjust this section manually by adding 3–5 sector‑specific metrics and clarifying the core narrative.',
              updatedSectionContent: undefined,
            });
          }
        }
      }

      if (!rawChat) {
        rawChat = JSON.stringify({
          reply:
            'AI chat is temporarily unavailable. Please refine this section manually to emphasize specific metrics and execution steps.',
          updatedSectionContent: undefined,
        });
      }

      let parsedReply;
      try {
        const clean = rawChat.replace(/^```json\s*/im, '').replace(/```$/m, '').trim();
        parsedReply = JSON.parse(clean);
      } catch {
        parsedReply = {
          reply:
            'I refined your section focusing on clearer narrative and sector‑specific metrics. Please review the updated content above.',
          updatedSectionContent: undefined,
        };
      }

      res.status(200).json(parsedReply);
    } catch (error: any) {
      console.error('Error in /chat-document:', error);
      res.status(200).json({
        reply:
          'System note: the AI chat backend encountered an error. You can continue editing directly in the canvas while we recover.',
        updatedSectionContent: undefined,
      });
    }
  },
);

// ----------------------------
// /send-welcome-email
// ----------------------------
router.post(
  '/send-welcome-email',
  requireAuth,
  strictLimiter,
  async (req, res) => {
    try {
      if (!process.env.RESEND_API_KEY) {
        return res.status(503).json({ error: 'Email service is not configured.' });
      }

      const { email, name } = req.body;
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedName = sanitizeInput(name);

      if (!sanitizedEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const data = await resend.emails.send({
        from: 'IdealApp Team <onboarding@idealapp.technology>',
        to: sanitizedEmail,
        subject: 'Welcome to IdealApp!',
        html: `
          <h1>Welcome, ${sanitizedName || 'Founder'}!</h1>
          <p>We're thrilled to have you on board. IdealApp is your AI document partner for building secure, enterprise-grade business documents.</p>
          <p>Get started by creating your first Pitch Deck or YC Memo in your dashboard.</p>
        `,
      });

      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Error sending welcome email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  }
);

// ----------------------------
// /send-invite-email
// ----------------------------
router.post(
  '/send-invite-email',
  requireAuth,
  strictLimiter,
  async (req, res) => {
    try {
      if (!process.env.RESEND_API_KEY) {
        return res.status(503).json({ error: 'Email service is not configured.' });
      }

      const { email, inviterName, documentTitle } = req.body;
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedInviter = sanitizeInput(inviterName) || 'A team member';
      const sanitizedTitle = sanitizeInput(documentTitle) || 'a document';

      if (!sanitizedEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const data = await resend.emails.send({
        from: 'IdealApp Collaboration <invites@idealapp.technology>',
        to: sanitizedEmail,
        subject: `${sanitizedInviter} invited you to collaborate on ${sanitizedTitle}`,
        html: `
          <h1>You've been invited!</h1>
          <p><strong>${sanitizedInviter}</strong> has invited you to collaborate on <em>${sanitizedTitle}</em> in IdealApp.</p>
          <p><a href="https://idealapp.technology/dashboard">Click here to join the workspace</a></p>
        `,
      });

      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Error sending invite email:', error);
      res.status(500).json({ error: 'Failed to send invite' });
    }
  }
);

export default router;
