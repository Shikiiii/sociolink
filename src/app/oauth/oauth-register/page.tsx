'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Sun,
  Moon,
  Shield,
  Zap
} from 'lucide-react'

const OAuthRegisterPage = () => {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<{
    token: string,
    provider: 'google' | 'discord'
  } | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  const isDark = theme === 'dark'

  useEffect(() => {
    setMounted(true)
    const token = searchParams.get('token')
    const provider = searchParams.get('provider') as 'google' | 'discord'

    if (token && provider) {
      setUserInfo({ token, provider })
    }
  }, [searchParams])

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (error) setError(null)
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { password, confirmPassword } = formData

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/
    if (!passwordRegex.test(password)) {
      setError('Password must be 8+ characters with at least one letter and number')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError(null)
    setIsLoading(true)
    
    try {
      const token = userInfo?.token
      const provider = userInfo?.provider
      if (!token) {
        setError('Missing OAuth token. Please try again.')
        setIsLoading(false)
        return
      }

      const res = await fetch('/api/auth/oauth/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token, provider })
      })

      if (res.ok) {
        router.push('/profile')
      } else {
        const data = await res.json()
        setError(data?.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if passwords match
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword

  // If no OAuth info, redirect back
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No OAuth information found</p>
          <Button onClick={() => router.push('/register')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Button>
        </div>
      </div>
    )
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
      <div className="flex items-center justify-center min-h-screen p-4">
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
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  sociolink
                </span>
              </div>
              
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                Almost there!
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Just set a secure password to complete your account
              </p>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              
              {/* Password Setup Form */}
              <form onSubmit={handleCompleteRegistration} className="space-y-4">
                
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Create Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
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
                  <p className="text-xs text-muted-foreground">
                    8+ characters with at least one letter and number
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 pr-16 ${
                        passwordsDontMatch ? 'border-red-500/50' : 
                        passwordsMatch ? 'border-green-500/50' : 
                        ''
                      }`}
                      required
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      <AnimatePresence>
                        {passwordsMatch && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <Check className="w-4 h-4 text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-accent/10"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
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
                  disabled={isLoading || formData.password.length < 8}
                  className="w-full h-12 font-medium text-white disabled:opacity-50"
                  style={{
                    backgroundColor: isDark ? '#60a5fa' : '#2563eb',
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Completing registration...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Complete registration
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Security note */}
              <div className="text-center text-xs text-muted-foreground p-3 rounded-xl border border-border">
                Your password will be securely encrypted and stored
              </div>
            </CardContent>
          </Card>

          {/* Back to registration */}
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/register')}
              className="text-muted-foreground hover:text-foreground rounded-md px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to registration
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-40">
        <Button
          onClick={handleThemeToggle}
          variant="outline"
          className="w-10 h-10 rounded-full"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}

export default OAuthRegisterPage