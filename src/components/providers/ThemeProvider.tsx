'use client'

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { theme } from '@/lib/theme'
import { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <EmotionThemeProvider theme={theme}>
      {children}
    </EmotionThemeProvider>
  )
}