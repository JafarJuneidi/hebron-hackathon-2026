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

    // Use native share on mobile, clipboard on desktop
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0
    if (isMobile && navigator.share) {
      try {
        await navigator.share({ title, text: title, url })
        return
      } catch (e) {
        // AbortError = user cancelled, which is fine
        if (e instanceof DOMException && e.name === "AbortError") return
        // Any other error: fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success(t`Link copied!`)
    } catch {
      // Clipboard API failed (insecure context, no focus, etc.)
      // Last resort: prompt-based copy
      window.prompt(t`Copy this link:`, url)
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
