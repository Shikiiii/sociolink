'use client'

import React from 'react'
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
  { value: 'Patreon', label: 'Patreon', icon: 'DollarSign', color: '#FF424D' }
]

// Mock profile data
const mockProfile = {
  name: 'John Doe',
  username: 'johndoe',
  bio: 'Digital creator and developer passionate about connecting people through technology.',
  avatar: '',
  background: 'animated-3',
  blur: 20,
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
  const profile = mockProfile

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      {BackgroundComponent ? (
        <div className="absolute inset-0">
          <BackgroundComponent />
        </div>
      ) : (
        <div className={`absolute inset-0 ${getBackgroundClass(profile.background)}`} />
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30" />
      <div 
        className="absolute inset-0 z-10"
        style={{
          backdropFilter: `blur(${profile.blur}px)`,
          WebkitBackdropFilter: `blur(${profile.blur}px)`
        }}
      />

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
            {/* Profile Card - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden mb-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative z-10">
                {/* Avatar */}
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

                {/* Profile Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mb-6"
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-white/60 text-sm mb-3">@{profile.username}</p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                </motion.div>

                {/* Edit and Share Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/profile')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl px-4 py-3 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-sm">Edit</span>
                  </motion.button>
                  
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

            {/* Links Section - Mobile */}
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
                    className="group w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                      style={{ background: `linear-gradient(135deg, ${platform.color}40, transparent)` }}
                    />
                    
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
                        <h3 className="text-white font-semibold text-base mb-1">
                          {link.title}
                        </h3>
                        <p className="text-white/60 text-sm truncate">
                          {link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
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
              <p className="text-white/30 text-xs">
                Powered by <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SocioLink</span>
              </p>
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center lg:min-h-screen">
            {/* Left Side - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />
                
                <div className="relative z-10">
                  {/* Avatar */}
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

                  {/* Profile Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mb-8"
                  >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3">
                      {profile.name}
                    </h1>
                    <p className="text-white/60 text-base mb-4">@{profile.username}</p>
                    <p className="text-white/80 text-base leading-relaxed">
                      {profile.bio}
                    </p>
                  </motion.div>

                  {/* Edit and Share Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex gap-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/profile')}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl px-6 py-4 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Settings className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Edit</span>
                    </motion.button>
                    
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

            {/* Right Side - Links */}
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
                    className="group w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                      style={{ background: `linear-gradient(135deg, ${platform.color}40, transparent)` }}
                    />
                    
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
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {link.title}
                        </h3>
                        <p className="text-white/60 text-sm truncate">
                          {link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                        </p>
                      </div>

                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                        <ExternalLink className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
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
                <p className="text-white/30 text-sm">
                  Powered by <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SocioLink</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}