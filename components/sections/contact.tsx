"use client"

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react"
import { ArrowUpRight, Check, Copy, Download, Mail, Phone } from "lucide-react"
import { contact, festival, nav, site } from "@/lib/data"
import { FX_EVENTS, launchFirework } from "@/lib/utils"
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from "@/components/ui/icons"
import { Reveal } from "@/components/ui/reveal"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Diya } from "@/components/diya"

type Line = { cmd?: string; out: ReactNode }

const HELP: [string, string][] = [
  ["help", "list commands"],
  ["whoami", "who is this"],
  ["ls", "list sections"],
  ["cd <section>", "jump to a section"],
  ["email · resume", "get in touch"],
  ["github · linkedin · leetcode", "open profiles"],
  ["diwali", "replay the greeting"],
  ["fireworks", "light up the sky"],
  ["clear", "clear the screen"],
]

function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { out: <span className="text-ink-dim">srikar-os v2.0 · type <span className="text-gold">help</span> to begin.</span> },
  ])
  const [value, setValue] = useState("")
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(-1)
  const body = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" })
  }, [lines])

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

  const run = (raw: string): ReactNode | null => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ")
    const sections = nav.map((n) => n.id)
    if (!cmd) return null
    if (cmd === "help")
      return (
        <div className="grid gap-x-6 sm:grid-cols-[auto_1fr]">
          {HELP.map(([c, d]) => (
            <div key={c} className="contents">
              <span className="text-gold">{c}</span>
              <span className="text-ink-faint">{d}</span>
            </div>
          ))}
        </div>
      )
    if (cmd === "whoami") return `${site.name} — software engineer · compilers, cloud, quantum · AIR 455 GATE 2026`
    if (cmd === "ls") return sections.map((s) => `${s}/`).join("  ")
    if (cmd.startsWith("cd ") || sections.includes(cmd)) {
      const target = cmd.replace(/^cd /, "").replace(/\/$/, "")
      if (target === "~" || target === "..") {
        go("top")
        return "→ ~/"
      }
      if (!sections.includes(target)) return `cd: no such section: ${target}`
      setTimeout(() => go(target), 250)
      return `→ ${target}/`
    }
    if (cmd === "email") {
      navigator.clipboard?.writeText(contact.email).catch(() => {})
      return `${contact.email} (copied to clipboard)`
    }
    if (cmd === "resume") {
      open(site.resume)
      return "opening résumé…"
    }
    if (cmd === "github" || cmd === "linkedin" || cmd === "leetcode") {
      open(contact[cmd])
      return `opening ${cmd}…`
    }
    if (cmd === "diwali" && festival.enabled) {
      window.scrollTo({ top: 0 })
      setTimeout(() => window.dispatchEvent(new Event(FX_EVENTS.replayGreeting)), 300)
      return "🪔 shubh deepavali!"
    }
    if (cmd === "fireworks" || cmd === "light") {
      const w = window.innerWidth
      const h = window.innerHeight
      for (let i = 0; i < 5; i++) setTimeout(() => launchFirework(w * (0.15 + i * 0.175), h * (0.15 + Math.random() * 0.2)), i * 220)
      return "✦ ✦ ✦ ✦ ✦"
    }
    if (cmd === "sudo hire srikar" || cmd === "hire srikar") {
      setTimeout(() => (window.location.href = `mailto:${contact.email}?subject=Let's%20work%20together`), 600)
      return <span className="text-leet">permission granted. opening mail client…</span>
    }
    if (cmd === "date") return new Date().toString()
    if (cmd.startsWith("sudo")) return "nice try. this incident will be reported to the Coding Club."
    if (cmd === "exit") return "there is no escape. only more projects."
    return (
      <>
        command not found: <span className="text-rangoli">{cmd}</span> — try <span className="text-gold">help</span>
      </>
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const cmd = value
    setValue("")
    setHi(-1)
    if (cmd.trim()) setHist((h) => [cmd, ...h].slice(0, 30))
    if (cmd.trim().toLowerCase() === "clear") return setLines([])
    const out = run(cmd)
    setLines((l) => [...l, { cmd, out }])
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const n = Math.min(hist.length - 1, hi + 1)
      if (n >= 0) {
        setHi(n)
        setValue(hist[n])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const n = hi - 1
      setHi(n)
      setValue(n >= 0 ? hist[n] : "")
    }
  }

  return (
    <div
      className="flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl border border-line bg-[#07060d]/95 font-mono text-[12.5px] shadow-[0_30px_80px_-30px_rgb(255_153_51/0.3)]"
      onClick={() => input.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-ink-faint">guest@srikar: ~</span>
      </div>
      <div ref={body} className="max-h-[300px] flex-1 space-y-2 overflow-y-auto p-4" aria-live="polite">
        {lines.map((l, i) => (
          <div key={i}>
            {l.cmd !== undefined && (
              <p>
                <span className="text-leet">➜</span> <span className="text-peacock">~</span> <span className="text-ink">{l.cmd}</span>
              </p>
            )}
            {l.out !== null && <div className="mt-0.5 break-words text-ink-dim">{l.out}</div>}
          </div>
        ))}
        <form onSubmit={submit} className="flex items-center gap-2">
          <span className="text-leet">➜</span> <span className="text-peacock">~</span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-ink caret-gold outline-none placeholder:text-ink-faint/60"
            placeholder="try: sudo hire srikar"
          />
        </form>
      </div>
    </div>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(contact.email).then(
          () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1800)
          },
          () => {},
        )
      }}
      className="group inline-flex items-center gap-3 rounded-full border border-line-strong bg-white/[0.03] py-2 pl-5 pr-2 text-left transition hover:border-gold/60"
      aria-label={`Copy email address ${contact.email}`}
    >
      <span className="font-mono text-sm text-ink sm:text-base">{contact.email}</span>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] text-ink-dim transition group-hover:bg-gold group-hover:text-bg">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </span>
    </button>
  )
}

export function Contact() {
  const links = [
    { label: "GitHub", sub: `@${contact.githubHandle}`, href: contact.github, Icon: GitHubIcon },
    { label: "LinkedIn", sub: contact.linkedinHandle, href: contact.linkedin, Icon: LinkedInIcon },
    { label: "LeetCode", sub: festival.leetcodeHandle, href: contact.leetcode, Icon: LeetCodeIcon },
    { label: "Phone", sub: contact.phone, href: contact.phoneHref, Icon: Phone },
  ]
  return (
    <section id="contact" data-fx-zone className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
        <Reveal>
          <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-marigold/90">
            <span className="text-ink-faint">06</span>
            <span className="h-px w-10 bg-gradient-to-r from-marigold/80 to-transparent" />
            Ground control
          </p>
          <h2 className="max-w-5xl font-display text-[13vw] font-semibold leading-[0.9] tracking-[-0.04em] sm:text-8xl">
            Let&apos;s build something <span className="font-serif font-normal italic text-fire">that ships.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-3">
          <CopyEmail />
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron via-marigold to-gold px-6 py-3.5 text-sm font-semibold text-[#1a0f02] shadow-[0_10px_40px_-8px_rgb(255_153_51/0.7)] transition hover:brightness-110"
          >
            <Mail className="h-4 w-4" aria-hidden="true" /> Write to me
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-sm transition hover:border-gold/60"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Résumé (PDF)
          </a>
        </Reveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-[1fr_1.15fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {links.map(({ label, sub, href, Icon }, i) => (
              <Reveal key={label} delay={i * 0.06}>
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block h-full">
                  <SpotlightCard className="group flex h-full flex-col justify-between gap-8 p-6">
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6 text-ink-dim transition group-hover:text-gold" />
                      <ArrowUpRight className="h-5 w-5 text-ink-faint transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-display text-xl font-semibold">{label}</p>
                      <p className="truncate font-mono text-xs text-ink-faint">{sub}</p>
                    </div>
                  </SpotlightCard>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <Terminal />
          </Reveal>
        </div>
      </div>

      <Footer />
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative mt-10 border-t border-line">
      {/* toran of diyas */}
      {festival.enabled && (
        <div className="pointer-events-none absolute inset-x-0 -top-5 flex justify-center gap-6 sm:gap-12" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <Diya key={i} className="h-8 w-10" delay={i * 130} />
          ))}
        </div>
      )}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-10 text-center font-mono text-xs text-ink-faint sm:flex-row sm:px-8 sm:text-left">
        <p>
          © {new Date().getFullYear()} {site.name}. Designed &amp; built from scratch.
        </p>
        {festival.enabled ? (
          <p className="font-deva text-sm text-gold/80">शुभ दीपावली · Happy Diwali</p>
        ) : (
          <p>Next.js · Tailwind · Motion · Vercel</p>
        )}
        <a href="#top" className="transition hover:text-ink">
          back to orbit ↑
        </a>
      </div>
    </footer>
  )
}
