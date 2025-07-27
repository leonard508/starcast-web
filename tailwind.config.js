/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae6fd',
          300: '#7dd3fc',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        sand: {
          50: '#fefcf7',
          100: '#fef7e7',
          200: '#fdecc8',
          300: '#fbd896',
          500: '#f59e0b',
          600: '#d97706',
        },
        sage: {
          50: '#f7fdf7',
          100: '#ecfdf5',
          200: '#d1fae5',
          300: '#a7f3d0',
          500: '#10b981',
          600: '#059669',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
        },
        surface: {
          DEFAULT: '#ffffff',
          warm: '#fefcf7',
          variant: '#f8fafc',
        },
        'on-surface': {
          DEFAULT: '#1c1917',
          variant: '#57534e',
        }
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      }
    },
  },
  plugins: [],
}