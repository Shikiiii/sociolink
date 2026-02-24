'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { 
  Sun,
  Moon,
  LogOut,
  User,
  LogIn
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const router = useRouter()

  // Fix hydration issue
  useEffect(() => {
    setMounted(true)
    
    // Check login status
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1]

    if (accessToken && accessToken !== 'null') {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlHeader)
    return () => window.removeEventListener('scroll', controlHeader)
  }, [lastScrollY])

  const shouldShow = isVisible || isHovering
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/login')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="h-14" />
  }

  return (
    <>
      {/* Header height spacer */}
      <div className="h-14" />
      
      <div
        className="fixed top-0 left-0 right-0 z-50 h-14"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence>
          {shouldShow && (
            <motion.header
              initial={{ y: -56, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -56, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full border-b border-border bg-background"
            >
              <div className="p-6 flex justify-between items-center relative z-20">
                
                {/* Logo - matching landing page exactly */}
                <div 
                  className="text-2xl font-bold cursor-pointer"
                  onClick={() => router.push('/')}
                >
                  sociolink
                </div>

                {/* Right side controls */}
                <div className="flex items-center space-x-2">
                  
                  {/* Theme Toggle */}
                  <Button
                    onClick={handleThemeToggle}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-accent/10 transition-colors relative z-30 pointer-events-auto"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </Button>

                  {/* Auth Section */}
                  {isLoggedIn ? (
                    <div className="flex items-center space-x-1">
                      {/* Profile Button */}
                      <Button
                        onClick={handleProfileClick}
                        variant="ghost"
                        size="sm"
                        className="w-9 h-9 p-0 rounded-full transition-colors"
                      >
                        <Avatar className="w-7 h-7 border border-border">
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </Avatar>
                      </Button>

                      {/* Logout Button */}
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="w-9 h-9 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleLogin}
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2 h-9 px-3 transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="text-sm font-medium">Sign in</span>
                    </Button>
                  )}
                </div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Header