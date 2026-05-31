import React from "react";
import { useDocumentStore } from "../../lib/store/useDocumentStore";
import { designSystem } from "../../lib/design-system";

export const SectionNavigator: React.FC = () => {
  const {
    document,
    activeSectionId,
    setActiveSection,
    addSection,
    investorView,
  } = useDocumentStore();
  const { colors, typography } = designSystem;

  if (!document || investorView) return null;

  return (
    <div
      className="w-[240px] h-full flex-shrink-0 flex flex-col border-r bg-white"
      style={{ borderColor: "rgba(0,0,0,0.08)" }}
    >
      <div className="p-4 border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
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
        {document.sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className="w-full text-left p-2 rounded flex items-center gap-3 transition-colors group"
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
            {/* Status Dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor:
                  section.status === "complete"
                    ? colors.accent.plasmaGreen
                    : section.status === "in-progress"
                      ? colors.accent.amberSignal
                      : colors.neutral.slate[300],
              }}
            />

            <span
              className="truncate flex-1"
              style={{
                fontFamily: typography.fonts.interface,
                fontSize: typography.scale.bodyS.fontSize,
                color:
                  activeSectionId === section.id
                    ? colors.primary.obsidian
                    : colors.neutral.slate[500],
                fontWeight: activeSectionId === section.id ? 600 : 400,
              }}
            >
              {section.title}
            </span>

            {/* Drag Handle (mock UI) */}
            <div className="opacity-0 group-hover:opacity-100 text-slate-300 cursor-grab">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z"
                  fill="currentColor"
                />
                <path
                  d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z"
                  fill="currentColor"
                />
                <path
                  d="M8 18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16C7.10457 16 8 16.8954 8 18Z"
                  fill="currentColor"
                />
                <path
                  d="M20 6C20 7.10457 19.1046 8 18 8C16.8954 8 16 7.10457 16 6C16 4.89543 16.8954 4 18 4C19.1046 4 20 4.89543 20 6Z"
                  fill="currentColor"
                />
                <path
                  d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z"
                  fill="currentColor"
                />
                <path
                  d="M20 18C20 19.1046 19.1046 20 18 20C16.8954 20 16 19.1046 16 18C16 16.8954 16.8954 16 18 16C19.1046 16 20 16.8954 20 18Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <button
          onClick={() => addSection("New Section")}
          className="text-sm font-medium hover:underline flex items-center gap-2"
          style={{
            color: colors.primary.spaceIndigo,
            fontFamily: typography.fonts.interface,
          }}
        >
          + Add section
        </button>
      </div>
    </div>
  );
};
