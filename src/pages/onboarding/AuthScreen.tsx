import React, { useState } from "react";
import { motion } from "framer-motion";
import { designSystem } from "../../lib/design-system";

export const AuthScreen: React.FC<{ onAuthComplete: () => void }> = ({
  onAuthComplete,
}) => {
  const [email, setEmail] = useState("");

  const handleGoogleAuth = () => {
    // Mock SSO
    onAuthComplete();
  };

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Mock magic link
      onAuthComplete();
    }
  };

  const {
    colors,
    typography,
    spacing,
    componentVariants,
    animations,
    radii,
    shadows,
    gradients,
  } = designSystem;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: colors.primary.obsidian }}
    >
      {/* Background Particles Light Version Placeholder */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #3D35C8 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: parseFloat(animations.duration.entrance) / 1000,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="z-10 w-full max-w-md mx-4"
        style={{
          backgroundColor: colors.glass.background,
          border: `1px solid ${colors.glass.border}`,
          borderRadius: radii.card,
          boxShadow: `${shadows.e4}, ${colors.glass.innerShadow}`,
          backdropFilter: "blur(20px) saturate(180%)",
          padding: spacing.scale[8],
        }}
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2
              style={{
                fontFamily: typography.fonts.interface,
                fontWeight: 600,
                color: colors.primary.arcticWhite,
                fontSize: "1.25rem",
              }}
            >
              IdealApp
            </h2>
          </div>

          <h1
            style={{
              fontFamily: typography.fonts.display,
              fontWeight: typography.scale.h2.fontWeight,
              fontSize: typography.scale.h2.fontSize,
              letterSpacing: typography.scale.h2.letterSpacing,
              color: colors.primary.arcticWhite,
              marginBottom: spacing.scale[2],
            }}
          >
            Start building in seconds
          </h1>
          <p
            style={{
              fontFamily: typography.fonts.interface,
              fontSize: typography.scale.bodyM.fontSize,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Your first pitch deck is free. No credit card.
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 relative overflow-hidden"
            style={{
              background: gradients.aiAura,
              color: colors.primary.arcticWhite,
              fontFamily: typography.fonts.interface,
              fontWeight: 600,
              borderRadius: radii.buttonPrimary,
              padding: "12px 24px",
              minHeight: "44px",
              transition: "all 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.89 16.79 15.73 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                fill="currentColor"
              />
              <path
                d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.73 17.57C14.75 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.07H2.15V16.92C3.97 20.53 7.69 23 12 23Z"
                fill="currentColor"
              />
              <path
                d="M5.82 14.07C5.59 13.4 5.46 12.71 5.46 12C5.46 11.29 5.59 10.6 5.82 9.93V7.08H2.15C1.41 8.56 1 10.23 1 12C1 13.77 1.41 15.44 2.15 16.92L5.82 14.07Z"
                fill="currentColor"
              />
              <path
                d="M12 5.38C13.62 5.38 15.06 5.94 16.21 6.94L19.35 3.8C17.45 2.03 14.96 1 12 1C7.69 1 3.97 3.47 2.15 7.08L5.82 9.93C6.7 7.31 9.13 5.38 12 5.38Z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-white/10 flex-1"></div>
            <span
              style={{
                fontFamily: typography.fonts.interface,
                fontSize: typography.scale.micro.fontSize,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              or
            </span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <form onSubmit={handleMagicLink} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${colors.glass.border}`,
                borderRadius: radii.input,
                height: "44px",
                padding: `0 ${spacing.scale[4]}`,
                color: colors.primary.arcticWhite,
                fontFamily: typography.fonts.interface,
                fontSize: typography.scale.bodyM.fontSize,
                outline: "none",
                transition: "border-color 150ms",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary.spaceIndigo;
                e.target.style.boxShadow = `0 0 0 3px rgba(61,53,200,0.15)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.glass.border;
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="submit"
              className="w-full"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: colors.primary.arcticWhite,
                fontFamily: typography.fonts.interface,
                fontWeight: 600,
                borderRadius: radii.buttonSecondary,
                padding: "12px 24px",
                minHeight: "44px",
                border: `1px solid ${colors.glass.border}`,
                transition: "background-color 150ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.06)")
              }
            >
              Continue →
            </button>
          </form>

          <p
            style={{
              fontFamily: typography.fonts.interface,
              fontSize: typography.scale.micro.fontSize,
              color: "rgba(255,255,255,0.4)",
              textAlign: "center",
              marginTop: spacing.scale[6],
            }}
          >
            By continuing you agree to our Terms & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
};
