import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

export function SectionHeading({
  index,
  kicker,
  title,
  accent,
  sub,
  className,
}: {
  index: string
  kicker: string
  title: string
  accent?: string
  sub?: string
  className?: string
}) {
  return (
    <Reveal className={cn("mb-12 max-w-3xl sm:mb-16", className)}>
      <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-marigold/90">
        <span className="text-ink-faint">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-marigold/80 to-transparent" />
        {kicker}
      </p>
      <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl">
        {title} {accent && <span className="font-serif font-normal italic text-fire">{accent}</span>}
      </h2>
      {sub && <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-dim sm:text-lg">{sub}</p>}
    </Reveal>
  )
}
