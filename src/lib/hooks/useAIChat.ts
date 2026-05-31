import { useState, useCallback, useRef } from 'react';
import { useAICompletion } from './useAICompletion';
import { useDocumentStore } from '../store/useDocumentStore';

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  actionable?: boolean;
}

export const useAIChat = (activeSectionId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "ai",
      text: "I'm your AI Document Partner. Select a section to get specific suggestions, or ask me to generate new content directly.",
    },
  ]);
  const { generateCompletion, isGenerating } = useAICompletion();
  const { document, updateSection } = useDocumentStore();
  const activeMessageIdRef = useRef<string | null>(null);

  const getSuggestedChips = () => {
    if (!activeSectionId)
      return ["Suggest a new section", "Check document health"];
    return [
      "Make more compelling \u2192",
      "Add market data \u2192",
      "Add customer quote \u2192",
      "Simplify language \u2192",
    ];
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const userMsgId = Date.now().toString();
      const newMsg: ChatMessage = {
        id: userMsgId,
        role: "user",
        text,
      };
      
      const aiMsgId = (Date.now() + 1).toString();
      const initAiMsg: ChatMessage = {
        id: aiMsgId,
        role: "ai",
        text: "",
        actionable: !!activeSectionId, // We can make it actionable if there's an active section
      };

      setMessages((prev) => [...prev, newMsg, initAiMsg]);
      activeMessageIdRef.current = aiMsgId;

      const documentContext = document 
        ? `Document Title: ${document.title}. Company: ${document.companyName}. Type: ${document.type}` 
        : '';
        
      const activeSection = document?.sections.find(s => s.id === activeSectionId);
      const sectionContent = activeSection ? `${activeSection.title}:\n${activeSection.content}` : '';

      try {
        await generateCompletion(documentContext, sectionContent, text, (chunk) => {
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === aiMsgId 
                ? { ...msg, text: msg.text + chunk } 
                : msg
            )
          );
        });
      } catch (err: any) {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMsgId 
              ? { ...msg, text: msg.text + `\n\n[Error: ${err.message}]` } 
              : msg
          )
        );
      }
    },
    [activeSectionId, document, generateCompletion]
  );

  const applyToSection = useCallback((text: string) => {
    if (activeSectionId) {
      updateSection(activeSectionId, text);
    }
  }, [activeSectionId, updateSection]);

  return {
    messages,
    isTyping: isGenerating,
    sendMessage,
    suggestedChips: getSuggestedChips(),
    applyToSection
  };
};
