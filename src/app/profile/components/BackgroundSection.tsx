'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { backgroundPresets } from '@/app/components/backgrounds'

interface BackgroundSectionProps {
  profile: any
  setProfile: (value: any) => void
  showBackgrounds: boolean
  setShowBackgrounds: (value: boolean) => void
  compact?: boolean
}

// Background Thumbnail Component
const BackgroundThumbnail = React.memo(({ background }: { background: any }) => {
  // Static previews for animated components to save resources
  const staticPreviews: Record<string, string> = {
    'ParticleFloat': 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    'ParticleWeb': 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700',
    'MatrixRain': 'bg-gradient-to-b from-green-900 via-green-600 to-black',
    'Constellation': 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black',
    'LiquidMorph': 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600',
    'GeometricWaves': 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500',
    'RippleEffect': 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400',
    'WaveAnimation': 'bg-gradient-to-b from-blue-900 to-black'
  }

  const interactiveComponents = ['ParticleWeb', 'RippleEffect']
  const isInteractive = background.component && interactiveComponents.includes(background.component)

  if (background.component) {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-md">
        <div className={`w-full h-full ${staticPreviews[background.component] || 'bg-gray-800'}`} />
        {isInteractive && (
          <div className="absolute top-1 right-1">
            <span className="text-[8px] font-semibold text-white bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm leading-none">
              Interactive
            </span>
          </div>
        )}
      </div>
    )
  }

  return <div className={`w-full h-full rounded-md ${background.class}`} />
})

BackgroundThumbnail.displayName = 'BackgroundThumbnail'

export const BackgroundSection = ({ profile, setProfile, showBackgrounds, setShowBackgrounds, compact = false }: BackgroundSectionProps) => {
  const [customColor, setCustomColor] = useState('#667eea')

  const categorizedBackgrounds = backgroundPresets.reduce((acc: any, bg: any) => {
    if (!acc[bg.category]) acc[bg.category] = []
    acc[bg.category].push(bg)
    return acc
  }, {} as Record<string, typeof backgroundPresets>)

  const handleCustomColorApply = () => {
    setProfile((prev: any) => ({ 
      ...prev, 
      background: `custom-${customColor.replace('#', '')}`,
      customColor: customColor
    }))
  }

  const isCustomColor = profile.background?.startsWith('custom-')

  return (
    <div className="space-y-3">
      <button
        onClick={() => setShowBackgrounds(!showBackgrounds)}
        className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent" />
          <span className="font-medium text-foreground">Backgrounds</span>
        </div>
        {showBackgrounds ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      <AnimatePresence>
        {showBackgrounds && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Blur Control */}
            <div className="mb-4 p-3 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Content Blur</label>
                <span className="text-xs text-muted-foreground">{profile.blur || 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={profile.blur || 0}
                onChange={(e) => setProfile((prev: any) => ({ ...prev, blur: parseInt(e.target.value) }))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${profile.blur || 0}%, #e5e7eb ${profile.blur || 0}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>No Blur</span>
                <span>Max Blur</span>
              </div>
            </div>

            {/* Custom Color Section */}
            <div className="mb-4 p-3 bg-card border border-border rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-3">Custom Color</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Hex Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#667eea"
                        className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleCustomColorApply}
                  size="sm"
                  className="w-full"
                >
                  Apply Color
                </Button>
              </div>

              {/* Current Custom Color Preview */}
              {isCustomColor && (
                <div className="mt-3 p-2 rounded border border-border">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: profile.customColor || customColor }}
                    />
                    <span className="text-xs text-muted-foreground">
                      Current: {profile.customColor || customColor}
                    </span>
                    <button
                      onClick={() => setProfile((prev: any) => ({ 
                        ...prev, 
                        background: 'gradient-1',
                        customColor: undefined
                      }))}
                      className="ml-auto text-xs text-destructive hover:text-destructive/80"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Background Categories */}
            <div className="space-y-4 p-3">
              {Object.entries(categorizedBackgrounds).map(([category, backgrounds]: [string, any]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className={`grid ${compact ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
                    {backgrounds.map((bg: any) => (
                      <button
                        key={bg.id}
                        onClick={() => setProfile((prev: any) => ({ 
                          ...prev, 
                          background: bg.id,
                          customColor: undefined
                        }))}
                        className={`relative ${compact ? 'h-12' : 'h-16'} rounded-md border-2 transition-all duration-200 overflow-hidden ${
                          profile.background === bg.id ? 'border-accent scale-105 ring-2 ring-accent/30' : 'border-border hover:border-accent/50'
                        } group`}
                        title={bg.name}
                      >
                        <BackgroundThumbnail background={bg} />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                          <span className="text-white text-xs font-medium block truncate">
                            {bg.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
