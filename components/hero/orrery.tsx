"use client"

import { useEffect, useRef } from "react"
import { Atom, Braces, Cloud, Layers, Satellite, Wallet, type LucideIcon } from "lucide-react"
import { hero } from "@/lib/data"

const ICONS: Record<string, LucideIcon> = { braces: Braces, cloud: Cloud, atom: Atom, satellite: Satellite, layers: Layers, wallet: Wallet }

// Three tilted orbits; two planets per orbit.
const ORBITS = [
  { a: 0.5, speed: 0.2 },
  { a: 0.72, speed: 0.12 },
  { a: 0.94, speed: 0.075 },
]

/** Rangoli-style mandala drawn around the sun. */
function Rangoli({ className }: { className?: string }) {
  const petals = 16
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <g fill="none" strokeWidth="0.8">
        {Array.from({ length: petals }).map((_, i) => (
          <ellipse
            key={`o${i}`}
            cx="0"
            cy="-62"
            rx="9"
            ry="26"
            transform={`rotate(${(360 / petals) * i})`}
            stroke={i % 2 ? "#ff3d81" : "#ff9933"}
            opacity="0.55"
          />
        ))}
        {Array.from({ length: petals / 2 }).map((_, i) => (
          <path
            key={`p${i}`}
            d="M0 -30 C 10 -44, 10 -52, 0 -60 C -10 -52, -10 -44, 0 -30 Z"
            transform={`rotate(${(360 / (petals / 2)) * i + 22.5})`}
            stroke="#ffd77a"
            opacity="0.6"
          />
        ))}
        <circle r="88" stroke="#ffb627" strokeDasharray="1 5" opacity="0.5" />
        <circle r="28" stroke="#ffd77a" strokeDasharray="2 3" opacity="0.6" />
      </g>
      <g fill="#ffd77a">
        {Array.from({ length: 32 }).map((_, i) => {
          const t = (i / 32) * Math.PI * 2
          return <circle key={`d${i}`} cx={Math.cos(t) * 94} cy={Math.sin(t) * 94} r={i % 4 === 0 ? 1.8 : 0.9} opacity="0.7" />
        })}
      </g>
    </svg>
  )
}

export function Orrery() {
  const wrap = useRef<HTMLDivElement>(null)
  const planets = useRef<(HTMLDivElement | null)[]>([])
  const rings = useRef<(SVGEllipseElement | null)[]>([])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0
    let tilt = 0.4
    let targetTilt = 0.4
    let spin = 0
    let targetSpin = 0
    let paused = false
    let t = 0
    let last = performance.now()
    let visible = true

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      targetTilt = 0.3 + ((e.clientY - r.top) / r.height) * 0.22
      targetSpin = ((e.clientX - r.left) / r.width - 0.5) * 0.6
    }
    const onLeave = () => {
      targetTilt = 0.4
      targetSpin = 0
    }
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    const onEnterPlanet = () => (paused = true)
    const onLeavePlanet = () => (paused = false)
    planets.current.forEach((p) => {
      p?.addEventListener("pointerenter", onEnterPlanet)
      p?.addEventListener("pointerleave", onLeavePlanet)
    })

    const place = () => {
      const size = el.clientWidth
      const half = size / 2
      ORBITS.forEach((o, i) => {
        const ring = rings.current[i]
        if (ring) {
          ring.setAttribute("cx", String(half))
          ring.setAttribute("cy", String(half))
          ring.setAttribute("rx", String(o.a * half))
          ring.setAttribute("ry", String(o.a * half * tilt))
        }
      })
      hero.orbits.forEach((_, i) => {
        const p = planets.current[i]
        if (!p) return
        const o = ORBITS[Math.floor(i / 2)]
        const theta = t * o.speed + (i % 2) * Math.PI + Math.floor(i / 2) * 1.1 + spin
        const x = Math.cos(theta) * o.a * half
        const y = Math.sin(theta) * o.a * half * tilt
        const depth = Math.sin(theta) // -1 back, +1 front
        const scale = 0.78 + (depth + 1) * 0.16
        p.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale})`
        p.style.zIndex = depth > 0 ? "30" : "5"
        p.style.opacity = String(0.55 + (depth + 1) * 0.225)
      })
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (visible) {
        if (!paused && !reduce) t += dt
        tilt += (targetTilt - tilt) * 0.06
        spin += (targetSpin - spin) * 0.06
        place()
      }
      raf = requestAnimationFrame(loop)
    }
    t = 2
    place()
    raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(place)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[560px] select-none" data-no-fx>
      {/* orbit rings */}
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="-50 -50 100 100" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="ring" x1="0" x2="1">
            <stop offset="0" stopColor="#ff9933" stopOpacity="0.05" />
            <stop offset="0.5" stopColor="#ffd77a" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ff3d81" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <g>
          {ORBITS.map((_, i) => (
            <ellipse
              key={i}
              ref={(n) => {
                rings.current[i] = n
              }}
              cx="0"
              cy="0"
              rx="0"
              ry="0"
              fill="none"
              stroke="url(#ring)"
              strokeWidth="1"
              strokeDasharray={i === 1 ? "3 6" : undefined}
            />
          ))}
        </g>
      </svg>

      {/* sun */}
      <div className="absolute left-1/2 top-1/2 z-20 h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-[-40%] rounded-full bg-[radial-gradient(circle,rgb(255_153_51/0.35),transparent_65%)] blur-2xl" />
        <Rangoli className="absolute inset-[-28%] animate-spin-slow opacity-80" />
        <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_38%_35%,#fff6dc_0%,#ffd77a_22%,#ff9933_55%,#e2401c_85%,#7a1d08_100%)] shadow-[0_0_60px_10px_rgb(255_153_51/0.55),0_0_140px_30px_rgb(255_61_129/0.25)]" />
        <div className="absolute inset-[14%] animate-spin-rev rounded-full bg-[conic-gradient(from_0deg,transparent,rgb(255_255_255/0.18),transparent_30%,rgb(255_255_255/0.12),transparent_60%)] mix-blend-overlay" />
        <span className="absolute inset-[14%] rounded-full border border-gold/50 animate-pulse-ring" />
      </div>

      {/* planets */}
      {hero.orbits.map((o, i) => {
        const Icon = ICONS[o.icon]
        return (
          <div
            key={o.label}
            ref={(n) => {
              planets.current[i] = n
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <div className="group flex items-center gap-2 rounded-full border border-white/10 bg-[rgb(14_11_26/0.85)] py-1.5 pl-1.5 pr-3.5 shadow-[0_8px_30px_-8px_rgb(0_0_0/0.8)] backdrop-blur-md transition hover:border-gold/60">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-saffron/90 to-rangoli/80 text-[#1a0f02]">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap font-mono text-xs text-ink">{o.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
