export const backgroundPresets = [
  { 
    id: 'gradient-1', 
    name: 'Ocean Wave', 
    class: 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    category: 'Gradient'
  },
  { 
    id: 'gradient-2', 
    name: 'Sunset', 
    class: 'bg-gradient-to-br from-orange-400 via-red-500 to-pink-600',
    category: 'Gradient'
  },
  { 
    id: 'gradient-3', 
    name: 'Forest', 
    class: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600',
    category: 'Gradient'
  },
  { 
    id: 'gradient-4', 
    name: 'Midnight', 
    class: 'bg-gradient-to-br from-gray-900 via-purple-900 to-black',
    category: 'Gradient'
  },
  { 
    id: 'gradient-5', 
    name: 'Aurora', 
    class: 'bg-gradient-to-br from-green-300 via-blue-500 to-purple-600',
    category: 'Gradient'
  },
  { 
    id: 'gradient-6', 
    name: 'Coral Reef', 
    class: 'bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400',
    category: 'Gradient'
  },
  { 
    id: 'gradient-7', 
    name: 'Ice Storm', 
    class: 'bg-gradient-to-br from-cyan-200 via-blue-400 to-indigo-600',
    category: 'Gradient'
  },
  { 
    id: 'animated-1', 
    name: 'Flowing', 
    class: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-x',
    category: 'Animated'
  },
  { 
    id: 'animated-2', 
    name: 'Wave', 
    class: 'bg-gradient-to-r from-blue-400 via-teal-500 to-green-500 animate-pulse',
    category: 'Animated'
  },
  // INTERACTIVE & ANIMATED BACKGROUNDS - Only components that exist
  { 
    id: 'particles-1', 
    name: 'Floating Particles', 
    class: 'bg-particles-float',
    category: 'Animated',
    component: 'ParticleFloat'
  },
  { 
    id: 'particles-2', 
    name: 'Connection Web', 
    class: 'bg-particle-web',
    category: 'Animated',
    component: 'ParticleWeb'
  },
  { 
    id: 'animated-3', 
    name: 'Matrix Rain', 
    class: 'bg-matrix-rain',
    category: 'Animated',
    component: 'MatrixRain'
  },
  { 
    id: 'animated-4', 
    name: 'Geometric Waves', 
    class: 'bg-geometric-waves',
    category: 'Animated',
    component: 'GeometricWaves'
  },
  { 
    id: 'interactive-2', 
    name: 'Ripple Effect', 
    class: 'bg-ripple-effect',
    category: 'Animated',
    component: 'RippleEffect'
  },
  { 
    id: 'animated-5', 
    name: 'Constellation', 
    class: 'bg-constellation',
    category: 'Animated',
    component: 'Constellation'
  },
  { 
    id: 'animated-6', 
    name: 'Liquid Morph', 
    class: 'bg-liquid-morph',
    category: 'Animated',
    component: 'LiquidMorph'
  },
  {
    id: 'animated-7',
    name: 'Ocean Waves',
    class: 'bg-wave-animation',
    category: 'Animated',
    component: 'WaveAnimation'
  }
]

export const mobilePresets = [
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'Galaxy S23', width: 360, height: 780 },
  { name: 'Pixel 7', width: 412, height: 915 },
]

// Static preview mappings for thumbnail rendering (prevents animated components in previews)
export const staticPreviewMap: Record<string, string> = {
  'ParticleFloat': 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
  'ParticleWeb': 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700',
  'MatrixRain': 'bg-gradient-to-b from-green-900 via-green-600 to-black',
  'Constellation': 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black',
  'LiquidMorph': 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600',
  'GeometricWaves': 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500',
  'RippleEffect': 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-400',
  'WaveAnimation': 'bg-gradient-to-b from-blue-900 to-black'
}

// Categories for organized display
export const backgroundCategories = ['Gradient', 'Solid', 'Animated', 'Interactive'] as const

export type BackgroundCategory = typeof backgroundCategories[number]

export interface BackgroundPreset {
  id: string
  name: string
  class: string
  category: BackgroundCategory
  component?: string
}