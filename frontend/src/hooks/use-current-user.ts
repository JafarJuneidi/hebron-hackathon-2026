import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@clerk/react"
import { api } from "@/lib/api"
import type { User } from "@shared/types"

export function useCurrentUser() {
  const { isSignedIn } = useAuth()

  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => api.get<User>("/api/users/me"),
    enabled: !!isSignedIn,
  })
}
