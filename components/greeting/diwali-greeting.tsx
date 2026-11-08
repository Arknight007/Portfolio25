"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { Calendar, CornerDownLeft, RotateCcw, Sparkles } from "lucide-react"
import { festival } from "@/lib/data"
import { rasterize } from "@/lib/pixel-font"
import { Fireworks, DIWALI_PALETTES } from "@/lib/fireworks"
import { FX_EVENTS, mulberry32, cn } from "@/lib/utils"
import { Diya } from "@/components/diya"

export const GREETED_KEY = "srikar:greeted"

const WEEKS = 53
const ROWS = 7
const EMPTY = "rgb(255 255 255 / 0.07)"
const GREENS = ["", "#0e4429", "#006d32", "#26a641", "#39d353"]
const FIRE = ["#ffa630", "#ffb627", "#ffc23d", "#ffcf5c"]
const EMBER = "rgb(255 153 51 / 0.13)"
const FESTIVAL_DAYS = ["Dhanteras", "Naraka Chaturdashi", "Lakshmi Puja", "Govardhan Puja", "Bhai Dooj"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

type Phase = 0 | 1 | 2 | 3
type Cell = { date: Date; level: number; count: number; future: boolean; fire: number; ember: boolean; jitter: number }
type Block = { start: number; cols: number; lit: Set<string> }

const fmt = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`

function buildYear(today: Date) {
  const rng = mulberry32(today.getFullYear() * 1000 + today.getMonth() * 40 + today.getDate())
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
  const cells: Cell[][] = []
  let total = 0
  let active = 0
  let streak = 0
  let maxStreak = 0
  for (let w = 0; w < WEEKS; w++) {
    const col: Cell[] = []
    // busy and quiet stretches across the year, like a real heatmap
    const season = 0.5 + 0.35 * Math.sin(w / 4.3) + 0.15 * Math.sin(w / 1.7)
    for (let r = 0; r < ROWS; r++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() - (WEEKS - 1 - w) * 7 + r)
      const future = date > today
      const roll = rng()
      let level = 0
      if (!future && roll < 0.25 + season * 0.5) {
        const k = rng()
        level = k < 0.42 ? 1 : k < 0.72 ? 2 : k < 0.9 ? 3 : 4
      }
      const count = level === 0 ? 0 : [0, 1 + Math.floor(rng() * 2), 3 + Math.floor(rng() * 3), 6 + Math.floor(rng() * 4), 10 + Math.floor(rng() * 5)][level]
      if (!future) {
        total += count
        if (count) {
          active++
          streak++
          maxStreak = Math.max(maxStreak, streak)
        } else streak = 0
      }
      col.push({ date, level, count, future, fire: Math.floor(rng() * FIRE.length), ember: rng() < 0.035, jitter: rng() })
    }
    cells.push(col)
  }
  return { cells, total, active, maxStreak }
}

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.max(0, Math.min(1, (t - t0) / duration))
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])
  return v
}

export function DiwaliGreeting() {
  const [state, setState] = useState<"pending" | "show" | "leaving" | "hidden">("pending")
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (!festival.enabled) return setState("hidden")
    let greeted = false
    try {
      greeted = festival.oncePerSession && sessionStorage.getItem(GREETED_KEY) === "1"
    } catch {}
    setState(greeted ? "hidden" : "show")
  }, [])

  useEffect(() => {
    const replay = () => {
      setRunId((n) => n + 1)
      setState("show")
    }
    window.addEventListener(FX_EVENTS.replayGreeting, replay)
    return () => window.removeEventListener(FX_EVENTS.replayGreeting, replay)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (state === "show" || state === "leaving") root.style.overflow = "hidden"
    else root.style.overflow = ""
  }, [state])

  const dismiss = useCallback(() => {
    setState((s) => (s === "show" ? "leaving" : s))
    try {
      sessionStorage.setItem(GREETED_KEY, "1")
    } catch {}
    window.setTimeout(() => {
      document.documentElement.setAttribute("data-greeted", "")
      setState("hidden")
    }, 700)
  }, [])

  if (!festival.enabled || state === "hidden") return null
  if (state === "pending") return <div id="greeting-cover" className="fixed inset-0 z-[100] bg-bg" aria-hidden="true" />

  return <GreetingOverlay key={runId} leaving={state === "leaving"} onDone={dismiss} onReplay={() => setRunId((n) => n + 1)} />
}

function GreetingOverlay({ leaving, onDone, onReplay }: { leaving: boolean; onDone: () => void; onReplay: () => void }) {
  const [today] = useState(() => new Date())
  const year = useMemo(() => buildYear(today), [today])
  const [phase, setPhase] = useState<Phase>(0)
  const [narrow, setNarrow] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [hover, setHover] = useState<{ x: number; y: number; text: string } | null>(null)
  const [progress, setProgress] = useState(0)
  const pausedRef = useRef(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fwRef = useRef<Fireworks | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)")
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)")
    setNarrow(mq.matches)
    setReduced(rm.matches)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener("change", on)
    dialogRef.current?.focus()
    return () => mq.removeEventListener("change", on)
  }, [])

  const blocks: Block[] = useMemo(
    () =>
      narrow
        ? [
            { start: 0, cols: 26, lit: rasterize("HAPPY", 26) },
            { start: 26, cols: 27, lit: rasterize("DIWALI", 27) },
          ]
        : [{ start: 0, cols: WEEKS, lit: rasterize("HAPPY DIWALI", WEEKS) }],
    [narrow],
  )
  const litCount = useMemo(() => blocks.reduce((n, b) => n + b.lit.size, 0), [blocks])

  // Timeline
  useEffect(() => {
    if (reduced) {
      setPhase(3)
      return
    }
    const ts = [
      window.setTimeout(() => setPhase(1), 200),
      window.setTimeout(() => setPhase(2), 1900),
      window.setTimeout(() => setPhase(3), 3500),
    ]
    return () => ts.forEach(clearTimeout)
  }, [reduced])

  // Fireworks canvas
  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const fw = new Fireworks({ maxSparks: window.innerWidth < 720 ? 700 : 1500, scale: window.innerWidth < 720 ? 0.75 : 1 })
    fwRef.current = fw
    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)
    let raf = 0
    let last = performance.now()
    const loop = (t: number) => {
      const dt = (t - last) / 1000
      last = t
      fw.update(dt)
      ctx.clearRect(0, 0, w, h)
      fw.draw(ctx)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      fwRef.current = null
    }
  }, [reduced])

  // Volley when the letters finish igniting, then gentle ambient launches.
  useEffect(() => {
    if (phase !== 3 || reduced) return
    const timers: number[] = []
    const W = window.innerWidth
    const H = window.innerHeight
    const shot = (fx: number, fy: number, i = 0) => {
      const fw = fwRef.current
      if (!fw) return
      fw.launch(W * (0.5 + (fx - 0.5) * 0.4), H + 10, W * fx, H * fy, DIWALI_PALETTES[i % DIWALI_PALETTES.length])
    }
    ;[0.12, 0.88, 0.3, 0.7, 0.5].forEach((fx, i) => timers.push(window.setTimeout(() => shot(fx, 0.14 + (i % 2) * 0.08, i), i * 260)))
    const ambient = window.setInterval(() => {
      if (document.hidden) return
      shot(0.08 + Math.random() * 0.84, 0.08 + Math.random() * 0.22, Math.floor(Math.random() * 6))
    }, 1100)
    return () => {
      timers.forEach(clearTimeout)
      clearInterval(ambient)
    }
  }, [phase, reduced])

  // Auto-continue countdown (pauses while the pointer is over the card)
  useEffect(() => {
    if (phase !== 3 || reduced || leaving) return
    const DURATION = 7500
    let elapsed = 0
    let last = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const dt = t - last
      last = t
      if (!pausedRef.current && !document.hidden) elapsed += dt
      const p = Math.min(1, elapsed / DURATION)
      setProgress(p)
      if (p >= 1) onDone()
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, reduced, leaving, onDone])

  useEffect(() => {
    if (phase === 3) enterRef.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.key === "Enter" && (e.target as HTMLElement)?.tagName !== "BUTTON")) onDone()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onDone])

  const submissions = useCountUp(year.total, phase >= 1, 1500)
  const lamps = useCountUp(litCount, phase >= 2, 1400)

  const onGridMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-w]")
    if (!el) return setHover(null)
    const w = Number(el.dataset.w)
    const r = Number(el.dataset.r)
    const lit = el.dataset.lit === "1"
    const cell = year.cells[w][r]
    const rect = el.getBoundingClientRect()
    const isToday = w === WEEKS - 1 && r === today.getDay()
    let text: string
    if (phase >= 2 && lit) text = `1 diya lit on ${fmt(cell.date)}`
    else if (isToday) text = `Today · ${fmt(cell.date)} · Shubh Deepavali`
    else if (phase >= 2) text = `${cell.ember ? "A quiet flame" : "No submissions"} on ${fmt(cell.date)}`
    else text = `${cell.count || "No"} submission${cell.count === 1 ? "" : "s"} on ${fmt(cell.date)}`
    setHover({ x: rect.left + rect.width / 2, y: rect.top, text })
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Happy Diwali greeting"
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden overscroll-contain bg-bg outline-none transition-[opacity,transform,filter] duration-700 ease-out",
        leaving && "pointer-events-none scale-[1.04] opacity-0 blur-sm",
      )}
    >
      {/* night-sky wash */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute -top-1/3 left-1/2 h-[80vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_153_51/0.16),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[radial-gradient(60%_80%_at_50%_100%,rgb(255_106_31/0.14),transparent)]" />
        <div className="noise absolute inset-0 opacity-[0.05]" />
      </div>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0" aria-hidden="true" />

      <button
        onClick={onDone}
        className="fixed right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink-dim transition hover:border-line-strong hover:text-ink sm:right-6 sm:top-6"
      >
        Skip intro <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">Esc</kbd>
      </button>

      <div className="relative flex min-h-full flex-col items-center justify-center px-4 pb-10 pt-16 sm:py-12">
      <p
        className={cn(
          "relative mb-5 font-mono text-xs tracking-wide text-ink-faint transition-opacity duration-700",
          phase >= 1 ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-leet">●</span> leetcode.com/u/{festival.leetcodeHandle}
      </p>

      {/* The heatmap card */}
      <div
        onPointerEnter={() => (pausedRef.current = true)}
        onPointerLeave={() => {
          pausedRef.current = false
          setHover(null)
        }}
        className={cn(
          "relative w-full max-w-[1000px] rounded-2xl border border-white/10 bg-[#1b1a22]/90 p-4 shadow-[0_30px_120px_-20px_rgb(255_120_30/0.25)] backdrop-blur-md transition-[opacity,transform] duration-700 sm:p-6",
          phase === 0 && !reduced ? "translate-y-3 scale-[0.97] opacity-0" : "translate-y-0 scale-100 opacity-100",
        )}
      >
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-sm">
          <p className="text-[#bdbdbd]">
            {phase >= 2 ? (
              <>
                <span className="mr-1.5 text-lg font-semibold text-gold tabular-nums">{lamps}</span>
                diyas lit for Deepavali {today.getFullYear()}
              </>
            ) : (
              <>
                <span className="mr-1.5 text-lg font-semibold text-white tabular-nums">{submissions}</span>
                submissions in the past one year
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-[#8a8a8a]">
            <span>
              Total active days: <b className="font-medium text-white">{phase >= 2 ? 5 : year.active}</b>
            </span>
            <span>
              Max streak: <b className="font-medium text-white">{phase >= 2 ? 5 : year.maxStreak}</b>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.08] px-2.5 py-1 text-xs text-[#cfcfcf]">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> Deepavali
            </span>
          </div>
        </div>

        <div className="space-y-4" onPointerMove={onGridMove} onPointerDown={onGridMove} onPointerLeave={() => setHover(null)}>
          {blocks.map((b, bi) => (
            <HeatBlock key={`${narrow}-${bi}`} block={b} blockIndex={bi} cells={year.cells} phase={phase} today={today} narrow={narrow} />
          ))}
        </div>

        <span className="sr-only">Happy Diwali, written in a coding-activity heatmap.</span>

        {/* Accepted verdict (height animates open via grid rows) */}
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-700 ease-out",
            phase >= 3 ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0",
          )}
          aria-hidden={phase < 3}
        >
        <div className="min-h-0 overflow-hidden">
        <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-xl font-semibold text-leet">Accepted</span>
              <span className="text-sm text-[#8a8a8a]">5 / 5 festival days passed</span>
            </div>
            <p className="mt-2 font-deva text-3xl leading-tight sm:mt-3 sm:text-5xl">
              <span className="text-fire">शुभ दीपावली</span>
            </p>
            <p className="mt-2 max-w-xl text-sm text-ink-dim">
              May your builds stay green, your tests pass first try, and your home glow bright. — Srikar
            </p>
            <div className="mt-3 hidden flex-wrap gap-2 font-mono text-[11px] text-[#bdbdbd] sm:flex">
              <span className="rounded-md bg-white/[0.06] px-2 py-1">
                Runtime <b className="text-white">0 ms</b> · beats <b className="text-leet">100%</b>
              </span>
              <span className="rounded-md bg-white/[0.06] px-2 py-1">
                Memory <b className="text-white">∞</b> of light
              </span>
            </div>
          </div>
          <div className="flex gap-2 sm:flex-col sm:items-stretch">
            <button
              ref={enterRef}
              onClick={onDone}
              className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-saffron to-marigold px-5 py-3 text-sm font-semibold text-[#1a0f02] shadow-[0_8px_30px_-6px_rgb(255_153_51/0.7)] transition hover:brightness-110"
            >
              <span
                className="absolute inset-y-0 left-0 bg-white/30"
                style={{ width: `${progress * 100}%` }}
                aria-hidden="true"
              />
              <span className="relative">Enter portfolio</span>
              <CornerDownLeft className="relative h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={onReplay}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-ink-dim transition hover:border-white/20 hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Replay
            </button>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* Five days, five diyas */}
      <ol className="relative mt-6 flex items-end justify-center gap-3 sm:mt-8 sm:gap-8" aria-label="The five days of Diwali">
        {FESTIVAL_DAYS.map((d, i) => (
          <li key={d} className="flex flex-col items-center gap-2">
            <Diya className="h-9 w-11 sm:h-11 sm:w-14" lit={phase >= 2} delay={reduced ? 0 : 300 + i * 280} />
            <span
              className={cn(
                "hidden max-w-[7rem] text-center font-mono text-[10px] uppercase tracking-widest transition-colors duration-700 sm:block",
                phase >= 2 ? "text-gold/80" : "text-ink-faint/50",
              )}
              style={{ transitionDelay: `${300 + i * 280}ms` }}
            >
              {d}
            </span>
          </li>
        ))}
      </ol>
      <p className="relative mt-4 flex items-center gap-2 font-mono text-[11px] text-ink-faint">
        <Sparkles className="h-3.5 w-3.5 text-marigold" aria-hidden="true" />
        Hover or tap the squares — every one is a day.
      </p>
      </div>

      {hover && (
        <div
          className="pointer-events-none fixed z-[110] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-[#2a2933] px-2.5 py-1.5 text-xs text-white shadow-xl ring-1 ring-white/10"
          style={{ left: hover.x, top: hover.y - 8 }}
        >
          {hover.text}
        </div>
      )}
    </div>
  )
}

function HeatBlock({
  block,
  blockIndex,
  cells,
  phase,
  today,
  narrow,
}: {
  block: Block
  blockIndex: number
  cells: Cell[][]
  phase: Phase
  today: Date
  narrow: boolean
}) {
  const months = useMemo(() => {
    const out: { col: number; label: string }[] = []
    let lastMonth = -1
    let lastCol = -10
    for (let c = 0; c < block.cols; c++) {
      const d = cells[block.start + c][0].date
      if (d.getMonth() !== lastMonth) {
        lastMonth = d.getMonth()
        if (c - lastCol >= 3 && c < block.cols - 2) {
          out.push({ col: c, label: MONTHS[lastMonth] })
          lastCol = c
        }
      }
    }
    return out
  }, [block, cells])

  const sweepBase = blockIndex * 26

  return (
    <div>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${block.cols}, minmax(0, 1fr))`, gap: narrow ? 2 : 3 }}
      >
        {Array.from({ length: block.cols }).map((_, c) =>
          Array.from({ length: ROWS }).map((__, r) => {
            const w = block.start + c
            const cell = cells[w][r]
            const lit = block.lit.has(`${c},${r}`)
            const isToday = w === WEEKS - 1 && r === today.getDay()
            let bg = EMPTY
            let shadow = "none"
            let delay = 0
            if (phase === 1) {
              bg = cell.level ? GREENS[cell.level] : EMPTY
              delay = (sweepBase + c) * 16 + r * 5
            } else if (phase >= 2) {
              if (lit) {
                bg = FIRE[cell.fire]
                shadow = "0 0 6px rgb(255 182 39 / 0.9), 0 0 16px rgb(255 106 31 / 0.45)"
                delay = (sweepBase + c) * 28 + r * 12
              } else {
                bg = cell.ember ? EMBER : EMPTY
                delay = cell.jitter * 500
              }
            }
            if (isToday && phase >= 2) {
              bg = "#ff3d81"
              shadow = "0 0 8px rgb(255 61 129 / 0.9)"
            }
            return (
              <div
                key={`${c}-${r}`}
                data-w={w}
                data-r={r}
                data-lit={lit ? "1" : "0"}
                className={cn(
                  "aspect-square rounded-[3px] transition-[background-color,box-shadow,transform] duration-500 ease-out",
                  cell.future && "invisible",
                  phase === 3 && lit && "diya-cell",
                  "hover:scale-125 hover:ring-1 hover:ring-white/60",
                )}
                style={{
                  gridColumn: c + 1,
                  gridRow: r + 1,
                  backgroundColor: bg,
                  boxShadow: shadow,
                  transitionDelay: `${delay}ms, ${delay}ms, 0ms`,
                  animationDelay: phase === 3 ? `${cell.jitter * -3}s` : undefined,
                }}
              />
            )
          }),
        )}
      </div>
      <div className="relative mt-1.5 h-4 text-[11px] text-[#8a8a8a]" aria-hidden="true">
        {months.map((m) => (
          <span key={`${m.col}-${m.label}`} className="absolute" style={{ left: `${(m.col / block.cols) * 100}%` }}>
            {m.label}
          </span>
        ))}
      </div>
    </div>
  )
}
