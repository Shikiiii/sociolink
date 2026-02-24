'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User, Upload } from 'lucide-react'

interface ProfileInfoSectionProps {
  profile: any
  setProfile: (value: any) => void
  handleAvatarUpload: () => void
}

export const ProfileInfoSection = ({ profile, setProfile, handleAvatarUpload }: ProfileInfoSectionProps) => {
  return (
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
}
