'use client'

import React, { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ExternalLink,
  Settings,
  Share2,
  Check,
  Link
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { backgroundPresets } from '@/app/components/backgrounds'
import { backgroundComponents } from '@/app/components/animated-backgrounds'
import { socialPlatforms } from '@/app/profile/constants'
import { iconMap } from '@/app/profile/utils/icons'

// Profile and Link interfaces
interface ProfileLink {
  id: string
  title: string
  url: string
  icon: string
}

interface Profile {
  name: string
  username: string
  bio: string
  avatar: string
  background: string
  blur: number
  customColor?: string
  links: ProfileLink[]
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// Calculate luminance (brightness)
const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// Determine if background is bright
const isBackgroundBright = (profile: Profile) => {
  // Handle custom colors
  if (profile.background?.startsWith('custom-') && profile.customColor) {
    const rgb = hexToRgb(profile.customColor)
    if (rgb) {
      const luminance = getLuminance(rgb.r, rgb.g, rgb.b)
      return luminance > 0.5
    }
  }
  
  // Handle preset backgrounds - add known bright ones
  const brightBackgrounds = [
    'gradient-3', 'gradient-6', 'gradient-8',
    'solid-1', 'solid-2', 'solid-4'
  ]
  
  return brightBackgrounds.includes(profile.background)
}

// Get text colors based on background brightness
const getTextColors = (profile: Profile) => {
  const isBright = isBackgroundBright(profile)
  
  return {
    primary: isBright ? 'text-gray-900' : 'text-white',
    secondary: isBright ? 'text-gray-700' : 'text-white/80',
    muted: isBright ? 'text-gray-500' : 'text-white/55',
    gradient: isBright ? 'text-gray-900' : 'text-white',
    // Container styles
    profileCard: isBright 
      ? 'bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-xl' 
      : 'bg-black/25 backdrop-blur-xl border border-white/10',
    linkCard: isBright 
      ? 'bg-white/75 border border-gray-200/60 shadow-sm hover:shadow-md' 
      : 'bg-black/20 border border-white/10',
    profileGlow: '',
    linkGlow: ''
  }
}

// Mock profile data
const mockProfile: Profile = {
  name: 'John Doe',
  username: 'johndoe',
  bio: 'Digital creator and developer passionate about connecting people through technology.',
  avatar: '',
  background: 'custom-6366f1',
  blur: 20,
  customColor: '#6366f1', // Add a default customColor property
  links: [
    { id: '1', title: 'Portfolio', url: 'https://johndoe.dev', icon: 'Link' },
    { id: '2', title: 'Instagram', url: 'https://instagram.com/johndoe', icon: 'Instagram' },
    { id: '3', title: 'Twitter', url: 'https://twitter.com/johndoe', icon: 'Twitter' },
    { id: '4', title: 'GitHub', url: 'https://github.com/johndoe', icon: 'Github' },
    { id: '5', title: 'YouTube', url: 'https://youtube.com/@johndoe', icon: 'Youtube' },
    { id: '6', title: 'Email', url: 'mailto:john@johndoe.dev', icon: 'Mail' },
  ]
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [isProfileAvailable, setIsProfileAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    // Fetch profile data from /api/view using POST with username
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/view?username=${encodeURIComponent(username)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();

        // Parse background and blur
        const [background, rawBlur] = data.website.background
          ? data.website.background.split('|')
          : [null, 0];
        let blur = rawBlur;
        if (blur === 'null' || blur === undefined) blur = 0;

        // Map socials to links
        const socials = Array.isArray(data.socials) ? data.socials : [];
        const links = socials.map((item: { order?: number; text: string; link: string; type: string }, idx: number) => ({
            id: item.order?.toString() ?? idx.toString(),
            title: item.text,
            url: item.link,
            icon: item.type
            ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
            : 'Link',
        }));

        const temp_username = username;

        setProfile({
          name: data.website.display_name,
          username: username,
          bio: data.website.bio,
          avatar: data.website.avatar,
          background: background || 'solid-1',
          blur: Number(blur) || 0,
          links,
        });

        // take access_token from cookies, take only the payload from it, there should be user_name in it, setUsername to user_name
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
          }
          return null;
        };

        const accessToken = getCookie('access_token');

        if (accessToken) {
          try {
            // JWT format: header.payload.signature
            const parts = accessToken.split('.');
            const payload = parts[1];
            if (payload) {
              // JWT base64url decode
              const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
              // Add padding if needed
              const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
              const decodedStr = atob(padded);
              const decoded = JSON.parse(decodedStr);
              if (decoded.user_name) {
                if (decoded.user_name === temp_username) {
                  setIsOwnProfile(true);
                }
              }
            }
          } catch {
            // ignore error
          }
        }

      } catch {
        setIsProfileAvailable(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const textColors = getTextColors(profile)
  const isBright = isBackgroundBright(profile)

  const getBackgroundClass = (bgId: string) => {
    return backgroundPresets.find(bg => bg.id === bgId)?.class || backgroundPresets[0].class
  }

  const getBackgroundComponent = (bgId: string) => {
    const bg = backgroundPresets.find(bg => bg.id === bgId)
    if (bg?.component && backgroundComponents[bg.component as keyof typeof backgroundComponents]) {
      return backgroundComponents[bg.component as keyof typeof backgroundComponents]
    }
    return null
  }

  const blurValue = profile.blur || 0

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = window.location.href
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const BackgroundComponent = getBackgroundComponent(profile.background)

  const [isCustomColor, setIsCustomColor] = useState<boolean>(false);
  const [whatCustomColor, setWhatCustomColor] = useState<string | null>(null);
  useEffect(() => {
    setIsCustomColor(profile.background.startsWith('custom-'));
    setWhatCustomColor('#' + profile.background.split("custom-")[1]);
  }, [profile])

  useEffect(() => {
    console.log("Custom color useEffect:", whatCustomColor);
  }, [whatCustomColor]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - update to handle custom colors and blur properly */}
      {isCustomColor ? (
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: whatCustomColor ? whatCustomColor : '#f0f0f0',
            filter: profile.blur > 0 ? `blur(${profile.blur * 0.3}px)` : 'none',
            transform: profile.blur > 0 ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 0.2s ease, transform 0.2s ease'
          }}
        />
      ) : (
      <>
      {/* Background Layer */}
      {profile.background.startsWith('custom-') ? (
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundColor: profile.customColor || `#${profile.background.split("custom-")[1]}`,
            filter: blurValue > 0 ? `blur(${blurValue * 0.3}px)` : 'none',
            transform: blurValue > 0 ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 0.2s ease, transform 0.2s ease'
          }}
        />
      ) : BackgroundComponent ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
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
        </div>
      ) : (
        <div 
          className={`absolute inset-0 z-0 ${getBackgroundClass(profile.background)}`}
          style={{
            filter: blurValue > 0 ? `blur(${blurValue * 0.3}px)` : 'none',
            transform: blurValue > 0 ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 0.2s ease, transform 0.2s ease'
          }}
        />
      )}
      </>
    )}

      <div className={`absolute inset-0 pointer-events-none ${isBright ? 'bg-black/10' : 'bg-black/20'}`} />

      {/* Content Container */}
      <div className="relative z-20 min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >

          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-screen">
              {/* Mobile Skeleton */}
              <div className="lg:hidden w-full max-w-md">
                <div className="backdrop-blur-xl rounded-3xl p-8 bg-black/25 border border-white/10 animate-pulse mb-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-white/20" />
                  </div>
                  <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="h-6 w-36 rounded-full bg-white/20" />
                    <div className="h-4 w-24 rounded-full bg-white/15" />
                    <div className="h-4 w-48 rounded-full bg-white/15" />
                    <div className="h-4 w-40 rounded-full bg-white/10" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-11 rounded-xl bg-white/15" />
                  </div>
                </div>
                <div className="w-full space-y-4 animate-pulse">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-xl p-4 bg-black/20 border border-white/10 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 rounded-full bg-white/20" />
                        <div className="h-3 w-36 rounded-full bg-white/15" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Desktop Skeleton */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center w-full max-w-6xl">
                <div className="flex justify-center">
                  <div className="w-full max-w-md backdrop-blur-xl rounded-3xl p-8 bg-black/25 border border-white/10 animate-pulse">
                    <div className="flex justify-center mb-8">
                      <div className="w-32 h-32 rounded-full bg-white/20" />
                    </div>
                    <div className="flex flex-col items-center gap-3 mb-8">
                      <div className="h-7 w-44 rounded-full bg-white/20" />
                      <div className="h-4 w-28 rounded-full bg-white/15" />
                      <div className="h-4 w-56 rounded-full bg-white/15" />
                      <div className="h-4 w-48 rounded-full bg-white/10" />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 h-14 rounded-xl bg-white/15" />
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-md mx-auto space-y-4 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl p-5 bg-black/20 border border-white/10 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-28 rounded-full bg-white/20" />
                        <div className="h-3 w-40 rounded-full bg-white/15" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!isLoading && isProfileAvailable && (
            <div className="flex flex-col items-center justify-center py-24">
              <h2 className="text-3xl font-bold mb-6 text-center text-white">
                This username is available.
              </h2>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 text-lg"
                onClick={() => router.push(`/register?username=${encodeURIComponent(username)}`)}
              >
                Claim it now
              </button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-8 text-center"
              >
                <p className={`text-sm transition-colors duration-300 ${textColors.muted}`}>
                  Powered by{' '}
                  <button
                    type="button"
                    className={`font-semibold ${textColors.gradient} focus:outline-none cursor-pointer hover:underline`}
                    onClick={() => router.push('/')}
                  >
                    SocioLink
                  </button>
                </p>
              </motion.div>
            </div>
          )}
          {!isLoading && !isProfileAvailable && (
            <div>
              {/* Mobile Layout */}
              <div className="flex flex-col items-center justify-center min-h-screen lg:hidden">
                {/* Profile Card - Mobile with dynamic styling */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden mb-6 transition-all duration-300 ${textColors.profileCard}`}
                >
                  
                  <div className="relative z-10">
                    {/* Avatar - same as before */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                        {profile.avatar ? (
                          <Image 
                            src={profile.avatar} 
                            alt={profile.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {profile.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Profile Info with dynamic colors */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-center mb-6"
                    >
                      <h1 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${textColors.gradient}`}>
                        {profile.name}
                      </h1>
                      <p className={`text-sm mb-3 transition-colors duration-300 ${textColors.muted}`}>@{profile.username}</p>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 ${textColors.secondary}`}>
                        {profile.bio}
                      </p>
                    </motion.div>

                    {/* Buttons - keep same styling as they work well */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex gap-3"
                    >
                      {isOwnProfile && (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push('/profile')}
                          className={`flex-1 border rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 ${isBright ? 'bg-black/10 hover:bg-black/20 border-black/15 text-gray-900' : 'bg-white/15 hover:bg-white/25 border-white/20 text-white'}`}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="font-medium text-sm">Edit</span>
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className={`flex-1 border rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center gap-2 ${isCopied ? (isBright ? 'bg-green-500/20 border-green-500/40 text-green-700' : 'bg-green-500/20 border-green-500/40 text-green-400') : (isBright ? 'bg-transparent hover:bg-black/10 border-black/15 text-gray-900' : 'bg-transparent hover:bg-white/10 border-white/20 text-white')}`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        <span className="font-medium text-sm">{isCopied ? 'Copied!' : 'Share'}</span>
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Links Section - Mobile with dynamic styling */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="w-full max-w-md space-y-4"
                >
                  {profile.links.map((link, index) => {
                    const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                    const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link

                    return (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        onClick={() => handleLinkClick(link.url)}
                        className={`group w-full backdrop-blur-sm rounded-xl p-4 transition-all duration-200 relative overflow-hidden ${textColors.linkCard}`}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                            style={{ 
                              backgroundColor: platform.color,
                              boxShadow: `0 4px 20px ${platform.color}40`
                            }}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1 text-left">
                            <h3 className={`font-semibold text-base mb-1 transition-colors duration-300 ${textColors.primary}`}>
                              {link.title}
                            </h3>
                            <p className={`text-sm truncate transition-colors duration-300 ${textColors.muted}`}>
                              {(() => {
                                const cleanUrl = link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')
                                const limit = 20
                                return cleanUrl.length > limit ? cleanUrl.substring(0, limit) + '...' : cleanUrl
                              })()}
                            </p>
                          </div>

                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                            <ExternalLink className={`w-4 h-4 transition-colors ${textColors.muted} group-hover:${textColors.primary}`} />
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </motion.div>

                {/* Footer - Mobile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="mt-8 text-center"
                >
                  <p className={`text-xs transition-colors duration-300 ${textColors.muted}`}>
                    Powered by <span className={`font-semibold ${textColors.gradient}`}>SocioLink</span>
                  </p>
                </motion.div>
              </div>

              {/* Desktop Layout - Apply same dynamic styling */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center lg:min-h-screen">
                {/* Left Side - Profile Card */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex justify-center"
                >
                  <div className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden transition-all duration-300 ${textColors.profileCard}`}>
                    
                    <div className="relative z-10">
                      {/* Avatar - same as before */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-8"
                      >
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                          {profile.avatar ? (
                            <Image 
                              src={profile.avatar} 
                              alt={profile.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-3xl font-bold">
                                {profile.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>

                      {/* Profile Info with dynamic colors */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mb-8"
                      >
                        <h1 className={`text-3xl font-bold mb-3 transition-colors duration-300 ${textColors.gradient}`}>
                          {profile.name}
                        </h1>
                        <p className={`text-base mb-4 transition-colors duration-300 ${textColors.muted}`}>@{profile.username}</p>
                        <p className={`text-base leading-relaxed transition-colors duration-300 ${textColors.secondary}`}>
                          {profile.bio}
                        </p>
                      </motion.div>

                      {/* Edit and Share Buttons - same as before */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex gap-4"
                      >
                        {isOwnProfile && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/profile')}
                            className={`flex-1 border rounded-xl px-6 py-4 transition-all duration-200 flex items-center justify-center gap-2 ${isBright ? 'bg-black/10 hover:bg-black/20 border-black/15 text-gray-900' : 'bg-white/15 hover:bg-white/25 border-white/20 text-white'}`}
                          >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Edit</span>
                          </motion.button>
                        )}
                        
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={handleShare}
                          className={`flex-1 border rounded-xl px-6 py-4 transition-all duration-200 flex items-center justify-center gap-2 ${isCopied ? (isBright ? 'bg-green-500/20 border-green-500/40 text-green-700' : 'bg-green-500/20 border-green-500/40 text-green-400') : (isBright ? 'bg-transparent hover:bg-black/10 border-black/15 text-gray-900' : 'bg-transparent hover:bg-white/10 border-white/20 text-white')}`}
                        >
                          {isCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                          <span className="font-medium">{isCopied ? 'Copied!' : 'Share'}</span>
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Side - Links with dynamic styling */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="w-full max-w-md mx-auto space-y-4"
                >
                  {profile.links.map((link, index) => {
                    const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                    const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link

                    return (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        onClick={() => handleLinkClick(link.url)}
                        className={`group w-full backdrop-blur-sm rounded-xl p-5 transition-all duration-200 relative overflow-hidden ${textColors.linkCard}`}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                            style={{ 
                              backgroundColor: platform.color,
                              boxShadow: `0 4px 20px ${platform.color}40`
                            }}
                          >
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>

                          <div className="flex-1 text-left">
                            <h3 className={`font-semibold text-lg mb-1 transition-colors duration-300 ${textColors.primary}`}>
                              {link.title}
                            </h3>
                            <p className={`text-sm truncate transition-colors duration-300 ${textColors.muted}`}>
                              {(() => {
                                const cleanUrl = link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')
                                const limit = 30
                                return cleanUrl.length > limit ? cleanUrl.substring(0, limit) + '...' : cleanUrl
                              })()}
                            </p>
                          </div>

                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                            <ExternalLink className={`w-5 h-5 transition-colors ${textColors.muted} group-hover:${textColors.primary}`} />
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                  {/* Footer - Desktop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="pt-8 text-center"
                  >
                    <p className={`text-sm transition-colors duration-300 ${textColors.muted}`}>
                      Powered by{' '}
                      <button
                        type="button"
                        className={`font-semibold ${textColors.gradient} focus:outline-none cursor-pointer hover:underline`}
                        onClick={() => router.push('/')}
                      >
                        SocioLink
                      </button>
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}