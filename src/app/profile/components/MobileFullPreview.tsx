'use client'

import React from 'react'
import { ProfilePreview } from './ProfilePreview'

interface MobileFullPreviewProps {
  profile: any
  getBackgroundClass: (bgId: string) => string
  iconMap: any
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
