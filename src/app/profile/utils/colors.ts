export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Calculate luminance (brightness)
export const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

interface ProfileColorInfo {
  background: string
  customColor?: string
}

// Determine if background is bright
export const isBackgroundBright = (profile: ProfileColorInfo) => {
  // Handle custom colors
  if (profile.background?.startsWith('custom-') && profile.customColor) {
    const rgb = hexToRgb(profile.customColor)
    if (rgb) {
      const luminance = getLuminance(rgb.r, rgb.g, rgb.b)
      return luminance > 0.5 // Threshold for bright vs dark
    }
  }
  
  // Handle preset backgrounds
  const brightBackgrounds = [
    'gradient-3', // Light gradients
    'gradient-6',
    'gradient-8', 
    'solid-1', // Light solid colors
    'solid-2',
    'solid-4'
    // Add more bright background IDs as needed
  ]
  
  return brightBackgrounds.includes(profile.background)
}

// Get text colors based on background brightness
export const getTextColors = (profile: ProfileColorInfo) => {
  const isBright = isBackgroundBright(profile)
  
  return {
    isBright,
    primary: isBright ? 'text-gray-900' : 'text-white',
    secondary: isBright ? 'text-gray-700' : 'text-white/80',
    muted: isBright ? 'text-gray-500' : 'text-white/55',
    gradient: isBright ? 'text-gray-900' : 'text-white',
    // Container styles
    profileCard: isBright
      ? 'bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-xl'
      : 'bg-black/25 backdrop-blur-xl border border-white/10',
    linkCard: isBright
      ? 'bg-white/75 border border-gray-200/60 shadow-sm'
      : 'bg-black/20 border border-white/10',
    profileGlow: '',
    linkGlow: ''
  }
}
