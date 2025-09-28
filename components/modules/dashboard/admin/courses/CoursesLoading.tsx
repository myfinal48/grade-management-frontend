"use client"

import { Skeleton } from "@/components/ui/skeleton"

const SKELETON_KEYS = [
  "course-skeleton-1",
  "course-skeleton-2", 
  "course-skeleton-3",
  "course-skeleton-4",
  "course-skeleton-5",
  "course-skeleton-6",
  "course-skeleton-7",
  "course-skeleton-8",
]

export function CoursesLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filters skeleton */}
      <div className="flex items-center py-4 space-x-2">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[100px] ml-auto" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="border-b bg-muted/50">
          <div className="flex h-12 items-center px-4 space-x-4">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
        </div>
        
        {/* Table rows */}
        {SKELETON_KEYS.map((key) => (
          <div key={key} className="border-b last:border-0">
            <div className="flex h-16 items-center px-4 space-x-4">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-4 w-[200px]" />
        <div className="space-x-2 flex">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </div>
    </div>
  )
}