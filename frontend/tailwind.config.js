/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // WIRTHFORGE Energy Color Scheme
        'lightning-blue': '#00ffff',   // Lightning strikes
        'energy-blue': '#00ffff',      // Lightning strikes (alias)
        'forge-orange': '#ff6b35',     // Forge path
        'scholar-cyan': '#4ecdc4',     // Scholar path
        'sage-emerald': '#45b7d1',     // Sage path
        'adaptive-cyan': '#45b7d1',    // Adaptive fields
        'consciousness-purple': '#9b59b6', // Consciousness emergence
        
        // Background colors
        'space-black': '#0a0a0a',      // Main background
        'deep-space': '#1a1a1a',       // Secondary background
        'energy-glow': '#00ffff20',    // Energy glow effects
        
        // Text colors
        'energy-white': '#ffffff',     // Primary text
        'energy-gray': '#cccccc',      // Secondary text
        'energy-dim': '#888888',       // Tertiary text
      },
      animation: {
        'lightning-strike': 'lightning-strike 0.5s ease-out',
        'particle-burst': 'particle-burst 2s ease-out',
        'energy-flow': 'energy-flow 3s linear infinite',
      },
      keyframes: {
        'lightning-strike': {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
          '100%': { opacity: '0', transform: 'scale(1)' }
        },
        'particle-burst': {
          '0%': { transform: 'translateY(0) scale(0)' },
          '50%': { transform: 'translateY(-20px) scale(1)' },
          '100%': { transform: 'translateY(-40px) scale(0)' }
        },
        'energy-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
} 