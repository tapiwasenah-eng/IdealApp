const API_URL = '/api';

export interface GenerateDocumentParams {
  documentType: string;
  companyName: string;
  industry: string;
  stage: string;
  description: string;
  audience?: string;
  keyMetrics?: string;
  additionalContext?: string;
  preferredModel?: 'openai' | 'gemini';
}

export interface DocumentSection {
  id: string;
  title: string;
  heading?: string;
  body: string;
  content?: string;
  order: number;
  type?: string;
}

export interface GeneratedDocument {
  id?: string;
  title: string;
  sections: DocumentSection[];
  type: string;
  content?: string;
  documentType?: string;
  createdAt?: number;
}

/**
 * Generate a complete document using AI
 * This calls the backend API which handles all AI logic
 */
export async function generateDocument(params: GenerateDocumentParams | string, type: string = 'business-document'): Promise<GeneratedDocument> {
  try {
    let requestParams: any;
    if (typeof params === 'string') {
       requestParams = {
         documentType: type,
         companyName: 'Untitled',
         industry: 'Various',
         stage: 'Various',
         description: params,
       };
    } else {
       requestParams = params;
    }
    
    console.log('🚀 Calling backend to generate document:', requestParams.documentType);

    // Call backend - let server handle all AI logic
    const response = await fetch(`${API_URL}/generate-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestParams),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.content) {
      throw new Error('No content received from AI');
    }

    // Parse AI response into structured sections
    const sections = parseContentIntoSections(result.content, requestParams.documentType);

    return {
      id: `doc-${Date.now()}`,
      title: `${requestParams.companyName || 'Untitled'} - ${requestParams.documentType}`,
      sections,
      type: requestParams.documentType,
      documentType: requestParams.documentType,
      content: result.content,
      createdAt: Date.now()
    };

  } catch (error: any) {
    console.error('❌ AI generation error:', error);
    throw error;
  }
}

/**
 * Send a chat message and get streaming response
 */
export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Read SSE stream
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.error) {
              onError(data.error);
              return;
            }

            if (data.done) {
              onComplete(fullResponse);
              return;
            }

            if (data.content) {
              fullResponse += data.content;
              onChunk(fullResponse);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

  } catch (error: any) {
    console.error('Chat error:', error);
    onError(error.message);
  }
}

/**
 * Check which AI models are available
 */
export async function checkAIStatus(): Promise<{
  openai: boolean;
  gemini: boolean;
  claude: boolean;
}> {
  try {
    const response = await fetch(`${API_URL}/ai-status`);
    
    if (!response.ok) {
      return { openai: false, gemini: false, claude: false };
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to check AI status:', error);
    return { openai: false, gemini: false, claude: false };
  }
}

/**
 * Parse AI-generated content into structured sections
 * This runs client-side to avoid sending HTML back from server
 */
export function parseContentIntoSections(content: string, docType: string) {
  const sections: any[] = [];
  const lines = content.split('\n');
  
  let currentSection: any = null;
  let order = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect section headers (## Header or **Header**)
    if (trimmed.startsWith('##')) {
      // Save previous section
      if (currentSection && currentSection.body) {
        sections.push({
          id: `section-${Date.now()}-${order}`,
          title: currentSection.title || 'Untitled',
          heading: currentSection.title || 'Untitled',
          body: currentSection.body.trim(),
          content: currentSection.body.trim(),
          order,
          type: 'text'
        });
        order++;
      }

      // Start new section
      const title = trimmed.replace(/^##\s*/, '').trim();
      currentSection = { title, body: '' };

    } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 100) {
      // Alternative header format
      if (currentSection && currentSection.body) {
        sections.push({
          id: `section-${Date.now()}-${order}`,
          title: currentSection.title || 'Untitled',
          heading: currentSection.title || 'Untitled',
          body: currentSection.body.trim(),
          content: currentSection.body.trim(),
          order,
          type: 'text'
        });
        order++;
      }

      const title = trimmed.replace(/\*\*/g, '').trim();
      currentSection = { title, body: '' };

    } else if (currentSection && trimmed) {
      // Add to current section body
      currentSection.body = (currentSection.body || '') + line + '\n';
    }
  }

  // Save last section
  if (currentSection && currentSection.body) {
    sections.push({
      id: `section-${Date.now()}-${order}`,
      title: currentSection.title || 'Untitled',
      heading: currentSection.title || 'Untitled',
      body: currentSection.body.trim(),
      content: currentSection.body.trim(),
      order,
      type: 'text'
    });
  }

  // If no sections found, create a default one
  if (sections.length === 0) {
    sections.push({
      id: `section-${Date.now()}-0`,
      title: 'Content',
      heading: 'Content',
      body: content,
      content: content,
      order: 0,
      type: 'text'
    });
  }

  return sections;
}

// Legacy function for backward compatibility
export async function generateDocumentFromConsultation(
  context: any
): Promise<GeneratedDocument> {
  return generateDocument({
    documentType: context.documentType,
    industry: context.industry,
    stage: context.stage,
    description: context.keyDetail,
    audience: context.audience,
    companyName: context.companyName,
    additionalContext: context.additionalNotes,
  });
}

export const aiService = {
  generateDocument,
  generateFromPrompt: generateDocument,
  generateDocumentFromConsultation
};

