'use client'

import React from 'react'
import { Eye, Smartphone, Monitor } from 'lucide-react'
import { ProfilePreview } from './ProfilePreview'

interface DesktopPreviewProps {
  profile: any
  getBackgroundClass: (bgId: string) => string
  iconMap: any
  isMobileView: boolean
  selectedMobilePreset: any
}

export const DesktopPreview = ({ profile, getBackgroundClass, iconMap, isMobileView, selectedMobilePreset }: DesktopPreviewProps) => {
  return (
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
      <div className="h-[calc(100%-4rem)] rounded-2xl overflow-hidden border border-border shadow-lg bg-background">
        {isMobileView ? (
          // Mobile Frame Preview
          <div className="h-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
            <div 
              className="relative bg-gray-900 rounded-[2rem] shadow-2xl p-2 border-2 border-gray-700"
              style={{
                width: Math.min(selectedMobilePreset.width, 420) + 16,
                height: Math.min(selectedMobilePreset.height, 800) + 16,
              }}
            >
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-black relative">
                <div
                  className="w-full h-full origin-top-left"
                  style={{
                    width: selectedMobilePreset.width,
                    height: selectedMobilePreset.height,
                    transform: `scale(${Math.min(1, 420 / selectedMobilePreset.width)})`,
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
          // Desktop Preview
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
}
