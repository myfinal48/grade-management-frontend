import { useQuery } from "@tanstack/react-query"
import { staffService } from "@/services/staffService"
import type { StaffRole } from "@/types/staff"
import { StaffCacheKeys } from "./const"

export function useStaff(enabled: boolean = true) {
  return useQuery({
    queryKey: [StaffCacheKeys.Staff],
    queryFn: staffService.getAllStaff,
    staleTime: 5 * 60 * 1000,
    enabled,
  })
}

export function useStaffByRole(role: StaffRole, enabled: boolean = true) {
  return useQuery({
    queryKey: [StaffCacheKeys.Staff, role],
    queryFn: () => staffService.getStaffByRole(role),
    staleTime: 5 * 60 * 1000,
    enabled: !!role && enabled,
  })
}
