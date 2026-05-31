import { Router } from 'express';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit } from 'express-rate-limit';
import { requireAuth, AuthenticatedRequest } from '../authMiddleware';
import { adminDb } from '../firebase-admin';

const router = Router();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again later.' }
});

const getPlanLimits = (plan: string) => {
  switch (plan) {
    case 'studio': return 1000;
    case 'pro': return 100;
    case 'free':
    default: return 10;
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
        error: `AI daily limit reached for your ${user.plan} plan. Please upgrade to continue.` 
      });
    }

    // Increment usage
    await adminDb.collection('users').doc(user.uid).update({
      aiRequestsToday: aiRequestsToday + 1,
      lastAiRequestDate: today
    });

    next();
  } catch (error) {
    console.error('Error checking AI limits:', error);
    next(error);
  }
};

// Initialize OpenAI (primary) and Google (fallback)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Import Google AI only if key exists
let genAI: any = null;
if (process.env.GOOGLE_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}

// AI Status
router.get('/ai-status', (req, res) => {
  res.json({
    openai: !!process.env.OPENAI_API_KEY,
    gemini: !!process.env.GOOGLE_API_KEY,
  });
});

// Document Generation
router.post('/generate-document', requireAuth, generalLimiter, checkAiLimits as any, async (req, res) => {
  try {
    const { documentType, companyName, industry, stage, description, audience } = req.body;

    console.log('📥 Generation request:', { documentType, companyName });

    const prompt = `You are an expert business document writer. Generate a professional ${documentType || 'business document'} for the following company:

Company Name: ${companyName || 'Startup Inc.'}
Industry: ${industry || 'Technology'}
Stage: ${stage || 'Seed'}
Description: ${description || 'A technology company'}
Target Audience: ${audience || 'Investors'}

Requirements:
1. Create a complete ${documentType || 'document'} with all standard sections
2. Use markdown headers (##) for section titles
3. Include specific, actionable content (not generic placeholders)
4. Make it investor-ready and professional

${getDocumentStructureGuide(documentType)}

Generate the complete document now:`;

    let content = '';
    let useGemini = !openai && !!genAI;

    // Try OpenAI first (more reliable)
    if (openai) {
      console.log('🤖 Using OpenAI GPT-4o-mini');
      
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Fast and cheap
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000,
        });

        content = completion.choices[0]?.message?.content || '';
        console.log('✅ OpenAI generated content, length:', content.length);
      } catch (openAiError: any) {
        console.warn('⚠️ OpenAI failed:', openAiError.message);
        if (genAI) {
          console.log('🔄 Falling back to Google Gemini...');
          useGemini = true;
        } else {
          throw openAiError;
        }
      }
    } 
    
    if (useGemini) {
      console.log('🤖 Using Google Gemini');
      
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      content = result.response.text();
      console.log('✅ Gemini generated content, length:', content.length);

    }

    if (!content && !useGemini && !openai) {
      throw new Error('No AI API keys configured. Add OPENAI_API_KEY or GOOGLE_API_KEY to server/.env');
    }

    if (!content) {
      throw new Error('AI returned empty content');
    }

    res.json({ 
      success: true,
      content,
      metadata: {
        documentType,
        companyName,
        generatedAt: new Date().toISOString(),
      }
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Generation failed',
    });
  }
});

// Chat Streaming
router.post('/chat', requireAuth, generalLimiter, checkAiLimits as any, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    console.log('💬 Chat request with', messages.length, 'messages');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let useGemini = !openai && !!genAI;

    // Try OpenAI streaming first
    if (openai) {
      console.log('🤖 Using OpenAI streaming');

      try {
        const stream = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages.map((m: any) => ({ 
            role: m.role, 
            content: m.content 
          })),
          stream: true,
        });

        let fullResponse = '';

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content, done: false })}\n\n`);
          }
        }

        res.write(`data: ${JSON.stringify({ content: '', done: true, fullResponse })}\n\n`);
        res.end();

        console.log('✅ OpenAI chat complete, length:', fullResponse.length);
      } catch (openAiError: any) {
        console.warn('⚠️ OpenAI chat streaming failed:', openAiError.message);
        if (genAI) {
          console.log('🔄 Falling back to Google Gemini streaming...');
          useGemini = true;
        } else {
          res.write(`data: ${JSON.stringify({ error: openAiError.message, done: true })}\n\n`);
          res.end();
          return;
        }
      }
    } 
    
    if (useGemini) {
      console.log('🤖 Using Google Gemini streaming');

      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const history = messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const chat = model.startChat({ history });
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessageStream(lastMessage.content);

      let fullResponse = '';

      for await (const chunk of result.stream) {
        const text = chunk.text();
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text, done: false })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ content: '', done: true, fullResponse })}\n\n`);
      res.end();

      console.log('✅ Gemini chat complete, length:', fullResponse.length);

    }
    
    if (!useGemini && !openai) {
      res.write(`data: ${JSON.stringify({ 
        error: 'No AI keys configured', 
        done: true 
      })}\n\n`);
      res.end();
    }

  } catch (error: any) {
    console.error('❌ Chat error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
    res.end();
  }
});

function getDocumentStructureGuide(docType: string): string {
  const guides: Record<string, string> = {
    'Pitch Deck': `
Structure with these sections:
## Problem
## Solution  
## Market Opportunity
## Business Model
## Traction
## Team
## Competition
## Financial Projections
## Ask`,

    'Business Plan': `
Structure with these sections:
## Executive Summary
## Company Description
## Market Analysis
## Organization & Management
## Products & Services
## Marketing Strategy
## Financial Projections
## Funding Requirements`,

    'Investor Memo': `
Structure with these sections:
## Investment Thesis
## Company Overview
## Market Analysis
## Competitive Advantage
## Financial Highlights
## Risks & Mitigations
## Investment Terms`,

    'One Pager': `
Create a concise one-page document with:
## Overview
## Problem & Solution
## Market
## Business Model
## Team
## Traction
## Ask`,

    'Financial Model': `
Structure with these sections:
## Revenue Model
## Cost Structure
## Key Assumptions
## 3-Year Projections
## Unit Economics
## Break-even Analysis`,
  };

  return guides[docType] || 'Create a professional document with clear sections and detailed content.';
}

// Complete Section (Inline Editor AI)
router.post('/ai/complete', requireAuth, generalLimiter, checkAiLimits as any, async (req, res) => {
  try {
    const { documentContext, sectionContent, instruction } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!process.env.GEMINI_API_KEY) {
      res.write(`data: ${JSON.stringify({ error: 'GEMINI_API_KEY is not configured', done: true })}\n\n`);
      res.end();
      return;
    }

    // Require the correct module per gemini-api skill
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are a professional business writer assisting with a document.
    
Context:
${documentContext || ''}

Current Section Content (in HTML):
${sectionContent || '(Empty section)'}

User Request: ${instruction}

Please write or revise the section content based on the instruction. Output ONLY valid, raw HTML for the section content. Use tags like <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>. Do NOT wrap your response in markdown code blocks (e.g. no \`\`\`html). Return only the raw HTML string.`;

    const response = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ content: chunk.text, done: false })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ content: '', done: true })}\n\n`);
    res.end();

  } catch (error: any) {
    console.error('❌ AI Complete error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
    res.end();
  }
});

// Fill Template
router.post('/fill-template', requireAuth, generalLimiter, checkAiLimits as any, async (req, res) => {
  try {
    const { templateId, sections, currentValues, userPrompt } = req.body;
    
    // Quick prompt to generate plausable filler data for empty fields
    const prompt = `You are a helpful assistant assisting in filling a business document template: ${templateId}.
    The document has the following sections: ${JSON.stringify(sections)}.
    Current values provided: ${JSON.stringify(currentValues)}.
    ${userPrompt ? `The user also provided this instruction/prompt: "${userPrompt}"` : 'Generate plausible, professional sample data for any missing fields typically required in this document.'}
    Return ONLY a valid JSON object where keys are field names and values are the generated strings. DO NOT wrap the JSON in markdown code blocks.`;

    let content = '';
    let useGemini = !openai && !!genAI;

    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        });
        content = completion.choices[0]?.message?.content || '{}';
      } catch (err) {
        useGemini = true;
      }
    }

    if (useGemini && genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      // Clean JSON if it includes markdown blocks
      content = result.response.text().replace(/^```json/m, '').replace(/```$/m, '').trim();
    }

    let fieldValues = {};
    try {
      fieldValues = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse fill-template JSON", content);
    }

    res.json({ success: true, fieldValues });
  } catch (err: any) {
    console.error('Fill template error:', err.message);
    res.json({ success: true, fieldValues: {} }); // Fallback
  }
});

router.post('/export/direct', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from("%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [ 3 0 R ]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [ 0 0 612 792 ]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n190\n%%EOF"));
});

router.get('/export-blank', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.send(Buffer.from("%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [ 3 0 R ]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [ 0 0 612 792 ]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n190\n%%EOF"));
});

router.post('/edit-section', (req, res) => {
  res.json({ success: true, section: req.body.section });
});

router.post('/chat/stream', (req, res) => {
  res.status(404).json({ error: 'Use /chat instead' });
});

router.patch('/documents/:id/draft', (req, res) => {
  res.json({ success: true });
});

router.get('/templates', (req, res) => {
  res.json([]);
});

export default router;
