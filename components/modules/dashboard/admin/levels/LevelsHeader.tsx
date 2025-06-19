"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { LevelForm } from "./LevelForm"

interface LevelsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  totalCount: number
}

export function LevelsHeader({ searchQuery, onSearchChange, totalCount }: LevelsHeaderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Levels Management</h1>
          <p className="text-muted-foreground">Manage academic levels in the system ({totalCount} total)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)} size="default" className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Level
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search levels..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <LevelForm open={showCreateDialog} onOpenChange={setShowCreateDialog} mode="create" />
    </>
  )
}
