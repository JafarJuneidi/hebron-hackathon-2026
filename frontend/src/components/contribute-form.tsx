import { useState } from "react"
import { useAuth } from "@clerk/react"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { toast } from "sonner"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContribute } from "@/hooks/use-projects"

interface ContributeFormProps {
  projectId: number
  fundingCurrent: number // cents
  fundingTarget: number  // cents
}

export function ContributeForm({ projectId, fundingCurrent, fundingTarget }: ContributeFormProps) {
  const { t } = useLingui()
  const { isSignedIn } = useAuth()
  const [amount, setAmount] = useState("")
  const contributeMutation = useContribute(projectId)

  const isFunded = fundingCurrent >= fundingTarget

  if (isFunded) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isSignedIn) {
      toast.error(t`Sign in to contribute`)
      return
    }

    const dollars = parseFloat(amount)
    if (isNaN(dollars) || dollars <= 0) {
      toast.error(t`Please enter a valid amount`)
      return
    }

    contributeMutation.mutate(
      { amount: dollars },
      {
        onSuccess: () => {
          toast.success(t`Thank you for your contribution!`)
          setAmount("")
        },
        onError: (error) => {
          toast.error(error.message || t`Failed to contribute`)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <DollarSign className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="number"
          min="1"
          step="1"
          placeholder={t`Amount`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-7 w-28"
        />
      </div>
      <Button type="submit" size="sm" disabled={contributeMutation.isPending}>
        {contributeMutation.isPending ? <Trans>Sending...</Trans> : <Trans>Fund</Trans>}
      </Button>
    </form>
  )
}
