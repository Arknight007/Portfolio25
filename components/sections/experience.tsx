"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { ArrowDownRight, ArrowUpRight, Calendar, MapPin } from "lucide-react"
import { experience, type Metric, type Role } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { PipelineViz } from "@/components/viz/pipeline"
import { DescentViz } from "@/components/viz/descent"
import { cn } from "@/lib/utils"

function MetricBar({ m, i, accent }: { m: Metric; i: number; accent: Role["accent"] }) {
  const sign = m.absolute ? "" : m.direction === "down" ? "−" : "+"
  const Arrow = m.direction === "down" ? ArrowDownRight : ArrowUpRight
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="text-ink-dim">{m.label}</span>
        <span className="flex items-center gap-1 font-mono text-ink">
          {m.from && (
            <span className="mr-1 text-xs text-ink-faint">
              {m.from} → {m.to}
            </span>
          )}
          <Arrow className={cn("h-3.5 w-3.5", accent === "saffron" ? "text-marigold" : "text-peacock")} aria-hidden="true" />
          {sign}
          {m.value}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={cn(
            "relative h-full rounded-full",
            accent === "saffron" ? "bg-gradient-to-r from-flame via-saffron to-gold" : "bg-gradient-to-r from-violet via-peacock to-[#9ff5ec]",
          )}
          initial={{ width: 0 }}
          whileInView={{ width: `${m.value}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.4, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/80 blur-[3px]" />
        </motion.div>
      </div>
    </div>
  )
}

function RoleCard({ role, index }: { role: Role; index: number }) {
  const saffron = role.accent === "saffron"
  return (
    <div className="relative grid gap-6 pl-10 sm:pl-16 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
      {/* node on the timeline */}
      <span className="absolute left-[3px] top-2 grid h-6 w-6 place-items-center sm:left-[19px]" aria-hidden="true">
        <span className={cn("absolute h-6 w-6 animate-pulse-ring rounded-full", saffron ? "bg-saffron/40" : "bg-peacock/40")} />
        <span className={cn("h-3 w-3 rounded-full ring-4 ring-bg", saffron ? "bg-saffron" : "bg-peacock")} />
      </span>

      <Reveal>
        <p className="font-mono text-xs text-ink-faint">
          LOG-{String(index + 1).padStart(2, "0")} ·{" "}
          <span className={saffron ? "text-marigold" : "text-peacock"}>{saffron ? "INDUSTRY" : "RESEARCH"}</span>
        </p>
        <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{role.orgShort}</h3>
        <p className="mt-1 text-sm text-ink-faint">{role.org}</p>
        <p className="mt-4 text-lg text-ink">{role.role}</p>
        {role.program && <p className="text-sm italic text-ink-dim">{role.program}</p>}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-ink-dim">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> {role.period}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {role.location}
          </span>
        </div>

        <ul className="mt-6 space-y-3">
          {role.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-ink-dim">
              <span className={cn("mt-2.5 h-1 w-3 shrink-0 rounded-full", saffron ? "bg-saffron" : "bg-peacock")} />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {role.stack.map((s) => (
            <span key={s} className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-ink-dim">
              {s}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="flex flex-col gap-4">
        <div className="min-h-[360px] flex-1">{role.viz === "pipeline" ? <PipelineViz /> : <DescentViz />}</div>
        <div className="glass space-y-4 rounded-2xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Impact telemetry</p>
          {role.metrics.map((m, i) => (
            <MetricBar key={m.label} m={m} i={i} accent={role.accent} />
          ))}
        </div>
      </Reveal>
    </div>
  )
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 })
  const cometTop = useTransform(scaleY, (n) => `${n * 100}%`)

  return (
    <section id="experience" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading
        index="02"
        kicker="Flight log"
        title="Where I've"
        accent="flown."
        sub="From soft-landing research at IISER to mission systems at Collins Aerospace: two internships, both about making hard computations faster and more trustworthy."
      />

      <div ref={ref} className="relative space-y-24 sm:space-y-32">
        {/* timeline rail */}
        <div className="absolute bottom-0 left-[14px] top-0 w-px bg-line sm:left-[30px]" aria-hidden="true">
          <motion.div style={{ scaleY }} className="absolute inset-0 origin-top bg-gradient-to-b from-saffron via-rangoli to-peacock" />
          <motion.div
            style={{ top: cometTop }}
            className="absolute left-1/2 h-16 w-[3px] -translate-x-1/2 -translate-y-full rounded-full bg-gradient-to-b from-transparent to-gold shadow-[0_0_16px_3px_rgb(255_182_39/0.6)]"
          />
        </div>
        {experience.map((r, i) => (
          <RoleCard key={r.id} role={r} index={i} />
        ))}
      </div>
    </section>
  )
}
