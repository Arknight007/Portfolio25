"use client"

import { useRef, type ReactNode, type PointerEvent } from "react"
import { cn } from "@/lib/utils"

/** Card with a pointer-tracking glow border and optional 3D tilt. */
export function SpotlightCard({
  children,
  className,
  tilt = false,
}: {
  children: ReactNode
  className?: string
  tilt?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty("--mx", `${x}px`)
    el.style.setProperty("--my", `${y}px`)
    if (tilt && e.pointerType === "mouse") {
      const rx = ((y / r.height) - 0.5) * -6
      const ry = ((x / r.width) - 0.5) * 8
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
  }
  const onLeave = () => {
    if (tilt && ref.current) ref.current.style.transform = ""
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("spotlight glass rounded-3xl transition-transform duration-300 ease-out will-change-transform", className)}
    >
      {children}
    </div>
  )
}
