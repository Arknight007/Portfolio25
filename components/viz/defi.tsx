"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { useCanvas } from "@/components/viz/use-canvas"

const VB = { w: 400, h: 300 }
const HUB = { x: 200, y: 150 }
const NODES = ["INR", "USD", "AED", "GBP", "SGD", "PHP", "EUR"].map((code, i, arr) => {
  const a = (i / arr.length) * Math.PI * 2 - Math.PI / 2
  return { code, x: HUB.x + Math.cos(a) * 128, y: HUB.y + Math.sin(a) * 112 }
})

type Packet = { from: number; to: number; t: number; speed: number; color: string }
type Tx = { id: number; from: string; to: string; secs: string }

const COLORS = ["#ffd77a", "#ff9933", "#ff3d81", "#22d3c5"]
const quad = (a: number, c: number, b: number, t: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b

/** Borderless: cross-border transfers routed through an on-chain hub. */
export function DefiViz() {
  const [feed, setFeed] = useState<Tx[]>([])
  const nextId = useRef(0)
  const pending = useRef<Tx[]>([])

  useEffect(() => {
    const id = setInterval(() => {
      if (!pending.current.length) return
      const add = pending.current.splice(0)
      setFeed((f) => [...add.reverse(), ...f].slice(0, 3))
    }, 400)
    return () => clearInterval(id)
  }, [])

  const ref = useCanvas((ctx, w, h, t, state) => {
    const s = state as { packets?: Packet[]; spawn?: number; last?: number }
    s.packets ??= []
    s.spawn ??= 0
    const dt = s.last === undefined ? 0 : Math.max(0, Math.min(0.05, t - s.last))
    s.last = t
    const k = Math.min(w / VB.w, h / VB.h)
    const ox = (w - VB.w * k) / 2
    const oy = (h - VB.h * k) / 2
    const X = (x: number) => ox + x * k
    const Y = (y: number) => oy + y * k

    s.spawn -= dt
    if (s.spawn <= 0 && s.packets.length < 14) {
      s.spawn = 0.35 + Math.random() * 0.4
      const from = Math.floor(Math.random() * NODES.length)
      let to = Math.floor(Math.random() * (NODES.length - 1))
      if (to >= from) to++
      s.packets.push({ from, to, t: 0, speed: 0.55 + Math.random() * 0.3, color: COLORS[Math.floor(Math.random() * COLORS.length)] })
    }

    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = "lighter"
    for (let i = s.packets.length - 1; i >= 0; i--) {
      const p = s.packets[i]
      p.t += dt * p.speed
      const a = NODES[p.from]
      const b = NODES[p.to]
      // two legs: sender → hub, hub → receiver
      const leg = p.t < 0.5 ? 0 : 1
      const lt = leg === 0 ? p.t * 2 : (p.t - 0.5) * 2
      const s0 = leg === 0 ? a : HUB
      const s1 = leg === 0 ? HUB : b
      const c = { x: (s0.x + s1.x) / 2 + (s1.y - s0.y) * 0.18, y: (s0.y + s1.y) / 2 - (s1.x - s0.x) * 0.18 }
      for (let j = 0; j < 6; j++) {
        const tt = Math.max(0, lt - j * 0.025)
        const x = X(quad(s0.x, c.x, s1.x, tt))
        const y = Y(quad(s0.y, c.y, s1.y, tt))
        ctx.globalAlpha = (1 - j / 6) * 0.9
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(x, y, (2.6 - j * 0.3) * Math.max(0.8, k), 0, Math.PI * 2)
        ctx.fill()
      }
      if (p.t >= 1) {
        s.packets.splice(i, 1)
        pending.current.push({ id: nextId.current++, from: a.code, to: b.code, secs: (1.6 + Math.random() * 2.2).toFixed(1) })
      }
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = "source-over"
  })

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-line bg-[#0b0916]/90">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="hubGlow">
              <stop offset="0" stopColor="#ff9933" stopOpacity="0.5" />
              <stop offset="1" stopColor="#ff9933" stopOpacity="0" />
            </radialGradient>
          </defs>
          {NODES.map((n) => (
            <path
              key={n.code}
              d={`M${n.x} ${n.y} Q ${(n.x + HUB.x) / 2 + (HUB.y - n.y) * 0.18} ${(n.y + HUB.y) / 2 - (HUB.x - n.x) * 0.18} ${HUB.x} ${HUB.y}`}
              stroke="rgb(255 255 255 / 0.08)"
              fill="none"
            />
          ))}
          <circle cx={HUB.x} cy={HUB.y} r="70" fill="url(#hubGlow)" />
          {/* chains orbiting the hub */}
          <g className="origin-center animate-spin-slow" style={{ transformOrigin: `${HUB.x}px ${HUB.y}px`, transformBox: "view-box" }}>
            <circle cx={HUB.x} cy={HUB.y} r="44" fill="none" stroke="rgb(255 215 122 / 0.3)" strokeDasharray="2 4" />
            {Array.from({ length: 5 }).map((_, i) => {
              const a = (i / 5) * Math.PI * 2
              return (
                <rect
                  key={i}
                  x={HUB.x + Math.cos(a) * 44 - 4}
                  y={HUB.y + Math.sin(a) * 44 - 4}
                  width="8"
                  height="8"
                  rx="2"
                  fill={["#ffd77a", "#ff9933", "#ff3d81", "#22d3c5", "#8b5cf6"][i]}
                  opacity="0.9"
                />
              )
            })}
          </g>
          <polygon
            points={Array.from({ length: 6 })
              .map((_, i) => `${HUB.x + Math.cos((i / 6) * Math.PI * 2) * 26},${HUB.y + Math.sin((i / 6) * Math.PI * 2) * 26}`)
              .join(" ")}
            fill="#16112a"
            stroke="#ffb627"
            strokeWidth="1.2"
          />
          <text x={HUB.x} y={HUB.y + 3} textAnchor="middle" fontSize="8" fontFamily="ui-monospace, monospace" fill="#ffd77a">
            BORDERLESS
          </text>
          {NODES.map((n) => (
            <g key={n.code}>
              <circle cx={n.x} cy={n.y} r="17" fill="#0f0c1c" stroke="rgb(255 255 255 / 0.18)" />
              <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fill="#f6efe4">
                {n.code}
              </text>
            </g>
          ))}
        </svg>
        <canvas ref={ref} className="absolute inset-0 h-full w-full" role="img" aria-label="Animated remittance transfers routed between currencies through the Borderless hub" />
        <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">remittance mesh · 5+ chains</div>
        <ul className="pointer-events-none absolute bottom-3 left-3 space-y-1 font-mono text-[10px] sm:text-[11px]" aria-hidden="true">
          {feed.map((f) => (
            <motion.li
              key={f.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-md border border-line bg-black/60 px-2 py-1 text-ink-dim backdrop-blur"
            >
              <span className="text-ink">{f.from}</span> → <span className="text-ink">{f.to}</span> · settled{" "}
              <span className="text-peacock">{f.secs}s</span> <span className="text-leet">✓</span>
            </motion.li>
          ))}
        </ul>
        <span className="pointer-events-none absolute bottom-3 right-3 font-mono text-[9px] text-ink-faint">simulated feed</span>
      </div>

      <div className="grid flex-1 gap-px border-t border-line bg-line sm:grid-cols-[1.4fr_1fr]">
        <div className="bg-[#0b0916] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Remittance fees</p>
          {[
            { k: "Traditional rails", v: 100, tone: "bg-ink-faint" },
            { k: "Borderless", v: 10, tone: "bg-gradient-to-r from-saffron to-gold" },
          ].map((r, i) => (
            <div key={r.k} className="mt-3">
              <div className="mb-1 flex justify-between font-mono text-[11px]">
                <span className="text-ink-dim">{r.k}</span>
                <span className="text-ink">{i === 1 ? "−90%" : "baseline"}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className={`h-full rounded-full ${r.tone}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.v}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, delay: 0.2 + i * 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 bg-[#0b0916] p-4">
          <svg viewBox="0 0 44 44" className="h-16 w-16 shrink-0 -rotate-90" aria-hidden="true">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="4" />
            <motion.circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#22d3c5"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 0.4 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div>
            <p className="font-display text-2xl font-semibold text-peacock">40%</p>
            <p className="font-mono text-[10px] leading-tight text-ink-faint">max APY on custom yield wallets</p>
          </div>
        </div>
      </div>
    </div>
  )
}
