'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  ArrowRight,
  Sparkles, 
  Wind, 
  Sun,
  Moon,
  Coffee,
  Zap
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

// Enhanced Neural Network - Fixed for SSR
const NeuralNetwork = ({ mouseX, mouseY, isDark, isVibrant }: { mouseX: any, mouseY: any, isDark: boolean, isVibrant: boolean }) => {
  const [mounted, setMounted] = useState(false)
  
  // Fixed nodes to prevent hydration mismatch
  const nodes = useMemo(() => [
    { id: 0, x: 20, y: 30, size: 3, connections: [1, 2] },
    { id: 1, x: 80, y: 20, size: 4, connections: [0, 3] },
    { id: 2, x: 60, y: 70, size: 2.5, connections: [0, 4] },
    { id: 3, x: 40, y: 80, size: 3.5, connections: [1, 4] },
    { id: 4, x: 70, y: 50, size: 3, connections: [2, 3] },
    { id: 5, x: 10, y: 60, size: 2, connections: [0] }
  ], [])

  // Move useTransform outside of conditional rendering
  const nodeX = useTransform(mouseX, [-1, 1], [-3, 3])
  const nodeY = useTransform(mouseY, [-1, 1], [-3, 3])

  useEffect(() => {
    setMounted(true)
  }, [])

  const getNodeColor = () => {
    if (isVibrant) {
      return isDark ? '#ff6b9d' : '#e91e63'
    }
    return isDark ? '#64b5f6' : '#2196f3'
  }

  if (!mounted) return null
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
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
                stroke={getNodeColor()}
                strokeWidth="1"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0.1, 0.4, 0.1]
                }}
                transition={{ 
                  duration: 4 + (connIndex * 0.5),
                  repeat: Infinity,
                  delay: connIndex * 0.8,
                  ease: "easeInOut"
                }}
              />
            )
          })
        )}
      </svg>

      {nodes.map((node) => {
        return (
          <motion.div
            key={node.id}
            className="absolute rounded-full"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: `${node.size}px`,
              height: `${node.size}px`,
              x: nodeX,
              y: nodeY,
              backgroundColor: getNodeColor(),
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + (node.id * 0.3),
              repeat: Infinity,
              delay: node.id * 0.4,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </div>
  )
}

const LandingPage = () => {
  const [username, setUsername] = useState('')
  const [isVibrant, setIsVibrant] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([])
  const [isHolding, setIsHolding] = useState(false)
  const [mounted, setMounted] = useState(false)
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const holdProgress = useSpring(0, { damping: 25, stiffness: 200 })

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 0.5)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 0.5)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const isDark = theme === 'dark'
  
  // More human content with personality
    const moods = useMemo(() => ({
    zen: {
        emoji: "🌱",
        greeting: "Hey there, fellow human",
        tagline: "One link. Zero chaos.",
        subtitle: "Keep it simple, keep it you",
        description: "Because your digital life doesn't need to be complicated. Just clean, focused connections.",
        placeholder: "yourname",
        cta: "Let's go →",
        colors: {
        primary: isDark ? '#60a5fa' : '#2563eb',
        secondary: isDark ? '#22d3ee' : '#0891b2'
        }
    },
    vibrant: {
        emoji: "⚡",
        greeting: "What's up, creative soul",
        tagline: "Link loud. Be bold.",
        subtitle: "Express yourself without limits",
        description: "Turn your link into a canvas. Bright, bold, and unapologetically you.",
        placeholder: "superstar",
        cta: "Hell yes! →",
        colors: {
        primary: isDark ? '#f472b6' : '#ec4899',
        secondary: isDark ? '#fb923c' : '#f97316'
        }
    }
    }), [isDark])

  const currentMood = isVibrant ? moods.vibrant : moods.zen

    const handleMoodChange = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsHolding(true)
    holdProgress.set(0)
    
    // Animate progress to 1 (spring will handle animation)
    holdProgress.set(1)
    
    holdTimerRef.current = setTimeout(() => {
        triggerMoodSwitch()
    }, 1200)
    }

    const handleMoodEnd = (event?: React.MouseEvent | React.TouchEvent) => {
    if (event) {
        event.preventDefault()
        event.stopPropagation()
    }
    if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current)
    }
    setIsHolding(false)
    holdProgress.set(0)
    }

  const triggerMoodSwitch = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    
    // Add ripple effect with deterministic position for first ripple
    const newRipple = {
      id: Date.now(),
      x: 50 + (Math.sin(Date.now() / 1000) * 20), // Deterministic but varied
      y: 50 + (Math.cos(Date.now() / 1000) * 20)
    }
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setIsVibrant(prev => !prev)
    }, 300)

    setTimeout(() => {
      setIsTransitioning(false)
      setIsHolding(false)
      holdProgress.set(0)
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  const handleGetStarted = () => {
    if (username.trim()) {
      // Add a little celebration ripple
      const celebrationRipple = {
        id: Date.now(),
        x: 50,
        y: 50
      }
      setRipples(prev => [...prev, celebrationRipple])
      
      setTimeout(() => {
        router.push(`/register?username=${username.trim()}`)
      }, 200)
    }
  }

  const { displayText: subtitleText } = useTypewriter(currentMood.subtitle, 60)

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      
      {/* Neural Network Background */}
      <NeuralNetwork 
        mouseX={mouseX} 
        mouseY={mouseY} 
        isDark={isDark} 
        isVibrant={isVibrant} 
      />

      {/* Mood Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${ripple.x}% ${ripple.y}%, ${currentMood.colors.primary} 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0, 2, 3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header with theme toggle */}
        <header className="p-6 flex justify-between items-center relative z-20">
          <motion.div 
            className="text-2xl font-bold"
            animate={{ 
              color: isVibrant ? currentMood.colors.primary : undefined,
              scale: isTransitioning ? 1.05 : 1 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            sociolink
          </motion.div>
          
          <Button
            onClick={() => {
              console.log('Theme button clicked!') // Debug log
              setTheme(isDark ? 'light' : 'dark')
            }}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/10 transition-colors relative z-30 pointer-events-auto"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-16">
          
          {/* Mood indicator */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mood-${isVibrant}`}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.5 }}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
              style={{
                background: isVibrant 
                  ? `linear-gradient(45deg, ${currentMood.colors.primary}, ${currentMood.colors.secondary})`
                  : undefined,
                backgroundClip: isVibrant ? 'text' : 'unset',
                WebkitBackgroundClip: isVibrant ? 'text' : 'unset',
                color: isVibrant ? 'transparent' : undefined,
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
              className="ml-1 w-0.5 h-6"
              style={{ backgroundColor: currentMood.colors.primary }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${isVibrant}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg text-muted-foreground max-w-md mb-12 leading-relaxed"
            >
              {currentMood.description}
            </motion.p>
          </AnimatePresence>

          {/* Input section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full max-w-md"
          >
            <div className="relative group">
              <div 
                className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"
                style={{
                  background: `linear-gradient(45deg, ${currentMood.colors.primary}, ${currentMood.colors.secondary})`
                }}
              />
              
              <div className="relative bg-card border rounded-xl p-2 backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="px-4 py-3 text-muted-foreground text-sm font-mono">
                    sociolink.app/
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
                    disabled={!username.trim()}
                    className="ml-2 rounded-lg px-6 transition-all duration-300"
                    style={{
                      backgroundColor: username.trim() ? currentMood.colors.primary : undefined,
                      color: username.trim() ? '#ffffff' : undefined
                    }}
                  >
                    {username.trim() ? currentMood.cta : 'Enter name'}
                  </Button>
                </div>
              </div>
            </div>
            
            <motion.p 
              className="mt-4 text-xs text-muted-foreground text-center"
              animate={{ opacity: username.trim() ? 1 : 0.5 }}
            >
              {username.trim() ? "Ready to claim your space? 🚀" : "Your digital home awaits"}
            </motion.p>
          </motion.div>
        </main>

        {/* Floating mood switcher */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="relative group pointer-events-auto">
            {/* Progress ring */}
            <svg 
              className="absolute inset-0 w-14 h-14 -rotate-90 transition-opacity duration-200 pointer-events-none"
              style={{ opacity: isHolding ? 1 : 0 }}
            >
              <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="1" fill="none" className="text-muted-foreground/20" />
              <motion.circle
                cx="28" cy="28" r="26"
                stroke={currentMood.colors.primary}
                strokeWidth="2"
                fill="none" 
                strokeLinecap="round"
                style={{ 
                  pathLength: holdProgress,
                  strokeDasharray: "0 1"
                }}
              />
            </svg>

            <Button
            onMouseDown={handleMoodChange}
            onMouseUp={handleMoodEnd}
            onMouseLeave={handleMoodEnd}
            onTouchStart={handleMoodChange}
            onTouchEnd={handleMoodEnd}
            className="w-14 h-14 rounded-full glass-card hover-lift stable-layout relative z-10"
            style={{
                borderColor: `${currentMood.colors.primary}20`
            }}
            >
            <motion.div
                animate={{ 
                rotate: isHolding ? 180 : 0,
                scale: isHolding ? 1.1 : 1 
                }}
                transition={{ duration: 0.3 }}
                style={{ color: currentMood.colors.primary }}
            >
                {isVibrant ? <Wind className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </motion.div>
            </Button>

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-popover border rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Hold to switch vibe
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage