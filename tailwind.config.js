import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let tenantConfig = {}
try {
  tenantConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'src', 'config', 'tenant.json'), 'utf8')
  )
} catch (e) {
  // fallback if file doesn't exist
}

const primaryColor = tenantConfig.VITE_APP_PRIMARY_COLOR || '#6A24E3'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: primaryColor,
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          400: '#A78BFA',
          500: primaryColor,
          600: primaryColor,
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B0764',
        },
        gold: {
          DEFAULT: '#F5C518',
          50: '#FFFBEB',
          500: '#F5C518',
          800: '#86650A',
        },
        secondary: {
          DEFAULT: '#EDE9FE',
          400: '#C4B5FD',
          600: '#8B5CF6',
        },
        ink: {
          DEFAULT: '#111827',
          muted: '#6B7280',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#F9FAFB',
          card: '#ffffff',
          border: 'rgba(17, 24, 39, 0.08)',
        },
        apple: {
          label: '#6B7280',
          text: '#111827',
          fill: '#F9FAFB',
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
        card: '16px',
        bento: '14px',
        apple: '12px',
        'apple-lg': '14px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(17,24,39,0.04), 0 4px 12px rgba(17,24,39,0.04)',
        elevated: '0 4px 6px rgba(17,24,39,0.04), 0 12px 28px rgba(106,36,227,0.08)',
        glow: '0 0 0 4px rgba(106, 36, 227, 0.15)',
        card: '0 1px 2px rgba(17,24,39,0.04), 0 8px 24px rgba(17,24,39,0.05)',
        'card-hover': '0 4px 8px rgba(17,24,39,0.05), 0 16px 32px rgba(106,36,227,0.1)',
        fab: '0 8px 24px rgba(106, 36, 227, 0.35)',
        apple: '0 1px 2px rgba(17,24,39,0.03), 0 6px 16px rgba(17,24,39,0.04)',
        'apple-sidebar': '0 1px 3px rgba(17,24,39,0.05)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
