"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { skillGroups } from "@/lib/data"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

function Ring({ items, inset, duration, reverse, delay }: { items: string[]; inset: string; duration: number; reverse?: boolean; delay: number }) {
  return (
    <div
      className="absolute rounded-full border border-dashed border-white/10 group-hover/stage:[animation-play-state:paused]"
      style={{ inset, animation: `${reverse ? "spin-rev" : "spin"} ${duration}s linear infinite` }}
    >
      {items.map((s, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2
        return (
          <div
            key={s}
            className="absolute"
            style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%`, transform: "translate(-50%, -50%)" }}
          >
            <div
              className="group-hover/stage:[animation-play-state:paused]"
              style={{ animation: `${reverse ? "spin" : "spin-rev"} ${duration}s linear infinite` }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                className="block whitespace-nowrap rounded-full border border-white/12 bg-[rgb(14_11_26/0.9)] px-3 py-1.5 font-mono text-[11px] text-ink shadow-[0_6px_24px_-6px_rgb(0_0_0/0.8)] backdrop-blur transition hover:scale-110 hover:border-gold/70 hover:text-gold sm:text-xs"
              >
                {s}
              </motion.span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Marquee({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration: number }) {
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className="flex shrink-0 animate-marquee gap-3 pr-3 hover:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[...items, ...items].map((s, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border border-line bg-white/[0.02] px-4 py-2 font-display text-sm text-ink-dim"
          >
            <span className="mr-2 text-marigold">✦</span>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Skills() {
  const [active, setActive] = useState(skillGroups[0].id)
  const group = skillGroups.find((g) => g.id === active)!
  const inner = group.skills.slice(0, Math.min(5, Math.ceil(group.skills.length / 2.4)))
  const outer = group.skills.slice(inner.length)
  const all = skillGroups.flatMap((g) => g.skills)
  const half = Math.ceil(all.length / 2)

  return (
    <section id="skills" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          kicker="Arsenal"
          title="The"
          accent="toolkit."
          sub="Pick a constellation. Hover the orbit to hold it still."
        />

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal>
            <div
              role="tablist"
              aria-label="Skill categories"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {skillGroups.map((g, i) => (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={active === g.id}
                  onClick={() => setActive(g.id)}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-full border px-4 py-2.5 text-left transition lg:w-full lg:gap-4 lg:rounded-2xl lg:px-5 lg:py-4",
                    active === g.id ? "border-gold/40 bg-white/[0.05]" : "border-line hover:border-line-strong hover:bg-white/[0.02]",
                  )}
                >
                  {active === g.id && (
                    <motion.span layoutId="skill-active" className="absolute inset-y-3 left-0 hidden w-[3px] rounded-full bg-gradient-to-b from-saffron to-rangoli lg:block" />
                  )}
                  <span className="hidden font-mono text-xs text-ink-faint lg:inline">0{i + 1}</span>
                  <span className="flex-1">
                    <span className={cn("block whitespace-nowrap font-display text-base font-semibold lg:text-xl", active === g.id ? "text-ink" : "text-ink-dim")}>{g.label}</span>
                    <span className="hidden text-sm text-ink-faint lg:block">{g.blurb}</span>
                  </span>
                  <span className={cn("font-mono text-xs", active === g.id ? "text-gold" : "text-ink-faint")}>{g.skills.length}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="group/stage relative mx-auto aspect-square w-full max-w-[540px]" role="tabpanel" aria-label={group.label}>
              <div className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,rgb(255_153_51/0.25),transparent_70%)] blur-xl" />
              <div className="absolute inset-[36%] grid place-items-center rounded-full border border-gold/30 bg-[radial-gradient(circle_at_35%_30%,rgb(255_215_122/0.25),rgb(20_14_36/0.95)_70%)] text-center shadow-[0_0_80px_-10px_rgb(255_153_51/0.5)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-display text-base font-semibold leading-tight sm:text-xl">{group.label}</p>
                    <p className="mt-1 font-mono text-[10px] text-gold">{group.skills.length} skills</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* keyed remount: new chips spring in whenever the category changes */}
              <div key={group.id} className="absolute inset-0">
                <Ring items={inner} inset="20%" duration={36} delay={0.05} />
                <Ring items={outer} inset="3%" duration={60} reverse delay={0.2} />
              </div>
            </div>
            <ul className="sr-only">
              {group.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 space-y-3">
        <Marquee items={all.slice(0, half)} duration={55} />
        <Marquee items={all.slice(half)} duration={65} reverse />
      </div>
    </section>
  )
}
