'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Link,
  Sun,
  Moon,
  LogOut,
  User,
  LucideLogIn
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    // get access_token from cookies, if its there and it isnt null, then setIsLoggedIn true
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

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleLogout = async () => {
    // ping api/auth/logout, POST request, include credentials
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/login')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const isDarkMode = theme === 'dark'

  return (
    <>
      {/* Header height spacer to push content down */}
      <div className="h-16" />
      
      <div
        className="fixed top-0 left-0 right-0 z-50 h-16"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence>
          {shouldShow && (
            <motion.header
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full backdrop-blur-xl border-b"
              style={{
                backgroundColor: 'var(--themed-input-bg)',
                borderColor: 'var(--themed-input-border)',
              }}
            >
              <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <motion.div 
                  className="flex items-center space-x-3 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/')}
                >
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
                    }}
                  >
                    <Link className="w-5 h-5 text-white" />
                  </div>
                  <span 
                    className="text-xl font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                  >
                    SocioLink
                  </span>
                </motion.div>

                {/* Right side controls */}
                <div className="flex items-center space-x-3">
                  {/* Theme Toggle */}
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

                  {/* Profile Avatar */}
                  <div className="flex items-center">
                    {isLoggedIn ? (
                      <>
                        <Button
                          onClick={handleProfileClick}
                          variant="ghost"
                          className="h-10 w-10 p-0 rounded-full hover:scale-105 transition-transform"
                        >
                          <Avatar className="w-10 h-10 border-2" style={{ borderColor: 'var(--themed-input-border)' }}>
                            <User className="w-4 h-4" />
                          </Avatar>
                        </Button>

                        {/* Logout Button */}
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="w-10 h-10 rounded-full border text-foreground hover:scale-105 transition-transform hover:text-red-500"
                          style={{
                            backgroundColor: 'var(--themed-input-bg)', 
                            borderColor: 'var(--themed-input-border)',
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex items-center">
                        <Button
                          onClick={handleLogin}
                          variant="ghost"
                          className="h-10 w-10 p-0 rounded-full hover:scale-105 transition-transform"
                        >
                          <Avatar className="w-10 h-10 border-2" style={{ borderColor: 'var(--themed-input-border)' }}>
                            <LucideLogIn className="w-4 h-4" />
                          </Avatar>
                        </Button>
                      </div>
                  )}
                  </div>
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