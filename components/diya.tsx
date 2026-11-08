import { useId } from "react"
import { cn } from "@/lib/utils"

/** Clay oil lamp with a flickering flame. Pure SVG + CSS, no JS animation. */
export function Diya({
  className,
  lit = true,
  delay = 0,
}: {
  className?: string
  lit?: boolean
  delay?: number
}) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 64 56" className={cn("overflow-visible", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`clay-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2601c" />
          <stop offset="0.55" stopColor="#a63a10" />
          <stop offset="1" stopColor="#5c1d07" />
        </linearGradient>
        <radialGradient id={`flame-${id}`} cx="0.5" cy="0.72" r="0.62">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.28" stopColor="#fff2b0" />
          <stop offset="0.6" stopColor="#ffb627" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id={`glow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb627" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#ff9933" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ff6a1f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* halo */}
      <circle
        cx="56"
        cy="16"
        r="20"
        fill={`url(#glow-${id})`}
        style={{ opacity: lit ? 1 : 0, transition: "opacity 0.8s ease", transitionDelay: `${delay}ms` }}
      />

      {/* bowl */}
      <path
        d="M4 30 C 8 46, 24 52, 34 52 C 46 52, 56 44, 60 32 L 52 30 C 40 34, 22 34, 4 30 Z"
        fill={`url(#clay-${id})`}
      />
      {/* oil surface / rim */}
      <path d="M4 30 C 22 35, 40 35, 52 30 L 60 27 C 50 25, 30 25, 4 30 Z" fill="#ffcf6b" opacity="0.9" />
      <path d="M4 30 C 22 35, 40 35, 52 30" fill="none" stroke="#ffe6a8" strokeWidth="1" opacity="0.6" />
      {/* decorative dots */}
      <g fill="#ffd77a" opacity="0.7">
        <circle cx="16" cy="41" r="1.4" />
        <circle cx="25" cy="44.5" r="1.4" />
        <circle cx="34" cy="45.5" r="1.4" />
        <circle cx="43" cy="44" r="1.4" />
      </g>
      {/* wick */}
      <path d="M52 30 L 56 24" stroke="#3b1a0a" strokeWidth="2" strokeLinecap="round" />

      {/* flame */}
      <g
        style={{
          transformOrigin: "56px 26px",
          transformBox: "view-box",
          opacity: lit ? 1 : 0,
          transition: "opacity 0.6s ease",
          transitionDelay: `${delay}ms`,
        }}
      >
        <path
          className="animate-flicker"
          style={{ transformOrigin: "56px 26px", transformBox: "view-box", animationDelay: `${(delay % 900) / 1000}s` }}
          d="M56 2 C 62 12, 64 19, 56 26 C 48 19, 50 12, 56 2 Z"
          fill={`url(#flame-${id})`}
        />
      </g>
    </svg>
  )
}
