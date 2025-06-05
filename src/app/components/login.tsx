'use client'

import React, { useState, useMemo, useEffect } from 'react'
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
  Sun,
  Moon,
  Sparkles,
  Shield,
  LogIn
} from 'lucide-react'
import { FaGoogle, FaDiscord } from 'react-icons/fa'

// Enhanced Neural Network (matching register page)
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

// Floating particles
const FloatingParticles = ({ isDark }: { isDark: boolean }) => {
  const particles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      duration: Math.random() * 15 + 10
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
            y: [0, -20, 0],
            x: [0, Math.sin(particle.id) * 8, 0],
            opacity: [0.2, 0.6, 0.2],
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

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  const isDark = theme === 'dark'

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
    } catch (err) {
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
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LogIn className="w-7 h-7 text-white" />
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
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
                Welcome back
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Sign in to continue your journey
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
                  className="w-full glass-effect transition-all duration-300 group"
                  onClick={() => handleSocialLogin('google')}
                >
                  <FaGoogle className="w-4 h-4 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                  Continue with Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full glass-effect transition-all duration-300 group"
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
                  Or sign in with email
                </span>
              </motion.div>

              {/* Login Form */}
              <motion.form 
                onSubmit={handleLogin} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 glass-effect focus:ring-2 focus:ring-accent/20 transition-all duration-300"
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
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded"
                    style={{ 
                      accentColor: isDark ? '#60a5fa' : '#2563eb'
                    }}
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me for 30 days
                  </Label>
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
                  className="w-full h-12 font-medium text-white shadow-xl disabled:opacity-50 relative overflow-hidden group"
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
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </motion.form>

              {/* Sign up link */}
              <motion.div 
                className="text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <span className="text-muted-foreground">Don't have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-sm hover:underline"
                  style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  onClick={() => router.push('/register')}
                >
                  Sign up
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
              className="text-muted-foreground hover:text-foreground glass-effect rounded-full px-6 transition-all duration-300"
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

export default LoginPage