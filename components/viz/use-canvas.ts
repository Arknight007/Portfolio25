"use client"

import { useEffect, useRef } from "react"

export type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, state: Record<string, unknown>) => void

/**
 * Animation loop for a canvas that fills its parent:
 * HiDPI sizing, runs only while on screen, and draws one still frame
 * for people who prefer reduced motion.
 */
export function useCanvas(draw: DrawFn, opts: { stillAt?: number } = {}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef(draw)
  drawRef.current = draw
  const stillAt = opts.stillAt ?? 4.6

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const state: Record<string, unknown> = {}
    let w = 0
    let h = 0
    let raf = 0
    let visible = false
    let t = 0
    let last = 0

    const size = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.floor(w * dpr))
      canvas.height = Math.max(1, Math.floor(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduce || !visible) drawRef.current(ctx, w, h, reduce ? stillAt : t, state)
    }

    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      t += dt
      drawRef.current(ctx, w, h, t, state)
      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (reduce || raf) return
      last = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const ro = new ResizeObserver(size)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !document.hidden) start()
      else stop()
    })
    io.observe(canvas)
    const onVis = () => (document.hidden ? stop() : visible && start())
    document.addEventListener("visibilitychange", onVis)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [stillAt])

  return ref
}
