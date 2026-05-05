import { GoogleGenAI, Type } from "@google/genai";
import { auth } from '../lib/firebase';
import type { ConsultationSummary } from '../store/chatStore';

export interface GeneratedDocument {
  id: string;
  title: string;
  sections: Array<{
    heading: string;
    content: string;
    type?: 'text' | 'bullets' | 'table' | 'metrics';
  }>;
  documentType: string;
  createdAt: number;
}

export type DocumentResult = GeneratedDocument;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AiSuggestion {
  content: string;
  type: 'text' | 'layout' | 'data';
  confidence: number;
}

export async function generateSlideContent(prompt: string, context: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are an expert pitch deck consultant. Based on the following context: "${context}", respond to this request: "${prompt}". Provide concise, high-impact content for a startup pitch deck slide.`,
  });
  return response.text || "Failed to generate content.";
}

export async function analyzeDeck(deckContent: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Analyze this pitch deck content and provide 3 actionable improvements for clarity and investor appeal: ${deckContent}`,
  });
  return response.text || "No feedback available.";
}

export async function suggestLayout(slideTitle: string): Promise<AiSuggestion[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Suggest 3 layout structures for a slide titled "${slideTitle}". Return as a JSON array of objects with 'content' (description), 'type' (layout), and 'confidence' (0-1).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            type: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["content", "type", "confidence"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch {
    return [];
  }
}

export async function generateInvestorOutreach(investorName: string, startupBio: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Write a personalized, short, and compelling intro email to an investor named ${investorName} for a startup with this bio: ${startupBio}. Focus on why they are a good fit based on their profile.`,
  });
  return response.text || "Failed to generate email.";
}

export async function generateDocument(prompt: string, type: string = 'business-document'): Promise<DocumentResult> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate a professional document structure for a ${type} based on this prompt: "${prompt}". Return a JSON object with 'title' and 'sections' (array of objects with 'heading' and 'content').`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["heading", "content"]
            }
          }
        },
        required: ["title", "sections"]
      }
    }
  });
  
  try {
    const data = JSON.parse(response.text || "{}");
    return {
      id: `doc-${Date.now()}`,
      title: data.title || "Untitled Document",
      sections: data.sections || [],
      documentType: type,
      createdAt: Date.now()
    };
  } catch {
    return { id: `doc-${Date.now()}`, title: "Untitled Document", sections: [], documentType: type, createdAt: Date.now() };
  }
}

export async function generateDocumentFromConsultation(
  context: ConsultationSummary
): Promise<DocumentResult> {
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch('/api/generate-document', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        documentType: context.documentType,
        companyName: context.companyName,
        industry: context.industry,
        description: context.keyDetail,
        stage: context.stage,
        targetAudience: context.audience,
        additionalContext: context.additionalNotes,
        preferredModel: 'claude'
      })
    });

    const data = await response.json();
    if (!data.success) {
      console.error('Backend AI Generation Error:', data.error);
      throw new Error(data.error || 'Failed to generate document');
    }

    // Map backend response to frontend GeneratedDocument type
    return {
      id: `doc-${Date.now()}`,
      title: data.document.title,
      sections: data.document.sections.map((s: any) => ({
        heading: s.heading,
        content: s.body, // Map 'body' to 'content'
        type: s.type === 'text_section' ? 'text' : s.type
      })),
      documentType: context.documentType,
      createdAt: Date.now()
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error;
  }
}

export const aiService = {
  generateSlideContent,
  analyzeDeck,
  suggestLayout,
  generateInvestorOutreach,
  generateDocument,
  generateDocumentFromConsultation,
  generateFromPrompt: generateDocument
};
