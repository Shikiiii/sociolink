'use client'

import React from 'react'

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-16 bg-muted/30 border-b border-border mb-8" />
      
      <div className="hidden lg:flex max-w-7xl mx-auto px-6 gap-6">
        {/* Left Sidebar Skeleton */}
        <div className="w-1/3 h-[800px] bg-card border border-border rounded-2xl p-6 space-y-8">
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-muted rounded" />
            <div className="w-32 h-6 bg-muted rounded" />
          </div>
          <div className="space-y-4">
            <div className="w-full h-10 bg-muted/60 rounded" />
            <div className="w-full h-32 bg-muted/60 rounded" />
            <div className="w-full h-10 bg-muted/60 rounded" />
          </div>
        </div>

        {/* Right Preview Skeleton */}
        <div className="flex-1 h-[800px] bg-muted/10 rounded-2xl border border-border" />
      </div>

      {/* Mobile Skeleton */}
      <div className="lg:hidden p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-32 h-8 bg-muted rounded" />
          <div className="w-8 h-8 bg-muted rounded-full" />
        </div>
        <div className="space-y-4">
          <div className="w-full h-40 bg-muted/30 rounded-xl" />
          <div className="w-full h-12 bg-muted/30 rounded-lg" />
          <div className="w-full h-12 bg-muted/30 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
