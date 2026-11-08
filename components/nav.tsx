"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react"
import { Download, Menu, X } from "lucide-react"
import { festival, nav, site } from "@/lib/data"
import { FX_EVENTS, cn } from "@/lib/utils"
import { Diya } from "@/components/diya"

export function Nav() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const [active, setActive] = useState<string>("")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    ;["top", ...nav.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener("scroll", onScroll)
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      root.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const replay = () => {
    setOpen(false)
    window.scrollTo({ top: 0 })
    window.dispatchEvent(new Event(FX_EVENTS.replayGreeting))
  }

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-rangoli via-saffron to-gold"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border px-2 py-2 transition-all duration-500 sm:px-3",
            scrolled
              ? "border-line bg-[rgb(10_8_20/0.72)] shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="group flex items-center gap-2 rounded-full py-1 pl-2 pr-3" aria-label="Back to top">
            <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-saffron to-rangoli font-display text-sm font-bold text-[#1a0f02]">
              S
              <span className="absolute inset-0 rounded-full bg-saffron/40 opacity-0 blur-md transition group-hover:opacity-100" />
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:block">Srikar</span>
          </a>

          <ul className="hidden items-center md:flex">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 text-sm transition-colors",
                    active === n.id ? "text-ink" : "text-ink-dim hover:text-ink",
                  )}
                >
                  {active === n.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            {festival.enabled && (
              <button
                onClick={replay}
                title="Replay the Diwali greeting"
                aria-label="Replay the Diwali greeting"
                className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/[0.07]"
              >
                <Diya className="h-6 w-7" />
              </button>
            )}
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-gold sm:inline-flex"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> Résumé
            </a>
            <button
              className="grid h-9 w-9 place-items-center rounded-full border border-line md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-[rgb(6_5_12/0.96)] px-6 pb-10 pt-6 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-line"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-8 space-y-1">
              {nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <a
                    href={`#${n.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 font-display text-4xl font-semibold tracking-tight"
                  >
                    <span className="font-mono text-xs text-marigold">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex gap-3">
              <a
                href={site.resume}
                target="_blank"
                rel="noopener"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3 font-medium text-bg"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Résumé
              </a>
              {festival.enabled && (
                <button onClick={replay} className="flex items-center gap-2 rounded-full border border-line px-4 py-3 text-sm">
                  <Diya className="h-5 w-6" /> Greeting
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
