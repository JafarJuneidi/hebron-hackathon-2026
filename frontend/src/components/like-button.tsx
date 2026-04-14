import { Heart } from "lucide-react"
import { useAuth } from "@clerk/react"
import { useLingui } from "@lingui/react/macro"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useLike } from "@/hooks/use-projects"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  projectId: number
  likes: number
  userLiked: boolean
}

export function LikeButton({ projectId, likes, userLiked }: LikeButtonProps) {
  const { t } = useLingui()
  const { isSignedIn } = useAuth()
  const likeMutation = useLike(projectId)

  function handleClick() {
    if (!isSignedIn) {
      toast.error(t`Sign in to like`)
      return
    }
    likeMutation.mutate()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={likeMutation.isPending}
      className="gap-1.5"
    >
      <Heart
        className={cn(
          "size-4",
          userLiked && "fill-red-500 text-red-500"
        )}
      />
      <span className="text-sm font-medium">{likes}</span>
    </Button>
  )
}
