import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81'
        },
        primary: '#1F4DB7',
        surface: '#F7F9FC',
        success: '#17B26A',
        warning: '#F79009',
        danger: '#DC2626',
        muted: '#64748B'
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        xl: '12px'
      }
    }
  },
  plugins: [],
} satisfies Config