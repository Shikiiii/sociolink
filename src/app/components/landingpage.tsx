'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Sparkles, 
  Wind, 
  Sun
} from 'lucide-react'

// Smoother typewriter with natural pauses
const useTypewriter = (text: string, speed = 80) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const char = text[currentIndex]
      const isPunctuation = ['.', ',', '!', '?'].includes(char)
      const delay = isPunctuation ? speed * 3 : speed + Math.random() * 40
      
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + char)
        setCurrentIndex(prev => prev + 1)
      }, delay)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed])

  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return { displayText, isComplete }
}

const LandingPage = () => {
  const [username, setUsername] = useState('')
  const [isVibrant, setIsVibrant] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loggedInUsername, setLoggedInUsername] = useState<string>('')
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(false)
  
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()

  console.log('Current state:', { isLoggedIn, loggedInUsername }); // Add this line

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'
  
  // More human content with personality
    const moods = useMemo(() => ({
    zen: {
        emoji: "🌱",
        greeting: isLoggedIn ? `Welcome back, ${loggedInUsername}` : "Hey there, fellow human",
        tagline: "One link. Zero chaos.",
        subtitle: isLoggedIn ? "Your space awaits" : "Keep it simple, keep it you",
        description: isLoggedIn 
        ? "Ready to view your profile page?" 
        : "Because your digital life doesn't need to be complicated. Just clean, focused connections.",
        placeholder: "yourname",
        cta: isLoggedIn ? "View Profile →" : "Let's go →",
        colors: {
        primary: isDark ? '#60a5fa' : '#2563eb',
        secondary: isDark ? '#22d3ee' : '#0891b2'
        }
    },
    vibrant: {
        emoji: "⚡",
        greeting: isLoggedIn ? `What's up, ${loggedInUsername}` : "What's up, creative soul",
        tagline: "Link loud. Be bold.",
        subtitle: isLoggedIn ? "Time to shine bright" : "Express yourself without limits",
        description: isLoggedIn
        ? "Check out how awesome your profile looks!"
        : "Turn your link into a canvas. Bright, bold, and unapologetically you.",
        placeholder: "superstar",
        cta: isLoggedIn ? "See My Profile! →" : "Hell yes! →",
        colors: {
        primary: isDark ? '#f472b6' : '#ec4899',
        secondary: isDark ? '#fb923c' : '#f97316'
        }
    }
    }), [isDark, isLoggedIn, loggedInUsername])

  const currentMood = isVibrant ? moods.vibrant : moods.zen

  // Check if user is logged in by looking for access_token cookie
  useEffect(() => {
  console.log('Checking auth status...'); // Debug log
  
  if (typeof document !== "undefined") {
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1]

      // decode only the payload of the access token, it should contain user_name, use setLoggedInUsername
      if (accessToken) {
        try {
          // JWT format: header.payload.signature
          const payload = accessToken.split('.')[1]
          if (payload) {
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
            if (decoded && decoded.user_name) {
              setLoggedInUsername(decoded.user_name)
              setIsLoggedIn(true)
              console.log('User logged in as:', decoded.user_name)
            } else {
              setIsLoggedIn(false)
              setLoggedInUsername('')
              console.log('No user_name in token payload')
            }
          } else {
            setIsLoggedIn(false)
            setLoggedInUsername('')
            console.log('No payload in access token')
          }
        } catch (e) {
          setIsLoggedIn(false)
          setLoggedInUsername('')
          console.error('Failed to decode access token', e)
        }
      } else {
        setIsLoggedIn(false)
        setLoggedInUsername('')
        console.log('No access token found')
      }
    } else {
      setIsLoggedIn(false)
      console.log('User not logged in'); // Debug log
    }
  }, [])

  // Debounce username check for availability (only when not logged in)
  useEffect(() => {
    if (isLoggedIn || !username.trim()) {
      setIsUsernameAvailable(false)
      return
    }
    const handler = setTimeout(() => {
      fetch(`/api/check_username?username=${encodeURIComponent(username.trim())}`)
        .then(res => res.json())
        .then(data => {
          setIsUsernameAvailable(data.status === "Available")
          if (data.status === 'Not available') {
            currentMood.cta = 'Taken.'
          } else {
            currentMood.cta = currentMood.emoji === "🌱" ? "Let's go →" : "Hell yes! →"
          }
        })
        .catch(() => setIsUsernameAvailable(false))
    }, 300)
    return () => clearTimeout(handler)
  }, [username, isLoggedIn, currentMood])


  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleMoodSwitch = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setIsVibrant(prev => !prev)
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
  }

const handleGetStarted = () => {
  console.log('handleGetStarted called', { isLoggedIn, loggedInUsername });
  
  if (isLoggedIn) {    
    router.push(`/p/${loggedInUsername}`)
  } else if (username.trim()) {
    router.push(`/register?username=${username.trim()}`)
  } else {
    console.log('No action taken - user not logged in and no username entered');
  }
}

  const { displayText: subtitleText } = useTypewriter(currentMood.subtitle, 60)

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-background">
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="p-6 flex justify-between items-center">
            <div className="text-2xl font-bold">sociolink</div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="w-5 h-5" />
            </Button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-16">
            <div className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              One link. Zero chaos.
            </div>
          </main>
        </div>
      </div>
    )
  }

return (
    <div className="relative overflow-hidden bg-background">

      {/* Background effects */}
      <div className="absolute inset-0 opacity-[0.4]" style={{
        backgroundImage: 'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
        backgroundSize: '64px 64px'
      }} />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${currentMood.colors.primary}08` }} />
      <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: `${currentMood.colors.secondary}08` }} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-16">
          
          {/* Mood indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mood-${isVibrant}-${isLoggedIn}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8 flex items-center gap-3"
            >
              <span className="text-3xl">{currentMood.emoji}</span>
              <span className="text-lg text-muted-foreground font-medium">
                {currentMood.greeting}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Main heading */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${isVibrant}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
              style={{
                color: isVibrant ? currentMood.colors.primary : undefined,
              }}
            >
              {currentMood.tagline}
            </motion.h1>
          </AnimatePresence>

          {/* Animated subtitle */}
          <motion.div
            className="text-xl md:text-2xl text-muted-foreground mb-8 h-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {subtitleText}
            <motion.span
              className="ml-1 w-0.5 h-6 bg-muted-foreground/50"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${isVibrant}-${isLoggedIn}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="text-lg text-muted-foreground max-w-md mb-12 leading-relaxed"
            >
              {currentMood.description}
            </motion.p>
          </AnimatePresence>

          {/* Input section or Welcome back section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md"
          >
          <AnimatePresence mode="wait">
            {isLoggedIn ? (
              <motion.div
                key="logged-in"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-sm text-muted-foreground font-mono">
                      sociolink.app/
                    </span>
                    <span className="text-lg font-bold ml-1" style={{ color: currentMood.colors.primary }}>
                      {loggedInUsername}
                    </span>
                  </div>
                  <Button
                    onClick={handleGetStarted}
                    className="w-full py-3 text-white font-medium"
                    style={{
                      backgroundColor: currentMood.colors.primary,
                    }}
                  >
                    {currentMood.cta}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="not-logged-in"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="bg-card border border-border rounded-xl p-2">
                  <div className="flex items-center">
                    <span className="px-4 py-3 text-muted-foreground text-sm font-mono">
                      sociolink.app/p/
                    </span>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGetStarted()}
                      placeholder={currentMood.placeholder}
                      className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 placeholder:text-muted-foreground/50"
                    />
                    <Button
                      onClick={handleGetStarted}
                      disabled={!username.trim() || isUsernameAvailable === false}
                      className="ml-2 px-6"
                      style={{
                        backgroundColor: !username.trim()
                          ? undefined
                          : isUsernameAvailable === false
                            ? '#ef4444'
                            : currentMood.colors.primary,
                        color: username.trim() ? '#ffffff' : undefined
                      }}
                    >
                      {username.trim() ? currentMood.cta : 'Enter name'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
          
          <motion.p 
            className="mt-4 text-xs text-muted-foreground text-center"
            animate={{ opacity: isLoggedIn || username.trim() ? 1 : 0.5 }}
          >
            {isLoggedIn 
              ? "View your profile and see how it looks to visitors" 
              : username.trim() 
              ? "Ready to claim your space?" 
              : "Your digital home awaits"
            }
          </motion.p>
        </main>

        {/* Mood switcher - simple toggle */}
        <motion.div
          className="fixed bottom-20 right-8 z-[9999]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={handleMoodSwitch}
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-border/60 bg-card/80 backdrop-blur-sm hover:bg-accent/10 transition-colors"
            style={{
              borderColor: `${currentMood.colors.primary}30`,
              color: currentMood.colors.primary,
            }}
          >
            {isVibrant ? (
              <Wind className="w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage