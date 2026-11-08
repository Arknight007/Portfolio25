"use client"

import { animate, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduce = useReducedMotion()
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) return setV(to)
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) })
    return () => controls.stop()
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span className="tabular-nums">{v}</span>
      {suffix}
    </span>
  )
}
