'use client'

import React from 'react'
import { ProfilePreview } from './ProfilePreview'

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

interface MobileFullPreviewProps {
  profile: Profile
  getBackgroundClass: (bgId: string) => string
  iconMap: Record<string, React.ComponentType<{ className?: string }>>
}

export const MobileFullPreview = ({ profile, getBackgroundClass, iconMap }: MobileFullPreviewProps) => {
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
