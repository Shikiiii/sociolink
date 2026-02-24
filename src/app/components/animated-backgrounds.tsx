'use client'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

// Optimized utility hook for animation frames with cleanup
const useAnimationFrame = (callback: () => void, fps: number = 60) => {
  const callbackRef = useRef(callback)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef(0)
  
  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    const interval = 1000 / fps

    const animate = (time: number) => {
      if (time - lastTimeRef.current >= interval) {
        callbackRef.current()
        lastTimeRef.current = time
      }
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [fps])
}

// Optimized canvas setup hook
const useCanvasSetup = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const dimensionsRef = useRef({ width: 0, height: 0 })

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const ctx = canvas.getContext('2d')
    if (!ctx) return false

    const updateSize = () => {
      // Use clientWidth/clientHeight to avoid scrollbar issues/mobile bar issues
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
        dimensionsRef.current = { width: parent.clientWidth, height: parent.clientHeight }
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        dimensionsRef.current = { width: window.innerWidth, height: window.innerHeight }
      }
    }

    updateSize()
    contextRef.current = ctx

    const handleResize = () => updateSize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { canvasRef, contextRef, dimensionsRef, setupCanvas }
}

// Floating Particles - Simpler, more reliable
export const ParticleFloat = React.memo(() => {
  const { canvasRef, contextRef, dimensionsRef, setupCanvas } = useCanvasSetup()
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    color: string
  }>>([])

  const colors = useMemo(() => ['#60A5FA', '#A78BFA', '#FB7185', '#34D399', '#FBBF24'], [])

  useEffect(() => {
    const cleanup = setupCanvas()
    if (!contextRef.current) return

    // Initialize particles
    particlesRef.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * dimensionsRef.current.width,
      y: Math.random() * dimensionsRef.current.height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    return typeof cleanup === 'function' ? cleanup : undefined
  }, [setupCanvas, colors])

  const animate = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    ctx.clearRect(0, 0, width, height)

    particlesRef.current.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Wrap around edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [])

  useAnimationFrame(animate, 60)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)' }}
    />
  )
})

// Particle Web - Optimized with distance culling
export const ParticleWeb = React.memo(() => {
  const { canvasRef, contextRef, dimensionsRef, setupCanvas } = useCanvasSetup()
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
  }>>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cleanup = setupCanvas()
    if (!contextRef.current) return

    // Initialize particles
    particlesRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * dimensionsRef.current.width,
      y: Math.random() * dimensionsRef.current.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 1
    }))

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }

    // Listen on window so events are received even when content layers are on top
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      if (typeof cleanup === 'function') cleanup()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [setupCanvas, canvasRef])

  const animate = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    ctx.clearRect(0, 0, width, height)

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#1e3c72')
    gradient.addColorStop(1, '#2a5298')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    const particles = particlesRef.current
    const connectionDistance = 120
    const mouseDistance = 150
    const { x: mx, y: my } = mouseRef.current

    particles.forEach((particle, i) => {
      // Mouse repulsion
      const mdx = particle.x - mx
      const mdy = particle.y - my
      const md = Math.sqrt(mdx * mdx + mdy * mdy)
      if (md < mouseDistance && md > 0) {
        const force = (mouseDistance - md) / mouseDistance
        particle.vx += (mdx / md) * force * 0.6
        particle.vy += (mdy / md) * force * 0.6
        // Clamp velocity
        const maxV = 3
        particle.vx = Math.max(-maxV, Math.min(maxV, particle.vx))
        particle.vy = Math.max(-maxV, Math.min(maxV, particle.vy))
      } else {
        // Gradually restore original speed
        particle.vx *= 0.99
        particle.vy *= 0.99
      }

      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      // Draw particle (brighter when near mouse)
      const glowFactor = md < mouseDistance ? 1 - md / mouseDistance : 0
      ctx.fillStyle = glowFactor > 0.1 ? `rgba(150,200,255,1)` : '#ffffff'
      ctx.globalAlpha = 0.8 + glowFactor * 0.2
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size + glowFactor * 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j]
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          ctx.strokeStyle = '#ffffff'
          ctx.globalAlpha = (1 - distance / connectionDistance) * 0.4
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      }

      // Draw line from mouse to nearby particles
      if (md < mouseDistance * 0.6) {
        ctx.strokeStyle = 'rgba(150,200,255,0.6)'
        ctx.globalAlpha = (1 - md / (mouseDistance * 0.6)) * 0.5
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(mx, my)
        ctx.stroke()
      }
    })
  }, [])

  useAnimationFrame(animate, 60)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
    />
  )
})

// Matrix Rain - Kept as is (User liked it)
export const MatrixRain = React.memo(() => {
  const { canvasRef, contextRef, dimensionsRef, setupCanvas } = useCanvasSetup()
  const dropsRef = useRef<number[]>([])
  const columnsRef = useRef(0)

  const matrixChars = useMemo(() => 
    "01".split(""), 
    []
  )

  useEffect(() => {
    const cleanup = setupCanvas()
    if (!contextRef.current) return

    const fontSize = 14
    columnsRef.current = Math.floor(dimensionsRef.current.width / fontSize)
    dropsRef.current = Array.from({ length: columnsRef.current }, () => 1)

    return typeof cleanup === 'function' ? cleanup : undefined
  }, [setupCanvas])

  const animate = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    const fontSize = 14

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#0F0'
    ctx.font = `${fontSize}px monospace`

    dropsRef.current.forEach((drop, i) => {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
      ctx.fillText(char, i * fontSize, drop * fontSize)

      if (drop * fontSize > height && Math.random() > 0.975) {
        dropsRef.current[i] = 0
      }
      dropsRef.current[i]++
    })
  }, [matrixChars])

  useAnimationFrame(animate, 30)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: '#000000' }}
    />
  )
})

// Constellation - Simplified to Starfield
export const Constellation = React.memo(() => {
  const { canvasRef, contextRef, dimensionsRef, setupCanvas } = useCanvasSetup()
  const starsRef = useRef<Array<{
    x: number
    y: number
    size: number
    twinkleSpeed: number
    opacity: number
  }>>([])

  useEffect(() => {
    const cleanup = setupCanvas()
    if (!contextRef.current) return

    starsRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * dimensionsRef.current.width,
      y: Math.random() * dimensionsRef.current.height,
      size: Math.random() * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      opacity: Math.random()
    }))

    return typeof cleanup === 'function' ? cleanup : undefined
  }, [setupCanvas])

  const animate = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    ctx.clearRect(0, 0, width, height)

    starsRef.current.forEach(star => {
      star.opacity += star.twinkleSpeed
      if (star.opacity > 1 || star.opacity < 0) star.twinkleSpeed *= -1
      
      ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity))
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [])

  useAnimationFrame(animate, 30)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, #1a202c 0%, #0f1419 100%)' }}
    />
  )
})

// Liquid Morph - Kept as is
export const LiquidMorph = React.memo(() => {
  const morphShapes = useMemo(() => [
    { color: '#ff6b6b', delay: 0 },
    { color: '#4ecdc4', delay: 2 },
    { color: '#45b7d1', delay: 4 }
  ], [])

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#1a1a2e' }}>
      <div className="absolute inset-0">
        {morphShapes.map((shape, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-60 mix-blend-screen will-change-transform"
            style={{
              width: '45vw',
              height: '45vw',
              background: `radial-gradient(circle, ${shape.color} 0%, transparent 65%)`,
              animation: `morph${i + 1} ${12 + i * 2}s ease-in-out infinite`,
              animationDelay: `${shape.delay}s`,
              left: `${10 + i * 20}%`,
              top: `${10 + i * 15}%`
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes morph1 {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.2) translate(10%, -10%); }
        }
        @keyframes morph2 {
          0%, 100% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(0.9) translate(-10%, 10%); }
        }
        @keyframes morph3 {
          0%, 100% { transform: scale(0.9) translate(0, 0); }
          50% { transform: scale(1.1) translate(5%, 5%); }
        }
      `}</style>
    </div>
  )
})

// NEW: Wave Animation
export const WaveAnimation = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-blue-900 to-black">
       <svg className="absolute bottom-0 left-0 w-full h-[50vh]" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#0099ff" fillOpacity="0.2" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            <animate attributeName="d" 
              dur="10s" 
              repeatCount="indefinite"
              values="
                M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,149.3C672,160,768,224,864,229.3C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
            />
          </path>
           <path fill="#0099ff" fillOpacity="0.4" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,202.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            <animate attributeName="d" 
              dur="15s" 
              repeatCount="indefinite"
               values="
                M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,202.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,154.7C672,128,768,128,864,149.3C960,171,1056,213,1152,229.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,197.3C672,224,768,224,864,202.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
               "
            />
          </path>
       </svg>
    </div>
  )
})

// Optimized Geometric Waves
export const GeometricWaves = React.memo(() => {
  const waves = useMemo(() => Array.from({ length: 4 }, (_, i) => ({ 
    id: i, 
    delay: i * 0.5,
    duration: 4 + i * 0.5,
    rotation: i * 15
  })), [])

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="absolute inset-0">
        {waves.map((wave) => (
          <div
            key={wave.id}
            className="absolute w-full opacity-15 will-change-transform"
            style={{
              height: '200%',
              background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
              transform: `translateY(-50%) rotate(${wave.rotation}deg)`,
              animation: `float ${wave.duration}s ease-in-out infinite alternate`,
              animationDelay: `${wave.delay}s`
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(-50%) rotate(0deg) translateX(-10px); }
          100% { transform: translateY(-50%) rotate(5deg) translateX(10px); }
        }
      `}</style>
    </div>
  )
})

// Optimized Ripple Effect with object pooling
export const RippleEffect = React.memo(() => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // If the click originated from an interactive element (button, link, input), don't ripple
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, textarea, select')) return;

      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()

      // Only ripple if click is within the background bounds
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return

      const newRipple = { x, y, id: Date.now() }
      setRipples(prev => [...prev.slice(-4), newRipple])

      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 1000)
    }

    // Listen on window so clicks are received even when content layers are on top
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-pointer overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' }}
    >
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full border-2 border-white/40 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 1s ease-out forwards'
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          0% { width: 0px; height: 0px; opacity: 1; border-width: 0px; }
          50% { opacity: 0.5; }
          100% { width: 500px; height: 500px; opacity: 0; border-width: 2px; }
        }
      `}</style>
    </div>
  )
})

export const backgroundComponents = {
  ParticleFloat,
  ParticleWeb,
  MatrixRain,
  Constellation,
  LiquidMorph,
  WaveAnimation,
  GeometricWaves,
  RippleEffect,
}