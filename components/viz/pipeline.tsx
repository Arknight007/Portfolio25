"use client"

import { useEffect, useState } from "react"
import { Boxes, Cpu, FileCode2, Rocket, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  { label: "asyncio parse", Icon: FileCode2 },
  { label: "CUDA compute", Icon: Cpu },
  { label: "test · multiproc", Icon: ShieldCheck },
  { label: "Jenkins CI", Icon: Boxes },
  { label: "release", Icon: Rocket },
]

const LOG = [
  { cmd: "python parse.py --async", out: "done in 2h  (was 8h)", tone: "text-peacock" },
  { cmd: "run pipeline --cuda --threads", out: "compute time −20%", tone: "text-marigold" },
  { cmd: "pytest -n auto --cov", out: "coverage 95%  ·  0 failed", tone: "text-leet" },
  { cmd: "jenkins build mission-systems", out: "manual integration −50%", tone: "text-gold" },
  { cmd: "release --tag next", out: "shipped 40% faster", tone: "text-rangoli" },
]

const PERIOD = 4.5 // seconds for a packet to traverse the pipeline
const SPACING = 1.5 // seconds between packets

/** Collins Aerospace: data packets flowing through a CI/CD pipeline. */
export function PipelineViz() {
  const [line, setLine] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setLine((n) => (n + 1) % LOG.length), 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-line bg-[rgb(8_7_16/0.75)] p-5">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
        <span>mission-systems / pipeline</span>
        <span className="flex items-center gap-1.5 text-leet">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leet" /> live
        </span>
      </div>

      {/* track */}
      <div className="relative mx-3 mb-4 mt-12 sm:mx-6">
        <div className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-saffron/10 via-saffron/60 to-rangoli/10" />
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            className="pipeline-packet absolute top-5 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_4px_rgb(255_182_39/0.6)]"
            style={{ animationDelay: `${-k * SPACING}s`, animationDuration: `${PERIOD}s` }}
          />
        ))}
        <ol className="relative flex justify-between">
          {STAGES.map(({ label, Icon }, i) => (
            <li key={label} className="flex w-0 flex-col items-center">
              <span
                className="pipeline-node grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line-strong bg-[#120f20] text-ink-dim"
                style={{ animationDelay: `${(i / (STAGES.length - 1)) * PERIOD}s`, animationDuration: `${SPACING}s` }}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="mt-2 whitespace-nowrap text-center font-mono text-[9px] text-ink-faint sm:text-[10px]">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* console */}
      <div className="relative mt-auto rounded-xl border border-line bg-black/50 p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
        {LOG.map((l, i) => {
          const age = (line - i + LOG.length) % LOG.length
          return (
            <div
              key={l.cmd}
              className={cn("flex flex-wrap gap-x-2 transition-opacity duration-500", age === 0 ? "opacity-100" : age < 3 ? "opacity-50" : "opacity-20")}
            >
              <span className="text-saffron">❯</span>
              <span className="text-ink">{l.cmd}</span>
              <span className={cn("ml-auto", l.tone)}>{age === 0 ? "✓ " : ""}{l.out}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
