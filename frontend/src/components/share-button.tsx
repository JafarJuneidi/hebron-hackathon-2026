import { Share2 } from "lucide-react"
import { useLingui } from "@lingui/react/macro"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  projectId: number
  title: string
}

export function ShareButton({ projectId, title }: ShareButtonProps) {
  const { t } = useLingui()

  async function handleClick() {
    const url = `${window.location.origin}/projects/${projectId}`

    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url })
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success(t`Link copied!`)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="gap-1.5"
    >
      <Share2 className="size-4" />
    </Button>
  )
}
