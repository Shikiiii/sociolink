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
  Moon
} from 'lucide-react'

// Typewriter hook
const useTypewriter = (text: string, speed = 100, delay = 0) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, currentIndex === 0 ? delay : speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, text, speed, delay])

  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
    setIsComplete(false)
  }, [text])

  return { displayText, isComplete }
}

// Neural Network Particles Component
const NeuralNetwork = ({ mouseX, mouseY, isDark, isVibrant }: { mouseX: any, mouseY: any, isDark: boolean, isVibrant: boolean }) => {
  const nodes = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      connections: Array.from({ length: Math.random() * 3 + 1 }, () => Math.floor(Math.random() * 12))
    })), []
  )

  const nodeColor = isDark 
    ? (isVibrant ? 'var(--accent)' : 'oklch(0.7 0.1 220)')
    : (isVibrant ? 'var(--accent)' : 'oklch(0.6 0.15 200)')

  const connectionColor = isDark
    ? (isVibrant ? 'var(--accent)/30' : 'oklch(0.7 0.1 220 / 0.2)')
    : (isVibrant ? 'var(--accent)/25' : 'oklch(0.6 0.15 200 / 0.15)')

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <svg className="w-full h-full">
        {/* Neural connections */}
        {nodes.map((node) =>
          node.connections.map((targetId, connIndex) => {
            const target = nodes[targetId]
            if (!target || targetId === node.id) return null
            
            return (
              <motion.line
                key={`${node.id}-${targetId}-${connIndex}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={connectionColor}
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            )
          })
        )}
      </svg>

      {/* Neural nodes */}
      {nodes.map((node) => {
        const nodeX = useTransform(mouseX, [-1, 1], [node.x - 2, node.x + 2])
        const nodeY = useTransform(mouseY, [-1, 1], [node.y - 2, node.y + 2])
        
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
              backgroundColor: nodeColor,
              boxShadow: `0 0 ${node.size * 2}px ${nodeColor}`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        )
      })}
    </div>
  )
}

// Simplified geometric patterns for depth
const GeometricPatterns = ({ isDark, isVibrant }: { isDark: boolean, isVibrant: boolean }) => {
  const patterns = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 100,
      rotation: Math.random() * 360,
      opacity: Math.random() * 0.03 + 0.01,
    })), []
  )

  const patternColor = isDark
    ? (isVibrant ? 'var(--accent)' : 'oklch(0.8 0.05 220)')
    : (isVibrant ? 'var(--accent)' : 'oklch(0.5 0.1 200)')

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 -z-20">
      {patterns.map((pattern) => (
        <motion.div
          key={pattern.id}
          className="absolute"
          style={{
            left: `${pattern.x}%`,
            top: `${pattern.y}%`,
            width: `${pattern.size}px`,
            height: `${pattern.size}px`,
            opacity: pattern.opacity,
          }}
          animate={{
            rotate: [pattern.rotation, pattern.rotation + 180],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25 + pattern.id * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div 
            className="w-full h-full rounded-full border"
            style={{
              borderColor: `${patternColor}`,
              borderWidth: '1px',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

const LandingPage = () => {
  const [username, setUsername] = useState('')
  const [isVibrantPersonality, setIsVibrantPersonality] = useState(false) // Personality state (independent of theme)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [circleTransition, setCircleTransition] = useState({ active: false, x: 0, y: 0 })
  const [isHolding, setIsHolding] = useState(false)
  const holdTimerRef = useRef<NodeJS.Timeout>()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const holdProgress = useSpring(0, { damping: 20, stiffness: 100 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const isDarkMode = theme === 'dark'
  
  // Theme + Personality combinations
  const themeConfig = useMemo(() => ({
    name: `${isDarkMode ? 'Dark' : 'Light'} ${isVibrantPersonality ? 'Vibrant' : 'Zen'}`,
    personalityIcon: isVibrantPersonality ? Sparkles : Wind,
    themeIcon: isDarkMode ? Moon : Sun,
  }), [isDarkMode, isVibrantPersonality])

  const oppositePersonalityName = isVibrantPersonality ? 'Zen' : 'Vibrant'

  // Personality change handler (hold to switch personality, not theme)
  const handlePersonalityChangeStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault()
    setIsHolding(true)
    holdProgress.set(0)
    
    const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX
    const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY
    
    setCircleTransition({ active: true, x: clientX, y: clientY })
    holdProgress.set(1, { duration: 0.8, ease: "linear" })
    holdTimerRef.current = setTimeout(() => triggerPersonalityTransition(), 800)
  }

  const handlePersonalityChangeEnd = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    setIsHolding(false)
    holdProgress.set(0)
    if (!isTransitioning) setCircleTransition(prev => ({ ...prev, active: false }))
  }

  const triggerPersonalityTransition = () => {
    if(isTransitioning) return
    setIsTransitioning(true)
    
    setTimeout(() => {
      setIsVibrantPersonality(prev => !prev) // Toggle personality
    }, 400)

    setTimeout(() => {
      setIsTransitioning(false)
      setCircleTransition({ active: false, x: 0, y: 0 })
      setIsHolding(false)
      holdProgress.set(0)
    }, 800)
  }

  // Quick theme toggle (separate from personality)
  const handleThemeToggle = () => {
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  const handleGetStarted = () => {
    if (username.trim()) router.push(`/register?username=${username.trim()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGetStarted()
  }
  
  // Content based on personality (works in both light and dark themes)
  const content = useMemo(() => ({
    zen: {
      badge: "🧘‍♀️ Your Serene Space",
      title: "One Link, Calmly Connected.",
      highlight: "Simplify Your Digital Presence.",
      description: "A tranquil, focused platform to unify your online identity with elegance and ease.",
    },
    vibrant: {
      badge: "🎉 Express Your Spark",
      title: "Link Loud, Live Vibrant.",
      highlight: "Ignite Your Online Persona.",
      description: "Unleash your creativity with a dynamic link platform that bursts with personality.",
    }
  }), [])

  const currentContent = isVibrantPersonality ? content.vibrant : content.zen
  const { displayText: highlightText } = useTypewriter(currentContent.highlight, 70, 300)

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Neural Network Background */}
      <NeuralNetwork 
        mouseX={mouseX} 
        mouseY={mouseY} 
        isDark={isDarkMode} 
        isVibrant={isVibrantPersonality} 
      />
      <GeometricPatterns isDark={isDarkMode} isVibrant={isVibrantPersonality} />

      {/* Personality Circle Transition */}
      <AnimatePresence>
        {circleTransition.active && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50 rounded-full"
            style={{
              left: circleTransition.x,
              top: circleTransition.y,
              transform: 'translate(-50%, -50%)',
              background: 'var(--accent)',
            }}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ 
              width: isTransitioning ? '300vmax' : isHolding ? '150px' : '80px',
              height: isTransitioning ? '300vmax' : isHolding ? '150px' : '80px',
              opacity: isTransitioning ? 1 : isHolding ? 0.7 : 0.3,
            }}
            exit={{ width: 0, height: 0, opacity: 0 }}
            transition={{ duration: isTransitioning ? 0.8 : 0.3, ease: [0.23, 1, 0.32, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={`content-${themeConfig.name}`}
          className="relative z-10 flex flex-1 flex-col items-center justify-center text-center p-4 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 20 : 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
            className="mb-6"
          >
            <div
              className="px-5 py-2 text-sm sm:text-base font-medium rounded-full backdrop-blur-sm border"
              style={{
                backgroundColor: 'var(--hero-badge-bg)',
                borderColor: 'var(--hero-badge-border)',
                color: 'var(--foreground)',
                boxShadow: `0 0 15px var(--glow-color-themed)`,
              }}
            >
              {currentContent.badge}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 120, damping: 20 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-foreground"
            style={{
              textShadow: `0 0 20px var(--glow-color-themed)`,
            }}
          >
            {currentContent.title}
          </motion.h1>
          
          {/* Highlight Text */}
          <motion.h2
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 bg-clip-text text-transparent min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            <span className="relative">
              {highlightText}
              <motion.span
                className="absolute -right-1 top-0 w-0.5 h-full"
                style={{ backgroundColor: 'var(--accent)' }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "mirror" }}
              />
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-md sm:text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed text-muted-foreground"
          >
            {currentContent.description}
          </motion.p>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 1.3 }}
            className="w-full max-w-md mx-auto mb-12"
          >
            <div 
              className="relative rounded-xl shadow-xl p-1.5 backdrop-blur-md border"
              style={{
                backgroundColor: 'var(--themed-input-bg)',
                borderColor: 'var(--themed-input-border)',
                boxShadow: `0 0 30px var(--glow-color-themed)`,
              }}
            >
              <div className="flex items-center">
                <span className="px-3 py-3 text-sm sm:text-base whitespace-nowrap font-medium text-muted-foreground">
                  sociolink.app/
                </span>
                <Input
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-0 bg-transparent text-md sm:text-lg placeholder-opacity-70 focus-visible:ring-0 focus-visible:ring-offset-0 py-3 font-medium text-foreground"
                />
                <Button
                  onClick={handleGetStarted}
                  disabled={!username.trim()}
                  className="rounded-lg px-4 py-3 sm:px-5 sm:py-3.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold text-sm sm:text-base shadow-md border-0 m-1 text-primary-foreground"
                  style={{
                    backgroundImage: username.trim() ? `linear-gradient(135deg, var(--accent-gradient-start) 0%, var(--accent-gradient-end) 100%)` : 'none',
                    backgroundColor: username.trim() ? 'transparent' : 'var(--themed-input-bg)',
                    boxShadow: username.trim() ? `0 0 15px var(--glow-color-themed)` : 'none',
                  }}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-center text-muted-foreground">
              Claim your unique link.
            </p>
          </motion.div>
        </motion.main>
      </AnimatePresence>

      {/* Controls - Theme Toggle (top right) */}
      <motion.div
        className="fixed top-6 right-6 sm:top-8 sm:right-8 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <Button
          onClick={handleThemeToggle}
          className="w-12 h-12 rounded-full shadow-lg transition-all duration-300 border backdrop-blur-md flex items-center justify-center text-foreground hover:scale-110"
          style={{
            backgroundColor: 'var(--themed-input-bg)', 
            borderColor: 'var(--themed-input-border)',
            boxShadow: `0 0 15px var(--glow-color-themed)`,
          }}
        >
          {React.createElement(themeConfig.themeIcon, { className: "w-5 h-5" })}
        </Button>
      </motion.div>

      {/* Personality Toggle (bottom right) */}
      <motion.div
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <div className="relative group">
          <svg 
            className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 -rotate-90 transition-opacity duration-300"
            style={{ opacity: isHolding ? 1 : 0 }}
            viewBox="0 0 64 64"
          >
            <circle cx="32" cy="32" r="29" stroke="var(--themed-input-border)" strokeWidth="1.5" fill="none" />
            <motion.circle
              cx="32" cy="32" r="29"
              stroke="var(--accent)" strokeWidth="2.5"
              fill="none" strokeLinecap="round"
              style={{ pathLength: holdProgress, strokeDasharray: "0 1" }}
            />
          </svg>

          <Button
            onMouseDown={handlePersonalityChangeStart}
            onMouseUp={handlePersonalityChangeEnd}
            onMouseLeave={handlePersonalityChangeEnd}
            onTouchStart={handlePersonalityChangeStart}
            onTouchEnd={handlePersonalityChangeEnd}
            aria-label={`Switch to ${oppositePersonalityName} personality`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl transition-all duration-300 border backdrop-blur-md font-bold relative overflow-hidden flex items-center justify-center text-foreground"
            style={{
              backgroundColor: 'var(--themed-input-bg)', 
              borderColor: 'var(--themed-input-border)',
              boxShadow: `0 0 25px var(--glow-color-themed)`,
            }}
          >
            <motion.div
              animate={{ scale: isHolding ? 1.1 : 1, rotate: isHolding ? (isVibrantPersonality ? -90 : 90) : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              {React.createElement(themeConfig.personalityIcon, { className: "w-6 h-6 sm:w-7 sm:h-7" })}
            </motion.div>
          </Button>
          
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -top-10 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              backgroundColor: 'var(--themed-input-bg)',
              color: 'var(--foreground)',
              border: `1px solid var(--themed-input-border)`,
              boxShadow: `0 2px 5px var(--glow-color-themed)`,
            }}
            initial={{ y: 5 }}
            animate={{ y: 0 }}
          >
            Hold to switch personality
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LandingPage