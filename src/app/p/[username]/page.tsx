'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Github, 
  Mail, 
  Link,
  Twitch,
  Facebook,
  Music,
  MessageCircle,
  CreditCard,
  Gamepad2,
  Coffee,
  Heart,
  DollarSign,
  Play,
  Camera,
  Headphones,
  ExternalLink,
  Settings,
  Share2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { backgroundPresets } from '@/app/components/backgrounds'
import { backgroundComponents } from '@/app/components/animated-backgrounds'

// Icon mapping
const iconMap = {
  Link,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Mail,
  Twitch,
  Facebook,
  Music,
  MessageCircle,
  CreditCard,
  Gamepad2,
  Coffee,
  Heart,
  DollarSign,
  Play,
  Camera,
  Headphones
}

// Social platforms data
const socialPlatforms = [
  { value: 'Link', label: 'Generic Link', icon: 'Link', color: '#6366f1' },
  { value: 'Instagram', label: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  { value: 'Twitter', label: 'Twitter/X', icon: 'Twitter', color: '#1DA1F2' },
  { value: 'Youtube', label: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  { value: 'Github', label: 'GitHub', icon: 'Github', color: '#333' },
  { value: 'Mail', label: 'Email', icon: 'Mail', color: '#EA4335' },
  { value: 'Twitch', label: 'Twitch', icon: 'Twitch', color: '#9146FF' },
  { value: 'Facebook', label: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  { value: 'TikTok', label: 'TikTok', icon: 'Play', color: '#000000' },
  { value: 'OnlyFans', label: 'OnlyFans', icon: 'Heart', color: '#00AFF0' },
  { value: 'Spotify', label: 'Spotify', icon: 'Music', color: '#1DB954' },
  { value: 'Snapchat', label: 'Snapchat', icon: 'Camera', color: '#FFFC00' },
  { value: 'Telegram', label: 'Telegram', icon: 'MessageCircle', color: '#0088CC' },
  { value: 'SoundCloud', label: 'SoundCloud', icon: 'Headphones', color: '#FF5500' },
  { value: 'PayPal', label: 'PayPal', icon: 'CreditCard', color: '#00457C' },
  { value: 'Roblox', label: 'Roblox', icon: 'Gamepad2', color: '#00A2FF' },
  { value: 'CashApp', label: 'CashApp', icon: 'DollarSign', color: '#00D632' },
  { value: 'GitLab', label: 'GitLab', icon: 'Github', color: '#FC6D26' },
  { value: 'Reddit', label: 'Reddit', icon: 'MessageCircle', color: '#FF4500' },
  { value: 'Steam', label: 'Steam', icon: 'Gamepad2', color: '#171A21' },
  { value: 'Kick', label: 'Kick', icon: 'Play', color: '#53FC18' },
  { value: 'Pinterest', label: 'Pinterest', icon: 'Camera', color: '#BD081C' },
  { value: 'LastFM', label: 'Last.fm', icon: 'Headphones', color: '#D51007' },
  { value: 'BuyMeACoffee', label: 'Buy Me a Coffee', icon: 'Coffee', color: '#FFDD00' },
  { value: 'Kofi', label: 'Ko-fi', icon: 'Heart', color: '#FF5E5B' },
  { value: 'Patreon', label: 'Patreon', icon: 'DollarSign', color: '#FF424D' },
  { value: 'Discord', label: 'Discord', icon: 'MessageCircle', color: '#5865f2'}
]

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
const isBackgroundBright = (profile: any) => {
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
const getTextColors = (profile: any) => {
  const isBright = isBackgroundBright(profile)
  
  return {
    primary: isBright ? 'text-gray-900' : 'text-white',
    secondary: isBright ? 'text-gray-700' : 'text-white/80',
    muted: isBright ? 'text-gray-600' : 'text-white/60',
    gradient: isBright 
      ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent',
    // Enhanced container styles
    profileCard: isBright 
      ? 'bg-white/10 backdrop-blur-xl border border-gray-500/30 shadow-2xl ring-1 ring-black/10' 
      : 'bg-white/5 backdrop-blur-xl border border-white/10',
    linkCard: isBright 
      ? 'bg-white/8 border border-gray-500/25 shadow-lg hover:shadow-xl ring-1 ring-black/5' 
      : 'bg-white/5 border border-white/10',
    profileGlow: isBright ? 'shadow-[0_0_50px_rgba(0,0,0,0.15)]' : '',
    linkGlow: isBright ? 'hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]' : ''
  }
}

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

export default function ProfilePage({ params }: { params: { username: string } }) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  // take username from the [username] (so like what, link query? path query?)

  useEffect(() => {
    // Fetch profile data from /api/view using POST with username
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/view?username=${encodeURIComponent(params.username)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();

        // Parse background and blur
        let [background, blur] = data.website.background
          ? data.website.background.split('|')
          : [null, 0];
        if (blur === 'null' || blur === undefined) blur = 0;

        // Map socials to links
        const socials = Array.isArray(data.socials) ? data.socials : [];
        const links = socials.map((item: any, idx: number) => ({
            id: item.order?.toString() ?? idx.toString(),
            title: item.text,
            url: item.link,
            icon: item.type
            ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
            : 'Link',
        }));

        setProfile({
          name: data.website.display_name,
          username: params.username,
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
                if ( decoded.user_name === profile.username ) { setIsOwnProfile(true) };
              }
            }
          } catch (e) {
            // ignore errors
          }
        }

      } catch (err) {
        router.push('/');
        // fallback to mockProfile on error
        setProfile(mockProfile);
      }
    };

    fetchProfile();
  }, []);

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

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} - SocioLink`,
          text: profile.bio,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
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
      ) : BackgroundComponent ? (
        <div 
          className="absolute inset-0"
          style={{
            filter: profile.blur > 0 ? `blur(${profile.blur * 0.3}px)` : 'none',
            transform: profile.blur > 0 ? 'scale(1.1)' : 'scale(1)',
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
            filter: profile.blur > 0 ? `blur(${profile.blur * 0.3}px)` : 'none',
            transform: profile.blur > 0 ? 'scale(1.05)' : 'scale(1)',
            transition: 'filter 0.2s ease, transform 0.2s ease'
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30" />

      {/* Content Container */}
      <div className="relative z-20 min-h-screen p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Mobile Layout */}
          <div className="flex flex-col items-center justify-center min-h-screen lg:hidden">
            {/* Profile Card - Mobile with dynamic styling */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden mb-6 transition-all duration-300 ${textColors.profileCard} ${textColors.profileGlow}`}
            >
              {/* Conditional gradient effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />
              
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
                      <img 
                        src={profile.avatar} 
                        alt={profile.name}
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
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/profile')}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl px-4 py-3 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-white" />
                      <span className="text-white font-medium text-sm">Edit</span>
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-sm">Share</span>
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
                    className={`group w-full backdrop-blur-sm rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden ${textColors.linkCard} ${textColors.linkGlow}`}
                  >
                    {!isBright && (
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                        style={{ background: `linear-gradient(135deg, ${platform.color}40, transparent)` }}
                      />
                    )}
                    
                    <div className="relative flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg"
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
                          {link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
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
              <div className={`w-full max-w-md backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden transition-all duration-300 ${textColors.profileCard} ${textColors.profileGlow}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />
                
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
                        <img 
                          src={profile.avatar} 
                          alt={profile.name}
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
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/profile')}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl px-6 py-4 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Settings className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Edit</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-4 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Share</span>
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
                    className={`group w-full backdrop-blur-sm rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden ${textColors.linkCard} ${textColors.linkGlow}`}
                  >
                    {!isBright && (
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                        style={{ background: `linear-gradient(135deg, ${platform.color}40, transparent)` }}
                      />
                    )}
                    
                    <div className="relative flex items-center gap-4">
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg"
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
                          {link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
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
        </motion.div>
      </div>
    </div>
  )
}