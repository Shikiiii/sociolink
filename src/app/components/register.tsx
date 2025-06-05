'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Link,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Sun,
  Moon
} from 'lucide-react'
import { FaGoogle, FaDiscord } from 'react-icons/fa'

// Simple Neural Network Background (same as login)
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
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [error, setError] = useState<string | null>(null);

  const isDarkMode = theme === 'dark'

  // Set username from URL params on mount
  useEffect(() => {
    const usernameFromUrl = searchParams.get('username')
    if (usernameFromUrl) {
      setFormData(prev => ({
        ...prev,
        username: usernameFromUrl
      }))
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { username, email, password, confirmPassword } = formData;

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError('Invalid username format.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, less than 100, and contain at least one letter and one number.');
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);

    setIsLoading(true)
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
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

  // Check if passwords match
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
  const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Simple Background */}
      <NeuralNetwork isDark={isDarkMode} />

      {/* Main Register Card */}
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
              Create your account
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Join thousands of creators sharing their links
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
                Or create with email
              </span>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground text-sm">
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
                    className="pl-10 border text-foreground placeholder:text-muted-foreground/70"
                    style={{
                      backgroundColor: 'var(--themed-input-bg)',
                      borderColor: 'var(--themed-input-border)',
                    }}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be your unique link: sociolink.com/{formData.username || 'username'}
                </p>
              </div>

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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground text-sm">
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
              </div>

              {/* Terms agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm"
                    style={{ color: 'var(--accent)' }}
                  >
                    Terms of Service
                  </Button>
                  {' '}and{' '}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-sm"
                    style={{ color: 'var(--accent)' }}
                  >
                    Privacy Policy
                  </Button>
                </label>
              </div>

              {/* Error message display */}
              {error && (
                <p className="text-sm text-red-500 min-h-[1.5em]">{error}</p>
              )}
              <Button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full font-medium py-5 text-primary-foreground hover:scale-[1.01] transition-transform border-0 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Create account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Sign in link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Button
                variant="link"
                className="p-0 h-auto font-medium text-sm"
                style={{ color: 'var(--accent)' }}
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
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Button>
        </div>
      </motion.div>

    </div>
  )
}

export default RegisterPage