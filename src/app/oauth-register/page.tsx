'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Link,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Sun,
  Moon,
  Shield
} from 'lucide-react'
import { FaGoogle, FaDiscord } from 'react-icons/fa'

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
    name: string
    email: string
    provider: 'google' | 'discord'
    avatar?: string
  } | null>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const isDarkMode = theme === 'dark'

  // Get OAuth info from URL params
  useEffect(() => {
    const name = searchParams.get('name')
    const email = searchParams.get('email')
    const provider = searchParams.get('provider') as 'google' | 'discord'
    const avatar = searchParams.get('avatar')

    if (name && email && provider) {
      setUserInfo({
        name,
        email,
        provider,
        avatar: avatar || undefined
      })
    }
  }, [searchParams])

  const handleThemeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log('Complete OAuth Registration:', { ...userInfo, password: formData.password })
      // Redirect to dashboard or login
      router.push('/dashboard')
    }, 2000)
  }

  // Check if passwords match
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword

  // If no OAuth info, redirect back
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No OAuth information found</p>
          <Button onClick={() => router.push('/register')}>
            Back to Registration
          </Button>
        </div>
      </div>
    )
  }

  const ProviderIcon = userInfo.provider === 'google' ? FaGoogle : FaDiscord
  const providerColor = userInfo.provider === 'google' ? 'text-red-500' : 'text-indigo-500'

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
              Complete your registration
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Set up a password to secure your account
            </p>
          </CardHeader>

          <CardContent className="space-y-6 px-6 pb-6">
            {/* OAuth User Info */}
            <div 
              className="flex items-center space-x-4 p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--themed-input-bg)',
                borderColor: 'var(--themed-input-border)',
              }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                {userInfo.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt={userInfo.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <ProviderIcon className={`w-5 h-5 ${providerColor}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {userInfo.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userInfo.email}
                </p>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <ProviderIcon className={`w-3 h-3 ${providerColor}`} />
                <span className="capitalize">{userInfo.provider}</span>
              </div>
            </div>

            {/* Password Setup Form */}
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm">
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
                    className="pl-10 pr-10 border text-foreground placeholder:text-muted-foreground/70"
                    style={{
                      backgroundColor: 'var(--themed-input-bg)',
                      borderColor: 'var(--themed-input-border)',
                    }}
                    required
                    minLength={8}
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
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground text-sm">
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
                    className={`pl-10 pr-16 border text-foreground placeholder:text-muted-foreground/70 ${
                      passwordsDontMatch ? 'border-red-500' : ''
                    } ${
                      passwordsMatch ? 'border-green-500' : ''
                    }`}
                    style={{
                      backgroundColor: 'var(--themed-input-bg)',
                      borderColor: passwordsDontMatch ? '#ef4444' : passwordsMatch ? '#10b981' : 'var(--themed-input-border)',
                    }}
                    required
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    {passwordsMatch && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                {passwordsDontMatch && (
                  <p className="text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !!passwordsDontMatch || formData.password.length < 8}
                className="w-full font-medium py-5 text-primary-foreground hover:scale-[1.01] transition-transform border-0 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Completing registration...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Complete registration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Security note */}
            <div 
              className="text-center text-xs text-muted-foreground p-3 rounded-lg border"
              style={{
                backgroundColor: 'var(--themed-input-bg)',
                borderColor: 'var(--themed-input-border)',
              }}
            >
              🔒 Your password will be securely encrypted and stored
            </div>
          </CardContent>
        </Card>

        {/* Back to registration */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/register')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to registration
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

export default OAuthRegisterPage