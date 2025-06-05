'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { backgroundComponents } from '@/app/components/animated-backgrounds'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Mail, 
  Link, 
  Instagram, 
  Twitter, 
  Youtube, 
  Github,
  Plus,
  Trash2,
  Settings,
  Eye,
  Smartphone,
  Monitor,
  Upload,
  GripVertical,
  Palette,
  ChevronDown,
  ChevronUp,
  Edit,
  Search,
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
  Share2,
  ExternalLink,
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Header from '@/app/components/header'
import { backgroundPresets, mobilePresets } from '@/app/components/backgrounds'

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

interface Profile {
  name: string | null,
  bio: string | null,
  avatar: string | null,
  background: string,
  blur?: number,
  avatarFile?: File;
  links: {
    id: string,
    title: string,
    url: string,
    icon: string,
  }[]
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
const isBackgroundBright = (profile: any) => {
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
const getTextColors = (profile: any) => {
  const isBright = isBackgroundBright(profile)
  
  return {
    primary: isBright ? 'text-gray-900' : 'text-white',
    secondary: isBright ? 'text-gray-700' : 'text-white/80',
    muted: isBright ? 'text-gray-600' : 'text-white/60',
    gradient: isBright 
      ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'
      : 'bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent',
    // Enhanced container styles - keep glassy but add better shadows
    profileCard: isBright 
      ? 'bg-white/10 backdrop-blur-xl border border-gray-500/30 shadow-2xl ring-1 ring-black/10' 
      : 'bg-white/5 backdrop-blur-xl border border-white/10',
    linkCard: isBright 
      ? 'bg-white/8 border border-gray-500/25 shadow-lg hover:shadow-xl ring-1 ring-black/5' 
      : 'bg-white/5 border border-white/10',
    // Add glow effects for bright backgrounds
    profileGlow: isBright ? 'shadow-[0_0_50px_rgba(0,0,0,0.15)]' : '',
    linkGlow: isBright ? 'hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]' : ''
  }
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bio: "",
    avatar: "",
    background: "",
    blur: 0,
    links: [

    ]
  });
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

    const [initialProfile, setInitialProfile] = useState<Profile | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Replace the problematic useEffect with this:
    useEffect(() => {
    if (!isLoaded) return; // Don't track changes until initial load is complete
    
    // Compare current profile with initial profile to determine if dirty
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    setIsDirty(hasChanges);
    }, [profile, initialProfile, isLoaded]);

  const saveChanges = async () => {
    // Save socials (links)
    let s = await fetch('/api/website/edit_socials', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      socials: profile.links.map((link, idx) => ({
        type: link.icon,
        link: link.url,
        order: idx + 1,
        text: link.title,
      }))
      })
    });

    if (!s.ok) {
      const errorJson = await s.json();
      setError(errorJson.error || "An unexpected error occured and your changes were not saved.");
      return;
    }

    // Save profile info as FormData (for avatar file support)
    const formData = new FormData();
    formData.append('display_name', profile.name ?? '');
    formData.append('bio', profile.bio ?? '');
    formData.append('background', profile.background + "|" + String(profile.blur));

    // If avatar is a File object (user uploaded), append it; otherwise, skip
    if (profile.avatarFile instanceof File) {
      formData.append('avatar', profile.avatarFile);
    }

    let e = await fetch('/api/website/edit', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    if (!e.ok) {
        const errorJson = await e.json();
        setError(errorJson.error || "An unexpected error occured and your changes were not saved.");
        return;
    }

    // After successful save, update initial profile to current state
    setInitialProfile({ ...profile });
    setIsDirty(false);
    }

    useEffect(() => {
    // Check for access_token and refresh_token cookies
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
    };

    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');

    if (!accessToken || !refreshToken) {
        window.location.href = '/login';
        return;
    }

    // Helper to fetch with auth and handle 401
    const fetchWithAuth = async (url: string) => {
        let res = await fetch(url, { credentials: 'include' });
        if (res.status === 401) {
        // Try to refresh token
        await fetch('/api/auth/refresh', { credentials: 'include' });
        res = await fetch(url, { credentials: 'include' });
        }
        return res;
    };

    // Fetch profile data
    (async () => {
        try {
        const profileRes = await fetchWithAuth('/api/website/get_data');
        const socialsRes = await fetchWithAuth('/api/website/get_socials');

        let finalProfile: Profile = {
            name: "",
            bio: "",
            avatar: "",
            background: "",
            blur: 0,
            links: []
        };

        if (profileRes.ok) {
            const data = await profileRes.json();
            let [background, blur] = data.data.background !== null && data.data.background !== undefined ? data.data.background.split("|") : [null, 0];
            if (blur === 'null') blur = 0;

            finalProfile = {
            name: data.data.display_name,
            bio: data.data.bio,
            avatar: data.data.avatar,
            background: background,
            blur: blur,
            links: []
            };
        }

        if (socialsRes.ok) {
            const socials = await socialsRes.json();
            const links = socials.map((item: any, idx: number) => ({
            id: item.order,
            title: item.text,
            url: item.link,
            icon: item.type.charAt(0).toUpperCase() + item.type.slice(1)
            })).sort((a: any, b: any) => Number(a.id) - Number(b.id));

            finalProfile.links = links;
        }

        // Set both current and initial profile, then mark as loaded
        setProfile(finalProfile);
        setInitialProfile(finalProfile);
        setIsLoaded(true);

        } catch (err) {
        // fallback: redirect to login on error
        window.location.href = '/login';
        }
    })();
    }, [])

  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'Link' })
  const [prevIcon, setPrevIcon] = useState(newLink.icon);
  const [isMobileView, setIsMobileView] = useState(false)
  const [selectedMobilePreset, setSelectedMobilePreset] = useState(mobilePresets[0])
  const [showBackgrounds, setShowBackgrounds] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false) // New state for mobile toggle

  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

  useEffect(() => {
    // can we detect if newLink.icon is changed from previous one, and if it is, clear out the url field?
    // Track previous icon to detect changes
    if (newLink.icon !== prevIcon) {
      setNewLink((prev: any) => ({ ...prev, url: '' }));
      setPrevIcon(newLink.icon);
    }


    // Auto-format username to URL for supported platforms
    // Map of platform value to URL pattern (use {username} as placeholder)
    const usernameUrlPatterns: Record<string, string> = {
      Instagram: "https://instagram.com/{username}",
      Twitter: "https://twitter.com/{username}",
      Youtube: "https://youtube.com/@{username}",
      Github: "https://github.com/{username}",
      Twitch: "https://twitch.tv/{username}",
      Facebook: "https://facebook.com/{username}",
      TikTok: "https://tiktok.com/@{username}",
      OnlyFans: "https://onlyfans.com/{username}",
      Spotify: "https://open.spotify.com/user/{username}",
      Snapchat: "https://snapchat.com/add/{username}",
      Telegram: "https://t.me/{username}",
      SoundCloud: "https://soundcloud.com/{username}",
      PayPal: "https://paypal.me/{username}",
      Roblox: "https://roblox.com/users/{username}/profile",
      CashApp: "https://cash.app/${username}",
      GitLab: "https://gitlab.com/{username}",
      Reddit: "https://reddit.com/u/{username}",
      Steam: "https://steamcommunity.com/id/{username}",
      Kick: "https://kick.com/{username}",
      Pinterest: "https://pinterest.com/{username}",
      LastFM: "https://last.fm/user/{username}",
      BuyMeACoffee: "https://buymeacoffee.com/{username}",
      Kofi: "https://ko-fi.com/{username}",
      Patreon: "https://patreon.com/{username}",
      Mail: "mailto:",
      Discord: "https://discordapp.com/users/{username}",
    };

    // Helper to check if a string is a valid URL
    function isValidUrl(str: string) {
      try {
      new URL(str);
      return true;
      } catch {
      return false;
      }
    }

    // Helper to check if a string is a single word (username)
    function isSingleWord(str: string) {
      return /^[a-zA-Z0-9_.-]+$/.test(str) && !str.includes(" ");
    }

    // If newLink.url is not a valid URL and is a single word, auto-format
    if (
      newLink.url &&
      !isValidUrl(newLink.url) &&
      isSingleWord(newLink.url) &&
      usernameUrlPatterns[newLink.icon]
    ) {
      setNewLink((prev: any) => ({
      ...prev,
      url: usernameUrlPatterns[newLink.icon].replace("{username}", prev.url),
      }));
    }
  }, [newLink]);

  useEffect(() => {
    if (selectedBackground === null) return;

    console.log("Changing background...");
    setIsDirty(true);
  }, [selectedBackground])

  const iconMap = {
    Link,
    Instagram,
    Twitter,
    Youtube,
    Github,
    Mail,
    User,
    Twitch,
    Facebook,
    Music, // For Spotify, SoundCloud, Last.fm
    MessageCircle, // For Telegram, Snapchat
    CreditCard, // For PayPal, CashApp
    Gamepad2, // For Roblox, Steam, Kick
    Coffee, // For Buy Me a Coffee
    Heart, // For Ko-fi, OnlyFans
    DollarSign, // For Patreon
    Play, // For TikTok
    Camera, // For Pinterest
    Headphones // For SoundCloud, Last.fm
  }

  const addLink = () => {
    if (newLink.title && newLink.url) {
      setProfile(prev => ({
        ...prev,
        links: [...prev.links, { ...newLink, id: Date.now().toString() }]
      }))
      setNewLink({ title: '', url: '', icon: 'Link' })
      console.log("Adding link...");
      setIsDirty(true);
    }
  }

  const removeLink = (id: string) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }))
    console.log("Removing link...");
    setIsDirty(true);
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(profile.links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setProfile(prev => ({ ...prev, links: items }))
    console.log("Handling drag end...");
    setIsDirty(true);
  }

  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfile(prev => ({
            ...prev,
            avatar: e.target?.result as string,    // Base64 for preview
            avatarFile: file                       // Actual File for backend
          }));
        };
        reader.readAsDataURL(file);
        setIsDirty(true);
      }
    };

    input.click();
  };

  const getBackgroundClass = (bgId: string) => {
    return backgroundPresets.find(bg => bg.id === bgId)?.class || backgroundPresets[0].class
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 gap-6">
        {/* Left Sidebar - Edit Panel */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-1/3 min-h-screen bg-card border border-border rounded-2xl p-6 overflow-y-auto shadow-lg"
          style={{ marginTop: '2rem', marginBottom: '2rem' }}
        >
          <EditPanel 
            profile={profile}
            setProfile={setProfile}
            newLink={newLink}
            setNewLink={setNewLink}
            isMobileView={isMobileView}
            setIsMobileView={setIsMobileView}
            selectedMobilePreset={selectedMobilePreset}
            setSelectedMobilePreset={setSelectedMobilePreset}
            showBackgrounds={showBackgrounds}
            setShowBackgrounds={setShowBackgrounds}
            addLink={addLink}
            removeLink={removeLink}
            handleDragEnd={handleDragEnd}
            handleAvatarUpload={handleAvatarUpload}
            iconMap={iconMap}
            saveChanges={saveChanges}
            error={error}
            isDirty={isDirty}
          />
        </motion.div>

        {/* Right Panel - Preview */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1"
          style={{ marginTop: '2rem', marginBottom: '2rem' }}
        >
          <DesktopPreview 
            profile={profile}
            getBackgroundClass={getBackgroundClass}
            iconMap={iconMap}
            isMobileView={isMobileView}
            selectedMobilePreset={selectedMobilePreset}
          />
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen relative">
        {/* Mobile Edit/Preview Toggle */}
        <AnimatePresence mode="wait">
          {isPreviewMode ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-screen"
        >
          <MobileFullPreview 
            profile={profile}
            getBackgroundClass={getBackgroundClass}
            iconMap={iconMap}
          />
        </motion.div>
          ) : (
        <motion.div
          key="edit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-card p-4 pb-24"
        >
          <MobileEditPanel 
            profile={profile}
            setProfile={setProfile}
            newLink={newLink}
            setNewLink={setNewLink}
            showBackgrounds={showBackgrounds}
            setShowBackgrounds={setShowBackgrounds}
            addLink={addLink}
            removeLink={removeLink}
            handleDragEnd={handleDragEnd}
            handleAvatarUpload={handleAvatarUpload}
            iconMap={iconMap}
            saveChanges={saveChanges}
            error={error}
            isDirty={isDirty}
          />
        </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform"
        >
          {isPreviewMode ? <Edit className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Dirty State Notification */}
    {isDirty && (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg z-50 font-medium"
    >
        Changes may not be saved until you click{' '}
        <button 
        onClick={saveChanges}
        className="font-bold underline hover:bg-yellow-500 px-1 rounded transition-colors cursor-pointer"
        >
        Save Changes
        </button>.
    </motion.div>
    )}
    </div>
  )
}

// Desktop Preview Component (Redesigned)
const DesktopPreview = ({ profile, getBackgroundClass, iconMap, isMobileView, selectedMobilePreset }: any) => (
  <div className="sticky top-8 h-[calc(100vh-4rem)]">
    {/* Preview Header */}
    <div className="flex items-center justify-center gap-2 mb-4 bg-card border border-border rounded-2xl p-3 shadow-lg">
      <Eye className="w-4 h-4 text-accent" />
      <h1 className="text-lg font-bold text-foreground">Preview</h1>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {isMobileView ? <Smartphone className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
        {isMobileView ? selectedMobilePreset.name : 'Desktop'}
      </div>
    </div>

    {/* Preview Container */}
    <div className="h-[calc(100%-4rem)] rounded-2xl overflow-hidden border border-border shadow-lg">
      {isMobileView ? (
        // Mobile Frame Preview - BIGGER PHONE
        <div className="h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div 
        className="px-4relative bg-gray-900 rounded-[2rem] shadow-2xl p-2 border-2 border-gray-700"
        style={{
          // Allow larger width/height for tablets, but cap at a max (e.g., 420x800)
          width: Math.min(selectedMobilePreset.width, 420) + 16,
          height: Math.min(selectedMobilePreset.height, 800) + 16,
        }}
        >
        <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-black">
          <div
            style={{
              width: selectedMobilePreset.width,
              height: selectedMobilePreset.height,
              // Only scale down if device is wider than max allowed
              transform: `scale(${Math.min(1, 420 / selectedMobilePreset.width)})`,
              transformOrigin: 'top left',
            }}
          >
            <ProfilePreview 
              profile={profile} 
              getBackgroundClass={getBackgroundClass} 
              iconMap={iconMap} 
              isMobile={true} 
            />
          </div>
        </div>
        </div>
        </div>
      ) : (
        // Desktop Preview - Fixed scrolling
        <div className="h-full">
          <ProfilePreview 
            profile={profile} 
            getBackgroundClass={getBackgroundClass} 
            iconMap={iconMap} 
            isMobile={false} 
            isDesktopPreview={true}
          />
        </div>
      )}
    </div>
  </div>
)

// Mobile Full Screen Preview
const MobileFullPreview = ({ profile, getBackgroundClass, iconMap }: any) => {
  const backgroundPreset = backgroundPresets.find(bg => bg.id === profile.background)
  const BackgroundComponent = backgroundPreset?.component ? backgroundComponents[backgroundPreset.component as keyof typeof backgroundComponents] : null

  return (
    <div className="w-full h-full">
      <ProfilePreview 
        profile={profile} 
        getBackgroundClass={getBackgroundClass} 
        iconMap={iconMap} 
        isMobile={true} 
      />
    </div>
  )
}

// Main Edit Panel for Desktop
const EditPanel = ({ 
  profile, setProfile, newLink, setNewLink, isMobileView, setIsMobileView,
  selectedMobilePreset, setSelectedMobilePreset, showBackgrounds, setShowBackgrounds,
  addLink, removeLink, handleDragEnd, handleAvatarUpload, iconMap, error, isDirty,
  saveChanges
}: any) => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center gap-2 mb-8">
      <Settings className="w-5 h-5 text-accent" />
      <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
    </div>

    {/* Preview Toggle */}
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Preview Mode</h2>
      <div className="flex gap-2">
        <Button
          onClick={() => setIsMobileView(false)}
          variant={!isMobileView ? "default" : "outline"}
          size="sm"
          className="flex-1"
        >
          <Monitor className="w-4 h-4 mr-2" />
          Desktop
        </Button>
        <Button
          onClick={() => setIsMobileView(true)}
          variant={isMobileView ? "default" : "outline"}
          size="sm"
          className="flex-1"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Mobile
        </Button>
      </div>
      
      {isMobileView && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Device Preset
          </label>
          <select
            value={selectedMobilePreset.name}
            onChange={(e) => setSelectedMobilePreset(mobilePresets.find(p => p.name === e.target.value) || mobilePresets[0])}
            className="w-full p-2 rounded-md border border-border bg-background text-foreground text-sm"
          >
            {mobilePresets.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name} ({preset.width}×{preset.height})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>

    {/* Profile Info */}
    <ProfileInfoSection 
      profile={profile}
      setProfile={setProfile}
      handleAvatarUpload={handleAvatarUpload}
    />

    {/* Background Selection */}
    <BackgroundSection 
      profile={profile}
      setProfile={setProfile}
      showBackgrounds={showBackgrounds}
      setShowBackgrounds={setShowBackgrounds}
    />

    {/* Links Management */}
    <LinksSection 
      profile={profile}
      setProfile={setProfile}
      newLink={newLink}
      setNewLink={setNewLink}
      addLink={addLink}
      removeLink={removeLink}
      handleDragEnd={handleDragEnd}
      iconMap={iconMap}
      socialPlatforms={socialPlatforms}
    />

    {/* Save Button */}
    {/* Error message display */}
    {error && (
      <p className="text-sm text-red-500 min-h-[1.5em]">{error}</p>
    )}

    <Button className="w-full" size="lg" onClick={saveChanges} disabled={isDirty === false}>
      Save Changes
    </Button>
  </div>
)

// Mobile Edit Panel (Full Screen version)
const MobileEditPanel = ({ 
  profile, setProfile, newLink, setNewLink, showBackgrounds, setShowBackgrounds,
  addLink, removeLink, handleDragEnd, handleAvatarUpload, iconMap, saveChanges, error, isDirty
}: any) => (
  <div className="space-y-6 pt-10">
    <div className="flex items-center gap-2 mb-6">
      <Settings className="w-5 h-5 text-accent" />
      <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
    </div>

    {/* Profile Info */}
    <ProfileInfoSection 
      profile={profile}
      setProfile={setProfile}
      handleAvatarUpload={handleAvatarUpload}
    />

    {/* Background Selection */}
    <BackgroundSection 
      profile={profile}
      setProfile={setProfile}
      showBackgrounds={showBackgrounds}
      setShowBackgrounds={setShowBackgrounds}
      compact={true}
    />

    {/* Links Management */}
    <LinksSection 
      profile={profile}
      setProfile={setProfile}
      newLink={newLink}
      setNewLink={setNewLink}
      addLink={addLink}
      removeLink={removeLink}
      handleDragEnd={handleDragEnd}
      iconMap={iconMap}
    />

    {/* Save Button */}
    {/* Error message display */}
    {error && (
      <p className="text-sm text-red-500 min-h-[1.5em]">{error}</p>
    )}

    <Button className="w-full" size="lg" onClick={saveChanges} disabled={isDirty === false}>
      Save Changes
    </Button>
  </div>
)

// Component Sections
const ProfileInfoSection = ({ profile, setProfile, handleAvatarUpload }: any) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
    
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Profile Picture
      </label>
      <button
        onClick={handleAvatarUpload}
        className="flex items-center gap-3 w-full p-3 rounded-lg border border-border hover:border-accent/50 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center border-2 border-accent/30 overflow-hidden">
          {profile.avatar ? (
            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-accent" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground">Click to upload</p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
        </div>
        <Upload className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Display Name
      </label>
      <Input
        value={profile.name}
        onChange={(e) => setProfile((prev: any) => ({ ...prev, name: e.target.value }))}
        placeholder="Your display name"
        className="w-full"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Bio
      </label>
      <Textarea
        value={profile.bio}
        onChange={(e) => setProfile((prev: any) => ({ ...prev, bio: e.target.value }))}
        placeholder="Tell people about yourself..."
        rows={3}
        className="w-full resize-none"
      />
    </div>
  </div>
)

const BackgroundSection = ({ profile, setProfile, showBackgrounds, setShowBackgrounds, compact = false }: any) => {
  const [customColor, setCustomColor] = useState('#667eea')

  const categorizedBackgrounds = backgroundPresets.reduce((acc, bg) => {
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

            {/* Custom Color Section - Always Visible */}
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
              {Object.entries(categorizedBackgrounds).map(([category, backgrounds]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className={`grid ${compact ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
                    {backgrounds.map((bg) => (
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
                        {bg.component && (
                          <div className="absolute top-1 right-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          </div>
                        )}
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

// New Background Thumbnail Component
const BackgroundThumbnail = React.memo(({ background }: { background: any }) => {
  // Don't render animated components in thumbnails - use static previews instead
  if (background.component) {
    // Create static previews for animated backgrounds
    const staticPreviews: Record<string, string> = {
      'ParticleFloat': 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
      'ParticleWeb': 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700',
      'MatrixRain': 'bg-gradient-to-b from-green-900 to-black',
      'DNAHelix': 'bg-gradient-to-br from-indigo-900 to-purple-900',
      // Add more mappings
    }

    return (
      <div className="relative w-full h-full">
        <div className={`w-full h-full ${staticPreviews[background.component] || 'bg-gray-500'}`} />
        {/* Animated indicator */}
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  return <div className={`w-full h-full ${background.class}`} />
})

const LinksSection = ({ profile, setProfile, newLink, setNewLink, addLink, removeLink, handleDragEnd, iconMap }: any) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState({ title: '', url: '', icon: '' })

  const filteredPlatforms = socialPlatforms.filter(platform =>
    platform.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedPlatform = socialPlatforms.find(p => p.value === newLink.icon) || socialPlatforms[0]

  const startEditing = (link: any) => {
    setEditingLinkId(link.id)
    setEditingLink({ title: link.title, url: link.url, icon: link.icon })
  }

  const saveEdit = () => {
    if (editingLink.title && editingLink.url && editingLinkId) {
      setProfile((prev: any) => ({
        ...prev,
        links: prev.links.map((link: any) => 
          link.id === editingLinkId 
            ? { ...link, title: editingLink.title, url: editingLink.url, icon: editingLink.icon }
            : link
        )
      }))
      setEditingLinkId(null)
      setEditingLink({ title: '', url: '', icon: '' })
    }
  }

  const cancelEdit = () => {
    setEditingLinkId(null)
    setEditingLink({ title: '', url: '', icon: '' })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Manage Links</h2>
      
      {/* Add New Link */}
      <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
        <h3 className="text-sm font-medium text-foreground">Add New Link</h3>
        
        <Input
          value={newLink.title}
          onChange={(e) => setNewLink((prev: any) => ({ ...prev, title: e.target.value }))}
          placeholder="Link title"
          className="w-full"
        />
        
        <Input
          value={newLink.url}
          onChange={(e) => setNewLink((prev: any) => ({ ...prev, url: e.target.value }))}
          placeholder="https://example.com or username"
          className="w-full"
        />

        {selectedPlatform.label === "Discord" && (
          <div className="text-xs text-muted-foreground mt-1 mb-2">
            Discord uses your user ID instead of your username.{" "}
            <a
              href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-accent-foreground hover:text-accent-foreground/70"
            >
              Find out how to get your user ID here
            </a>
            .
          </div>
        )}

        {/* Enhanced Platform Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-3 rounded-md border border-border bg-background text-foreground flex items-center justify-between hover:border-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: selectedPlatform.color }}
              >
                {React.createElement(iconMap[selectedPlatform.icon as keyof typeof iconMap], {
                  className: "w-3 h-3 text-white"
                })}
              </div>
              <span className="text-sm">{selectedPlatform.label}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-hidden"
              >
                {/* Search */}
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search platforms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm bg-muted/30 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Platform List */}
                <div className="max-h-48 overflow-y-auto">
                  {filteredPlatforms.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No platforms found
                    </div>
                  ) : (
                    filteredPlatforms.map((platform) => (
                      <button
                        key={platform.value}
                        onClick={() => {
                          setNewLink((prev: any) => ({ ...prev, icon: platform.value }))
                          setIsDropdownOpen(false)
                          setSearchTerm('')
                        }}
                        className={`w-full p-2 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                          selectedPlatform.value === platform.value ? 'bg-muted/30' : ''
                        }`}
                      >
                        <div 
                          className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: platform.color }}
                        >
                          {React.createElement(iconMap[platform.icon as keyof typeof iconMap], {
                            className: "w-4 h-4 text-white"
                          })}
                        </div>
                        <span className="text-sm font-medium">{platform.label}</span>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Button onClick={addLink} className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {/* Existing Links */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Current Links</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {profile.links.map((link: any, index: number) => {
                  const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                  const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link
                  const isEditing = editingLinkId === link.id
                  
                  return (
                    <Draggable key={String(link.id)} draggableId={String(link.id)} index={index} isDragDisabled={isEditing}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border border-border rounded-md transition-all ${
                            snapshot.isDragging ? 'shadow-lg scale-105' : ''
                          } ${isEditing ? 'bg-muted/40 ring-2 ring-accent/30' : 'bg-muted/20'}`}
                        >
                          {isEditing ? (
                            // Edit Mode
                            <div className="p-3 space-y-3">
                              <Input
                                value={editingLink.title}
                                onChange={(e) => setEditingLink(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Link title"
                                className="w-full"
                                autoFocus
                              />
                              <Input
                                value={editingLink.url}
                                onChange={(e) => setEditingLink(prev => ({ ...prev, url: e.target.value }))}
                                placeholder="https://example.com"
                                className="w-full"
                              />
                              
                              {/* Platform selector for editing */}
                              <div className="relative">
                                <select
                                  value={editingLink.icon}
                                  onChange={(e) => setEditingLink(prev => ({ ...prev, icon: e.target.value }))}
                                  className="w-full p-2 rounded-md border border-border bg-background text-foreground text-sm"
                                >
                                  {socialPlatforms.map((platform) => (
                                    <option key={platform.value} value={platform.value}>
                                      {platform.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button onClick={saveEdit} size="sm" className="flex-1">
                                  Save
                                </Button>
                                <Button onClick={cancelEdit} variant="outline" size="sm" className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="flex items-center gap-2 p-2">
                              <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div 
                                className="w-6 h-6 rounded-sm flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: platform.color }}
                              >
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                                <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                              </div>
                              <Button
                                onClick={() => startEditing(link)}
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => removeLink(link.id)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}

// Profile Preview Component (Redesigned for better desktop view)
const ProfilePreview = ({ profile, getBackgroundClass, iconMap, isMobile, isDesktopPreview = false }: any) => {
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
      } catch (e) {
        // ignore errors
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background - same as before */}
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

      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30" />
      
      {/* Content */}
      {isMobile ? (
        // Mobile Layout
        <div className="relative z-20 h-full p-4 flex flex-col items-center justify-center pt-10">
                <div className={`w-full max-w-sm backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden mb-4 transition-all duration-300 ${textColors.profileCard} ${textColors.profileGlow}`}>
                {/* Keep the gradient effects - they work with the glass look */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />
                
                <div className="relative z-10">
              {/* Avatar - same as before */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name}
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

              {/* Profile Info with dynamic text colors */}
              <div className="text-center mb-4">
                <h1 className={`text-lg font-bold mb-1 transition-colors duration-300 ${textColors.gradient}`}>
                  {profile.name || 'Your Name'}
                </h1>
                <p className={`text-xs mb-2 transition-colors duration-300 ${textColors.muted}`}>@{username}</p>
                <p className={`text-xs leading-relaxed transition-colors duration-300 ${textColors.secondary}`}>
                  {profile.bio || 'Your bio will appear here...'}
                </p>
              </div>

              {/* Buttons - same as before */}
              <div className="flex gap-2">
                <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg px-3 py-2 flex items-center justify-center gap-1">
                  <Settings className="w-3 h-3 text-white" />
                  <span className="text-white font-medium text-xs">Edit</span>
                </div>
                
                <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-2 flex items-center justify-center gap-1">
                  <Share2 className="w-3 h-3 text-white" />
                  <span className="text-white font-medium text-xs">Share</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Section with dynamic text colors */}
          <div className="w-full max-w-sm space-y-2 flex-1 overflow-y-auto">
            {profile.links.length > 0 ? profile.links.map((link: any) => {
              const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
              const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link

              return (
                    <div
                      key={link.id}
                      className={
                        `group w-full backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 relative overflow-hidden ${textColors.linkCard} ${textColors.linkGlow}` +
                        (!isMobile ? " hover:scale-[1.02] hover:shadow-xl" : "")
                      }
                    >
                    <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                        style={{ background: `linear-gradient(135deg, ${platform.color}40, transparent)` }}
                    />
                    
                    <div className="relative flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 shadow-lg"
                      style={{ 
                        backgroundColor: platform.color,
                        boxShadow: `0 4px 20px ${platform.color}40`
                      }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 text-left">
                      <h3 className={`font-semibold text-sm mb-0.5 transition-colors duration-300 ${textColors.primary}`}>
                        {link.title}
                      </h3>
                      <p className={`text-xs truncate transition-colors duration-300 ${textColors.muted}`}>
                        {link.url.replace(/^https?:\/\//, '').replace(/^mailto:/, '')}
                      </p>
                    </div>

                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                      <ExternalLink className={`w-3 h-3 transition-colors ${textColors.muted} group-hover:text-white`} />
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
          <div className="mt-4 text-center">
            <p className={`text-xs transition-colors duration-300 ${textColors.muted}`}>
              Powered by <span className={`font-semibold ${textColors.gradient}`}>SocioLink</span>
            </p>
          </div>
        </div>
      ) : (
        // Desktop Layout - Left profile, right links
        <div className="relative z-20 h-full overflow-y-auto">
          <div className="min-h-full p-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-8 items-center min-h-[80vh]">
                
                {/* Left Side - Profile Card */}
                <div className="flex justify-center">
                        <div className={`w-full max-w-sm backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${textColors.profileCard} ${textColors.profileGlow}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50" />
                        
                        <div className="relative z-10">
                      {/* Avatar */}
                      <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                          {profile.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt={profile.name}
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
                        <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
                          <Settings className="w-4 h-4 text-white" />
                          <span className="text-white font-medium text-sm">Edit</span>
                        </div>
                        
                        <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
                          <Share2 className="w-4 h-4 text-white" />
                          <span className="text-white font-medium text-sm">Share</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Links */}
                <div className="w-full max-w-sm mx-auto space-y-3">
                  {profile.links.length > 0 ? profile.links.map((link: any) => {
                    const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                    const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link

                    return (
                            <div
                            key={link.id}
                            className={`group w-full backdrop-blur-sm rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden ${textColors.linkCard} ${textColors.linkGlow}`}
                            >
                            <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                                style={{ background: `linear-gradient(135deg, ${platform.color}40, transparent)` }}
                            />
                            
                            <div className="relative flex items-center gap-3">
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

export default ProfilePage