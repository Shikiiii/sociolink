'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Link,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react'

const ERRORS = {
    "email-taken": "Your email has already been taken by another account. Sorry for this.",
    "oauth-failed": "An unexpected error occured during the authentication process. If this issue persists, contact support.",
    "missing-code": "You're missing expected parameters. You shouldn't get this error unless the providers are facing issues, or you're messing with the authentication process.",
    "email-not-available": "You're missing expected parameters. You shouldn't get this error unless the providers are facing issues, or you're messing with the authentication process.",
    "unexpected-error": "Unexpected error happened. If this issue keeps happening, please contact support.",
}

const OAuthErrorPage = () => {
  const searchParams = useSearchParams()
  // take "error" from search params
  const errorKey = (searchParams.get('error') as keyof typeof ERRORS) || 'unexpected-error'
  const errorMessage = ERRORS[errorKey] || "Unexpected error happened. If this issue keeps happening, please contact support."

  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const isDarkMode = theme === 'dark'


  const handleThemeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }


  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex items-center justify-center p-4">

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border border-border shadow-sm">
          {/* Card Header */}
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: isDarkMode ? '#60a5fa' : '#2563eb',
                }}
              >
                <Link className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                SocioLink
              </span>
            </div>
            
            <CardTitle className="text-xl font-semibold text-foreground mb-2">
              An error occured during registration
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {errorMessage}
            </p>
          </CardHeader>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
                Go home
          </Button>
        </div>
      </motion.div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-40">
        <Button
          onClick={handleThemeToggle}
          variant="outline"
          className="w-10 h-10 rounded-full"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}

export default OAuthErrorPage