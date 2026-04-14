import { useAuth } from "@clerk/react"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { toast } from "sonner"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVolunteer, useWithdrawVolunteer } from "@/hooks/use-projects"

interface VolunteerButtonProps {
  projectId: number
  isVolunteered: boolean
  volunteersCurrent: number
  volunteersRequired: number
}

export function VolunteerButton({
  projectId,
  isVolunteered,
  volunteersCurrent,
  volunteersRequired,
}: VolunteerButtonProps) {
  const { t } = useLingui()
  const { isSignedIn } = useAuth()
  const volunteerMutation = useVolunteer(projectId)
  const withdrawMutation = useWithdrawVolunteer(projectId)

  const isPending = volunteerMutation.isPending || withdrawMutation.isPending

  function handleClick() {
    if (!isSignedIn) {
      toast.error(t`Sign in to volunteer`)
      return
    }

    if (isVolunteered) {
      withdrawMutation.mutate(undefined, {
        onSuccess: () => toast.success(t`You have withdrawn from this project`),
        onError: (error) => toast.error(error.message || t`Failed to withdraw`),
      })
    } else {
      volunteerMutation.mutate(undefined, {
        onSuccess: () => toast.success(t`You signed up as a volunteer!`),
        onError: (error) => toast.error(error.message || t`Failed to sign up`),
      })
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={isVolunteered ? "outline" : "default"}
        size="sm"
        onClick={handleClick}
        disabled={isPending}
      >
        <Users className="size-4" />
        {isVolunteered ? <Trans>Withdraw</Trans> : <Trans>Sign Up to Volunteer</Trans>}
      </Button>
      <span className="text-sm text-muted-foreground">
        <Trans>{volunteersCurrent} / {volunteersRequired} volunteers</Trans>
      </span>
    </div>
  )
}
