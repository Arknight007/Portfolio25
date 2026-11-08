"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { ArrowDown, ArrowUpRight, Download, Mail, MousePointerClick } from "lucide-react"
import { contact, festival, hero, honours, site } from "@/lib/data"
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from "@/components/ui/icons"
import { Counter } from "@/components/ui/counter"
import { Orrery } from "@/components/hero/orrery"

const ease = [0.16, 1, 0.3, 1] as const

function SplitWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <span className={`inline-block overflow-hidden pb-[0.12em] align-bottom ${className ?? ""}`} aria-hidden="true">
      {[...word].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { y: "110%", rotate: 8, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + i * 0.045, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

function RoleTicker() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % hero.roles.length), 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="relative inline-grid h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          className="col-start-1 row-start-1 whitespace-nowrap text-ember"
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.55, ease }}
        >
          {hero.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const orreryY = useTransform(scrollY, [0, 800], [0, 160])
  const orreryOpacity = useTransform(scrollY, [0, 700], [1, 0.2])
  const textY = useTransform(scrollY, [0, 800], [0, -60])

  return (
    <section id="top" data-fx-zone className="relative flex min-h-dvh flex-col justify-center overflow-hidden pb-10 pt-28 sm:pt-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        <motion.div style={{ y: textY }} className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pl-2 pr-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marigold opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-marigold" />
            </span>
            {hero.eyebrow}
          </motion.p>

          <h1 className="font-display text-[17vw] font-semibold leading-[0.86] tracking-[-0.045em] sm:text-[13vw] lg:text-[8.6rem]">
            <span className="sr-only">{site.name}</span>
            <SplitWord word="Srikar" delay={0.1} />
            <br />
            <SplitWord word="Molahalli" delay={0.35} className="font-serif font-normal italic tracking-[-0.02em] text-fire" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease }}
            className="mt-7 text-xl text-ink sm:text-2xl"
          >
            Software engineer who <RoleTicker />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink-dim sm:text-[17px]"
          >
            {hero.summary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-saffron via-marigold to-gold px-6 py-3.5 text-sm font-semibold text-[#1a0f02] shadow-[0_10px_40px_-8px_rgb(255_153_51/0.7)] transition hover:shadow-[0_10px_50px_-4px_rgb(255_153_51/0.9)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">See the work</span>
              <ArrowUpRight className="relative h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-ink backdrop-blur transition hover:border-gold/60 hover:bg-white/[0.06]"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Résumé
            </a>
            <div className="ml-1 flex items-center gap-1">
              {[
                { href: contact.github, label: "GitHub", Icon: GitHubIcon },
                { href: contact.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                { href: contact.leetcode, label: "LeetCode", Icon: LeetCodeIcon },
                { href: `mailto:${contact.email}`, label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full text-ink-dim transition hover:bg-white/[0.06] hover:text-gold"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: orreryY, opacity: orreryOpacity }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease }}
          className="relative"
        >
          <Orrery />
        </motion.div>
      </div>

      {/* honours strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.35, ease }}
        className="mx-auto mt-14 w-full max-w-7xl px-5 sm:px-8"
      >
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
          {honours.map((h, i) => (
            <div
              key={h.label + i}
              className="group relative bg-[rgb(9_8_18/0.88)] px-5 py-4 backdrop-blur last:col-span-2 sm:last:col-span-1"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">{h.label}</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                {"text" in h ? (
                  <span className="text-ember">{h.text}</span>
                ) : (
                  <Counter to={h.value} prefix={h.prefix} suffix={h.suffix} />
                )}
              </dd>
              <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px scale-x-0 bg-gradient-to-r from-saffron to-rangoli transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </dl>
      </motion.div>

      <div className="mx-auto mt-8 flex w-full max-w-7xl items-center justify-between px-5 font-mono text-[11px] text-ink-faint sm:px-8">
        <a href="#about" className="inline-flex items-center gap-2 transition hover:text-ink">
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" /> Scroll to explore
        </a>
        {festival.enabled && (
          <span className="hidden items-center gap-2 sm:inline-flex">
            <MousePointerClick className="h-3.5 w-3.5 text-marigold" aria-hidden="true" /> Click the sky to light a firework
          </span>
        )}
      </div>
    </section>
  )
}
