'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Link,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react'
import { FaGoogle, FaDiscord } from 'react-icons/fa'

// Simple Neural Network Background (less nodes, calmer)
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

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [error, setError] = useState<string | null>(null);

  const isDarkMode = theme === 'dark'

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
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
      });

      if (res.ok) {
        router.push('/profile');
      } else {
        const data = await res.json();
        setError(data?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
        setError('An unexpected error occurred. Please try again.');
    } finally {
        setIsLoading(false);
    }
  }

  const handleSocialLogin = (provider: string) => {
    router.push('/api/auth/oauth/oauth_' + provider);
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Simple Background */}
      <NeuralNetwork isDark={isDarkMode} />

      {/* Main Login Card */}
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
              Welcome back
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Sign in to your account
            </p>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border text-foreground hover:scale-[1.01] transition-transform"
                style={{
                  backgroundColor: 'var(--themed-input-bg)',
                  borderColor: 'var(--themed-input-border)',
                }}
                onClick={() => handleSocialLogin('google')}
              >
                <FaGoogle className="w-4 h-4 mr-3 text-red-500" />
                Continue with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border text-foreground hover:scale-[1.01] transition-transform"
                style={{
                  backgroundColor: 'var(--themed-input-bg)',
                  borderColor: 'var(--themed-input-border)',
                }}
                onClick={() => handleSocialLogin('discord')}
              >
                <FaDiscord className="w-4 h-4 mr-3 text-indigo-500" />
                Continue with Discord
              </Button>
            </div>

            {/* Separator */}
            <div className="relative">
              <Separator style={{ backgroundColor: 'var(--themed-input-border)' }} />
              <span 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs text-muted-foreground"
                style={{ backgroundColor: 'var(--themed-input-bg)' }}
              >
                Or with email
              </span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border text-foreground placeholder:text-muted-foreground/70"
                    style={{
                      backgroundColor: 'var(--themed-input-bg)',
                      borderColor: 'var(--themed-input-border)',
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border text-foreground placeholder:text-muted-foreground/70"
                    style={{
                      backgroundColor: 'var(--themed-input-bg)',
                      borderColor: 'var(--themed-input-border)',
                    }}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  style={{ color: 'var(--accent)' }}
                >
                  Forgot password?
                </Button>
              </div>

              {/* Error message display */}
              {error && (
                <p className="text-sm text-red-500 min-h-[1.5em]">{error}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-medium py-5 text-primary-foreground hover:scale-[1.01] transition-transform border-0"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign in
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                variant="link"
                className="p-0 h-auto font-medium text-sm"
                style={{ color: 'var(--accent)' }}
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
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </div>
      </motion.div>

      {/* Simple Theme Toggle */}

    </div>
  )
}

export default LoginPage