import { useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  actionable?: boolean;
}

export const useAIChatMock = (activeSectionId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "ai",
      text: "I'm your AI Document Partner. Select a section to get specific suggestions, or ask me to generate new content directly.",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Context-aware chips
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
    (text: string) => {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        text,
      };
      setMessages((prev) => [...prev, newMsg]);
      setIsTyping(true);

      // TODO: Replace this mock delay with actual LLM API invocation via streaming
      setTimeout(() => {
        const responseText = `I've updated the section to incorporate your request: "${text}". The revisions make the narrative tighter and more investor-focused.`;
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: responseText,
          actionable: true, // allows UI to show "Apply to section"
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
    },
    [activeSectionId],
  );

  return {
    messages,
    isTyping,
    sendMessage,
    suggestedChips: getSuggestedChips(),
  };
};
