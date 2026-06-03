import { useState } from 'react';
import { useDocumentStore } from '../store/useDocumentStore';
import { auth } from '../firebase';

export interface ChatMessage {
  id: string;
  role: "user" | "ai" | "assistant";
  content?: string;
  text?: string;
  actionable?: boolean;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { currentDocument, updateSectionContent, document, updateSection } = useDocumentStore();

  const activeDoc = currentDocument || document;
  const updateSec = updateSectionContent || updateSection;
  const documentId = activeDoc?.id || 'doc-123';

  const getSuggestedChips = () => {
    return [
      "Flesh out the market analysis",
      "Make this section more formal",
      "Simplify language",
      "Highlight key risks and mitigations"
    ];
  };

  const applyToSection = (text: string) => {
    // Legacy support piece if any code calls it, though we rely on real-time proxy
  };

  const sendMessage = async (userPrompt: string, activeSectionTitle?: string) => {
    if (!userPrompt.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: userPrompt, text: userPrompt };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      
      // Call the secure proxy server endpoint instead of the direct client-side SDK
      const response = await fetch('/api/chat-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId,
          prompt: userPrompt,
          activeSection: activeSectionTitle,
          documentContext: {
            title: activeDoc?.title,
            originalPrompt: activeDoc?.originalPrompt,
            sections: activeDoc?.sections,
            industry: activeDoc?.industry || activeDoc?.type || "saas"
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Chat processing failure');

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        text: data.reply
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If the chat agent processed an inline update request, sync the editor canvas
      if (data.updatedSectionContent && activeSectionTitle) {
        const targetSec = activeDoc?.sections?.find((s: any) => s.title === activeSectionTitle || s.id === activeSectionTitle);
        if (targetSec && updateSec) {
          updateSec(targetSec.id, data.updatedSectionContent);
        }
      }

    } catch (error: any) {
      console.error('❌ Chat Agent Error:', error.message);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `⚠️ System Note: Local Workspace is operating in fallback/offline mode. Suggested Action: Make your edits directly within the rich text canvas above.`,
        text: `⚠️ System Note: Local Workspace is operating in fallback/offline mode. Suggested Action: Make your edits directly within the rich text canvas above.`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, sendMessage, suggestedChips: getSuggestedChips(), applyToSection };
};
