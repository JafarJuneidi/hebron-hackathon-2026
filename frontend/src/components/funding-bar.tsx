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
  const isAlmostThere = percent >= 80 && !isComplete
  const raised = formatCents(current)
  const goal = formatCents(target)

  return (
    <div className="space-y-1.5">
      <Progress
        value={percent}
        className={cn(
          "h-3",
          isComplete
            ? "[&>[data-slot=progress-indicator]]:bg-amber-500"
            : "[&>[data-slot=progress-indicator]]:bg-primary"
        )}
      />
      <p className={cn("text-xs text-muted-foreground", isComplete && "text-amber-600 dark:text-amber-400")}>
        {t`${raised} of ${goal} raised`}
        {isAlmostThere && (
          <span className="text-primary font-medium"> Almost there!</span>
        )}
      </p>
    </div>
  )
}
