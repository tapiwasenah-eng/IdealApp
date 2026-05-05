import express from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { getDb, getAdminApp, verifyFirebaseIdToken } from '../firebaseAdmin.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Auth Middleware (Legacy wrapper around centralized requireAuth for this file)
// We already have requireAuth but we will use it natively below
async function verifyAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  return requireAuth(req, res, next);
}

// Rate Limiter
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many API requests from this IP, please try again after 15 minutes.' }
});

// Credits / Quota Middleware
async function enforceCredits(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Bypassed: firebase-admin service account is not injected by default in AI Studio.
  // In a production environment, this would hit the db to verify credits via firebase-admin.
  next();
}

// ═══ DOCUMENT SCHEMA (shared by both models) ═══

const DocumentSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['cover', 'executive_summary', 'problem', 'solution', 'market_analysis', 'business_model', 'traction', 'financial_projections', 'team', 'competition', 'roadmap', 'investment_ask', 'appendix', 'swot_grid', 'text_section']),
  heading: z.string(),
  subheading: z.string().optional(),
  body: z.string().describe('2-4 paragraphs of professional narrative text. NO placeholders like [insert here]. Write real, synthesized content.'),
  bullets: z.array(z.string()).optional().describe('Key bullet points if applicable'),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    trend: z.enum(['up', 'down', 'neutral']).optional(),
    color: z.string().optional()
  })).optional().describe('For financial/traction sections'),
  tableData: z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string()))
  }).optional().describe('For comparison tables, financial tables, SWOT grids'),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  layoutHint: z.enum(['full_width', 'two_column', 'centered', 'sidebar_right']).optional()
})

const GeneratedDocumentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  companyName: z.string(),
  sections: z.array(DocumentSectionSchema).describe('Generate 8-15 sections for a thorough document'),
  colorScheme: z.object({
    primary: z.string().describe('Hex code'),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    text: z.string()
  }),
  fontStyle: z.enum(['modern', 'classic', 'bold', 'minimal']),
  estimatedPages: z.number(),
  generatedBy: z.enum(['claude', 'gemini']),
  confidence: z.number().min(0).max(1).describe('Model confidence in document quality')
})

type GeneratedDocument = z.infer<typeof GeneratedDocumentSchema>

// ═══ SYSTEM PROMPT (shared by both models) ═══

const DOCUMENT_SYSTEM_PROMPT = `You are an elite venture document architect with 20 years of experience at McKinsey, Goldman Sachs, and Y Combinator. You produce investment-grade business documents that have helped raise over $500M in funding.

ABSOLUTE RULES:
1. NEVER use placeholders like "[Insert company name]", "[Add details]", "[TBD]", or "Lorem ipsum"
2. ALWAYS synthesize real, professional content based on the provided information
3. If information is missing, make intelligent industry-standard assumptions and state them
4. Financial projections must use realistic numbers based on industry benchmarks
5. Every section must contain substantive, actionable content — minimum 2 paragraphs for body text
6. Use specific data points, percentages, and dollar figures throughout
7. Write in the authoritative voice of a top-tier consulting firm
8. Tailor tone to the target audience (investors get data-driven urgency; boards get strategic clarity)

DOCUMENT QUALITY STANDARDS:
- Executive summaries must be compelling enough to secure a meeting
- Market analysis must reference real market sizes and growth rates
- Financial projections must include clear assumptions and 3-year horizons
- Competition analysis must use structured frameworks (Porter's, positioning maps)
- SWOT analysis must be actionable, not generic
- Team sections must highlight relevant expertise and track record`

function buildUserPrompt(params: {
  documentType: string
  companyName: string
  industry: string
  description: string
  stage: string
  targetAudience?: string
  keyMetrics?: string
  additionalContext?: string
}): string {
  return `Generate a complete ${params.documentType} for the following company:

COMPANY: ${params.companyName}
INDUSTRY: ${params.industry}
STAGE: ${params.stage}
DESCRIPTION: ${params.description}
${params.targetAudience ? `TARGET AUDIENCE: ${params.targetAudience}` : ''}
${params.keyMetrics ? `KEY METRICS: ${params.keyMetrics}` : ''}
${params.additionalContext ? `ADDITIONAL CONTEXT: ${params.additionalContext}` : ''}

Generate a thorough, section-by-section document with 8-15 sections. Each section must have real content — no placeholders. Financial figures should be realistic for a ${params.stage} ${params.industry} company.`
}

// ═══ CLAUDE PROVIDER (PRIMARY — highest quality) ═══

async function generateWithClaude(systemPrompt: string, userPrompt: string): Promise<GeneratedDocument | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Claude API Key missing (ANTHROPIC_API_KEY)')
    return null
  }

  try {
    console.log('Attempting document generation with Claude...')
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey })

    const jsonSchema = zodToJsonSchema(GeneratedDocumentSchema as any, { $refStrategy: 'none' }) as any
    if (jsonSchema.$schema) delete jsonSchema.$schema

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 8192,
      system: systemPrompt,
      tools: [{
        name: 'generate_document',
        description: 'Generate a structured venture document',
        input_schema: jsonSchema
      }],
      tool_choice: { type: 'tool', name: 'generate_document' },
      messages: [{ role: 'user', content: userPrompt }]
    })

    const toolBlock = response.content.find(
      (b: any) => b.type === 'tool_use'
    ) as any
    if (!toolBlock || toolBlock.type !== 'tool_use') {
      throw new Error('Claude did not return tool_use block')
    }

    const parsed = GeneratedDocumentSchema.parse({
      ...(toolBlock.input as object),
      generatedBy: 'claude'
    })
    console.log('Claude generation successful')
    return parsed
  } catch (err) {
    console.error('Claude generation failed:', err)
    return null
  }
}

// ═══ GEMINI PROVIDER (FALLBACK — fast and free) ═══

async function generateWithGemini(systemPrompt: string, userPrompt: string, isRetry = false): Promise<GeneratedDocument | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('Gemini API Key missing (GEMINI_API_KEY)')
    return null
  }

  const models = (process.env.GEMINI_MODELS || 'gemini-2.0-flash').split(',');

  try {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey })

    const jsonSchema = zodToJsonSchema(GeneratedDocumentSchema as any, { $refStrategy: 'none' }) as any
    if (jsonSchema.$schema) delete jsonSchema.$schema

    for (const model of models) {
      try {
        console.log(`[generateWithGemini] Attempting document generation with Gemini model: ${model.trim()}...`)
        
        const promptSuffix = isRetry ? '\n\nIMPORTANT: You MUST return strictly valid JSON according to the provided schema with no trailing characters or markdown.' : '';
  
        const response = await ai.models.generateContent({
          model: model.trim(),
          contents: `${systemPrompt}\n\n${userPrompt}${promptSuffix}`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: jsonSchema as any,
          }
        })
  
        const text = response.text
        if (!text) throw new Error('Empty Gemini response')
        
        let parsedJson;
        try {
          parsedJson = JSON.parse(text);
        } catch (parseError) {
          if (!isRetry) {
            console.warn(`[generateWithGemini] JSON parsing failed, retrying once...`);
            return await generateWithGemini(systemPrompt, userPrompt, true);
          }
          throw new Error('Gemini response was not valid JSON after retry');
        }
  
        const parsed = GeneratedDocumentSchema.parse({
          ...parsedJson,
          generatedBy: 'gemini'
        })
        console.log(`[generateWithGemini] Gemini generation successful using ${model}`)
        return parsed
      } catch (err: any) {
        console.error(`[generateWithGemini] Gemini generation failed with model ${model}:`, err.message)
      }
    }
    return null
  } catch (err) {
    console.error('Gemini initialization failed:', err)
    return null
  }
}

// ═══ NATURAL LANGUAGE → PARAMS EXTRACTION ═══

const ParamsExtractionSchema = z.object({
  documentType: z.string(),
  companyName: z.string(),
  industry: z.string(),
  description: z.string(),
  stage: z.string(),
  targetAudience: z.string().optional(),
  keyMetrics: z.string().optional()
})

async function extractParamsFromPrompt(prompt: string): Promise<z.infer<typeof ParamsExtractionSchema>> {
  // Try Claude first, then Gemini for parameter extraction
  const extractionPrompt = `Extract structured parameters from this natural language document request. If any field is ambiguous, make a reasonable assumption.

User request: "${prompt}"

Extract: documentType, companyName, industry, description, stage, targetAudience, keyMetrics`

  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
  if (anthropicKey) {
    try {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey: anthropicKey })
      
      const jsonSchema = zodToJsonSchema(ParamsExtractionSchema as any, { $refStrategy: 'none' }) as any
      if (jsonSchema.$schema) delete jsonSchema.$schema

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        tools: [{
          name: 'extract_params',
          description: 'Extract document parameters',
          input_schema: {
            type: 'object',
            properties: jsonSchema.properties,
            required: jsonSchema.required,
            definitions: jsonSchema.definitions
          } as any
        }],
        tool_choice: { type: 'tool', name: 'extract_params' },
        messages: [{ role: 'user', content: extractionPrompt }]
      })
      const toolBlock = response.content.find((b: any) => b.type === 'tool_use') as any
      if (toolBlock && toolBlock.type === 'tool_use') {
        return ParamsExtractionSchema.parse(toolBlock.input)
      }
    } catch (err) {
      console.error('Claude param extraction failed, trying Gemini:', err)
    }
  }

  // Gemini fallback
  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({ apiKey: geminiKey })
    
    const jsonSchema = zodToJsonSchema(ParamsExtractionSchema as any, { $refStrategy: 'none' }) as any
    if (jsonSchema.$schema) delete jsonSchema.$schema

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: extractionPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: jsonSchema as any
      }
    })
    return ParamsExtractionSchema.parse(JSON.parse(response.text || '{}'))
  }

  throw new Error('No AI provider available')
}

// ═══ ROUTES ═══

// POST /api/generate-document — structured params
router.post('/generate-document', aiRateLimiter, verifyAuth, enforceCredits, async (req, res) => {
  try {
    const { documentType, companyName, industry, description, stage, targetAudience, keyMetrics, additionalContext, preferredModel } = req.body

    if (!documentType || !companyName || !industry || !description || !stage) {
      return res.status(400).json({ success: false, error: 'Missing required fields: documentType, companyName, industry, description, stage' })
    }

    const userPrompt = buildUserPrompt({ documentType, companyName, industry, description, stage, targetAudience, keyMetrics, additionalContext })

    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY
    
    if (!anthropicKey && !geminiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'No AI API keys found. Please add ANTHROPIC_API_KEY or GEMINI_API_KEY to your Secrets in the Settings menu.' 
      })
    }

    let document: GeneratedDocument | null = null

    // Route based on preference or availability
    if (preferredModel === 'gemini') {
      document = await generateWithGemini(DOCUMENT_SYSTEM_PROMPT, userPrompt)
      if (!document) document = await generateWithClaude(DOCUMENT_SYSTEM_PROMPT, userPrompt)
    } else {
      // Default: Claude first (higher quality), Gemini fallback
      document = await generateWithClaude(DOCUMENT_SYSTEM_PROMPT, userPrompt)
      if (!document) document = await generateWithGemini(DOCUMENT_SYSTEM_PROMPT, userPrompt)
    }

    if (!document) {
      return res.status(500).json({ success: false, error: 'All AI providers failed. Check API keys in Secrets.' })
    }

    res.json({ success: true, document })
  } catch (err: any) {
    console.error('Generation error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/generate-from-prompt — natural language
router.post('/generate-from-prompt', aiRateLimiter, verifyAuth, enforceCredits, async (req, res) => {
  try {
    const { prompt, preferredModel } = req.body
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Missing prompt field' })
    }

    // Step 1: Extract params from natural language
    const params = await extractParamsFromPrompt(prompt)

    // Step 2: Generate document
    const userPrompt = buildUserPrompt(params)
    let document: GeneratedDocument | null = null

    if (preferredModel === 'gemini') {
      document = await generateWithGemini(DOCUMENT_SYSTEM_PROMPT, userPrompt)
      if (!document) document = await generateWithClaude(DOCUMENT_SYSTEM_PROMPT, userPrompt)
    } else {
      document = await generateWithClaude(DOCUMENT_SYSTEM_PROMPT, userPrompt)
      if (!document) document = await generateWithGemini(DOCUMENT_SYSTEM_PROMPT, userPrompt)
    }

    if (!document) {
      return res.status(500).json({ success: false, error: 'All AI providers failed' })
    }

    res.json({ success: true, document, extractedParams: params })
  } catch (err: any) {
    console.error('Generation error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/edit-section — AI-powered section editing
router.post('/edit-section', aiRateLimiter, verifyAuth, enforceCredits, async (req, res) => {
  try {
    const { section, editInstruction, companyContext } = req.body
    if (!section || !editInstruction) {
      return res.status(400).json({ success: false, error: 'Missing section or editInstruction' })
    }

    const editPrompt = `You are editing a section of a business document. Here is the current section:

HEADING: ${section.heading}
BODY: ${section.body}
BULLETS: ${(section.bullets || []).join(', ')}

The user wants you to: ${editInstruction}

Company context: ${companyContext || 'Not provided'}

Return the COMPLETE updated section with all fields. Do not use placeholders.`

    const SectionEditSchema = z.object({
      heading: z.string(),
      subheading: z.string().optional(),
      body: z.string(),
      bullets: z.array(z.string()).optional(),
      metrics: z.array(z.object({
        label: z.string(),
        value: z.string(),
        trend: z.enum(['up', 'down', 'neutral']).optional()
      })).optional()
    })

    let result: z.infer<typeof SectionEditSchema> | null = null

    // Try Claude
    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
    if (anthropicKey) {
      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default
        const client = new Anthropic({ apiKey: anthropicKey })

        const jsonSchema = zodToJsonSchema(SectionEditSchema as any, { $refStrategy: 'none' }) as any
        if (jsonSchema.$schema) delete jsonSchema.$schema

        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 4096,
          tools: [{
            name: 'edit_section',
            description: 'Return the edited section',
            input_schema: jsonSchema
          }],
          tool_choice: { type: 'tool', name: 'edit_section' },
          messages: [{ role: 'user', content: editPrompt }]
        })
        const toolBlock = response.content.find((b: any) => b.type === 'tool_use') as any
        if (toolBlock && toolBlock.type === 'tool_use') {
          result = SectionEditSchema.parse(toolBlock.input)
        }
      } catch (err) { console.error('Claude edit failed:', err) }
    }

    // Gemini fallback
    if (!result) {
      const geminiKey = process.env.GEMINI_API_KEY
      if (geminiKey) {
        const { GoogleGenAI } = await import('@google/genai')
        const ai = new GoogleGenAI({ apiKey: geminiKey })
        
        const jsonSchema = zodToJsonSchema(SectionEditSchema as any, { $refStrategy: 'none' }) as any
        if (jsonSchema.$schema) delete jsonSchema.$schema

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: editPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: jsonSchema as any
          }
        })
        result = SectionEditSchema.parse(JSON.parse(response.text || '{}'))
      }
    }

    if (!result) {
      return res.status(500).json({ success: false, error: 'AI edit failed' })
    }

    res.json({ success: true, section: { ...section, ...result } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/fill-template — fill blank fields in a template using AI
router.post('/fill-template', aiRateLimiter, verifyAuth, enforceCredits, async (req, res) => {
  try {
    const { templateSections, companyName, industry, stage, description } = req.body

    const fillPrompt = `You are filling in a business document template for:
COMPANY: ${companyName}
INDUSTRY: ${industry}
STAGE: ${stage}
DESCRIPTION: ${description}

Here are the template sections. For each section, replace any blank fields, placeholder text, or generic content with real, specific, professional content tailored to this company. Keep the structure identical but fill in ALL content.

Template sections: ${JSON.stringify(templateSections)}

Return the complete filled sections array.`

    const FilledSectionsSchema = z.object({
      sections: z.array(DocumentSectionSchema)
    })

    let result: z.infer<typeof FilledSectionsSchema> | null = null

    // Claude first
    const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
    if (anthropicKey) {
      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default
        const client = new Anthropic({ apiKey: anthropicKey })

        const jsonSchema = zodToJsonSchema(FilledSectionsSchema as any, { $refStrategy: 'none' }) as any
        if (jsonSchema.$schema) delete jsonSchema.$schema

        const response = await client.messages.create({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 8192,
          tools: [{
            name: 'fill_template',
            description: 'Return filled template sections',
            input_schema: jsonSchema
          }],
          tool_choice: { type: 'tool', name: 'fill_template' },
          messages: [{ role: 'user', content: fillPrompt }]
        })
        const toolBlock = response.content.find((b: any) => b.type === 'tool_use') as any
        if (toolBlock && toolBlock.type === 'tool_use') {
          result = FilledSectionsSchema.parse(toolBlock.input)
        }
      } catch (err) { console.error('Claude fill failed:', err) }
    }

    // Gemini fallback
    if (!result) {
      const geminiKey = process.env.GEMINI_API_KEY
      if (geminiKey) {
        const { GoogleGenAI } = await import('@google/genai')
        const ai = new GoogleGenAI({ apiKey: geminiKey })
        
        const jsonSchema = zodToJsonSchema(FilledSectionsSchema as any, { $refStrategy: 'none' }) as any
        if (jsonSchema.$schema) delete jsonSchema.$schema

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: fillPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: jsonSchema as any
          }
        })
        result = FilledSectionsSchema.parse(JSON.parse(response.text || '{}'))
      }
    }

    if (!result) {
      return res.status(500).json({ success: false, error: 'AI fill failed' })
    }

    res.json({ success: true, sections: result.sections })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/ai-status — check which AI providers are available
router.get('/ai-status', (req, res) => {
  res.json({
    claude: !!process.env.ANTHROPIC_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    primaryModel: process.env.ANTHROPIC_API_KEY ? 'Claude Sonnet 3.5' : process.env.GEMINI_API_KEY ? 'Gemini 2.0 Flash' : 'None',
    status: (process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY) ? 'ready' : 'no_keys'
  })
})

// MOCK: Save drafts directly to firestore from backend if needed
router.patch('/documents/:id/draft', verifyAuth, (req, res) => {
  res.json({ success: true });
});

// MOCK: Direct Export PDF endpoint
router.post('/export/direct', verifyAuth, (req, res) => {
  // Generate a minimal valid PDF file as a placeholder
  const pdfString = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [ 3 0 R ]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [ 0 0 612 792 ]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n190\n%%EOF";
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from(pdfString));
});

export const generateRouter = router
export default router
