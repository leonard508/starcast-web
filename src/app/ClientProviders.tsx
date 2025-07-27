'use client'

// Temporarily remove ThemeProvider to test if Emotion is causing the context error
// import { ThemeProvider } from '@/components/providers/ThemeProvider'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>
} 