"use client"

import { motion } from "motion/react"
import {
  Atom,
  BadgeCheck,
  Braces,
  Brain,
  Cloud,
  Cpu,
  Database,
  GraduationCap,
  MemoryStick,
  Network,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"
import { certifications, education, publication } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const COURSE_ICONS: Record<string, LucideIcon> = {
  cloud: Cloud,
  network: Network,
  cpu: Cpu,
  braces: Braces,
  shield: ShieldCheck,
  database: Database,
  chip: MemoryStick,
  brain: Brain,
  atom: Atom,
}

// A small property graph for the publication card.
const G_NODES = [
  { x: 50, y: 50, r: 7 },
  { x: 20, y: 25, r: 4.5 },
  { x: 82, y: 22, r: 5 },
  { x: 86, y: 70, r: 4.5 },
  { x: 24, y: 78, r: 5 },
  { x: 55, y: 88, r: 3.5 },
  { x: 8, y: 52, r: 3.5 },
  { x: 62, y: 14, r: 3.5 },
]
const G_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [4, 6], [2, 7], [1, 7], [3, 5], [4, 5],
]

function GraphViz() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      {G_EDGES.map(([a, b], i) => (
        <g key={i}>
          <motion.line
            x1={G_NODES[a].x}
            y1={G_NODES[a].y}
            x2={G_NODES[b].x}
            y2={G_NODES[b].y}
            stroke="rgb(34 211 197 / 0.35)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
          />
          {/* traversal pulse */}
          <circle r="1.1" fill="#ffd77a">
            <animateMotion
              dur={`${2.2 + (i % 4) * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
              path={`M${G_NODES[a].x} ${G_NODES[a].y} L${G_NODES[b].x} ${G_NODES[b].y}`}
            />
          </circle>
        </g>
      ))}
      {G_NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={i === 0 ? "#ff9933" : "#0f0c1c"}
          stroke={i === 0 ? "#ffd77a" : "#22d3c5"}
          strokeWidth="0.8"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: i * 0.06 }}
          style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: "view-box" }}
        />
      ))}
    </svg>
  )
}

export function Education() {
  return (
    <section id="education" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading index="05" kicker="Academy & honours" title="Learning in" accent="public." />

      <div className="grid gap-4 lg:grid-cols-12">
        {/* degree */}
        <Reveal className="lg:col-span-7">
          <SpotlightCard className="relative h-full overflow-hidden p-7 sm:p-9">
            <GraduationCap className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 text-white/[0.03]" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-marigold">{education.period}</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{education.school}</h3>
            <p className="mt-1 text-ink-dim">{education.campus}</p>
            <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
              <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1">{education.degree}</span>
              <span className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-ink-dim">CGPA {education.cgpa}</span>
            </div>

            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Relevant coursework</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-3">
              {education.coursework.map((c, i) => {
                const Icon = COURSE_ICONS[c.icon]
                return (
                  <motion.li
                    key={c.name}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="group flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-3 py-2.5 text-sm text-ink-dim transition hover:border-gold/40 hover:text-ink"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-marigold transition group-hover:scale-110" aria-hidden="true" />
                    {c.name}
                  </motion.li>
                )
              })}
            </ul>
          </SpotlightCard>
        </Reveal>

        {/* publication */}
        <Reveal delay={0.1} className="lg:col-span-5">
          <SpotlightCard className="flex h-full flex-col overflow-hidden">
            <div className="relative h-52 border-b border-line bg-[radial-gradient(circle_at_50%_50%,rgb(34_211_197/0.12),transparent_70%)] p-4">
              <GraphViz />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-peacock/30 bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-peacock backdrop-blur">
                <ScrollText className="h-3 w-3" aria-hidden="true" /> Publication
              </span>
            </div>
            <div className="flex flex-1 flex-col p-7">
              <h3 className="font-serif text-2xl italic leading-snug text-ink">“{publication.title}”</h3>
              <p className="mt-4 text-sm text-ink-dim">{publication.venue}</p>
              <p className="mt-auto pt-4 font-mono text-[11px] text-peacock">{publication.status}</p>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>

      {/* certifications wall */}
      <Reveal className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Certifications</h3>
          <span className="font-mono text-xs text-ink-faint">{certifications.length} badges</span>
        </div>
      </Reveal>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <Reveal as="li" key={c.name} delay={(i % 3) * 0.06}>
            <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-4 transition hover:border-gold/40">
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-saffron/20 to-rangoli/10 ring-1 ring-gold/20">
                <BadgeCheck className="h-5 w-5 text-gold" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[15px] leading-snug text-ink">{c.name}</span>
                <span className="block font-mono text-[11px] text-ink-faint">{c.issuer}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
