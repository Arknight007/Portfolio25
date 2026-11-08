"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"

const STAGES = ["source", "tokens", "ast", "llvm ir", "x86"] as const
type Stage = (typeof STAGES)[number]

const SOURCE = `fn fib(n: int) -> int {
  if n < 2 { return n; }
  return fib(n - 1) + fib(n - 2);
}

let answer: int = fib(10);`

// tiny highlighter for the sample language
function highlight(line: string) {
  const parts = line.split(/(\bfn\b|\blet\b|\bif\b|\breturn\b|\bint\b|\d+|[{}();:]|->)/g)
  return parts.map((p, i) => {
    if (/^(fn|let|if|return)$/.test(p)) return <span key={i} className="text-rangoli">{p}</span>
    if (p === "int") return <span key={i} className="text-peacock">{p}</span>
    if (/^\d+$/.test(p)) return <span key={i} className="text-gold">{p}</span>
    if (/^[{}();:]$|^->$/.test(p)) return <span key={i} className="text-ink-faint">{p}</span>
    return <span key={i}>{p}</span>
  })
}

const TOKENS: [string, string][] = [
  ["FN", "kw"], ["IDENT fib", "id"], ["LPAREN", "p"], ["IDENT n", "id"], ["COLON", "p"], ["TYPE int", "ty"], ["RPAREN", "p"],
  ["ARROW", "p"], ["TYPE int", "ty"], ["LBRACE", "p"], ["IF", "kw"], ["IDENT n", "id"], ["LT", "op"], ["INT 2", "num"],
  ["LBRACE", "p"], ["RETURN", "kw"], ["IDENT n", "id"], ["SEMI", "p"], ["RBRACE", "p"], ["RETURN", "kw"], ["IDENT fib", "id"],
  ["LPAREN", "p"], ["IDENT n", "id"], ["MINUS", "op"], ["INT 1", "num"], ["RPAREN", "p"], ["PLUS", "op"], ["IDENT fib", "id"],
  ["…", "p"], ["LET", "kw"], ["IDENT answer", "id"], ["EOF", "kw"],
]
const TOKEN_TONE: Record<string, string> = {
  kw: "border-rangoli/40 text-rangoli bg-rangoli/10",
  id: "border-ink-dim/30 text-ink bg-white/5",
  ty: "border-peacock/40 text-peacock bg-peacock/10",
  num: "border-gold/40 text-gold bg-gold/10",
  op: "border-saffron/40 text-saffron bg-saffron/10",
  p: "border-white/10 text-ink-faint bg-transparent",
}

const IR = `define i32 @fib(i32 %n) {
entry:
  %cmp = icmp slt i32 %n, 2
  br i1 %cmp, label %base, label %rec
base:
  ret i32 %n
rec:
  %n1 = sub nsw i32 %n, 1
  %a  = tail call i32 @fib(i32 %n1)
  %n2 = sub nsw i32 %n, 2
  %b  = tail call i32 @fib(i32 %n2)
  %r  = add nsw i32 %a, %b
  ret i32 %r
}`

const ASM = `fib:
  push   ebp
  mov    ebp, esp
  push   ebx
  mov    eax, DWORD PTR [ebp+8]
  cmp    eax, 2
  jl     .L_base
  lea    edx, [eax-1]
  push   edx
  call   fib
  mov    ebx, eax
  mov    eax, DWORD PTR [ebp+8]
  sub    eax, 2
  push   eax
  call   fib
  add    eax, ebx
.L_base:
  pop    ebx
  leave
  ret`

// AST layout (x, y in a 100×100 box)
const AST_NODES = [
  { id: "fn", label: "FnDecl fib", x: 50, y: 8, tone: "rangoli" },
  { id: "param", label: "Param n: int", x: 16, y: 30, tone: "peacock" },
  { id: "if", label: "If", x: 50, y: 30, tone: "rangoli" },
  { id: "ret", label: "Return", x: 84, y: 30, tone: "rangoli" },
  { id: "lt", label: "n < 2", x: 36, y: 54, tone: "saffron" },
  { id: "retn", label: "Return n", x: 62, y: 54, tone: "ink" },
  { id: "add", label: "BinOp +", x: 84, y: 54, tone: "saffron" },
  { id: "c1", label: "Call fib(n−1)", x: 66, y: 80, tone: "gold" },
  { id: "c2", label: "Call fib(n−2)", x: 92, y: 80, tone: "gold" },
]
const AST_EDGES: [string, string][] = [
  ["fn", "param"], ["fn", "if"], ["fn", "ret"], ["if", "lt"], ["if", "retn"], ["ret", "add"], ["add", "c1"], ["add", "c2"],
]
const TONE: Record<string, string> = {
  rangoli: "border-rangoli/50 text-rangoli",
  peacock: "border-peacock/50 text-peacock",
  saffron: "border-saffron/50 text-saffron",
  gold: "border-gold/50 text-gold",
  ink: "border-white/20 text-ink",
}

function Typed({ text, speed = 14 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return setN(text.length)
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 2)), speed)
    return () => clearInterval(id)
  }, [text, speed])
  const shown = text.slice(0, n)
  return (
    <>
      {shown.split("\n").map((l, i, arr) => (
        <div key={i} className="flex">
          <span className="mr-4 w-5 shrink-0 select-none text-right text-ink-faint/60">{i + 1}</span>
          <span className="whitespace-pre">
            {highlight(l)}
            {i === arr.length - 1 && <span className="ml-px inline-block h-[1.1em] w-[7px] translate-y-[2px] animate-blink bg-gold/80" />}
          </span>
        </div>
      ))}
    </>
  )
}

function Lines({ text, tone }: { text: string; tone: (l: string) => string }) {
  return (
    <div>
      {text.split("\n").map((l, i) => (
        <motion.div
          key={i}
          className={cn("flex whitespace-pre", tone(l))}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <span className="mr-4 w-5 shrink-0 select-none text-right text-ink-faint/60">{i + 1}</span>
          {l}
        </motion.div>
      ))}
    </div>
  )
}

function Ast() {
  const byId = Object.fromEntries(AST_NODES.map((n) => [n.id, n]))
  return (
    <div className="relative h-[260px] w-full sm:h-[290px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {AST_EDGES.map(([a, b], i) => (
          <motion.path
            key={`${a}-${b}`}
            d={`M${byId[a].x} ${byId[a].y + 4} C ${byId[a].x} ${(byId[a].y + byId[b].y) / 2}, ${byId[b].x} ${(byId[a].y + byId[b].y) / 2}, ${byId[b].x} ${byId[b].y - 4}`}
            stroke="rgb(255 182 39 / 0.5)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
          />
        ))}
      </svg>
      {AST_NODES.map((n, i) => (
        <motion.span
          key={n.id}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border bg-[#0f0c1c] px-1.5 py-0.5 font-mono text-[9px] sm:px-2 sm:text-[11px]",
            TONE[n.tone],
          )}
          style={{ left: `${Math.min(n.x, 90)}%`, top: `${n.y}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
        >
          {n.label}
        </motion.span>
      ))}
    </div>
  )
}

/** Quasar compiler: source → tokens → AST → LLVM IR → x86, auto-playing. */
export function CompilerViz() {
  const [stage, setStage] = useState<Stage>("source")
  const [auto, setAuto] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-80px" })

  useEffect(() => {
    if (!auto || !inView) return
    const id = setTimeout(() => {
      setStage((s) => STAGES[(STAGES.indexOf(s) + 1) % STAGES.length])
    }, stage === "source" ? 3600 : 3000)
    return () => clearTimeout(id)
  }, [stage, auto, inView])

  const idx = STAGES.indexOf(stage)

  return (
    <div ref={ref} className="flex h-[480px] flex-col overflow-hidden rounded-2xl sm:h-[500px] border border-line bg-[#0b0916]/90 shadow-[0_30px_80px_-30px_rgb(255_61_129/0.35)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-ink-faint">quasarc fib.qsr --emit=x86</span>
        <button
          onClick={() => setAuto((a) => !a)}
          className="ml-auto rounded-md border border-line px-2 py-0.5 font-mono text-[10px] text-ink-dim transition hover:text-ink"
        >
          {auto ? "pause" : "play"}
        </button>
      </div>

      {/* stage tabs as a progress rail */}
      <div className="relative flex border-b border-line" role="tablist" aria-label="Compiler stages">
        {STAGES.map((s, i) => (
          <button
            key={s}
            role="tab"
            aria-selected={stage === s}
            onClick={() => {
              setStage(s)
              setAuto(false)
            }}
            className={cn(
              "relative flex-1 px-1 py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors sm:text-[11px]",
              stage === s ? "text-gold" : i < idx ? "text-ink-dim" : "text-ink-faint hover:text-ink-dim",
            )}
          >
            {s}
            {stage === s && <motion.span layoutId="quasar-tab" className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-gradient-to-r from-saffron to-rangoli" />}
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden p-4 font-mono text-[11px] leading-[1.7] text-ink sm:p-5 sm:text-[12.5px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="h-full overflow-x-auto"
          >
            {stage === "source" && <Typed text={SOURCE} />}
            {stage === "tokens" && (
              <div className="flex flex-wrap gap-1.5">
                {TOKENS.map(([t, k], i) => (
                  <motion.span
                    key={i}
                    className={cn("rounded border px-1.5 py-0.5 text-[10px] sm:text-[11px]", TOKEN_TONE[k])}
                    initial={{ opacity: 0, y: -14, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.035, type: "spring", stiffness: 400, damping: 22 }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            )}
            {stage === "ast" && <Ast />}
            {stage === "llvm ir" && (
              <Lines
                text={IR}
                tone={(l) => (l.startsWith("define") || l === "}" ? "text-rangoli" : l.endsWith(":") ? "text-gold" : "text-ink")}
              />
            )}
            {stage === "x86" && (
              <Lines text={ASM} tone={(l) => (l.endsWith(":") ? "text-gold" : /call|jl|ret/.test(l) ? "text-rangoli" : "text-peacock")} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-ink-faint">
        <span>
          stage {idx + 1}/{STAGES.length} · {["lexing", "tokenised", "parsed + type-checked", "optimised IR", "32-bit emitted"][idx]}
        </span>
        <span className="text-leet">● 0 errors</span>
      </div>
    </div>
  )
}
