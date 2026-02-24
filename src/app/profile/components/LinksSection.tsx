'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Search, ChevronDown, Plus, GripVertical, Link, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { socialPlatforms } from '../constants'

interface LinksSectionProps {
  profile: any
  setProfile: (value: any) => void
  newLink: any
  setNewLink: (value: any) => void
  addLink: () => void
  removeLink: (id: string) => void
  handleDragEnd: (result: any) => void
  iconMap: any
}

export const LinksSection = ({ profile, setProfile, newLink, setNewLink, addLink, removeLink, handleDragEnd, iconMap }: LinksSectionProps) => {
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
                <AnimatePresence mode="popLayout">
                  {profile.links.map((link: any, index: number) => {
                    const platform = socialPlatforms.find(p => p.value === link.icon) || socialPlatforms[0]
                    const IconComponent = iconMap[platform.icon as keyof typeof iconMap] || Link
                    const isEditing = editingLinkId === link.id
                    
                    return (
                      <Draggable key={String(link.id)} draggableId={String(link.id)} index={index} isDragDisabled={isEditing}>
                        {(provided, snapshot) => (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border border-border rounded-md transition-all ${
                              snapshot.isDragging ? 'shadow-lg scale-105' : ''
                            } ${isEditing ? 'bg-muted/40 ring-2 ring-accent/30' : 'bg-muted/20'}`}
                            // Style handling to coexist with DnD
                            style={{ ...provided.draggableProps.style }} 
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
                          </motion.div>
                        )}
                      </Draggable>
                    )
                  })}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  )
}
