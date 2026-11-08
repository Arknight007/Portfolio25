"use client"

import { ArrowUpRight } from "lucide-react"
import { contact, langColors, projects, sideQuests, type Project } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { GitHubIcon } from "@/components/ui/icons"
import { CompilerViz } from "@/components/viz/compiler"
import { SolarViz } from "@/components/viz/solar"
import { DefiViz } from "@/components/viz/defi"
import { cn } from "@/lib/utils"

const VIZ = { compiler: CompilerViz, solar: SolarViz, defi: DefiViz }

function Mission({ p, i }: { p: Project; i: number }) {
  const Viz = VIZ[p.viz]
  const flip = i % 2 === 1
  return (
    <article className="relative grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
      <Reveal className={cn("lg:col-span-5", flip && "lg:order-2")}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="rounded-md bg-gradient-to-r from-saffron to-rangoli px-2 py-0.5 font-semibold text-[#1a0f02]">
              M-{String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-ink-faint">{p.date}</span>
          </div>
          <h3 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">{p.name}</h3>
          <p className="mt-4 font-serif text-xl italic leading-snug text-ink-dim sm:text-2xl">{p.tagline}</p>

          <dl className="mt-7 grid grid-cols-3 gap-2">
            {p.highlights.map((h) => (
              <div key={h.label} className="rounded-xl border border-line bg-white/[0.02] px-3 py-3">
                <dd className="font-display text-2xl font-semibold text-ember">{h.value}</dd>
                <dt className="mt-0.5 text-[11px] leading-tight text-ink-faint">{h.label}</dt>
              </div>
            ))}
          </dl>

          <ul className="mt-7 space-y-2.5">
            {p.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-ink-dim">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-marigold" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span key={s} className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-ink-dim">
                {s}
              </span>
            ))}
          </div>

          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm transition hover:border-gold/60 hover:bg-white/[0.04]"
          >
            <GitHubIcon className="h-4 w-4" />
            View on GitHub
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.1} className={cn("lg:sticky lg:top-28 lg:col-span-7", flip && "lg:order-1")}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] lg:-inset-6 bg-[radial-gradient(closest-side,rgb(255_153_51/0.12),transparent)] blur-2xl" />
          <div className="relative">
            <Viz />
          </div>
        </div>
      </Reveal>
    </article>
  )
}

export function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36">
      <SectionHeading
        index="03"
        kicker="Missions"
        title="Things I've"
        accent="launched."
        sub="Three flagship builds, each running live below: a compiler you can step through, a solar simulator you can drive, and a DeFi remittance mesh in motion."
      />

      <div className="space-y-28 sm:space-y-36">
        {projects.map((p, i) => (
          <Mission key={p.id} p={p} i={i} />
        ))}
      </div>

      <div className="mt-32">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-marigold/90">Side quests</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">More from the hangar</h3>
          </div>
          <a
            href={`${contact.github}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-ink-dim transition hover:text-gold"
          >
            all repositories <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sideQuests.map((q, i) => (
            <Reveal key={q.name} delay={(i % 3) * 0.07}>
              <a href={q.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                <SpotlightCard tilt className="group flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-display text-xl font-semibold tracking-tight">{q.name}</h4>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-ink-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden="true" />
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">{q.blurb}</p>
                  <div className="mt-5 flex items-center justify-between font-mono text-[11px] text-ink-faint">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColors[q.lang] ?? "#888" }} />
                      {q.lang}
                    </span>
                    <span>{q.stack}</span>
                  </div>
                </SpotlightCard>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
