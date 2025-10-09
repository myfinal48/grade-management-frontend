"use client"

import { useMemo, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"

export interface OptionItem {
  value: string
  label: string
}

interface SearchableSelectProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  options: OptionItem[]
  emptyText?: string
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function SearchableSelect({
  value,
  onChange,
  placeholder = "Sélectionner...",
  options,
  emptyText = "Aucun élément",
  loading = false,
  disabled = false,
  className,
}: Readonly<SearchableSelectProps>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const selectedLabel = useMemo(() => options.find(o => o.value === value)?.label ?? "", [options, value])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return options
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, query])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <span className={cn(!selectedLabel && "text-muted-foreground")}>{selectedLabel || placeholder}</span>
          {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-2" align="start">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-60 overflow-y-auto pr-1">
          <div className="space-y-1">
            {filtered.length === 0 && (
              <div className="px-2 py-3 text-sm text-muted-foreground">{emptyText}</div>
            )}
            {filtered.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  "w-full text-left px-2 py-2 rounded hover:bg-muted flex items-center gap-2",
                )}
              >
                <Check className={cn("h-4 w-4", opt.value === value ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
