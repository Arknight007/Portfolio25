"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { useCanvas } from "@/components/viz/use-canvas"

const TILT = 23.44
const DEG = Math.PI / 180
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const declination = (n: number) => TILT * Math.sin((2 * Math.PI * (284 + n)) / 365)
function dayLength(lat: number, dec: number) {
  const x = -Math.tan(lat * DEG) * Math.tan(dec * DEG)
  if (x <= -1) return 24
  if (x >= 1) return 0
  return (2 * Math.acos(x)) / DEG / 15
}
const elevation = (lat: number, dec: number, hour: number) =>
  Math.asin(Math.sin(lat * DEG) * Math.sin(dec * DEG) + Math.cos(lat * DEG) * Math.cos(dec * DEG) * Math.cos((hour - 12) * 15 * DEG)) / DEG
function dateLabel(n: number) {
  const d = new Date(2026, 0, Math.round(n))
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}
function dayOfYear(d: Date) {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
}

const EVENTS = [
  { n: 79, label: "March equinox" },
  { n: 172, label: "June solstice" },
  { n: 265, label: "September equinox" },
  { n: 355, label: "December solstice" },
]

/** Solar Positioning Equinox Simulator: orbit view + sun path in the sky. */
export function SolarViz() {
  const [day, setDay] = useState(312)
  const [lat, setLat] = useState(19.1)
  const [playing, setPlaying] = useState(true)
  const dayRef = useRef(day)
  const latRef = useRef(lat)
  const playRef = useRef(playing)
  latRef.current = lat
  playRef.current = playing

  useEffect(() => {
    const n = dayOfYear(new Date())
    dayRef.current = n
    setDay(n)
  }, [])

  // throttle React updates while the canvas advances the day
  useEffect(() => {
    const id = setInterval(() => {
      if (playRef.current) setDay(Math.round(dayRef.current))
    }, 120)
    return () => clearInterval(id)
  }, [])

  const orbit = useCanvas((ctx, w, h, t, state) => {
    const s = state as { last?: number }
    const dt = s.last === undefined ? 0 : Math.max(0, Math.min(0.05, t - s.last))
    s.last = t
    if (playRef.current) dayRef.current = ((dayRef.current + dt * 22 - 1) % 365) + 1

    const n = dayRef.current
    const cx = w / 2
    const cy = h / 2
    const a = Math.min(w * 0.4, h * 0.95)
    const b = a * 0.42
    ctx.clearRect(0, 0, w, h)

    // orbit
    ctx.strokeStyle = "rgba(255,255,255,0.12)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2)
    ctx.stroke()

    const theta = (n: number) => (2 * Math.PI * (n - 79)) / 365 + Math.PI // equinox on the left
    const pos = (n: number) => ({ x: cx + Math.cos(theta(n)) * a, y: cy + Math.sin(theta(n)) * b })

    // traversed arc
    const g = ctx.createLinearGradient(cx - a, cy, cx + a, cy)
    g.addColorStop(0, "rgba(255,153,51,0.9)")
    g.addColorStop(1, "rgba(255,61,129,0.9)")
    ctx.strokeStyle = g
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, a, b, 0, theta(1), theta(n))
    ctx.stroke()

    // event markers
    ctx.font = "10px ui-monospace, monospace"
    ctx.textAlign = "center"
    for (const e of EVENTS) {
      const p = pos(e.n)
      ctx.fillStyle = "rgba(255,215,122,0.9)"
      ctx.beginPath()
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "rgba(179,171,194,0.85)"
      const above = p.y < cy - 1
      const label = e.label.slice(0, 3) + (e.label.includes("equinox") ? " equinox" : " solstice")
      ctx.fillText(label, p.x, above ? p.y - 10 : p.y + 18)
    }

    const ep = pos(n)
    const behind = ep.y < cy

    const drawSun = () => {
      const r = Math.min(w, h) * 0.075
      const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3.2)
      sg.addColorStop(0, "rgba(255,246,220,1)")
      sg.addColorStop(0.18, "rgba(255,215,122,1)")
      sg.addColorStop(0.35, "rgba(255,153,51,0.55)")
      sg.addColorStop(1, "rgba(255,106,31,0)")
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.arc(cx, cy, r * 3.2, 0, Math.PI * 2)
      ctx.fill()
      // rays
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.15)
      ctx.strokeStyle = "rgba(255,215,122,0.35)"
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6)
        ctx.beginPath()
        ctx.moveTo(r * 1.25, 0)
        ctx.lineTo(r * (1.7 + 0.2 * Math.sin(t * 2 + i)), 0)
        ctx.stroke()
      }
      ctx.restore()
    }

    const drawEarth = () => {
      const r = Math.max(7, Math.min(w, h) * 0.04) * (behind ? 0.85 : 1.1)
      // sunlight ray
      ctx.strokeStyle = "rgba(255,215,122,0.25)"
      ctx.setLineDash([2, 4])
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(ep.x, ep.y)
      ctx.stroke()
      ctx.setLineDash([])
      // planet
      const toSun = Math.atan2(cy - ep.y, cx - ep.x)
      ctx.fillStyle = "#0b1230"
      ctx.beginPath()
      ctx.arc(ep.x, ep.y, r, 0, Math.PI * 2)
      ctx.fill()
      const lit = ctx.createLinearGradient(
        ep.x + Math.cos(toSun) * r,
        ep.y + Math.sin(toSun) * r,
        ep.x - Math.cos(toSun) * r,
        ep.y - Math.sin(toSun) * r,
      )
      lit.addColorStop(0, "#7fe3ff")
      lit.addColorStop(0.45, "#2f7de1")
      lit.addColorStop(0.55, "rgba(20,40,90,0.2)")
      lit.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = lit
      ctx.beginPath()
      ctx.arc(ep.x, ep.y, r, 0, Math.PI * 2)
      ctx.fill()
      // atmosphere
      ctx.strokeStyle = "rgba(127,227,255,0.45)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(ep.x, ep.y, r + 1.5, 0, Math.PI * 2)
      ctx.stroke()
      // axis (fixed in space → seasons)
      ctx.strokeStyle = "rgba(255,255,255,0.8)"
      ctx.lineWidth = 1.2
      const ax = Math.sin(-TILT * DEG) * r * 1.9
      const ay = -Math.cos(TILT * DEG) * r * 1.9
      ctx.beginPath()
      ctx.moveTo(ep.x - ax, ep.y - ay)
      ctx.lineTo(ep.x + ax, ep.y + ay)
      ctx.stroke()
    }

    if (behind) {
      drawEarth()
      drawSun()
    } else {
      drawSun()
      drawEarth()
    }
  })

  const sky = useCanvas((ctx, w, h, t) => {
    const n = dayRef.current
    const la = latRef.current
    const dec = declination(n)
    ctx.clearRect(0, 0, w, h)
    const horizon = h * 0.78
    const scaleY = (horizon - 12) / 90

    // sky gradient
    const sg = ctx.createLinearGradient(0, 0, 0, horizon)
    sg.addColorStop(0, "rgba(139,92,246,0.10)")
    sg.addColorStop(1, "rgba(255,153,51,0.12)")
    ctx.fillStyle = sg
    ctx.fillRect(0, 0, w, horizon)

    // path
    ctx.beginPath()
    for (let i = 0; i <= 96; i++) {
      const hr = (i / 96) * 24
      const x = (hr / 24) * w
      const y = horizon - elevation(la, dec, hr) * scaleY
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = "rgba(255,215,122,0.8)"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // ground
    ctx.fillStyle = "rgba(6,5,12,0.92)"
    ctx.fillRect(0, horizon, w, h - horizon)
    ctx.strokeStyle = "rgba(255,255,255,0.25)"
    ctx.beginPath()
    ctx.moveTo(0, horizon)
    ctx.lineTo(w, horizon)
    ctx.stroke()
    ctx.fillStyle = "rgba(179,171,194,0.8)"
    ctx.font = "9px ui-monospace, monospace"
    ctx.textAlign = "center"
    ;["00", "06", "12", "18", "24"].forEach((lbl, i) => ctx.fillText(lbl, (i / 4) * w + (i === 0 ? 8 : i === 4 ? -8 : 0), h - 6))

    // moving sun
    const hr = (t * 2.4) % 24
    const el = elevation(la, dec, hr)
    const x = (hr / 24) * w
    const y = horizon - el * scaleY
    if (el > -2) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, 14)
      g.addColorStop(0, "rgba(255,246,220,1)")
      g.addColorStop(0.35, "rgba(255,182,39,0.9)")
      g.addColorStop(1, "rgba(255,106,31,0)")
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, Math.min(y, horizon), 14, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = "rgba(200,210,255,0.8)"
      ctx.beginPath()
      ctx.arc(x, horizon + 8, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  const dec = declination(day)
  const noon = 90 - Math.abs(lat - dec)
  const len = dayLength(lat, dec)

  return (
    <div className="grid h-full min-h-[420px] overflow-hidden rounded-2xl border border-line bg-[#0b0916]/90 md:grid-cols-[1.35fr_1fr]">
      <div className="relative min-h-[260px] border-b border-line md:border-b-0 md:border-r">
        <canvas ref={orbit} className="absolute inset-0 h-full w-full" role="img" aria-label="Earth orbiting the Sun with equinox and solstice markers" />
        <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">heliocentric view</div>
        <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-xs text-ink">
          <span className="text-gold">{dateLabel(day)}</span> · day {day}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">controls</p>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[10px] text-ink-dim transition hover:text-ink"
            aria-label={playing ? "Pause orbit" : "Play orbit"}
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />} {playing ? "pause" : "play"}
          </button>
        </div>

        <label className="block">
          <span className="flex justify-between font-mono text-[11px] text-ink-dim">
            <span>Day of year</span>
            <span className="text-ink">{dateLabel(day)}</span>
          </span>
          <input
            type="range"
            min={1}
            max={365}
            value={day}
            onChange={(e) => {
              const v = Number(e.target.value)
              setPlaying(false)
              dayRef.current = v
              setDay(v)
            }}
            className="solar-range mt-2 w-full"
          />
        </label>
        <label className="block">
          <span className="flex justify-between font-mono text-[11px] text-ink-dim">
            <span>Latitude</span>
            <span className="text-ink">
              {Math.abs(lat).toFixed(1)}°{lat >= 0 ? "N" : "S"} {Math.abs(lat - 19.1) < 0.05 && <span className="text-ink-faint">· Mumbai</span>}
            </span>
          </span>
          <input
            type="range"
            min={-66}
            max={66}
            step={0.1}
            value={lat}
            onChange={(e) => setLat(Number(e.target.value))}
            className="solar-range mt-2 w-full"
          />
        </label>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            { k: "Declination", v: `${dec >= 0 ? "+" : ""}${dec.toFixed(1)}°` },
            { k: "Noon sun", v: `${Math.max(0, noon).toFixed(1)}°` },
            { k: "Daylight", v: `${Math.floor(len)}h ${String(Math.round((len % 1) * 60)).padStart(2, "0")}m` },
          ].map((x) => (
            <div key={x.k} className="rounded-lg border border-line bg-white/[0.02] px-1 py-2">
              <dt className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">{x.k}</dt>
              <dd className="mt-0.5 font-mono text-sm text-gold">{x.v}</dd>
            </div>
          ))}
        </dl>

        <div className="relative min-h-[120px] flex-1 overflow-hidden rounded-lg border border-line">
          <canvas ref={sky} className="absolute inset-0 h-full w-full" role="img" aria-label="The sun's path across the sky for the chosen day and latitude" />
          <span className="pointer-events-none absolute left-2 top-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-faint">sun path · elevation vs hour</span>
        </div>
      </div>
    </div>
  )
}
