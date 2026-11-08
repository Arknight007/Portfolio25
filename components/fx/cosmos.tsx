"use client"

import { useEffect, useRef } from "react"
import { festival } from "@/lib/data"
import { Fireworks } from "@/lib/fireworks"
import { FX_EVENTS } from "@/lib/utils"

type Star = { x: number; y: number; z: number; r: number; tw: number; sp: number; hue: number }
type Ember = { x: number; y: number; vy: number; sway: number; ph: number; r: number; life: number }
type Lantern = { x: number; y: number; vy: number; s: number; ph: number }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number }

/**
 * Fixed full-screen canvas behind everything: parallax starfield, shooting
 * stars, rising embers, sky lanterns and fireworks. Pauses when hidden.
 */
export function Cosmos() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const small = window.innerWidth < 768
    const fw = new Fireworks({ maxSparks: small ? 600 : 1200, scale: small ? 0.7 : 1 })

    let w = 0
    let h = 0
    let stars: Star[] = []
    let embers: Ember[] = []
    let lanterns: Lantern[] = []
    const meteors: Meteor[] = []
    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0

    const seed = () => {
      const count = Math.min(small ? 220 : 520, Math.floor((w * h) / 2600))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() ** 2,
        r: Math.random() * 1.2 + 0.25,
        tw: Math.random() * Math.PI * 2,
        sp: 0.6 + Math.random() * 1.8,
        hue: Math.random(),
      }))
      embers = Array.from({ length: small ? 18 : 36 }, () => newEmber(true))
      lanterns = festival.enabled ? Array.from({ length: small ? 4 : 8 }, () => newLantern(true)) : []
    }
    const newEmber = (anywhere = false): Ember => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      vy: 12 + Math.random() * 26,
      sway: 8 + Math.random() * 20,
      ph: Math.random() * Math.PI * 2,
      r: 0.8 + Math.random() * 1.8,
      life: 0,
    })
    const newLantern = (anywhere = false): Lantern => ({
      x: Math.random() * w,
      y: anywhere ? h * (0.3 + Math.random() * 0.8) : h + 40,
      vy: 6 + Math.random() * 9,
      s: 0.55 + Math.random() * 0.7,
      ph: Math.random() * Math.PI * 2,
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const drawLantern = (l: Lantern, t: number, fade: number) => {
      const s = l.s
      ctx.globalAlpha = fade
      const x = l.x + Math.sin(t * 0.4 + l.ph) * 10
      const y = l.y
      const flick = 0.85 + Math.sin(t * 7 + l.ph) * 0.08 + Math.random() * 0.05
      const g = ctx.createRadialGradient(x, y, 0, x, y, 46 * s)
      g.addColorStop(0, `rgba(255,170,60,${0.32 * flick})`)
      g.addColorStop(1, "rgba(255,120,30,0)")
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, 46 * s, 0, Math.PI * 2)
      ctx.fill()
      // paper body (tall, slightly wider at the top)
      const bw = 8.5 * s
      const bh = 20 * s
      const body = ctx.createLinearGradient(x, y - bh / 2, x, y + bh / 2)
      body.addColorStop(0, `rgba(255,214,140,${0.95 * flick})`)
      body.addColorStop(1, `rgba(255,120,40,${0.9 * flick})`)
      ctx.fillStyle = body
      ctx.beginPath()
      ctx.moveTo(x - bw, y - bh / 2)
      ctx.lineTo(x + bw, y - bh / 2)
      ctx.lineTo(x + bw * 0.72, y + bh / 2)
      ctx.lineTo(x - bw * 0.72, y + bh / 2)
      ctx.closePath()
      ctx.fill()
      // paper ribs
      ctx.strokeStyle = `rgba(160,60,10,${0.35 * flick})`
      ctx.lineWidth = 0.7
      ctx.beginPath()
      ctx.moveTo(x, y - bh / 2)
      ctx.lineTo(x, y + bh / 2)
      ctx.moveTo(x - bw * 0.5, y - bh / 2)
      ctx.lineTo(x - bw * 0.36, y + bh / 2)
      ctx.moveTo(x + bw * 0.5, y - bh / 2)
      ctx.lineTo(x + bw * 0.36, y + bh / 2)
      ctx.stroke()
      ctx.fillStyle = `rgba(255,255,230,${0.9 * flick})`
      ctx.beginPath()
      ctx.arc(x, y + bh / 2 - 2 * s, 2.2 * s, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    let scrollY = window.scrollY
    let last = performance.now()
    let raf = 0
    let nextMeteor = 2 + Math.random() * 4
    let nextAuto = 2.5
    let t = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      mx += (tmx - mx) * 0.05
      my += (tmy - my) * 0.05
      const sy = scrollY

      ctx.clearRect(0, 0, w, h)

      // stars
      for (const s of stars) {
        const depth = 0.15 + s.z * 0.85
        let x = s.x + mx * depth * 18
        let y = s.y - sy * depth * 0.18 + my * depth * 12
        y = ((y % h) + h) % h
        x = ((x % w) + w) % w
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.sp + s.tw))
        const r = s.r * (0.6 + depth * 0.8)
        ctx.globalAlpha = a * (0.4 + depth * 0.6)
        ctx.fillStyle = s.hue > 0.92 ? "#ffd8a8" : s.hue > 0.85 ? "#bcd7ff" : "#fff8ee"
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        if (r > 1.25 && a > 0.85) {
          ctx.globalAlpha = (a - 0.85) * 2.5
          ctx.fillRect(x - r * 3, y - 0.3, r * 6, 0.6)
          ctx.fillRect(x - 0.3, y - r * 3, 0.6, r * 6)
        }
      }
      ctx.globalAlpha = 1

      // shooting stars
      nextMeteor -= dt
      if (nextMeteor <= 0) {
        nextMeteor = 4 + Math.random() * 7
        const fromLeft = Math.random() < 0.5
        meteors.push({
          x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
          y: Math.random() * h * 0.4,
          vx: (fromLeft ? 1 : -1) * (500 + Math.random() * 300),
          vy: 180 + Math.random() * 120,
          life: 0,
        })
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.life += dt
        m.x += m.vx * dt
        m.y += m.vy * dt
        const a = Math.max(0, 1 - m.life / 1.1)
        const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 0.12, m.y - m.vy * 0.12)
        g.addColorStop(0, `rgba(255,240,215,${a})`)
        g.addColorStop(1, "rgba(255,200,120,0)")
        ctx.strokeStyle = g
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 0.12, m.y - m.vy * 0.12)
        ctx.stroke()
        if (m.life > 1.1) meteors.splice(i, 1)
      }

      // sky lanterns (they belong to the hero sky; fade out as you scroll into content)
      const lanternFade = Math.max(0, 1 - sy / (h * 0.85))
      for (let i = 0; i < lanterns.length; i++) {
        const l = lanterns[i]
        l.y -= l.vy * dt
        if (l.y < -60) lanterns[i] = newLantern()
        if (lanternFade > 0.01) drawLantern(l, t, lanternFade)
      }

      // embers
      ctx.globalCompositeOperation = "lighter"
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i]
        e.life += dt
        e.y -= e.vy * dt
        const x = e.x + Math.sin(e.life * 1.3 + e.ph) * e.sway
        if (e.y < -10) embers[i] = newEmber()
        const fade = Math.min(1, (h - e.y) / (h * 0.25)) * Math.min(1, e.y / (h * 0.35))
        const flick = 0.6 + 0.4 * Math.sin(e.life * 9 + e.ph)
        const g = ctx.createRadialGradient(x, e.y, 0, x, e.y, e.r * 4)
        g.addColorStop(0, `rgba(255,200,110,${0.9 * fade * flick})`)
        g.addColorStop(1, "rgba(255,110,30,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, e.y, e.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalCompositeOperation = "source-over"

      // ambient fireworks over the hero during the festival
      if (festival.enabled && sy < h * 0.6) {
        nextAuto -= dt
        if (nextAuto <= 0) {
          nextAuto = 2.8 + Math.random() * 3.5
          const tx = w * (0.1 + Math.random() * 0.8)
          fw.launch(tx + (Math.random() - 0.5) * 120, h + 10, tx, h * (0.12 + Math.random() * 0.22))
        }
      }
      fw.update(dt)
      fw.draw(ctx)

      raf = requestAnimationFrame(frame)
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        ctx.globalAlpha = 0.3 + s.z * 0.6
        ctx.fillStyle = "#fff8ee"
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const onScroll = () => (scrollY = window.scrollY)
    const onMove = (e: PointerEvent) => {
      tmx = e.clientX / w - 0.5
      tmy = e.clientY / h - 0.5
    }
    const onFirework = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail
      fw.launch(x + (Math.random() - 0.5) * 80, h + 10, x, y)
    }
    const onDown = (e: PointerEvent) => {
      if (!festival.enabled || reduced) return
      const target = e.target as HTMLElement
      if (!target.closest("[data-fx-zone]") || target.closest("a,button,input,textarea,select,label,[role=button],[data-no-fx]")) return
      fw.sparkle(e.clientX, e.clientY)
      fw.launch(e.clientX + (Math.random() - 0.5) * 60, h + 10, e.clientX, Math.max(40, e.clientY - 40))
    }
    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduced) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }

    const onResize = () => {
      resize()
      if (reduced) drawStatic()
    }
    resize()
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener(FX_EVENTS.firework, onFirework)
    document.addEventListener("visibilitychange", onVisibility)

    if (reduced) drawStatic()
    else raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener(FX_EVENTS.firework, onFirework)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      {/* nebula wash */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_80%_-10%,rgb(139_92_246/0.16),transparent_60%),radial-gradient(900px_600px_at_0%_30%,rgb(255_153_51/0.10),transparent_60%),radial-gradient(1000px_800px_at_60%_110%,rgb(255_61_129/0.10),transparent_60%)]" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      {/* horizon glow */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgb(255_106_31/0.06)] to-transparent" />
    </div>
  )
}
