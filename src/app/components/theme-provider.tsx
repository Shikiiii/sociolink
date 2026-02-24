'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Sanitize stored theme value
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (stored && (stored.startsWith('{') || stored.startsWith('['))) {
        // Invalid theme value, reset to default
        localStorage.removeItem('theme')
      }
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}