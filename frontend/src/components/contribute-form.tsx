import { useState } from "react"
import { useAuth } from "@clerk/react"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { toast } from "sonner"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContribute } from "@/hooks/use-projects"
import { cn } from "@/lib/utils"

interface ContributeFormProps {
  projectId: number
  fundingCurrent: number // cents
  fundingTarget: number  // cents
}

const PRESETS = [5, 10, 25, 50] as const

export function ContributeForm({ projectId, fundingCurrent, fundingTarget }: ContributeFormProps) {
  const { t } = useLingui()
  const { isSignedIn } = useAuth()
  const [amount, setAmount] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const contributeMutation = useContribute(projectId)

  const isFunded = fundingCurrent >= fundingTarget
  const parsedAmount = parseFloat(amount)
  const hasValidAmount = !isNaN(parsedAmount) && parsedAmount > 0

  if (isFunded) return null

  function handlePresetClick(value: number) {
    setSelectedPreset(value)
    setAmount(String(value))
  }

  function handleCustomAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedPreset(null)
    setAmount(e.target.value)
  }

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
          setSelectedPreset(null)
        },
        onError: (error) => {
          toast.error(error.message || t`Failed to contribute`)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Preset amount buttons */}
      <div className="flex gap-2">
        {PRESETS.map((value) => (
          <Button
            key={value}
            type="button"
            variant={selectedPreset === value ? "default" : "outline"}
            size="sm"
            className={cn("flex-1", selectedPreset === value && "ring-2 ring-primary/30")}
            onClick={() => handlePresetClick(value)}
          >
            ${value}
          </Button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="relative">
        <DollarSign className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="number"
          min="1"
          step="1"
          placeholder={t`Other amount`}
          value={selectedPreset ? "" : amount}
          onChange={handleCustomAmountChange}
          className="pl-7"
        />
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!hasValidAmount || contributeMutation.isPending}
      >
        {contributeMutation.isPending ? (
          <Trans>Sending...</Trans>
        ) : hasValidAmount ? (
          <Trans>Contribute ${parsedAmount}</Trans>
        ) : (
          <Trans>Fund</Trans>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {t`This is a demo — no real payment will be processed.`}
      </p>
    </form>
  )
}
