'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DropResult } from '@hello-pangea/dnd'
import { Eye, Edit, Save, AlertTriangle, ExternalLink } from 'lucide-react'

import Header from '@/app/components/header'
import { useRouter } from 'next/navigation'
import { mobilePresets } from '@/app/components/backgrounds'
import { backgroundPresets } from '@/app/components/backgrounds'
import { EditPanel, MobileEditPanel } from './components/EditPanel'
import { DesktopPreview } from './components/DesktopPreview'
import { MobileFullPreview } from './components/MobileFullPreview'
import { ProfileSkeleton } from './components/ProfileSkeleton'
import { iconMap } from './utils/icons'

interface Profile {
  name: string | null,
  bio: string | null,
  avatar: string | null,
  background: string,
  font: string,
  blur?: number,
  buttonStyle: string,
  buttonRoundness: string,
  buttonLayout?: string,
  customColor?: string,
  avatarFile?: File;
  backgroundFile?: File;
  links: {
    id: string,
    title: string,
    url: string,
    icon: string,
  }[]
}

const ProfilePage = () => {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    name: "",
    bio: "",
    avatar: "",
    background: "",
    font: "inter",
    blur: 0,
    buttonStyle: "fill",
    buttonRoundness: "rounded",
    buttonLayout: "list",
    links: []
  });
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return null
    }
    const token = getCookie('access_token')
    if (token) {
      try {
        const payload = token.split('.')[1]
        if (payload) {
          const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
          if (decoded.user_name) setUsername(decoded.user_name)
        }
      } catch { /* ignore */ }
    }
  }, [])

  const [initialProfile, setInitialProfile] = useState<Profile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Navigation Guard / Unsaved Changes Warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Dirty State Logic
  useEffect(() => {
    if (!isLoaded) return;
    const hasChanges = JSON.stringify(profile) !== JSON.stringify(initialProfile);
    setIsDirty(hasChanges);
  }, [profile, initialProfile, isLoaded]);

  const saveChanges = async () => {
    // Save socials (links)
    const s = await fetch('/api/website/edit_socials', {
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
    formData.append('font', profile.font ?? 'inter');
    formData.append('buttonStyle', profile.buttonStyle || 'fill');
    formData.append('buttonRoundness', profile.buttonRoundness || 'rounded');
    formData.append('buttonLayout', profile.buttonLayout || 'list');
    
    // Check if background is custom color or preset
    if (profile.backgroundFile instanceof File) {
      formData.append('background', profile.backgroundFile);
      formData.append('blur', String(profile.blur));
    } else if (profile.background.startsWith('custom-') && profile.customColor) {
      // Store custom color with prefix
      formData.append('background', profile.background + "|" + String(profile.blur));
    } else {
      formData.append('background', profile.background + "|" + String(profile.blur));
    }

    // If avatar is a File object (user uploaded), append it; otherwise, skip
    if (profile.avatarFile instanceof File) {
      formData.append('avatar', profile.avatarFile);
    }

    const e = await fetch('/api/website/edit', {
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

  // Initial Data Fetch
  useEffect(() => {
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

    const fetchWithAuth = async (url: string) => {
        let res = await fetch(url, { credentials: 'include' });
        if (res.status === 401) {
          await fetch('/api/auth/refresh', { credentials: 'include' });
          res = await fetch(url, { credentials: 'include' });
        }
        return res;
    };

    (async () => {
        try {
          const profileRes = await fetchWithAuth('/api/website/get_data');
          const socialsRes = await fetchWithAuth('/api/website/get_socials');

          let finalProfile: Profile = {
              name: "",
              bio: "",
              avatar: "",
              background: "",
              font: "inter",
              blur: 0,
              buttonStyle: "fill",
              buttonRoundness: "rounded",
              links: []
          };

          if (profileRes.ok) {
              const data = await profileRes.json();
              const [background, blur] = data.data.background !== null && data.data.background !== undefined ? data.data.background.split("|") : [null, 0];
              let blurVal = blur;
              if (blurVal === 'null') blurVal = 0;
              
              // Handle custom hex colors stored in background string
              let customColor = undefined;
              if (background && background.startsWith('custom-')) {
                customColor = '#' + background.split('custom-')[1]; // assuming stored as custom-HEX
              }

              finalProfile = {
                name: data.data.display_name,
                bio: data.data.bio,
                avatar: data.data.avatar,
                background: background,
                font: data.data.font || "inter",
                buttonStyle: data.data.buttonStyle || "fill",
                buttonRoundness: data.data.buttonRoundness || "rounded",
                buttonLayout: data.data.buttonLayout || "list",
                blur: parseInt(String(blur)),
                customColor: customColor,
                links: []
              };
          }

          if (socialsRes.ok) {
              const socials = await socialsRes.json();
              const links = socials.map((item: { id: string; order: number; text: string; link: string; type: string }) => ({
                id: item.id,
                title: item.text,
                url: item.link,
                icon: item.type.charAt(0).toUpperCase() + item.type.slice(1),
                order: item.order
              })).sort((a: any, b: any) => a.order - b.order);

              finalProfile.links = links;
          }

          setProfile(finalProfile);
          setInitialProfile(finalProfile);
          setIsLoaded(true);

        } catch {
          window.location.href = '/login';
        }
    })();
  }, [])

  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'Link' })
  const [prevIcon, setPrevIcon] = useState(newLink.icon);
  const [isMobileView, setIsMobileView] = useState(false)
  const [selectedMobilePreset, setSelectedMobilePreset] = useState(mobilePresets[0])
  const [showBackgrounds, setShowBackgrounds] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Auto-format URL logic
  useEffect(() => {
    if (newLink.icon !== prevIcon) {
      setNewLink((prev) => ({ ...prev, url: '' }));
      setPrevIcon(newLink.icon);
    }

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

    function isValidUrl(str: string) {
      try {
        new URL(str);
        return true;
      } catch {
        return false;
      }
    }

    function isSingleWord(str: string) {
      return /^[a-zA-Z0-9_.-]+$/.test(str) && !str.includes(" ");
    }

    if (
      newLink.url &&
      !isValidUrl(newLink.url) &&
      isSingleWord(newLink.url) &&
      usernameUrlPatterns[newLink.icon]
    ) {
      setNewLink((prev) => ({
        ...prev,
        url: usernameUrlPatterns[newLink.icon].replace("{username}", prev.url),
      }));
    }
  }, [newLink, prevIcon]);

  const addLink = () => {
    if (newLink.title && newLink.url) {
      setProfile(prev => ({
        ...prev,
        links: [...prev.links, { ...newLink, id: Date.now().toString() }]
      }))
      setNewLink({ title: '', url: '', icon: 'Link' })
    }
  }

  const removeLink = (id: string) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id)
    }))
  }

  const handleDragEnd = (result: DropResult<string>) => {
    if (!result.destination) return

    const items = Array.from(profile.links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setProfile(prev => ({ ...prev, links: items }))
  }

  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfile(prev => ({
            ...prev,
            avatar: e.target?.result as string,
            avatarFile: file
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleBackgroundUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfile(prev => ({
            ...prev,
            background: e.target?.result as string,
            backgroundFile: file
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getBackgroundClass = (bgId: string) => {
    return backgroundPresets.find(bg => bg.id === bgId)?.class || backgroundPresets[0].class
  }

  if (!isLoaded) {
    return <ProfileSkeleton />
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 gap-6 pt-8">
        {/* Left Sidebar - Edit Panel */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-1/3 min-h-[calc(100vh-8rem)] bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
          style={{ marginTop: '2rem', marginBottom: '2rem' }}
        >
          {/* View Profile button */}
          {username && (
            <button
              onClick={() => router.push(`/p/${username}`)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 group"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>sociolink.app/p/{username}</span>
            </button>
          )}
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
            handleBackgroundUpload={handleBackgroundUpload}
            iconMap={iconMap}
            saveChanges={saveChanges}
            error={error}
            isDirty={isDirty}
          />
        </motion.div>

        {/* Right Panel - Preview */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
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
        <AnimatePresence mode="wait">
          {isPreviewMode ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="h-screen fixed inset-0 z-40 bg-background"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="min-h-screen bg-card p-4 pt-24 pb-24"
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
                handleBackgroundUpload={handleBackgroundUpload}
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center z-50 transition-colors"
        >
          {isPreviewMode ? <Edit className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Unsaved Changes Notification */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg border border-yellow-200/50 backdrop-blur-md z-50 flex items-center gap-3 lg:gap-4"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium whitespace-nowrap">Unsaved changes</span>
            </div>
            <button 
              onClick={saveChanges}
              className="flex items-center gap-1 text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-full transition-colors"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfilePage
