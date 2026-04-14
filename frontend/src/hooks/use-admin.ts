import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/react"
import { api } from "@/lib/api"
import type { Project, ApproveProjectRequest, BulkInviteRequest, BulkInviteResponse } from "@shared/types"

export function usePendingProjects() {
  const { isSignedIn } = useAuth()

  return useQuery({
    queryKey: ["admin", "pending"],
    queryFn: () => api.get<Project[]>("/api/admin/projects/pending"),
    enabled: !!isSignedIn,
  })
}

export function useApproveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: ApproveProjectRequest & { id: number }) =>
      api.post<Project>(`/api/admin/projects/${id}/approve`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useRejectProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      api.post<Project>(`/api/admin/projects/${id}/reject`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending"] })
    },
  })
}

export function useBulkInvite() {
  return useMutation({
    mutationFn: ({ id, emails }: BulkInviteRequest & { id: number }) =>
      api.post<BulkInviteResponse>(`/api/admin/projects/${id}/invite`, { emails }),
  })
}
