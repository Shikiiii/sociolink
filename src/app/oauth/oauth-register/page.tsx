'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
  Sparkles,
  Zap
} from 'lucide-react'

// Enhanced Neural Network (matching your other pages)
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

// Floating particles for extra magic
const FloatingParticles = ({ isDark }: { isDark: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <p className="text-muted-foreground mb-4">No OAuth information found</p>
          <Button onClick={() => router.push('/register')} className="glass-effect">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Button>
        </motion.div>
      </div>
    )
  }

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
              >
                  <motion.div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${isDark ? '#60a5fa' : '#2563eb'}, ${isDark ? '#22d3ee' : '#0891b2'})`,
                    }}
                  >
                  <Sparkles className="w-7 h-7 text-white" />
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-2xl font-bold text-foreground mb-2">
                  Almost there!
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Just set a secure password to complete your account
                </p>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              
              {/* Password Setup Form */}
              <motion.form 
                onSubmit={handleCompleteRegistration} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Create Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 glass-effect focus:ring-2 focus:ring-accent/20 transition-all duration-300"
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
                  <div className="relative group">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
                    disabled={isLoading || formData.password.length < 8}
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
                        Completing registration...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center group-hover:gap-3 gap-2 transition-all">
                        <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Complete registration
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              {/* Security note */}
              <motion.div 
                className="text-center text-xs text-muted-foreground p-3 rounded-xl glass-effect border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                🔒 Your password will be securely encrypted and stored
              </motion.div>
            </CardContent>
          </Card>

          {/* Back to registration */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="ghost"
              onClick={() => router.push('/register')}
              className="text-muted-foreground hover:text-foreground glass-effect rounded-full px-6 hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to registration
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Theme Toggle - Positioned like your other pages */}
      <motion.div 
        className="fixed top-6 right-6 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", damping: 20 }}
      >
        <Button
          onClick={handleThemeToggle}
          className="w-12 h-12 rounded-full glass-effect border shadow-lg hover:scale-105 transition-all duration-300"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}

export default OAuthRegisterPage