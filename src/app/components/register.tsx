'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Zap
} from 'lucide-react'
import { FaGoogle, FaDiscord } from 'react-icons/fa'

const RegisterPage = () => {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [mounted, setMounted] = useState(false)
  // track which field is currently focused (used for UI effects)
  const [focusedField, setFocusedField] = useState<'username' | 'email' | 'password' | 'confirmPassword' | null>(null)
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  useEffect(() => {
    setMounted(true)
    const usernameFromUrl = searchParams.get('username')
    if (usernameFromUrl) {
      setFormData(prev => ({ ...prev, username: usernameFromUrl }))
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null) // Clear error on input change
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { username, email, password, confirmPassword } = formData

    // Validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    if (!usernameRegex.test(username)) {
      setError('Username must be 3-20 characters (letters, numbers, underscore only)')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })

      if (res.ok) {
        router.push('/profile')
      } else {
        const data = await res.json()
        setError(data?.error || 'Registration failed. Please try again.')
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

  // Password validation indicators
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword

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
      <div className="flex items-center justify-center min-h-screen p-4 pt-24 md:pt-4">
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
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Create your space
              </h1>
              <p className="text-muted-foreground text-sm">
                Join creators building their digital presence
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
                  Or create with email
                </span>
              </div>

              {/* Register Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 ${focusedField === 'username' ? 'ring-2 ring-indigo-500' : ''}`}
                      required
                    />
                  </div>
                    <p className="text-xs text-muted-foreground">
                    {typeof window !== 'undefined' && (
                      <>
                      {window.location.origin}/p/
                      <span className="font-mono">{formData.username || 'username'}</span>
                      </>
                    )}
                    </p>
                </div>

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
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 ${focusedField === 'email' ? 'ring-2 ring-indigo-500' : ''}`}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 pr-10 ${focusedField === 'password' ? 'ring-2 ring-indigo-500' : ''}`}
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 pr-16 ${
                        passwordsDontMatch ? 'border-red-500/50' : 
                        passwordsMatch ? 'border-green-500/50' : 
                        ''
                      } ${focusedField === 'confirmPassword' ? 'ring-2 ring-indigo-500' : ''}`}
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

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3 p-4 rounded-xl border border-border">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded"
                    style={{ 
                      accentColor: isDark ? '#60a5fa' : '#2563eb'
                    }}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    I agree to the{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm font-medium hover:underline"
                      style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                    >
                      Terms of Service
                    </Button>
                    {' '}and{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm font-medium hover:underline"
                      style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                    >
                      Privacy Policy
                    </Button>
                  </label>
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
                  disabled={isLoading || !agreedToTerms}
                  className="w-full h-12 font-medium text-white disabled:opacity-50"
                  style={{
                    backgroundColor: isDark ? '#60a5fa' : '#2563eb',
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      Creating your account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Create account
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Sign in link */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-sm hover:underline"
                  style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  onClick={() => router.push('/login')}
                >
                  Sign in
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

export default RegisterPage