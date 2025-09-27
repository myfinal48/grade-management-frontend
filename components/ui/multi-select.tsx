"use client"

import * as React from "react"
import { X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface Option {
  label: string
  value: string
  searchText?: string
}

interface MultiSelectProps {
  options: Option[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  maxCount?: number
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  maxCount = 3,
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedOptions = options.filter((option) => value.includes(option.value))
  const remainingCount = selectedOptions.length - maxCount

  const filteredOptions = options.filter((option) => {
    const searchText = option.searchText || option.label
    return searchText.toLowerCase().includes(search.toLowerCase())
  })

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onValueChange?.(newValue)
  }

  const handleRemove = (optionValue: string) => {
    const newValue = value.filter((v) => v !== optionValue)
    onValueChange?.(newValue)
  }

  const handleClear = () => {
    onValueChange?.([])
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "w-full justify-between text-left font-normal min-h-10",
          !selectedOptions.length && "text-muted-foreground",
          className
        )}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-wrap items-center gap-2 p-2 min-h-[2.5rem] overflow-hidden">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <>
              {selectedOptions.slice(0, maxCount).map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="mr-1 mb-1 text-xs px-2 py-1 max-w-[150px] truncate"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(option.value)
                  }}
                >
                  {option.label}
                  <X className="ml-1 h-3 w-3 cursor-pointer" />
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge variant="secondary" className="mr-1 mb-1 text-xs px-1 py-0 h-5">
                  +{remainingCount} more
                </Badge>
              )}
            </>
          )}
        </div>
        {selectedOptions.length > 0 && (
          <X
            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
          />
        )}
      </Button>
      
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="flex items-center w-full px-3 py-2 text-sm text-left cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelect(option.value)
                    }
                  }}
                >
                  <div className="flex items-center space-x-2 w-full">
                    <div
                      className={cn(
                        "h-4 w-4 border border-input rounded-sm flex items-center justify-center",
                        value.includes(option.value) && "bg-primary"
                      )}
                    >
                      {value.includes(option.value) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="flex-1">{option.label}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
      
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-transparent border-0 p-0 cursor-default"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          aria-label="Close dropdown"
        />
      )}
    </div>
  )
}
