'use client'

import React, { useMemo, useState } from 'react'
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

// Simple Neural Network Background (same as login/register)
const NeuralNetwork = ({ isDark }: { isDark: boolean }) => {
  const nodes = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
    })), []
  )

  const nodeColor = isDark ? 'oklch(0.7 0.1 220)' : 'oklch(0.6 0.15 200)'
  const connectionColor = isDark ? 'oklch(0.7 0.1 220 / 0.1)' : 'oklch(0.6 0.15 200 / 0.08)'

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <svg className="w-full h-full">
        {/* Simple static connections */}
        {nodes.slice(0, 3).map((node, i) => {
          const target = nodes[i + 1] || nodes[0]
          return (
            <line
              key={`connection-${i}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke={connectionColor}
              strokeWidth="1"
              opacity={0.3}
            />
          )
        })}
      </svg>

      {/* Static nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute rounded-full opacity-40"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            backgroundColor: nodeColor,
            boxShadow: `0 0 ${node.size}px ${nodeColor}`,
          }}
        />
      ))}
    </div>
  )
}

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
  const error = (searchParams.get('error') as keyof typeof ERRORS) || 'unexpected-error'

  const [errorMessage, setErrorMessage] = useState<string>(ERRORS[error] || "Unexpected error happened. If this issue keeps happening, please contact support.");

  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const isDarkMode = theme === 'dark'


  const handleThemeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }


  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Simple Background */}
      <NeuralNetwork isDark={isDarkMode} />

      {/* Main OAuth Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card 
          className="backdrop-blur-xl border shadow-xl"
          style={{
            backgroundColor: 'var(--themed-input-bg)',
            borderColor: 'var(--themed-input-border)',
          }}
        >
          {/* Card Header */}
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
                }}
              >
                <Link className="w-6 h-6 text-white" />
              </div>
              <span 
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
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

      {/* Simple Theme Toggle */}
      <div className="fixed top-6 right-6 z-40">
        <Button
          onClick={handleThemeToggle}
          className="w-10 h-10 rounded-full border text-foreground hover:scale-105 transition-transform"
          style={{
            backgroundColor: 'var(--themed-input-bg)', 
            borderColor: 'var(--themed-input-border)',
          }}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}

export default OAuthErrorPage