// src/lib/hooks/useAIChat.ts
import { useState } from 'react';
import { auth } from '../firebase';
import { useDocumentStore } from '../store/useDocumentStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseAIChatResult {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (userPrompt: string, activeSectionTitle?: string) => Promise<void>;
  suggestedChips: string[];
  applyToSection: (text: string) => void;
}

export const useAIChat = (documentId: string): UseAIChatResult => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { document: currentDocument, activeSectionId, updateSectionContent } = useDocumentStore();

  const getSuggestedChips = () => {
    const defaultChips = [
      "Evaluate against YC Memo criteria",
      "Tighten wording & remove fluff",
      "Stress-test downside scenario"
    ];

    if (!currentDocument || !activeSectionId) return defaultChips;

    const section = currentDocument.sections.find(s => s.id === activeSectionId);
    if (!section) return defaultChips;

    const title = section.title.toLowerCase();

    if (title.includes('traction') || title.includes('milestone')) {
      return ["Add cohort retention metrics", "Make execution milestones clearer", "Tighten wording"];
    }
    if (title.includes('financial') || title.includes('model') || title.includes('business')) {
      return ["Stress-test downside scenario", "Clarify margin compounding", "Add unit economics bullets"];
    }
    if (title.includes('problem')) {
      return ["Make the pain point more acute", "Add metrics to quantify the problem", "Evaluate against Sequoia canvas"];
    }
    if (title.includes('solution') || title.includes('product')) {
      return ["Clarify the unfair advantage", "Make it less generic", "Highlight the \"Aha\" moment"];
    }

    return defaultChips;
  };

  const applyToSection = (text: string) => {
    // Only used for UI parity, real update handled directly in chat payload
  };

  const sendMessage = async (userPrompt: string, activeSectionTitle?: string) => {
    if (!userPrompt.trim()) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: userPrompt,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const user = auth.currentUser;
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('User not authenticated for chat');
      }

      const response = await fetch('/api/chat-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId,
          prompt: userPrompt,
          activeSection: activeSectionTitle,
          documentContext: {
            id: currentDocument?.id,
            title: currentDocument?.title,
            companyName: currentDocument?.companyName,
            industry: currentDocument?.industry,
            stage: currentDocument?.stage,
            documentType: currentDocument?.documentType,
            originalPrompt: currentDocument?.originalPrompt,
            sections: currentDocument?.sections,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat processing failure');
      }

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content:
          typeof data.reply === 'string'
            ? data.reply
            : 'I updated this section using sector‑specific guidance.',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.updatedSectionContent && activeSectionTitle && currentDocument?.sections) {
        const targetSection = currentDocument.sections.find(
          (sec) => sec.title === activeSectionTitle,
        );
        if (targetSection) {
          updateSectionContent(targetSection.id, data.updatedSectionContent);
        }
      }
    } catch (error: any) {
      console.error('❌ Chat Agent Error:', error?.message || error);

      const fallbackMessage: ChatMessage = {
        id: `${Date.now()}-assistant-fallback`,
        role: 'assistant',
        content:
          '⚠️ System note: The live AI chat is temporarily unavailable. You can continue editing directly in the canvas while we restore connectivity.',
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, isTyping, sendMessage, suggestedChips: getSuggestedChips(), applyToSection };
};
