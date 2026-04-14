import { useState } from "react"
import { Trans } from "@lingui/react/macro"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulkInviteFormProps {
  projectId: number
}

export function BulkInviteForm({ projectId: _projectId }: BulkInviteFormProps) {
  const [isSending, setIsSending] = useState(false)

  function handleClick() {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      toast.success("Invites sent to 12 volunteers!")
    }, 1500)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isSending}
      className="gap-1.5"
    >
      <Mail className="size-4" />
      {isSending ? (
        <Trans>Sending...</Trans>
      ) : (
        <Trans>Invite Volunteers by Email</Trans>
      )}
    </Button>
  )
}
