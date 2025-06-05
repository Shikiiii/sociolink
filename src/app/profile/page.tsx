'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  ChevronUp
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Header from '@/app/components/header'
import { backgroundPresets, mobilePresets } from '@/app/components/backgrounds'

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    bio: 'Digital creator and developer passionate about connecting people through technology.',
    avatar: '',
    background: 'gradient-1',
    links: [
      { id: '1', title: 'Portfolio', url: 'https://johndoe.dev', icon: 'Link' },
      { id: '2', title: 'Instagram', url: 'https://instagram.com/johndoe', icon: 'Instagram' },
      { id: '3', title: 'Twitter', url: 'https://twitter.com/johndoe', icon: 'Twitter' },
      { id: '4', title: 'GitHub', url: 'https://github.com/johndoe', icon: 'Github' },
    ]
  })

  const [newLink, setNewLink] = useState({ title: '', url: '', icon: 'Link' })
  const [isMobileView, setIsMobileView] = useState(false)
  const [selectedMobilePreset, setSelectedMobilePreset] = useState(mobilePresets[0])
  const [showBackgrounds, setShowBackgrounds] = useState(false)

  const iconMap = {
    Link,
    Instagram,
    Twitter,
    Youtube,
    Github,
    Mail,
    User
  }

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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(profile.links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setProfile(prev => ({ ...prev, links: items }))
  }

  const handleAvatarUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setProfile(prev => ({ ...prev, avatar: e.target?.result as string }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

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
          />
        </motion.div>

        {/* Right Panel - Preview */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 bg-card border border-border rounded-2xl shadow-lg p-8"
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
      <div className="lg:hidden flex flex-col h-screen">
        {/* Top 3/5 - Preview */}
        <div className="h-3/5 bg-card border-b border-border">
          <MobilePreview 
            profile={profile}
            getBackgroundClass={getBackgroundClass}
            iconMap={iconMap}
          />
        </div>

        {/* Bottom 2/5 - Controls */}
        <div className="h-2/5 bg-card overflow-y-auto">
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
          />
        </div>
      </div>
    </div>
  )
}

// Desktop Preview Component
const DesktopPreview = ({ profile, getBackgroundClass, iconMap, isMobileView, selectedMobilePreset }: any) => (
  <div className="h-full flex flex-col">
    {/* Preview Header */}
    <div className="flex items-center justify-center gap-2 mb-6">
      <Eye className="w-5 h-5 text-accent" />
      <h1 className="text-xl font-bold text-foreground">Preview</h1>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {isMobileView ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
        {isMobileView ? selectedMobilePreset.name : 'Desktop'}
      </div>
    </div>

    {/* Preview Container */}
    <div className="flex-1 flex items-start justify-center">
      {isMobileView ? (
        // Mobile Frame Preview
        <div 
          className="relative bg-gray-900/70 backdrop-blur-sm rounded-[2.5rem] shadow-2xl p-2 border-2 border-gray-700"
          style={{ 
            width: Math.min(selectedMobilePreset.width / 2.5, 280) + 16,
            height: Math.min(selectedMobilePreset.height / 2.5, 600) + 16,
          }}
        >
          <div className="absolute inset-x-0 top-4 h-5 w-24 mx-auto bg-gray-900 rounded-b-lg z-20"></div>
          <div className="absolute left-1 top-20 h-12 w-1 bg-gray-700 rounded-full"></div>
          <div className="absolute left-1 top-36 h-8 w-1 bg-gray-700 rounded-full"></div>
          
          <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black">
            <div
              style={{
                width: selectedMobilePreset.width,
                height: selectedMobilePreset.height,
                transform: `scale(${Math.min(1/2.5, 280/selectedMobilePreset.width)})`,
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
      ) : (
        // Desktop Frame Preview - Fixed size with proper scrolling
        <div className="w-full max-w-2xl bg-gray-900/70 backdrop-blur-sm rounded-xl shadow-2xl p-3 border-2 border-gray-700">
          <div className="w-full h-96 rounded-lg overflow-hidden bg-black">
            <ProfilePreview 
              profile={profile} 
              getBackgroundClass={getBackgroundClass} 
              iconMap={iconMap} 
              isMobile={false} 
            />
          </div>
        </div>
      )}
    </div>
  </div>
)

// Mobile Preview Component (Full Screen on Mobile)
const MobilePreview = ({ profile, getBackgroundClass, iconMap }: any) => (
  <div className="w-full h-full">
    <ProfilePreview 
      profile={profile} 
      getBackgroundClass={getBackgroundClass} 
      iconMap={iconMap} 
      isMobile={true} 
    />
  </div>
)

// Main Edit Panel for Desktop
const EditPanel = ({ 
  profile, setProfile, newLink, setNewLink, isMobileView, setIsMobileView,
  selectedMobilePreset, setSelectedMobilePreset, showBackgrounds, setShowBackgrounds,
  addLink, removeLink, handleDragEnd, handleAvatarUpload, iconMap 
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
      newLink={newLink}
      setNewLink={setNewLink}
      addLink={addLink}
      removeLink={removeLink}
      handleDragEnd={handleDragEnd}
      iconMap={iconMap}
    />

    {/* Save Button */}
    <Button className="w-full" size="lg">
      Save Changes
    </Button>
  </div>
)

// Mobile Edit Panel (Compact version for bottom 2/5)
const MobileEditPanel = ({ 
  profile, setProfile, newLink, setNewLink, showBackgrounds, setShowBackgrounds,
  addLink, removeLink, handleDragEnd, handleAvatarUpload, iconMap 
}: any) => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <Settings className="w-4 h-4 text-accent" />
      <h1 className="text-lg font-bold text-foreground">Edit Profile</h1>
    </div>

    {/* Compact Profile Info */}
    <div className="space-y-3">
      <Input
        value={profile.name}
        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Display name"
        className="w-full"
      />
      <Textarea
        value={profile.bio}
        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
        placeholder="Bio"
        rows={2}
        className="w-full resize-none"
      />
    </div>

    {/* Compact Background Selection */}
    <BackgroundSection 
      profile={profile}
      setProfile={setProfile}
      showBackgrounds={showBackgrounds}
      setShowBackgrounds={setShowBackgrounds}
      compact={true}
    />

    {/* Compact Links */}
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Quick Add Link</h3>
      <div className="flex gap-2">
        <Input
          value={newLink.title}
          onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Title"
          className="flex-1"
        />
        <Button onClick={addLink} size="sm">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Input
        value={newLink.url}
        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
        placeholder="URL"
        className="w-full"
      />
    </div>

    <Button className="w-full" size="sm">
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
        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
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
        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
        placeholder="Tell people about yourself..."
        rows={3}
        className="w-full resize-none"
      />
    </div>
  </div>
)

const BackgroundSection = ({ profile, setProfile, showBackgrounds, setShowBackgrounds, compact = false }: any) => (
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
          <div className={`grid ${compact ? 'grid-cols-4' : 'grid-cols-3'} gap-2 p-3`}>
            {backgroundPresets.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setProfile(prev => ({ ...prev, background: bg.id }))}
                className={`relative ${compact ? 'h-8' : 'h-12'} rounded-md border-2 transition-all duration-200 ${
                  profile.background === bg.id ? 'border-accent scale-105' : 'border-border hover:border-accent/50'
                }`}
                title={bg.name}
              >
                <div className={`w-full h-full rounded-sm ${bg.class}`} />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

const LinksSection = ({ profile, newLink, setNewLink, addLink, removeLink, handleDragEnd, iconMap }: any) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-foreground">Manage Links</h2>
    
    {/* Add New Link */}
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
      <h3 className="text-sm font-medium text-foreground">Add New Link</h3>
      
      <Input
        value={newLink.title}
        onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Link title"
        className="w-full"
      />
      
      <Input
        value={newLink.url}
        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
        placeholder="https://example.com"
        className="w-full"
      />
      
      <select
        value={newLink.icon}
        onChange={(e) => setNewLink(prev => ({ ...prev, icon: e.target.value }))}
        className="w-full p-2 rounded-md border border-border bg-background text-foreground"
      >
        <option value="Link">Link</option>
        <option value="Instagram">Instagram</option>
        <option value="Twitter">Twitter</option>
        <option value="Youtube">YouTube</option>
        <option value="Github">GitHub</option>
        <option value="Mail">Email</option>
      </select>
      
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
                const IconComponent = iconMap[link.icon as keyof typeof iconMap] || Link
                return (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center gap-2 p-2 bg-muted/20 rounded-md border border-border transition-all ${
                          snapshot.isDragging ? 'shadow-lg scale-105' : ''
                        }`}
                      >
                        <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                        </div>
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

// Profile Preview Component (Fixed scrolling for desktop)
const ProfilePreview = ({ profile, getBackgroundClass, iconMap, isMobile }: any) => (
  <div className="relative w-full h-full">
    {/* Background */}
    <div className={`absolute inset-0 ${getBackgroundClass(profile.background)}`} />
    
    {/* Content */}
    {isMobile ? (
      // Mobile Layout
      <div className="relative z-10 bg-black/20 backdrop-blur-sm h-full p-4 flex flex-col">
        {/* Avatar */}
        <div className="flex justify-center pt-4 pb-3">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-lg overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
        </div>

        {/* Name & Bio */}
        <div className="text-center pb-4">
          <h2 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{profile.name}</h2>
          <p className="text-sm text-white/90 leading-relaxed drop-shadow">{profile.bio}</p>
        </div>

        {/* Links */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {profile.links.map((link: any) => {
            const IconComponent = iconMap[link.icon as keyof typeof iconMap] || Link
            return (
              <div
                key={link.id}
                className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{link.title}</p>
                  <p className="text-xs text-white/80 truncate">{link.url}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-3 pb-2 border-t border-white/20">
          <p className="text-xs text-white/80">
            Powered by <span className="text-white font-medium">SocioLink</span>
          </p>
        </div>
      </div>
    ) : (
      // Desktop Layout - FIXED SCROLLING
      <div className="relative z-10 bg-black/20 backdrop-blur-sm h-full overflow-y-auto">
        <div className="p-6 max-w-md mx-auto">
          {/* Avatar */}
          <div className="flex justify-center pt-6 pb-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 shadow-lg overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
          </div>

          {/* Name & Bio */}
          <div className="text-center pb-6">
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{profile.name}</h1>
            <p className="text-white/90 leading-relaxed drop-shadow">{profile.bio}</p>
          </div>

          {/* Links */}
          <div className="space-y-3 pb-6">
            {profile.links.map((link: any) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap] || Link
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-4 p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer shadow-lg hover:scale-[1.02]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{link.title}</p>
                    <p className="text-sm text-white/80">{link.url}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="text-center pt-4 pb-4 border-t border-white/20">
            <p className="text-sm text-white/80">
              Powered by <span className="text-white font-semibold">SocioLink</span>
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)

export default ProfilePage