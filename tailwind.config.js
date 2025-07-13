/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f1',
          100: '#feeee2',
          200: '#fcd9bf',
          300: '#f9bd8c',
          400: '#f5966e',
          500: '#d67d3e',
          600: '#c56d31',
          700: '#a5592a',
          800: '#864524',
          900: '#6d371f',
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
    },
  },
  plugins: [],
}