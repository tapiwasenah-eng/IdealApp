import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designSystem } from "../../lib/design-system";

const SECTIONS = [
  "Cover & Executive Summary",
  "Problem Statement",
  "Solution",
  "Market Opportunity",
  "Business Model",
  "Financial Projections",
  "Team & Ask",
];

export const GenerationLoading: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const { colors, typography, spacing, radii, shadows } = designSystem;

  useEffect(() => {
    // Simulate generation progress
    const interval = setInterval(() => {
      setActiveSection((prev) => {
        if (prev < SECTIONS.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        setTimeout(onComplete, 800); // Wait a bit after finishing the last section
        return prev;
      });
    }, 400); // 400ms per section simulation

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = ((activeSection + 1) / SECTIONS.length) * 100;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: colors.primary.obsidian }}
    >
      {/* Background Document Silhouette Assembly Animation (Simplified with CSS) */}
      <div
        className="absolute inset-0 z-0 opacity-10 flex items-center justify-center"
        style={{ filter: "blur(8px)" }}
      >
        <motion.div
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-64 h-96 bg-white/20 rounded-xl"
        />
      </div>

      <div className="z-10 w-full max-w-md mx-4">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: colors.accent.plasmaGreen }}
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Section Timeline */}
        <div className="space-y-4 mb-12">
          {SECTIONS.map((section, idx) => {
            const isComplete = idx < activeSection;
            const isBuilding = idx === activeSection;
            const isPending = idx > activeSection;

            return (
              <motion.div
                key={section}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isPending ? 0.3 : 1,
                  x: 0,
                  scale: isBuilding ? 1.02 : 1,
                }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isComplete
                      ? colors.accent.plasmaGreen
                      : "transparent",
                    border: isComplete
                      ? "none"
                      : `1px solid ${isBuilding ? colors.primary.electricViolet : "rgba(255,255,255,0.2)"}`,
                  }}
                >
                  {isComplete && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke={colors.primary.obsidian}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {isBuilding && (
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: colors.primary.electricViolet }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                <span
                  style={{
                    fontFamily: typography.fonts.interface,
                    fontSize: typography.scale.bodyM.fontSize,
                    color: isComplete
                      ? colors.primary.arcticWhite
                      : isBuilding
                        ? colors.primary.electricViolet
                        : "rgba(255,255,255,0.6)",
                    fontWeight: isBuilding ? 600 : 400,
                  }}
                >
                  {section}
                  {isBuilding && (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {" "}
                      — building...
                    </motion.span>
                  )}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
          style={{
            fontFamily: typography.fonts.interface,
            fontSize: typography.scale.bodyS.fontSize,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Building your investor-grade pitch deck using best practices · Usually
          takes 15–30s
        </motion.p>
      </div>
    </div>
  );
};
