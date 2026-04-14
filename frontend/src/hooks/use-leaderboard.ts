import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { LeaderboardEntry } from "@shared/types"

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => api.get<LeaderboardEntry[]>("/api/leaderboard"),
  })
}
