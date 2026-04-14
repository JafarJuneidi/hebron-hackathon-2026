import { type ReactNode } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
}

const containerVariants = {
  hidden: {},
  visible: (stagger: boolean) => ({
    transition: stagger ? { staggerChildren: 0.15 } : undefined,
  }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  stagger = false,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={stagger}
      variants={containerVariants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  )
}
