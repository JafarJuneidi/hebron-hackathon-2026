import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/react"
import { api } from "@/lib/api"
import type {
  Project,
  ProjectWithScore,
  ProjectDetail,
  LikeResponse,
  ContributeRequest,
  ContributeResponse,
  VolunteerResponse,
} from "@shared/types"

export function useMyProjects() {
  const { isSignedIn } = useAuth()

  return useQuery({
    queryKey: ["projects", "my"],
    queryFn: () => api.get<Project[]>("/api/projects/my"),
    enabled: !!isSignedIn,
  })
}

export function useProjects(sort?: "likes" | "funding", status?: string) {
  const params = new URLSearchParams()
  if (sort) params.set("sort", sort)
  if (status) params.set("status", status)
  const qs = params.toString()

  return useQuery({
    queryKey: ["projects", { sort, status }],
    queryFn: () => api.get<ProjectWithScore[]>(`/api/projects${qs ? `?${qs}` : ""}`),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => api.get<ProjectDetail>(`/api/projects/${id}`),
  })
}

export function useLike(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.post<LikeResponse>(`/api/projects/${projectId}/like`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useContribute(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: ContributeRequest) =>
      api.post<ContributeResponse>(`/api/projects/${projectId}/contribute`, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
      void queryClient.invalidateQueries({ queryKey: ["projects", String(projectId)] })
    },
  })
}

export function useVolunteer(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      api.post<VolunteerResponse>(`/api/projects/${projectId}/volunteer`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
      void queryClient.invalidateQueries({ queryKey: ["projects", String(projectId)] })
    },
  })
}

export function useWithdrawVolunteer(projectId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      api.delete<VolunteerResponse>(`/api/projects/${projectId}/volunteer`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] })
      void queryClient.invalidateQueries({ queryKey: ["projects", String(projectId)] })
    },
  })
}
