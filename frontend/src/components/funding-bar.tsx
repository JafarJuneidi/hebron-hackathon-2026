import { useLingui } from "@lingui/react/macro"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FundingBarProps {
  current: number // cents
  target: number  // cents
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function FundingBar({ current, target }: FundingBarProps) {
  const { t } = useLingui()
  const percent = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
  const isComplete = percent >= 100
  const currentFormatted = formatCents(current)
  const targetFormatted = formatCents(target)

  return (
    <div className="space-y-1.5">
      <Progress
        value={percent}
        className={cn("h-2", isComplete && "[&>[data-slot=progress-indicator]]:bg-green-600")}
      />
      <p className="text-xs text-muted-foreground">
        {t`${currentFormatted} / ${targetFormatted} (${percent}%)`}
      </p>
    </div>
  )
}
