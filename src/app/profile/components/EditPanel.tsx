'use client'

import React from 'react'
import { Settings, Monitor, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mobilePresets } from '@/app/components/backgrounds'
import { ProfileInfoSection } from './ProfileInfoSection'
import { BackgroundSection } from './BackgroundSection'
import { LinksSection } from './LinksSection'

interface EditPanelProps {
  profile: any
  setProfile: (value: any) => void
  newLink: any
  setNewLink: (value: any) => void
  isMobileView: boolean
  setIsMobileView: (value: boolean) => void
  selectedMobilePreset: any
  setSelectedMobilePreset: (value: any) => void
  showBackgrounds: boolean
  setShowBackgrounds: (value: boolean) => void
  addLink: () => void
  removeLink: (id: string) => void
  handleDragEnd: (result: any) => void
  handleAvatarUpload: () => void
  iconMap: any
  error: string | null
  isDirty: boolean
  saveChanges: () => void
}

export const EditPanel = ({ 
  profile, setProfile, newLink, setNewLink, isMobileView, setIsMobileView,
  selectedMobilePreset, setSelectedMobilePreset, showBackgrounds, setShowBackgrounds,
  addLink, removeLink, handleDragEnd, handleAvatarUpload, iconMap, error, isDirty,
  saveChanges
}: EditPanelProps) => (
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
    />

    {/* Save Button */}
    {error && (
      <p className="text-sm text-red-500 min-h-[1.5em]">{error}</p>
    )}

    <Button className="w-full" size="lg" onClick={saveChanges} disabled={isDirty === false}>
      Save Changes
    </Button>
  </div>
)

interface MobileEditPanelProps {
  profile: any
  setProfile: (value: any) => void
  newLink: any
  setNewLink: (value: any) => void
  showBackgrounds: boolean
  setShowBackgrounds: (value: boolean) => void
  addLink: () => void
  removeLink: (id: string) => void
  handleDragEnd: (result: any) => void
  handleAvatarUpload: () => void
  iconMap: any
  saveChanges: () => void
  error: string | null
  isDirty: boolean
}

export const MobileEditPanel = ({ 
  profile, setProfile, newLink, setNewLink, showBackgrounds, setShowBackgrounds,
  addLink, removeLink, handleDragEnd, handleAvatarUpload, iconMap, saveChanges, error, isDirty
}: MobileEditPanelProps) => (
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
    {error && (
      <p className="text-sm text-red-500 min-h-[1.5em]">{error}</p>
    )}

    <Button className="w-full" size="lg" onClick={saveChanges} disabled={isDirty === false}>
      Save Changes
    </Button>
  </div>
)
