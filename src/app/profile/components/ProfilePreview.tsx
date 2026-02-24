'use client'

import React, { useState, useEffect } from 'react'
import { Share2, Settings, ExternalLink, Link } from 'lucide-react'
import { backgroundPresets } from '@/app/components/backgrounds'
import { backgroundComponents } from '@/app/components/animated-backgrounds'
import { getTextColors } from '../utils/colors'
import { socialPlatforms } from '../constants'
import Image from 'next/image'
import { fontMap } from '@/lib/fonts'
import { cn } from '@/lib/utils'

interface Profile {
  name: string | null
  bio: string | null
  avatar: string | null
  background: string
  font: string
  buttonStyle: string
  buttonRoundness: string
  buttonLayout?: string
  blur?: number
  customColor?: string
  links: {
    id: string
    title: string
    url: string
    icon: string
  }[]
}

interface ProfilePreviewProps {
  profile: Profile
  getBackgroundClass: (bgId: string) => string
  iconMap: Record<string, React.ComponentType<{ className?: string }>>
  isMobile: boolean
  isDesktopPreview?: boolean
}

export const ProfilePreview = ({ profile, getBackgroundClass, iconMap, isMobile }: ProfilePreviewProps) => {
  const backgroundPreset = backgroundPresets.find(bg => bg.id === profile.background)
  const BackgroundComponent = backgroundPreset?.component ? backgroundComponents[backgroundPreset.component as keyof typeof backgroundComponents] : null
  
  const blurValue = profile.blur || 0
  const isCustomColor = profile.background?.startsWith('custom-')
  const isExternalImage = profile.background && !backgroundPreset && !isCustomColor && !profile.background.startsWith('bg-')

  // Get dynamic text colors
  const textColors = getTextColors(profile)
  const fontClass = fontMap[profile.font] || fontMap.inter

  const getButtonClass = () => {
    const style = profile.buttonStyle || 'fill'
    const roundness = profile.buttonRoundness || 'rounded'
    const layout = profile.buttonLayout || 'list'
    const isBright = textColors.isBright

    const roundClass = {
        'sharp': 'rounded-none',
        'rounded': 'rounded-xl',
        'pill': 'rounded-full'
    }[roundness as 'sharp' | 'rounded' | 'pill'] || 'rounded-xl';

    let colorClass = "";
    switch (style) {
        case 'fill':
            colorClass = isBright 
                ? "bg-white/80 hover:bg-white text-black border border-black/5 shadow-sm" 
                : "bg-zinc-900/60 hover:bg-zinc-900/80 text-white border border-white/10 backdrop-blur-md";
            break;
        case 'outline':
            colorClass = isBright 
                ? "bg-transparent border-2 border-black/80 text-black hover:bg-black/5" 
                : "bg-transparent border-2 border-white/80 text-white hover:bg-white/10";
            break;
        case 'soft':
            colorClass = isBright 
                ? "bg-black/5 hover:bg-black/10 text-black" 
                : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md";
            break;
        case 'hard':
            colorClass = isBright 
                ? "bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                : "bg-black border-2 border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";
            break;
        default:
             colorClass = isBright 
                ? "bg-white/50 text-black" 
                : "bg-black/50 text-white";
    }
    
    // Adjust padding/layout for grid mode
    if (layout === 'grid') {
      return `${roundClass} ${colorClass} transition-all duration-200 flex flex-col items-center justify-center text-center p-4 h-32 w-full`;
    }

    return `${roundClass} ${colorClass} transition-all duration-200`;
  }

  const [username, setUsername] = useState<string>("username");

  useEffect(() => {
    // take access_token from cookies, take only the payload from it, there should be user_name in it, setUsername to user_name
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const accessToken = getCookie('access_token');
    if (accessToken) {
      try {
        // JWT format: header.payload.signature
        const payload = accessToken.split('.')[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
          if (decoded.user_name) {
            setUsername(decoded.user_name);
          }
        }
      } catch {
        // ignore errors
      }
    }
  }, [])

  return (
    <div className={`relative w-full h-full overflow-hidden bg-background ${fontClass}`}>
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {isCustomColor ? (
          <div 
            className="w-full h-full" 
            style={{ backgroundColor: profile.customColor || '#000000' }}
          />
        ) : isExternalImage ? (
          <div className="relative w-full h-full">
            <Image
              src={profile.background}
              alt="Profile Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : BackgroundComponent ? (
          <BackgroundComponent />
        ) : (
          <div className={`w-full h-full ${getBackgroundClass(profile.background)}`} />
        )}
      </div>

      {/* Blur Overlay - Applied separately to avoid blurring the container edges */}
      {blurValue > 0 && (
        <div 
          className="absolute inset-0 z-0 backdrop-blur-[var(--blur-amount)]"
          style={{ '--blur-amount': `${blurValue * 0.5}px` } as React.CSSProperties}
        />
      )}

      {/* Content */}
      <div className={`absolute inset-0 z-10 pointer-events-none ${textColors.isBright ? 'bg-black/10' : 'bg-black/20'}`} />
      
      {/* Content Container */}
      {isMobile ? (
        // Mobile Layout
        <div className="relative z-20 h-full p-4 flex flex-col items-center justify-start pt-10 overflow-y-auto custom-scrollbar">
          <div className={`w-full max-w-sm backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden mb-4 transition-all duration-300 ${textColors.profileCard}`}>
            
            <div className="relative z-10">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {profile.avatar ? (
                    <Image 
                      src={profile.avatar} 
                      alt={profile.name || 'User'}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {profile.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-4">
                <h1 className={`text-lg font-bold mb-1 transition-colors duration-300 ${textColors.gradient}`}>
                  {profile.name || 'Your Name'}
                </h1>
                <p className={`text-xs mb-2 transition-colors duration-300 ${textColors.muted}`}>@{username}</p>
                <p className={`text-xs leading-relaxed transition-colors duration-300 ${textColors.secondary}`}>
                  {profile.bio || 'Your bio will appear here...'}
                </p>
              </div>

              {/* Share/Edit Buttons */}
              <div className="flex gap-2">
                <div className={`flex-1 border rounded-lg px-3 py-2 flex items-center justify-center gap-1 cursor-pointer transition-colors ${textColors.isBright ? 'bg-black/10 hover:bg-black/20 border-black/15 text-gray-900' : 'bg-white/15 hover:bg-white/25 border-white/20 text-white'}`}>
                  <Settings className="w-3 h-3" />
                  <span className="font-medium text-xs">Edit</span>
                </div>
                
                <div className={`flex-1 border rounded-lg px-3 py-2 flex items-center justify-center gap-1 cursor-pointer transition-colors ${textColors.isBright ? 'bg-transparent hover:bg-black/10 border-black/15 text-gray-900' : 'bg-transparent hover:bg-white/10 border-white/20 text-white'}`}>
                  <Share2 className="w-3 h-3" />
                  <span className="font-medium text-xs">Share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links + Footer wrapper */}
          <div className="w-full max-w-sm flex-1 flex flex-col">
            <div className={cn(
               "w-full",
               profile.buttonLayout === 'grid-icon' ? "grid grid-cols-3 gap-2" : "space-y-2"
            )}>
              {profile.links.length > 0 ? profile.links.map((link) => {
                const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link
                const buttonClass = getButtonClass();
                const isIconGrid = profile.buttonLayout === 'grid-icon';
                
                if (isIconGrid) {
                  return (
                    <div
                      key={link.id}
                      className={`group cursor-pointer flex flex-col items-center justify-center gap-1 p-3 ${buttonClass}`}
                    >
                      <IconComponent className="w-6 h-6" />
                      <h3 className="font-semibold text-xs text-center leading-tight line-clamp-2 w-full">
                        {link.title}
                      </h3>
                    </div>
                  )
                }

                return (
                  <div
                    key={link.id}
                    className={`w-full relative overflow-hidden flex items-center gap-3 p-3 group cursor-pointer ${buttonClass}`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="font-semibold text-sm mb-0.5 truncate">
                        {link.title}
                      </h3>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-8">
                  <p className={`text-sm transition-colors duration-300 ${textColors.muted}`}>No links added yet</p>
                </div>
              )}
            </div>

            {/* Footer - always outside the grid */}
            <div className="py-4 text-center">
              <p className={`text-xs transition-colors duration-300 ${textColors.muted}`}>
                Powered by <span className={`font-semibold ${textColors.gradient}`}>SocioLink</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Desktop Layout - Left profile, right links
        <div className="relative z-20 h-full overflow-y-auto custom-scrollbar">
          <div className="min-h-full p-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-8 items-center min-h-[80vh]">
                
                {/* Left Side - Profile Card */}
                <div className="flex justify-center sticky top-10">
                  <div className={`w-full max-w-sm backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${textColors.profileCard}`}>
                    
                    <div className="relative z-10">
                      {/* Avatar */}
                      <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                          {profile.avatar ? (
                            <Image 
                              src={profile.avatar} 
                              alt={profile.name || 'User'}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">
                                {profile.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="text-center mb-6">
                        <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${textColors.gradient}`}>
                          {profile.name || 'Your Name'}
                        </h1>
                        <p className={`text-sm mb-3 transition-colors duration-300 ${textColors.muted}`}>@{username}</p>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${textColors.secondary}`}>
                          {profile.bio || 'Your bio will appear here...'}
                        </p>
                      </div>

                      {/* Edit and Share Buttons */}
                      <div className="flex gap-3">
                        <div className={`flex-1 border rounded-xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer transition-colors ${textColors.isBright ? 'bg-black/10 hover:bg-black/20 border-black/15 text-gray-900' : 'bg-white/15 hover:bg-white/25 border-white/20 text-white'}`}>
                          <Settings className="w-4 h-4" />
                          <span className="font-medium text-sm">Edit</span>
                        </div>
                        
                        <div className={`flex-1 border rounded-xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer transition-colors ${textColors.isBright ? 'bg-transparent hover:bg-black/10 border-black/15 text-gray-900' : 'bg-transparent hover:bg-white/10 border-white/20 text-white'}`}>
                          <Share2 className="w-4 h-4" />
                          <span className="font-medium text-sm">Share</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Links */}
                <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
                  <div className={cn(
                     "w-full",
                     profile.buttonLayout === 'grid-icon' ? "grid grid-cols-3 gap-3" : "space-y-3"
                  )}>
                    {profile.links.length > 0 ? profile.links.map((link) => {
                      const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                      const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link
                      const buttonClass = getButtonClass();
                      const isIconGrid = profile.buttonLayout === 'grid-icon';
                      
                      if (isIconGrid) {
                        return (
                          <div
                            key={link.id}
                            className={`group cursor-pointer flex flex-col items-center justify-center gap-1.5 p-4 hover:scale-[1.04] transition-transform ${buttonClass}`}
                          >
                            <IconComponent className="w-7 h-7" />
                            <h3 className="font-semibold text-xs text-center leading-tight line-clamp-2 w-full">
                              {link.title}
                            </h3>
                          </div>
                        )
                      }

                      return (
                        <div
                          key={link.id}
                          className={`w-full relative overflow-hidden flex items-center gap-3 p-3 sm:p-4 group cursor-pointer ${buttonClass}`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <h3 className="font-semibold text-base mb-1 truncate">
                              {link.title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 opacity-70" />
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-center py-12">
                        <p className={`text-base transition-colors duration-300 ${textColors.muted}`}>No links added yet</p>
                      </div>
                    )}
                  </div>

                  {/* Footer - always outside the grid */}
                  <div className="pt-2 text-center">
                    <p className={`text-sm transition-colors duration-300 ${textColors.muted}`}>
                      Powered by <span className={`font-semibold ${textColors.gradient}`}>SocioLink</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
