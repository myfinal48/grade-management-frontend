import { useQuery } from "@tanstack/react-query"
import { transcriptsService } from "@/services/transcriptsService"
import type { TranscriptFilters } from "@/types/transcript"

const TRANSCRIPTS_QUERY_KEY = ["transcripts"]

export function useTranscripts(filters: TranscriptFilters, enabled = true) {
  return useQuery({
    queryKey: [...TRANSCRIPTS_QUERY_KEY, filters],
    queryFn: () => transcriptsService.getTranscripts(filters),
    enabled:
      enabled && (filters.studentIds.length > 0 || filters.semesterIds.length > 0 || filters.universityYear.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
