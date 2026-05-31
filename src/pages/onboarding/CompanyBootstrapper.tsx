import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { designSystem } from "../../lib/design-system";

export const CompanyBootstrapper: React.FC<{
  onGenerate: (data: any) => void;
}> = ({ onGenerate }) => {
  const { colors, typography, spacing, radii, shadows, gradients } =
    designSystem;

  const [description, setDescription] = useState("");
  const [stageAndRaise, setStageAndRaise] = useState("");
  const [metrics, setMetrics] = useState("");

  const [showOptional1, setShowOptional1] = useState(false);
  const [showOptional2, setShowOptional2] = useState(false);

  // Auto-expand optional fields if description has enough content, or just let user click
  const hasDescription = description.trim().length > 10;

  return (
    <div
      className="min-h-screen w-full flex justify-center py-12 px-4"
      style={{ backgroundColor: colors.primary.obsidian }}
    >
      <div className="w-full max-w-[680px] mt-12 relative flex flex-col h-full">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
          style={{
            fontFamily: typography.fonts.interface,
            fontWeight: 600,
            fontSize: typography.scale.h2.fontSize,
            color: colors.primary.arcticWhite,
            letterSpacing: typography.scale.h2.letterSpacing,
          }}
        >
          Tell us about your company
        </motion.h2>

        <div className="flex-1 space-y-8 pb-32">
          {/* AI Turn 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="inline-block p-4 mb-4"
              style={{
                backgroundColor: colors.glass.background,
                border: `1px solid ${colors.glass.border}`,
                borderRadius: radii.card,
                borderBottomLeftRadius: "4px",
                fontFamily: typography.fonts.interface,
                color: colors.primary.arcticWhite,
                fontSize: typography.scale.bodyM.fontSize,
                maxWidth: "85%",
              }}
            >
              Hey, I'm your IdealApp AI. Tell me about your company in one
              sentence — what it does and who it's for.
            </div>

            <div className="flex justify-end mt-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. We build AI-powered legal software for mid-sized law firms..."
                style={{
                  backgroundColor: colors.primary.spaceIndigo,
                  color: colors.primary.arcticWhite,
                  border: "none",
                  borderRadius: radii.card,
                  borderBottomRightRadius: "4px",
                  padding: spacing.scale[4],
                  width: "85%",
                  minHeight: "80px",
                  fontFamily: typography.fonts.interface,
                  fontSize: typography.scale.bodyM.fontSize,
                  resize: "none",
                  outline: "none",
                  boxShadow: shadows.e2,
                }}
              />
            </div>
          </motion.div>

          {/* AI Turn 2 (Optional) */}
          <AnimatePresence>
            {hasDescription && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                {!showOptional1 ? (
                  <button
                    onClick={() => setShowOptional1(true)}
                    className="text-sm font-medium hover:underline opacity-60 hover:opacity-100 transition-opacity"
                    style={{
                      color: colors.primary.arcticWhite,
                      fontFamily: typography.fonts.interface,
                    }}
                  >
                    Want a stronger draft? Add your stage and raise amount →
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div
                      className="inline-block p-4"
                      style={{
                        backgroundColor: colors.glass.background,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: radii.card,
                        borderBottomLeftRadius: "4px",
                        fontFamily: typography.fonts.interface,
                        color: colors.primary.arcticWhite,
                        fontSize: typography.scale.bodyM.fontSize,
                      }}
                    >
                      What stage are you raising, and roughly how much?{" "}
                      <span className="opacity-50 text-xs uppercase ml-2">
                        Optional
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <input
                        type="text"
                        value={stageAndRaise}
                        onChange={(e) => setStageAndRaise(e.target.value)}
                        placeholder="e.g. Seed · $500K"
                        className="w-2/3"
                        style={{
                          backgroundColor: colors.primary.spaceIndigo,
                          color: colors.primary.arcticWhite,
                          border: "none",
                          borderRadius: radii.card,
                          borderBottomRightRadius: "4px",
                          padding: "12px 16px",
                          fontFamily: typography.fonts.interface,
                          fontSize: typography.scale.bodyM.fontSize,
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Turn 3 (Optional) */}
          <AnimatePresence>
            {showOptional1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                {!showOptional2 ? (
                  <button
                    onClick={() => setShowOptional2(true)}
                    className="text-sm font-medium hover:underline opacity-60 hover:opacity-100 transition-opacity"
                    style={{
                      color: colors.primary.arcticWhite,
                      fontFamily: typography.fonts.interface,
                    }}
                  >
                    Add key metrics? →
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div
                      className="inline-block p-4"
                      style={{
                        backgroundColor: colors.glass.background,
                        border: `1px solid ${colors.glass.border}`,
                        borderRadius: radii.card,
                        borderBottomLeftRadius: "4px",
                        fontFamily: typography.fonts.interface,
                        color: colors.primary.arcticWhite,
                        fontSize: typography.scale.bodyM.fontSize,
                      }}
                    >
                      Any key metrics? (revenue, users, growth rate){" "}
                      <span className="opacity-50 text-xs uppercase ml-2">
                        Optional
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <input
                        type="text"
                        value={metrics}
                        onChange={(e) => setMetrics(e.target.value)}
                        placeholder="e.g. $12K MRR, 40% MoM"
                        className="w-2/3"
                        style={{
                          backgroundColor: colors.primary.spaceIndigo,
                          color: colors.primary.arcticWhite,
                          border: "none",
                          borderRadius: radii.card,
                          borderBottomRightRadius: "4px",
                          padding: "12px 16px",
                          fontFamily: typography.fonts.interface,
                          fontSize: typography.scale.bodyM.fontSize,
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Action */}
        <AnimatePresence>
          {hasDescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50"
              style={{
                background:
                  "linear-gradient(to top, #0A0A0F 60%, transparent 100%)",
              }}
            >
              <button
                onClick={() =>
                  onGenerate({ description, stageAndRaise, metrics })
                }
                className="max-w-[400px] w-full flex items-center justify-center gap-2"
                style={{
                  background: gradients.aiAura,
                  color: colors.primary.arcticWhite,
                  fontFamily: typography.fonts.interface,
                  fontWeight: 600,
                  fontSize: "16px",
                  borderRadius: radii.pill, // Extra rounded for main CTA
                  padding: "16px 32px",
                  boxShadow: shadows.e4,
                  transition: "transform 150ms",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
              >
                <SparkleIcon />
                Generate first draft →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SparkleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
      fill="currentColor"
    />
  </svg>
);
