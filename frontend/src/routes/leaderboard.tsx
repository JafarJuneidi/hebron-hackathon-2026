import { createFileRoute } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { useLeaderboard } from "@/hooks/use-leaderboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, Award } from "lucide-react"

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
})

const RANK_ICONS = [
  { icon: Trophy, color: "text-yellow-500" },
  { icon: Medal, color: "text-slate-400" },
  { icon: Award, color: "text-amber-700" },
]

function LeaderboardPage() {
  const { t } = useLingui()
  const { data: entries, isLoading } = useLeaderboard()

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          <Trans>Honor Board</Trans>
        </h1>
        <p className="text-muted-foreground mt-1">
          <Trans>Recognizing our top sponsors and funders.</Trans>
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 p-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (!entries || entries.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              <Trans>No contributions yet. Be the first to fund a project!</Trans>
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && entries && entries.length > 0 && (
        <>
          {/* Top 3 podium */}
          {entries.length >= 3 && (
            <div className="mb-8 grid grid-cols-3 gap-3">
              {[1, 0, 2].map((rankIndex) => {
                const entry = entries[rankIndex]
                if (!entry) return null
                const RankIcon = RANK_ICONS[rankIndex].icon
                const isFirst = rankIndex === 0

                return (
                  <Card
                    key={entry.userId}
                    className={isFirst ? "row-span-1 border-yellow-300 dark:border-yellow-700" : ""}
                  >
                    <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                      <RankIcon
                        className={`${RANK_ICONS[rankIndex].color} ${isFirst ? "size-8" : "size-6"}`}
                      />
                      <Avatar className={isFirst ? "size-14" : "size-10"}>
                        <AvatarImage src={entry.imageUrl ?? undefined} />
                        <AvatarFallback>
                          {entry.displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-full">
                          {entry.displayName}
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          ${(entry.totalContributed / 100).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t`${entry.projectsFunded} projects`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Full list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Trans>All Contributors</Trans>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0 pb-2">
              {entries.map((entry, index) => (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <span className="w-6 text-center text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <Avatar className="size-8">
                    <AvatarImage src={entry.imageUrl ?? undefined} />
                    <AvatarFallback>
                      {entry.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t`${entry.projectsFunded} projects funded`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    ${(entry.totalContributed / 100).toLocaleString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
