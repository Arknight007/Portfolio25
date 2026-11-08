"use client"

import { useEffect, useRef } from "react"
import { useCanvas } from "@/components/viz/use-canvas"

type Pt = { x: number; y: number }
const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  }
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2)

/** IISER Kolkata: a lander flying an optimised soft-landing trajectory vs a baseline. */
export function DescentViz() {
  const hud = useRef<HTMLDivElement>(null)
  const ref = useCanvas((ctx, w, h, t, state) => {
    const s = state as { stars?: { x: number; y: number; r: number }[]; dust?: { x: number; y: number; vx: number; vy: number; life: number }[]; landedAt?: number }
    if (!s.stars || s.stars.length === 0) {
      s.stars = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random() * 0.7, r: Math.random() * 1.1 + 0.2 }))
      s.dust = []
    }
    const groundY = h * 0.82
    const padX = w * 0.66
    const CYCLE = 7.5
    const ct = t % CYCLE
    const k = Math.min(1, ct / 5.2)

    ctx.clearRect(0, 0, w, h)

    // stars
    for (const st of s.stars) {
      ctx.globalAlpha = 0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * 2 + st.x * 40))
      ctx.fillStyle = "#fff"
      ctx.fillRect(st.x * w, st.y * h, st.r, st.r)
    }
    ctx.globalAlpha = 1

    // planet limb in the corner
    const lg = ctx.createRadialGradient(w * 1.05, -h * 0.25, h * 0.2, w * 1.05, -h * 0.25, h * 0.62)
    lg.addColorStop(0, "rgba(34,211,197,0.35)")
    lg.addColorStop(0.7, "rgba(34,211,197,0.06)")
    lg.addColorStop(1, "rgba(34,211,197,0)")
    ctx.fillStyle = lg
    ctx.fillRect(0, 0, w, h)

    // terrain
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 6) {
      const flat = Math.abs(x - padX) < w * 0.09
      const y = flat ? groundY : groundY + Math.sin(x * 0.03) * 5 + Math.sin(x * 0.011 + 1) * 9 - 4
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    const tg = ctx.createLinearGradient(0, groundY - 10, 0, h)
    tg.addColorStop(0, "#2a2438")
    tg.addColorStop(1, "#0d0b16")
    ctx.fillStyle = tg
    ctx.fill()
    ctx.strokeStyle = "rgba(255,215,122,0.25)"
    ctx.stroke()
    // craters
    ctx.fillStyle = "rgba(0,0,0,0.25)"
    ;[0.12, 0.3, 0.88].forEach((cx, i) => {
      ctx.beginPath()
      ctx.ellipse(cx * w, groundY + 14 + i * 4, 18 - i * 3, 4, 0, 0, Math.PI * 2)
      ctx.fill()
    })

    // pad + beacons
    ctx.fillStyle = "rgba(255,182,39,0.9)"
    ctx.fillRect(padX - 26, groundY - 2, 52, 3)
    const blink = Math.sin(t * 6) > 0 ? 1 : 0.25
    ;[-26, 26].forEach((dx) => {
      ctx.fillStyle = `rgba(255,61,129,${blink})`
      ctx.beginPath()
      ctx.arc(padX + dx, groundY - 5, 2.2, 0, Math.PI * 2)
      ctx.fill()
    })

    const start = { x: w * 0.08, y: h * 0.1 }
    const opt = [start, { x: w * 0.42, y: h * 0.05 }, { x: padX, y: groundY - h * 0.45 }, { x: padX, y: groundY - 10 }] as const
    const base = [start, { x: w * 0.5, y: h * 0.0 }, { x: w * 0.86, y: groundY - h * 0.3 }, { x: w * 0.8, y: groundY - 10 }] as const

    // baseline trajectory
    ctx.setLineDash([4, 6])
    ctx.strokeStyle = "rgba(179,171,194,0.35)"
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let i = 0; i <= 60; i++) {
      const p = bez(base[0], base[1], base[2], base[3], i / 60)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()
    ctx.setLineDash([])
    // baseline miss marker
    ctx.strokeStyle = "rgba(179,171,194,0.5)"
    ctx.beginPath()
    ctx.moveTo(w * 0.8 - 5, groundY - 5)
    ctx.lineTo(w * 0.8 + 5, groundY + 5)
    ctx.moveTo(w * 0.8 + 5, groundY - 5)
    ctx.lineTo(w * 0.8 - 5, groundY + 5)
    ctx.stroke()

    // optimised trajectory (drawn up to the lander)
    const e = easeOut(k)
    const grad = ctx.createLinearGradient(start.x, start.y, padX, groundY)
    grad.addColorStop(0, "rgba(255,153,51,0.2)")
    grad.addColorStop(1, "rgba(255,215,122,0.95)")
    ctx.strokeStyle = grad
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= 80; i++) {
      const tt = (i / 80) * e
      const p = bez(opt[0], opt[1], opt[2], opt[3], tt)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.stroke()

    // lander
    const p = bez(opt[0], opt[1], opt[2], opt[3], e)
    const p2 = bez(opt[0], opt[1], opt[2], opt[3], Math.min(1, e + 0.01))
    let ang = Math.atan2(p2.y - p.y, p2.x - p.x) - Math.PI / 2
    ang *= 1 - Math.min(1, k * 1.4) // upright for the final approach
    const landed = k >= 1
    const burn = landed ? 0 : 0.35 + Math.min(1, Math.max(0, (k - 0.45) * 2)) * 0.65

    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(ang)
    // flame
    if (burn > 0) {
      const fl = 10 + burn * 18 + Math.random() * 5
      const fg = ctx.createLinearGradient(0, 6, 0, 6 + fl)
      fg.addColorStop(0, "rgba(255,255,230,0.95)")
      fg.addColorStop(0.4, "rgba(255,182,39,0.85)")
      fg.addColorStop(1, "rgba(255,61,129,0)")
      ctx.fillStyle = fg
      ctx.beginPath()
      ctx.moveTo(-4, 6)
      ctx.quadraticCurveTo(0, 6 + fl * 1.1, 4, 6)
      ctx.fill()
    }
    // legs
    ctx.strokeStyle = "#b3abc2"
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(-6, 3)
    ctx.lineTo(-11, 10)
    ctx.moveTo(6, 3)
    ctx.lineTo(11, 10)
    ctx.stroke()
    // body
    ctx.fillStyle = "#f6efe4"
    ctx.beginPath()
    ctx.moveTo(-7, 5)
    ctx.lineTo(7, 5)
    ctx.lineTo(5, -6)
    ctx.lineTo(-5, -6)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = "#22d3c5"
    ctx.fillRect(-2.5, -3, 5, 3)
    ctx.restore()

    // touchdown dust
    if (landed && s.landedAt === undefined) {
      s.landedAt = t
      for (let i = 0; i < 40; i++) {
        const a = Math.PI + Math.random() * Math.PI
        s.dust!.push({ x: padX, y: groundY - 2, vx: Math.cos(a) * (20 + Math.random() * 60), vy: Math.sin(a) * (5 + Math.random() * 20), life: 0 })
      }
    }
    if (!landed) s.landedAt = undefined
    for (let i = s.dust!.length - 1; i >= 0; i--) {
      const d = s.dust![i]
      d.life += 1 / 60
      d.x += d.vx / 60
      d.y += d.vy / 60
      d.vy += 0.6
      if (d.life > 1.2) s.dust!.splice(i, 1)
      ctx.fillStyle = `rgba(220,200,170,${0.5 * (1 - d.life / 1.2)})`
      ctx.fillRect(d.x, d.y, 2, 2)
    }

    if (landed) {
      ctx.font = "600 11px ui-monospace, monospace"
      ctx.fillStyle = "#2cbb5d"
      ctx.textAlign = "center"
      ctx.fillText("TOUCHDOWN ✓", padX, groundY - 40)
    }

    // HUD (DOM, cheaper for text)
    if (hud.current) {
      const alt = Math.max(0, ((groundY - 10 - p.y) / (groundY - 10 - start.y)) * 2400)
      const vel = landed ? 0 : Math.max(0.4, (1 - e) * 62)
      const fuel = 100 - e * 46
      hud.current.textContent = `ALT ${alt.toFixed(0).padStart(4, " ")} m   VEL ${vel.toFixed(1).padStart(4, " ")} m/s   FUEL ${fuel.toFixed(0)}%`
    }
  })

  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-2xl border border-line bg-[rgb(8_7_16/0.75)]">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-label="Animated spacecraft soft-landing simulation" role="img" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        <span>soft-landing / trajectory</span>
        <span className="hidden items-center gap-3 sm:flex">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-gold" /> optimised</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 border-t border-dashed border-ink-dim" /> baseline</span>
        </span>
      </div>
      <div ref={hud} className="pointer-events-none absolute bottom-4 left-5 whitespace-pre font-mono text-[10px] text-peacock sm:text-[11px]" />
    </div>
  )
}
