'use client'

import React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { fontOptions } from '@/lib/fonts'

interface FontPickerProps {
  value: string
  onChange: (value: string) => void
}

export const FontPicker = ({ value, onChange }: FontPickerProps) => {
  const selectedFont = fontOptions.find(f => f.value === value) || fontOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          className={cn(
            "w-full justify-between",
            selectedFont?.className
          )}
        >
          {selectedFont?.label || "Select font"}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[300px] h-[300px] overflow-y-auto">
        <div className="grid grid-cols-1 gap-1 p-1">
            {fontOptions.map((font) => (
            <DropdownMenuItem
                key={font.value}
                onSelect={() => onChange(font.value)}
                className={cn(
                "flex items-center justify-between cursor-pointer px-3 py-2 rounded-md hover:bg-accent",
                value === font.value && "bg-accent"
                )}
            >
                <div className="flex flex-col gap-1">
                    <span className={cn("text-base", font.className)}>
                        {font.label}
                    </span>
                    <span className={cn("text-xs text-muted-foreground opacity-70", font.className)}>
                        The quick brown fox jumps over the lazy dog
                    </span>
                </div>
                {value === font.value && (
                <Check className="h-4 w-4 text-primary ml-2" />
                )}
            </DropdownMenuItem>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
