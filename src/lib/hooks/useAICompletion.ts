import { useState } from 'react';
import { auth } from '../firebase';

export interface AICompletionChunk {
  content: string;
  done: boolean;
  error?: string;
}

export function useAICompletion() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCompletion = async (
    documentContext: string,
    sectionContent: string,
    instruction: string,
    onChunk: (chunk: string) => void
  ) => {
    setIsGenerating(true);
    setError(null);

    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : '';

    try {
      const response = await fetch('/api/ai/complete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ documentContext, sectionContent, instruction }),
      });

      if (!response.ok) {
        let errMsg = `HTTP Error ${response.status}`;
        try {
          const body = await response.json();
          if (body.error) errMsg = body.error;
        } catch(e) {}
        throw new Error(errMsg);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const messages = chunkStr.split('\n\n').filter((msg) => msg.trim() !== '');

          for (const msg of messages) {
            if (msg.startsWith('data: ')) {
              try {
                const data: AICompletionChunk = JSON.parse(msg.slice(6));
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.content) {
                  onChunk(data.content);
                }
              } catch (e: any) {
                console.error('Error parsing chunk', e, msg);
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateCompletion, isGenerating, error };
}
