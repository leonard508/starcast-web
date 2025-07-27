// Temporarily comment out @emotion/react import to test if this is causing the context error
// import { Theme } from '@emotion/react'

export const theme = {
  colors: {
    primary: '#4a90e2',
    secondary: '#7c3aed',
    success: '#059669',
    danger: '#dc2626',
    warning: '#d97706',
    info: '#0891b2',
    
    // Greys
    grey: {
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
    },
    
    // Background
    background: '#e8e8e8',
    surface: '#ffffff',
    
    // Text
    text: {
      primary: '#374151',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    card: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    heading: ['Poppins', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
}

// Temporarily comment out the Theme interface extension
// declare module '@emotion/react' {
//   export interface Theme {
//     colors: {
//       primary: string
//       secondary: string
//       success: string
//       danger: string
//       warning: string
//       info: string
//       grey: {
//         [key: string]: string
//       }
//       background: string
//       surface: string
//       text: {
//         primary: string
//         secondary: string
//         tertiary: string
//       }
//     }
//     spacing: {
//       [key: string]: string
//     }
//     borderRadius: {
//       [key: string]: string
//     }
//     shadows: {
//       [key: string]: string
//     }
//     breakpoints: {
//       [key: string]: string
//     }
//     fonts: {
//       [key: string]: string[]
//     }
//     fontSizes: {
//       [key: string]: string
//     }
//     transitions: {
//       [key: string]: string
//     }
//   }
// }