import { useRef, useState, useEffect } from "react"
import { useInView } from "motion/react"

interface CountUpProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function CountUp({
  target,
  duration = 1.5,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView || target === 0) return

    const start = performance.now()
    let rafId: number

    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
