import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designSystem } from "../../lib/design-system";

const MOCK_SECTIONS = [
  {
    id: "1",
    title: "Cover & Executive Summary",
    content:
      "We build AI-powered legal software for mid-sized law firms, saving them $420M annually.",
  },
  {
    id: "2",
    title: "Problem Statement",
    content:
      "Lawyers spend 40% of their time on repetitive document review and case law research. This manual process is error-prone and severely limits caseload capacity.",
  },
  {
    id: "3",
    title: "Solution",
    content:
      "An ambient AI assistant that pre-reads discovery documents, flags anomalies, and drafts preliminary briefs in seconds. Integrates seamlessly into existing workflows.",
  },
];

export const FirstDocumentView: React.FC = () => {
  const { colors, typography, spacing, radii, shadows, animations, gradients } =
    designSystem;
  const [activeSectionId, setActiveSectionId] = useState("1");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "ai",
      text: "Your draft is ready. Review the sections on the left. You can ask me to rewrite or adjust anything.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [showTooltip, setShowTooltip] = useState(true);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setChatMessages([...chatMessages, { role: "user", text: inputText }]);
    setInputText("");

    // Mock AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "I've applied those changes. Notice how the problem statement is now much more quantifiable. Want me to add customer quotes next?",
        },
      ]);
    }, 1500);
  };

  return (
    <div
      className="flex w-full h-screen overflow-hidden"
      style={{ backgroundColor: colors.neutral.slate[50] }}
    >
      {/* 1. SECTION NAVIGATOR (Left) */}
      <div
        className="w-[240px] h-full flex-shrink-0 flex flex-col border-r bg-white"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        <div
          className="p-4 border-b"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
          <h3
            style={{
              fontFamily: typography.fonts.interface,
              fontWeight: 600,
              fontSize: typography.scale.bodyM.fontSize,
              color: colors.primary.obsidian,
            }}
          >
            Sections
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {MOCK_SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className="w-full text-left p-2 rounded flex items-center gap-3 transition-colors"
              style={{
                backgroundColor:
                  activeSectionId === section.id
                    ? colors.neutral.slate[50]
                    : "transparent",
                borderLeft:
                  activeSectionId === section.id
                    ? `3px solid ${colors.primary.spaceIndigo}`
                    : "3px solid transparent",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.accent.plasmaGreen }}
              ></div>
              <span
                style={{
                  fontFamily: typography.fonts.interface,
                  fontSize: typography.scale.bodyS.fontSize,
                  color:
                    activeSectionId === section.id
                      ? colors.primary.obsidian
                      : colors.neutral.slate[500],
                  fontWeight: activeSectionId === section.id ? 600 : 400,
                }}
                className="truncate"
              >
                {section.title}
              </span>
            </button>
          ))}
        </div>
        <div
          className="p-4 border-t"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
          <button
            className="text-sm font-medium hover:underline"
            style={{
              color: colors.primary.spaceIndigo,
              fontFamily: typography.fonts.interface,
            }}
          >
            + Add section
          </button>
        </div>
      </div>

      {/* 2. DOCUMENT CANVAS (Center) */}
      <div className="flex-1 h-full overflow-y-auto p-8 relative">
        <div className="max-w-[800px] mx-auto space-y-8 pb-32">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1
                className="outline-none"
                contentEditable
                suppressContentEditableWarning
                style={{
                  fontFamily: typography.fonts.interface,
                  fontWeight: 600,
                  fontSize: typography.scale.h2.fontSize,
                  color: colors.primary.obsidian,
                  letterSpacing: typography.scale.h2.letterSpacing,
                }}
              >
                LegalTech Pitch Deck
              </h1>
              <span className="inline-block mt-2 px-2 py-1 rounded bg-slate-200 text-xs font-medium text-slate-700">
                Acme Corp
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a href="/documents/101" className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mr-2 shadow-sm">
                Open in Workspace →
              </a>
              <button className="px-3 py-1.5 text-sm font-medium rounded-md border text-slate-700 hover:bg-slate-50 transition-colors">
                Investor View
              </button>
              <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                Share
              </button>
              <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                Export ▾
              </button>
            </div>
          </div>

          {/* Document Sections */}
          {MOCK_SECTIONS.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: idx * 0.06,
                duration: 0.28,
                ease: "easeOut",
              }}
              className="bg-white p-8 group relative"
              style={{
                borderRadius: radii.card,
                boxShadow: shadows.e1,
                border: "1px solid rgba(0,0,0,0.05)",
                transition: "box-shadow 150ms ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = shadows.e2)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = shadows.e1)
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-indigo-600">
                  {idx + 1}
                </div>
                <span
                  style={{
                    fontFamily: typography.fonts.interface,
                    fontSize: typography.scale.label.fontSize,
                    fontWeight: 600,
                    letterSpacing: typography.scale.label.letterSpacing,
                    color: colors.neutral.slate[400],
                    textTransform: "uppercase",
                  }}
                >
                  {section.title}
                </span>
              </div>

              <h3
                contentEditable
                suppressContentEditableWarning
                className="outline-none mb-4"
                style={{
                  fontFamily: typography.fonts.interface,
                  fontWeight: 600,
                  fontSize: typography.scale.h3.fontSize,
                  color: colors.primary.obsidian,
                }}
              >
                {section.title}
              </h3>

              <p
                contentEditable
                suppressContentEditableWarning
                className="outline-none focus:bg-slate-50/50 p-2 -ml-2 rounded"
                style={{
                  fontFamily: typography.fonts.interface,
                  fontSize: typography.scale.bodyL.fontSize,
                  lineHeight: typography.scale.bodyL.lineHeight,
                  color: colors.neutral.slate[700],
                }}
              >
                {section.content}
              </p>

              <button className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 shadow-sm text-sm font-medium px-3 py-1.5 rounded-md text-slate-700 hover:bg-slate-50">
                Regenerate ↺
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. AI CHAT RAIL (Right) */}
      <div
        className="w-[380px] h-full flex-shrink-0 flex flex-col bg-white border-l relative"
        style={{ borderColor: "rgba(0,0,0,0.08)" }}
      >
        {/* Tooltip Overlay (First Time) */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-1/2 -left-[300px] w-64 bg-slate-900 text-white p-4 rounded-xl shadow-xl z-50"
            >
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
              <p className="text-sm font-medium mb-3">
                Your AI document partner is here. Try: 'Make the problem section
                more compelling'.
              </p>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
              >
                Got it
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
            Claude 3.5
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="p-3 rounded-2xl max-w-[85%]"
                style={{
                  backgroundColor:
                    msg.role === "user"
                      ? colors.primary.spaceIndigo
                      : colors.neutral.slate[50],
                  color:
                    msg.role === "user"
                      ? colors.primary.arcticWhite
                      : colors.primary.obsidian,
                  fontFamily: typography.fonts.interface,
                  fontSize: typography.scale.bodyM.fontSize,
                  borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                  borderBottomLeftRadius: msg.role === "ai" ? "4px" : "16px",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div
          className="p-4 bg-white border-t"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
          {/* Suggested Prompts */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            <button
              onClick={() => setInputText("Make this more compelling →")}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Make more compelling →
            </button>
            <button
              onClick={() => setInputText("Add customer quote →")}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Add customer quote →
            </button>
          </div>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything about this document..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 text-sm outline-none resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="absolute right-2 bottom-2 p-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
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
