'use client'

import React from 'react'
import { Square, Circle, LayoutTemplate, LayoutList, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface Profile {
  name: string | null
  bio: string | null
  avatar: string | null
  background: string
  font: string
  blur?: number
  buttonStyle: string
  buttonRoundness: string
  buttonLayout?: string
  customColor?: string
  links: {
    id: string
    title: string
    url: string
    icon: string
  }[]
}

interface ProfileStyleSectionProps {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
}

const styles = [
  { id: 'fill', label: 'Fill', previewClass: 'bg-primary text-primary-foreground border-transparent' },
  { id: 'outline', label: 'Outline', previewClass: 'bg-transparent border-2 border-primary text-primary' },
  { id: 'soft', label: 'Soft', previewClass: 'bg-primary/20 text-primary border-transparent' },
  { id: 'hard', label: 'Heavy', previewClass: 'bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' },
]

const roundness = [
  { id: 'sharp', label: 'Square', icon: Square, class: 'rounded-none' },
  { id: 'rounded', label: 'Rounded', icon: LayoutTemplate, class: 'rounded-lg' },
  { id: 'pill', label: 'Pill', icon: Circle, class: 'rounded-full' },
]

const layouts = [
  { id: 'list', label: 'List', icon: LayoutList },
  { id: 'grid-icon', label: 'Grid', icon: LayoutGrid },
]

export const ProfileStyleSection = ({ profile, setProfile }: ProfileStyleSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Button Appearance</h2>
      
      {/* Button Style */}
      <div className="space-y-3">
        <Label>Fill Style</Label>
        <div className="grid grid-cols-2 gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setProfile(prev => ({ ...prev, buttonStyle: style.id }))}
              className={cn(
                "h-12 flex items-center justify-center text-sm font-medium transition-all rounded-md",
                style.previewClass,
                profile.buttonStyle === style.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100"
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Button Roundness */}
      <div className="space-y-3">
        <Label>Corner Radius</Label>
        <div className="flex gap-2">
          {roundness.map((r) => (
            <Button
              key={r.id}
              variant={profile.buttonRoundness === r.id ? "default" : "outline"}
              className="flex-1"
              onClick={() => setProfile(prev => ({ ...prev, buttonRoundness: r.id }))}
            >
              <r.icon className={cn("w-4 h-4 mr-2", r.id === 'pill' ? "rounded-full" : "")} />
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Button Layout */}
      <div className="space-y-3">
        <Label>Layout</Label>
        <div className="flex gap-2">
          {layouts.map((l) => (
            <Button
              key={l.id}
              variant={profile.buttonLayout === l.id ? "default" : "outline"}
              className="flex-1"
              onClick={() => setProfile(prev => ({ ...prev, buttonLayout: l.id }))}
            >
              <l.icon className="w-4 h-4 mr-2" />
              {l.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
