import React, { useState } from "react";
import { designSystem } from "../../lib/design-system";
import { useDocumentStore } from "../../lib/store/useDocumentStore";
import { useAIChat } from "../../lib/hooks/useAIChat";
import { motion, AnimatePresence } from "framer-motion";

export const AIChatRail: React.FC = () => {
  const { colors, typography, radii, shadows } = designSystem;
  const { activeSectionId, document, investorView } = useDocumentStore();
  const { messages, isTyping, sendMessage, suggestedChips, applyToSection } =
    useAIChat(activeSectionId);
  const [inputText, setInputText] = useState("");

  if (investorView) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div
      className="w-[380px] h-full flex-shrink-0 flex flex-col bg-white border-l relative"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex justify-between items-center"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <SparkleIcon color={colors.primary.electricViolet} />
          <h3
            style={{
              fontFamily: typography.fonts.interface,
              fontWeight: 600,
              fontSize: typography.scale.bodyM.fontSize,
              color: colors.primary.obsidian,
            }}
          >
            AI Document Partner
          </h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-violet-50 text-violet-700 rounded-full">
          Gemini Flash
        </span>
      </div>

      {/* Context Indicator */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">Context:</span>
        <span className="text-xs text-indigo-600 font-semibold truncate max-w-[200px]">
          {activeSectionId
            ? document?.sections.find((s) => s.id === activeSectionId)?.title
            : "Full Document"}
        </span>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div
                className={`p-3 shadow-sm ${msg.role === "ai" ? "prose prose-sm max-w-none" : ""}`}
                style={{
                  backgroundColor:
                    msg.role === "user"
                      ? colors.primary.spaceIndigo
                      : colors.neutral.slate[50],
                  color:
                    msg.role === "user"
                      ? colors.primary.arcticWhite
                      : colors.neutral.slate[800],
                  fontFamily: typography.fonts.interface,
                  fontSize: typography.scale.bodyM.fontSize,
                  lineHeight: 1.5,
                  borderRadius: "16px",
                  borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                  borderBottomLeftRadius: msg.role === "ai" ? "4px" : "16px",
                  border:
                    msg.role === "ai" ? "1px solid rgba(0,0,0,0.05)" : "none",
                }}
              >
                {msg.role === 'ai' ? (
                  <div 
                    className="prose prose-sm max-w-none" 
                    dangerouslySetInnerHTML={{ __html: msg.text }} 
                  />
                ) : (
                  msg.text
                )}
              </div>

              {/* Optional actionable buttons from AI */}
              {msg.actionable && msg.role === "ai" && msg.text && (
                <button 
                  onClick={() => applyToSection(msg.text)}
                  className="self-start px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                  Apply to section
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="p-4 bg-white border-t"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        {/* Suggested Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {suggestedChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setInputText(chip.replace(" \u2192", ""))}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              style={{ fontFamily: typography.fonts.interface }}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about this document..."
            className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 pr-12 text-sm outline-none resize-none focus:border-indigo-600 focus:ring-[3px] focus:ring-indigo-600/15 transition-all"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 bottom-2 p-1.5 bg-gradient-to-br from-[#6C47FF] to-[#3D35C8] text-white rounded-lg disabled:opacity-50 hover:shadow-md transition-all shadow-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const SparkleIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
      fill={color}
    />
  </svg>
);
