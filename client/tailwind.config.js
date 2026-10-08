/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070A',         // Primary background
          secondary: '#0B1017',  // Secondary background
          panel: '#0F1720',      // Panel & HUD containers
          cyan: '#00E5FF',       // Neon Cyan
          green: '#39FF88',      // Terminal Green
          orange: '#FF6A00',     // CodeSphere Orange
          danger: '#FF3B5C',     // Error / Breach Alert
          warning: '#FFC857',    // Warning
          text: '#F5F7FA',       // High-contrast readable text
          muted: '#8B98A7',      // Muted metadata text
          border: '#1B2A38',     // Subdued cyber border
          borderGlow: '#00E5FF33', // Cyan translucent border
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', '"Sora"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 229, 255, 0.35)',
        'neon-green': '0 0 15px rgba(57, 255, 136, 0.35)',
        'neon-orange': '0 0 15px rgba(255, 106, 0, 0.35)',
        'panel-glow': '0 4px 20px -2px rgba(0, 229, 255, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
