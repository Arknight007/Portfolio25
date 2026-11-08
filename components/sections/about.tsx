"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"
import { Atom, Cloud, Code2 } from "lucide-react"
import { leadership, stats } from "@/lib/data"
import { Counter } from "@/components/ui/counter"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const STATEMENT =
  "From a hand-written compiler that emits x86, to CUDA-accelerated aerospace pipelines, to simulations that land spacecraft softer — I build the systems layer, and I make it fast."
const HOT = new Set(["compiler", "x86,", "CUDA-accelerated", "aerospace", "spacecraft", "systems", "fast."])

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const y = useTransform(progress, range, [6, 0])
  const hot = HOT.has(word)
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.28em] inline-block ${hot ? "font-serif italic text-ember" : ""}`}>
      {word}
    </motion.span>
  )
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] })
  const words = STATEMENT.split(" ")

  return (
    <section id="about" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading index="01" kicker="Mission brief" title="Engineer by training," accent="explorer by habit." />

      <p
        ref={ref}
        className="max-w-5xl font-display text-3xl font-medium leading-[1.18] tracking-tight text-ink sm:text-5xl"
        aria-label={STATEMENT}
      >
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
        ))}
      </p>

      <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <SpotlightCard className="h-full p-6">
              <p className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
                <Counter to={s.value} suffix={s.suffix} className="text-ember" />
              </p>
              <p className="mt-3 text-sm leading-snug text-ink-dim">{s.label}</p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-saffron to-rangoli"
                  initial={{ width: "0%" }}
                  whileInView={{ width: `${Math.min(100, s.value <= 10 ? s.value * 10 : s.value)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_1.1fr]">
        {leadership.map((l, i) => {
          const Icon = i === 0 ? Cloud : Code2
          return (
            <Reveal key={l.org} delay={0.1 + i * 0.08}>
              <SpotlightCard className="flex h-full items-start gap-4 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-saffron/20 to-rangoli/20 text-gold ring-1 ring-gold/20">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-marigold">Leadership</p>
                  <p className="mt-1 font-display text-xl font-semibold">{l.role}</p>
                  <p className="text-sm text-ink-dim">{l.org}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          )
        })}
        <Reveal delay={0.26}>
          <SpotlightCard className="flex h-full items-start gap-4 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-peacock/20 to-violet/20 text-peacock ring-1 ring-peacock/20">
              <Atom className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-peacock">Now exploring</p>
              <p className="mt-1 font-display text-xl font-semibold">Rust × quantum computing</p>
              <p className="text-sm text-ink-dim">Qiskit, Cirq and Rust tooling for quantum workloads.</p>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </section>
  )
}
