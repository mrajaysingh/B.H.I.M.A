/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'typing': 'typing 1.2s steps(3) infinite',
      },
      keyframes: {
        typing: {
          '0%, 100%': { content: "''" },
          '25%': { content: "'.'" },
          '50%': { content: "'..'" },
          '75%': { content: "'...'" },
        },
      },
      boxShadow: {
        'inner-md': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};