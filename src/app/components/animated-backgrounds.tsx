'use client'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'

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
      const { innerWidth, innerHeight } = window
      canvas.width = innerWidth
      canvas.height = innerHeight
      dimensionsRef.current = { width: innerWidth, height: innerHeight }
    }

    updateSize()
    contextRef.current = ctx

    const handleResize = () => updateSize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { canvasRef, contextRef, dimensionsRef, setupCanvas }
}

// Floating Particles - Optimized with object pooling
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
    particlesRef.current = Array.from({ length: 40 }, () => ({
        x: Math.random() * dimensionsRef.current.width,
        y: Math.random() * dimensionsRef.current.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.4 + 0.3,
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

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      // Draw particle
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
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
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
    particlesRef.current = Array.from({ length: 25 }, () => ({
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

    const canvas = canvasRef.current
    if (canvas) {
        canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    return () => {
        if (typeof cleanup === 'function') cleanup()
        canvas?.removeEventListener('mousemove', handleMouseMove)
    }
    }, [setupCanvas, canvasRef])

  const animate = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    ctx.clearRect(0, 0, width, height)

    const particles = particlesRef.current
    const connectionDistance = 120
    const mouseDistance = 80

    particles.forEach((particle, i) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      // Draw particle
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      // Draw connections (optimized with distance culling)
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j]
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          ctx.strokeStyle = '#ffffff'
          ctx.globalAlpha = (connectionDistance - distance) / connectionDistance * 0.4
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
        }
      }

      // Mouse interaction
      const mouseDx = particle.x - mouseRef.current.x
      const mouseDy = particle.y - mouseRef.current.y
      const mouseDistanceActual = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)

      if (mouseDistanceActual < mouseDistance) {
        ctx.strokeStyle = '#ff6b6b'
        ctx.globalAlpha = (mouseDistance - mouseDistanceActual) / mouseDistance * 0.8
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
        ctx.stroke()
      }
    })
  }, [])

  useAnimationFrame(animate, 60)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
    />
  )
})

// Matrix Rain - Optimized with column pooling
export const MatrixRain = React.memo(() => {
  const { canvasRef, contextRef, dimensionsRef, setupCanvas } = useCanvasSetup()
  const dropsRef = useRef<number[]>([])
  const columnsRef = useRef(0)

  const matrixChars = useMemo(() => 
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()+-/~{[|`]}".split(""), 
    []
  )

  useEffect(() => {
    const cleanup = setupCanvas()
    if (!contextRef.current) return

    const fontSize = 12
    columnsRef.current = Math.floor(dimensionsRef.current.width / fontSize)
    dropsRef.current = Array.from({ length: columnsRef.current }, () => 1)

    return typeof cleanup === 'function' ? cleanup : undefined
  }, [setupCanvas])

  const animate = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    const fontSize = 12

    // Semi-transparent background for trail effect
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

  useAnimationFrame(animate, 30) // Lower FPS for matrix effect

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: '#000000' }}
    />
  )
})

// Constellation - Optimized with reduced star count and line calculations
export const Constellation = React.memo(() => {
  const { canvasRef, contextRef, dimensionsRef, setupCanvas } = useCanvasSetup()
  const starsRef = useRef<Array<{
    x: number
    y: number
    size: number
    twinkle: number
    twinkleSpeed: number
  }>>([])

  useEffect(() => {
    const cleanup = setupCanvas()
    if (!contextRef.current) return

    // Reduced star count for better performance
    starsRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * dimensionsRef.current.width,
      y: Math.random() * dimensionsRef.current.height,
      size: Math.random() * 1.5 + 0.5,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.01 + 0.005
    }))

    return typeof cleanup === 'function' ? cleanup : undefined
  }, [setupCanvas])

  const animate = useCallback(() => {
    const ctx = contextRef.current
    if (!ctx) return

    const { width, height } = dimensionsRef.current
    ctx.fillStyle = 'rgba(15, 23, 42, 1)'
    ctx.fillRect(0, 0, width, height)

    const stars = starsRef.current

    stars.forEach((star, i) => {
      star.twinkle += star.twinkleSpeed
      const alpha = (Math.sin(star.twinkle) + 1) / 2

      ctx.globalAlpha = alpha * 0.8
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()

      // Optimized constellation lines - only check nearby stars
      if (Math.random() > 0.995) { // Reduced frequency
        for (let j = i + 1; j < Math.min(i + 10, stars.length); j++) {
          const other = stars[j]
          const dx = star.x - other.x
          const dy = star.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.globalAlpha = 0.2
            ctx.strokeStyle = '#60A5FA'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(star.x, star.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }
      }
    })
  }, [])

  useAnimationFrame(animate, 60)

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, #1a202c 0%, #0f1419 100%)' }}
    />
  )
})

// Liquid Morph - Pure CSS optimized version
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
              width: '35vw',
              height: '35vw',
              background: `radial-gradient(circle, ${shape.color} 0%, transparent 65%)`,
              animation: `morph${i + 1} ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${shape.delay}s`,
              left: `${15 + i * 25}%`,
              top: `${5 + i * 20}%`
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes morph1 {
          0%, 100% { transform: scale(1) translate(0, 0) rotate(0deg); }
          33% { transform: scale(1.2) translate(20px, -20px) rotate(120deg); }
          66% { transform: scale(0.8) translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes morph2 {
          0%, 100% { transform: scale(1.1) translate(0, 0) rotate(0deg); }
          33% { transform: scale(0.9) translate(-30px, 10px) rotate(-120deg); }
          66% { transform: scale(1.3) translate(10px, -30px) rotate(-240deg); }
        }
        @keyframes morph3 {
          0%, 100% { transform: scale(0.9) translate(0, 0) rotate(0deg); }
          33% { transform: scale(1.4) translate(15px, 25px) rotate(180deg); }
          66% { transform: scale(1.1) translate(-25px, -15px) rotate(360deg); }
        }
      `}</style>
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

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { x, y, id: Date.now() }
    setRipples(prev => [...prev.slice(-3), newRipple]) // Limit to 3 ripples max

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 1000)
  }, [])

  return (
    <div
      className="absolute inset-0 cursor-pointer overflow-hidden"
      onClick={handleClick}
      style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' }}
    >
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full border-2 border-white/30 animate-ping pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )
})

// Add display names for debugging
ParticleFloat.displayName = 'ParticleFloat'
ParticleWeb.displayName = 'ParticleWeb'
MatrixRain.displayName = 'MatrixRain'
Constellation.displayName = 'Constellation'
LiquidMorph.displayName = 'LiquidMorph'
GeometricWaves.displayName = 'GeometricWaves'
RippleEffect.displayName = 'RippleEffect'

// Export the optimized components
export const backgroundComponents = {
  ParticleFloat,
  ParticleWeb,
  MatrixRain,
  Constellation,
  LiquidMorph,
  GeometricWaves,
  RippleEffect
}