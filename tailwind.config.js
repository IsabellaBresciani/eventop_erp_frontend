/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5e17eb',
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#ddd0ff',
          300: '#c4a8ff',
          400: '#a574ff',
          500: '#5e17eb',
          600: '#4f12c7',
          700: '#420fa3',
          800: '#360d85',
          900: '#2d0b6e',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f2f2f7',
          card: '#ffffff',
          border: 'rgba(0, 0, 0, 0.08)',
        },
        apple: {
          bg: '#ffffff',
          sidebar: '#e8e3f5',
          label: '#86868b',
          text: '#1d1d1f',
          fill: '#f2f2f7',
          separator: 'rgba(0, 0, 0, 0.08)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'SF Pro Text',
          'SF Pro Display',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '20px',
        bento: '16px',
        pill: '9999px',
        apple: '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      boxShadow: {
        soft: '0 0 0 0.5px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
        elevated:
          '0 0 0 0.5px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)',
        glow: '0 0 0 4px rgba(94, 23, 235, 0.15)',
        card: '0 0 0 0.5px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
        'card-hover':
          '0 0 0 0.5px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.08)',
        fab: '0 4px 14px rgba(94, 23, 235, 0.4), 0 1px 4px rgba(0,0,0,0.12)',
        apple: '0 0 0 0.5px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
        'apple-sidebar': '0 1px 4px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
        'soft-pulse': 'softPulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
