'use client'

import React, { useState, useEffect } from 'react'
import { Share2, Settings, ExternalLink, Link } from 'lucide-react'
import { backgroundPresets } from '@/app/components/backgrounds'
import { backgroundComponents } from '@/app/components/animated-backgrounds'
import { getTextColors } from '../utils/colors'
import { socialPlatforms } from '../constants'
import Image from 'next/image'

interface Profile {
  name: string | null
  bio: string | null
  avatar: string | null
  background: string
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

  // Get dynamic text colors
  const textColors = getTextColors(profile)

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
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      {isCustomColor ? (
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: `#${profile.background.split("custom-")[1]}`,
            filter: blurValue > 0 ? `blur(${blurValue * 0.3}px)` : 'none',
            transform: blurValue > 0 ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 0.2s ease, transform 0.2s ease'
          }}
        />
      ) : BackgroundComponent ? (
        <div 
          className="absolute inset-0"
          style={{
            filter: blurValue > 0 ? `blur(${blurValue * 0.3}px)` : 'none',
            transform: blurValue > 0 ? 'scale(1.1)' : 'scale(1)',
            transformOrigin: 'center',
            transition: 'filter 0.2s ease, transform 0.2s ease'
          }}
        >
          <BackgroundComponent />
        </div>
      ) : (
        <div 
          className={`absolute inset-0 ${getBackgroundClass(profile.background)}`}
          style={{
            filter: blurValue > 0 ? `blur(${blurValue * 0.3}px)` : 'none',
            transform: blurValue > 0 ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 0.2s ease, transform 0.2s ease'
          }}
        />
      )}

      <div className={`absolute inset-0 pointer-events-none ${textColors.isBright ? 'bg-black/10' : 'bg-black/20'}`} />
      
      {/* Content */}
      {isMobile ? (
        // Mobile Layout
        <div className="relative z-20 h-full p-4 flex flex-col items-center justify-start pt-10 overflow-y-auto">
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

          {/* Links Section */}
          <div className="w-full max-w-sm space-y-2 flex-1 pb-10">
            {profile.links.length > 0 ? profile.links.map((link) => {
              const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
              const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link

              return (
                <div
                  key={link.id}
                  className={`w-full backdrop-blur-sm rounded-xl p-3 transition-all duration-200 relative overflow-hidden ${textColors.linkCard}`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{ 
                        backgroundColor: platform.color,
                        boxShadow: `0 4px 20px ${platform.color}40`
                      }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <h3 className={`font-semibold text-sm mb-0.5 truncate transition-colors duration-300 ${textColors.primary}`}>
                        {link.title}
                      </h3>
                      <p className={`text-xs truncate transition-colors duration-300 ${textColors.muted}`}>
                        {link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                      </p>
                    </div>

                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className={`w-3 h-3 ${textColors.muted}`} />
                    </div>
                  </div>
                </div>
              )
            }) : (
              <div className="text-center py-8">
                <p className={`text-sm transition-colors duration-300 ${textColors.muted}`}>No links added yet</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pb-4 text-center">
            <p className={`text-xs transition-colors duration-300 ${textColors.muted}`}>
              Powered by <span className={`font-semibold ${textColors.gradient}`}>SocioLink</span>
            </p>
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
                <div className="w-full max-w-sm mx-auto space-y-3 pb-10">
                  {profile.links.length > 0 ? profile.links.map((link) => {
                    const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                    const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link

                    return (
                      <div
                        key={link.id}
                        className={`w-full backdrop-blur-sm rounded-xl p-4 transition-all duration-200 relative overflow-hidden ${textColors.linkCard}`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                            style={{ 
                              backgroundColor: platform.color,
                              boxShadow: `0 4px 20px ${platform.color}40`
                            }}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1 text-left min-w-0">
                            <h3 className={`font-semibold text-base mb-1 transition-colors duration-300 ${textColors.primary}`}>
                              {link.title}
                            </h3>
                            <p className={`text-sm truncate transition-colors duration-300 ${textColors.muted}`}>
                              {link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                            </p>
                          </div>

                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            <ExternalLink className={`w-4 h-4 ${textColors.muted}`} />
                          </div>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="text-center py-12">
                      <p className="text-white/60 text-base">No links added yet</p>
                      <p className="text-white/40 text-sm mt-2">Add some links to see them here</p>
                    </div>
                  )}

                  {/* Footer - Desktop */}
                  <div className="pt-6 text-center">
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
