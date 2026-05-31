export const colors = {
  primary: {
    obsidian: "#0A0A0F",
    spaceIndigo: "#3D35C8",
    electricViolet: "#6C47FF",
    cosmicWhite: "#FAFAFF",
    arcticWhite: "#FFFFFF",
  },
  accent: {
    plasmaGreen: "#00E5A0",
    amberSignal: "#F5A623",
    crimsonAlert: "#FF3B5C",
    investorGold: "#C9A84C",
    trustBlue: "#2563EB",
  },
  neutral: {
    slate: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },
  glass: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.10)",
    innerShadow: "0 0 0 1px rgba(255, 255, 255, 0.06) inset",
  },
};

export const gradients = {
  aiAura: "linear-gradient(135deg, #6C47FF 0%, #3D35C8 100%)",
  investorGlow: "linear-gradient(135deg, #C9A84C 0%, #F5A623 100%)",
  documentDepth: "linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)",
  successArc: "linear-gradient(90deg, #00E5A0 0%, #2563EB 100%)",
  ghostSurface:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
};

export const typography = {
  fonts: {
    display: '"Instrument Serif", "Canela Text", serif',
    interface: '"Geist", "Inter", sans-serif',
    mono: '"Geist Mono", "JetBrains Mono", monospace',
  },
  scale: {
    display: {
      fontSize: "4rem",
      lineHeight: "1.2",
      fontWeight: 400,
      letterSpacing: "-0.04em",
    },
    h1: {
      fontSize: "3rem",
      lineHeight: "1.2",
      fontWeight: 600,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontSize: "2.25rem",
      lineHeight: "1.2",
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    h3: {
      fontSize: "1.75rem",
      lineHeight: "1.2",
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontSize: "1.25rem",
      lineHeight: "1.2",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    bodyL: {
      fontSize: "1.0625rem",
      lineHeight: "1.75",
      fontWeight: 400,
      letterSpacing: "normal",
    },
    bodyM: {
      fontSize: "0.9375rem",
      lineHeight: "1.7",
      fontWeight: 400,
      letterSpacing: "normal",
    },
    bodyS: {
      fontSize: "0.8125rem",
      lineHeight: "1.65",
      fontWeight: 400,
      letterSpacing: "normal",
    },
    label: {
      fontSize: "0.6875rem",
      lineHeight: "1.5",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    metric: {
      fontSize: "2.5rem",
      lineHeight: "1.2",
      fontWeight: 700,
      letterSpacing: "normal",
    },
    micro: {
      fontSize: "0.75rem",
      lineHeight: "1.5",
      fontWeight: 500,
      letterSpacing: "normal",
    },
  },
};

export const spacing = {
  base: 4,
  scale: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    14: "56px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px",
    40: "160px",
  },
  layout: {
    cardPadding: "24px",
    pageSectionVertical: "96px",
    maxContentWidth: "1200px",
    sidebarWidth: "256px",
    chatRailWidth: "380px",
  },
};

export const radii = {
  card: "16px",
  input: "12px",
  buttonPrimary: "10px",
  buttonSecondary: "8px",
  pill: "999px",
  modal: "20px",
};

export const shadows = {
  e0: "none",
  e1: "0 1px 3px rgba(0, 0, 0, 0.08)",
  e2: "0 4px 16px rgba(61, 53, 200, 0.14)",
  e3: "0 8px 32px rgba(0, 0, 0, 0.16)",
  e4: "0 16px 48px rgba(108, 71, 255, 0.24)",
};

export const animations = {
  easing: {
    entrance: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
    hover: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    pageTransition: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  duration: {
    entrance: "320ms",
    exit: "200ms",
    hover: "150ms",
    pageTransition: "400ms",
    tokenStream: "80ms",
  },
};

export const componentVariants = {
  button: {
    primary:
      "bg-gradient-to-br from-[#6C47FF] to-[#3D35C8] text-white font-semibold rounded-[10px] px-6 py-3 min-h-[44px] transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(61,53,200,0.14)] active:scale-[0.99] disabled:opacity-30",
    secondary:
      "bg-white text-[#3D35C8] border border-[#3D35C8] font-semibold rounded-[8px] px-6 py-3 min-h-[44px] transition-all duration-150 hover:bg-[#F1F5F9] active:scale-[0.99] disabled:opacity-30",
    ghost:
      "bg-transparent text-white/80 font-semibold rounded-[8px] px-6 py-3 min-h-[44px] transition-all duration-150 hover:bg-white/10 active:scale-[0.99] disabled:opacity-30",
    danger:
      "bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] font-semibold rounded-[8px] px-6 py-3 min-h-[44px] transition-all duration-150 hover:bg-[#FEE2E2] active:scale-[0.99] disabled:opacity-30",
    premium:
      "bg-gradient-to-br from-[#C9A84C] to-[#F5A623] text-[#0A0A0F] font-semibold rounded-[10px] px-6 py-3 min-h-[44px] transition-all duration-150 hover:scale-[1.01] hover:shadow-[0_16px_48px_rgba(108,71,255,0.24)] active:scale-[0.99]",
  },
  input: {
    standard:
      "bg-white border border-[#E2E8F0] rounded-[12px] h-[44px] px-4 text-[15px] outline-none transition-all duration-150 focus:border-[#3D35C8] focus:ring-[3px] focus:ring-[#3D35C8]/15",
    large:
      "bg-white border border-[#E2E8F0] rounded-[12px] h-[56px] px-5 py-[18px] text-[18px] outline-none transition-all duration-150 focus:border-[#3D35C8] focus:ring-[3px] focus:ring-[#3D35C8]/15",
    textarea:
      "bg-white border border-[#E2E8F0] rounded-[12px] min-h-[120px] px-4 py-3 text-[15px] outline-none resize-y transition-all duration-150 focus:border-[#3D35C8] focus:ring-[3px] focus:ring-[#3D35C8]/15",
    search:
      "bg-white border border-[#E2E8F0] rounded-[12px] h-[40px] pl-10 pr-4 text-[14px] outline-none transition-all duration-150 focus:border-[#3D35C8] focus:ring-[3px] focus:ring-[#3D35C8]/15",
  },
  badge: {
    base: "font-semibold uppercase tracking-[0.06em] rounded-full px-3 py-1.5 text-[12px] inline-flex items-center justify-center",
    status: {
      draft: "bg-slate-100 text-slate-600",
      inReview: "bg-amber-100 text-amber-800",
      investorReady: "bg-indigo-100 text-indigo-700",
      sent: "bg-blue-100 text-blue-700",
      engaged: "bg-emerald-100 text-emerald-700",
      funded: "bg-amber-100 text-amber-800", // Gold equivalent
    },
    docType: {
      pitchDeck: "bg-violet-100 text-violet-700",
      businessPlan: "bg-blue-100 text-blue-700",
      financialModel: "bg-emerald-100 text-emerald-700",
      investmentMemo: "bg-amber-100 text-amber-700",
      dataRoom: "bg-slate-100 text-slate-600",
    },
    premium: "bg-gradient-to-r from-[#C9A84C] to-[#F5A623] text-[#0A0A0F]",
  },
  toast: {
    base: "bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.16)] max-w-[380px] p-4 flex items-start gap-3 border-l-[4px]",
    success: "border-l-[#00E5A0]",
    error: "border-l-[#FF3B5C]",
    info: "border-l-[#3D35C8]",
    aiAction: "border-l-[#6C47FF]",
    investorAlert: "border-l-[#C9A84C]",
  },
};

export const designSystem = {
  colors,
  gradients,
  typography,
  spacing,
  radii,
  shadows,
  animations,
  componentVariants,
};

export default designSystem;
