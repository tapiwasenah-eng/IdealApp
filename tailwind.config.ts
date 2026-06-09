// tailwind.config.ts
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Provided by user
        'ideal-neon': '#cde71b',
        'ideal-gold': '#ffffcc',
        'ideal-charcoal': '#121316',
        'ideal-sidebar': '#1c1d21',
        'ideal-text': '#f4f5f7',
        'ideal-muted': '#a0a3ac',
        obsidian: '#050816',
        'space-indigo': '#6366f1',
        'electric-violet': '#7c3aed',
        'plasma-green': '#22c55e',

        brand: {
          blue:   '#3B82F6',
          purple: '#8B5CF6',
          teal:   '#0D9488',
          orange: '#F59E0B',
          green:  '#10B981',
          pink:   '#EC4899',
        },
        surface: {
          bg:     '#F8FAFC',
          card:   '#FFFFFF',
          subtle: '#F1F5F9',
        },
        text: {
          primary: '#111827',
          muted:   '#6B7280',
          faint:   '#9CA3AF',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
      },
      backgroundImage: {
        'ideal-hero': 'linear-gradient(to bottom, #111322 0%, #161821 35%, #cde71b 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        'hero-xl': '32px',
        'chat-pill': '999px',
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover':'0 10px 25px -5px rgba(0,0,0,0.10), 0 4px 10px -5px rgba(0,0,0,0.06)',
        modal:      '0 20px 60px -10px rgba(0,0,0,0.20), 0 8px 20px -8px rgba(0,0,0,0.12)',
        'hero-card': '0 30px 80px rgba(0,0,0,0.85)',
      },
      animation: {
        fadeIn:  'fadeIn 0.25s ease-out both',
        shimmer: 'shimmer 0.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
