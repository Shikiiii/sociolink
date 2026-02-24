'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Shield,
  LogIn
} from 'lucide-react'
import { FaGoogle, FaDiscord } from 'react-icons/fa'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (res.ok) {
        router.push('/profile')
      } else {
        const data = await res.json()
        setError(data?.error || 'Login failed. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    router.push(`/api/auth/oauth/oauth_${provider}`)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          
          {/* Card */}
          <Card className="border border-border shadow-sm overflow-hidden">
            
            {/* Header */}
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: isDark ? '#60a5fa' : '#2563eb' }}
                >
                  <LogIn className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  sociolink
                </span>
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to continue your journey
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('google')}
                >
                  <FaGoogle className="w-4 h-4 mr-3 text-red-500" />
                  Continue with Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin('discord')}
                >
                  <FaDiscord className="w-4 h-4 mr-3 text-indigo-500" />
                  Continue with Discord
                </Button>
              </div>

              {/* Separator */}
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-xs text-muted-foreground bg-card">
                  Or sign in with email
                </span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-xs hover:underline"
                      style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent/10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center space-x-2"
                    >
                      <Shield className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 font-medium text-white disabled:opacity-50"
                  style={{
                    backgroundColor: isDark ? '#60a5fa' : '#2563eb',
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Sign up link */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don&apos;t have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-sm hover:underline"
                  style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  onClick={() => router.push('/register')}
                >
                  Sign up
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground rounded-md px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage