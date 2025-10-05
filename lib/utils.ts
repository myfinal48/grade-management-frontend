import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a more readable format
 * @param date - The date to format
 * @returns Formatted date string (e.g., "4 Oct. 2025")
 */
export function formatDate(date: Date): string {
  const day = date.getDate()
  const month = date.toLocaleDateString("fr-FR", { month: "short" })
  const year = date.getFullYear()
  
  return `${day} ${month} ${year}`
}
