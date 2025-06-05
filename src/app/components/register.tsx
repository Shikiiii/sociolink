'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
  Sun,
  Moon,
  Sparkles,
  Wind,
  Shield,
  Zap
} from 'lucide-react'
import { FaGoogle, FaDiscord } from 'react-icons/fa'

// Enhanced Neural Network (similar to landing page)
const NeuralNetwork = ({ isDark }: { isDark: boolean }) => {
  const nodes = useMemo(() => [
    { id: 0, x: 15, y: 25, size: 2.5, connections: [1, 3] },
    { id: 1, x: 85, y: 15, size: 3, connections: [0, 2] },
    { id: 2, x: 70, y: 60, size: 2, connections: [1, 4] },
    { id: 3, x: 25, y: 75, size: 2.8, connections: [0, 4] },
    { id: 4, x: 60, y: 40, size: 2.2, connections: [2, 3] },
    { id: 5, x: 40, y: 20, size: 1.8, connections: [0] }
  ], [])

  const nodeColor = isDark ? '#64b5f6' : '#2196f3'
  const connectionColor = isDark ? 'rgba(100, 181, 246, 0.15)' : 'rgba(33, 150, 243, 0.1)'

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg className="w-full h-full">
        {nodes.map((node) =>
          node.connections.map((targetId, connIndex) => {
            const target = nodes[targetId]
            if (!target) return null
            
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={connectionColor}
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0, 0.4, 0]
                }}
                transition={{ 
                  duration: 6 + (connIndex * 0.8),
                  repeat: Infinity,
                  delay: connIndex * 1.2,
                  ease: "easeInOut"
                }}
              />
            )
          })
        )}
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
            backgroundColor: nodeColor,
            boxShadow: `0 0 ${node.size * 2}px ${nodeColor}40`,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + (node.id * 0.4),
            repeat: Infinity,
            delay: node.id * 0.6,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Floating particles for extra magic ✨
const FloatingParticles = ({ isDark }: { isDark: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 15
    })), []
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: isDark ? '#60a5fa' : '#3b82f6',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(particle.id) * 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.id * 0.5,
          }}
        />
      ))}
    </div>
  )
}

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
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const isDark = theme === 'dark'

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
    } catch (err) {
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      
      {/* Background Effects */}
      <NeuralNetwork isDark={isDark} />
      <FloatingParticles isDark={isDark} />
      
      {/* Theme Toggle */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full glass-effect hover:scale-110 transition-all duration-300"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md relative z-10"
        >
          
          {/* Glass Card */}
          <Card className="glass-effect border shadow-2xl backdrop-blur-xl overflow-hidden">
            
            {/* Animated Header */}
            <CardHeader className="text-center pb-6 relative">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
              
              {/* Logo with floating animation */}
              <motion.div
                className="flex items-center justify-center space-x-3 mb-6"
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${isDark ? '#60a5fa' : '#2563eb'}, ${isDark ? '#22d3ee' : '#0891b2'})`,
                  }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="w-7 h-7 text-white" />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
                <motion.span 
                  className="text-3xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${isDark ? '#60a5fa' : '#2563eb'}, ${isDark ? '#22d3ee' : '#0891b2'})`,
                  }}

                >
                  sociolink
                </motion.span>
              </motion.div>
              
              <motion.h1 
                className="text-2xl font-bold text-foreground mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Create your space
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Join creators building their digital presence
              </motion.p>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              
              {/* Social Login Buttons */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full glass-effect hover:scale-[1.02] transition-all duration-300 group"
                  onClick={() => handleSocialLogin('google')}
                >
                  <FaGoogle className="w-4 h-4 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                  Continue with Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full glass-effect hover:scale-[1.02] transition-all duration-300 group"
                  onClick={() => handleSocialLogin('discord')}
                >
                  <FaDiscord className="w-4 h-4 mr-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                  Continue with Discord
                </Button>
              </motion.div>

              {/* Separator */}
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Separator className="bg-border/50" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-xs text-muted-foreground bg-card">
                  Or create with email
                </span>
              </motion.div>

              {/* Register Form */}
              <motion.form 
                onSubmit={handleRegister} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 glass-effect focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      required
                    />
                  </div>
                  <motion.p 
                    className="text-xs text-muted-foreground"
                    animate={{ 
                      color: formData.username ? (isDark ? '#60a5fa' : '#2563eb') : undefined 
                    }}
                  >
                    sociolink.app/<span className="font-mono">{formData.username || 'username'}</span>
                  </motion.p>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 glass-effect focus:ring-2 focus:ring-accent/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="pl-10 pr-10 glass-effect focus:ring-2 focus:ring-accent/20 transition-all duration-300"
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
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className={`pl-10 pr-16 glass-effect focus:ring-2 transition-all duration-300 ${
                        passwordsDontMatch ? 'focus:ring-red-500/20 border-red-500/50' : 
                        passwordsMatch ? 'focus:ring-green-500/20 border-green-500/50' : 
                        'focus:ring-accent/20'
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

                {/* Terms Agreement */}
                <motion.div 
                  className="flex items-start space-x-3 p-4 rounded-xl glass-effect"

                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded"
                    style={{ 
                      accentColor: isDark ? '#60a5fa' : '#2563eb'
                    }}

                    whileTap={{ scale: 0.95 }}
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
                </motion.div>

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
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading || !agreedToTerms}
                    className="w-full h-12 font-medium text-white shadow-xl disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${isDark ? '#60a5fa' : '#2563eb'}, ${isDark ? '#22d3ee' : '#0891b2'})`,
                    }}
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Creating your account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center group-hover:gap-3 gap-2 transition-all">
                        <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Create account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Sign in link */}
              <motion.div 
                className="text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <span className="text-muted-foreground">Already have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-sm hover:underline"
                  style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  onClick={() => router.push('/login')}
                >
                  Sign in
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Back to home */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="text-muted-foreground hover:text-foreground glass-effect rounded-full px-6 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage