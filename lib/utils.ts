import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** Tiny deterministic PRNG so server and client agree on "random" layouts. */
export function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Cross-component events: replay the greeting, launch a firework. */
export const FX_EVENTS = {
  replayGreeting: "fx:replay-greeting",
  firework: "fx:firework",
} as const

export function launchFirework(x: number, y: number) {
  window.dispatchEvent(new CustomEvent(FX_EVENTS.firework, { detail: { x, y } }))
}
