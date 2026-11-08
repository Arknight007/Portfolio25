/**
 * Small canvas fireworks engine. Sparks are drawn as short streaks
 * (previous → current position) with additive blending, so trails work on
 * top of other canvas content without smearing it.
 */

export const DIWALI_PALETTES: string[][] = [
  ["#ffd77a", "#ffb627", "#fff3d6"], // gold
  ["#ff9933", "#ffb627", "#ffe2b8"], // saffron
  ["#ff3d81", "#ff8fb8", "#ffd77a"], // rangoli
  ["#22d3c5", "#9ff5ec", "#ffd77a"], // peacock
  ["#8b5cf6", "#c4b5fd", "#ff9933"], // violet
  ["#ffffff", "#ffd77a", "#ff6a1f"], // white-hot
]

type Spark = {
  x: number
  y: number
  px: number
  py: number
  vx: number
  vy: number
  life: number
  max: number
  color: string
  width: number
  drag: number
  gravity: number
  glitter: boolean
}

type Rocket = {
  x: number
  y: number
  px: number
  py: number
  vx: number
  vy: number
  ty: number
  palette: string[]
  shape: Shape
}

type Shape = "peony" | "ring" | "willow" | "crossette" | "heart"

const SHAPES: Shape[] = ["peony", "peony", "ring", "willow", "crossette"]

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]

export class Fireworks {
  sparks: Spark[] = []
  rockets: Rocket[] = []
  maxSparks: number
  scale: number

  constructor(opts: { maxSparks?: number; scale?: number } = {}) {
    this.maxSparks = opts.maxSparks ?? 1400
    this.scale = opts.scale ?? 1
  }

  get active() {
    return this.sparks.length > 0 || this.rockets.length > 0
  }

  /** Launch a rocket from (x, groundY) that bursts at (tx, ty). */
  launch(x: number, groundY: number, tx: number, ty: number, palette = pick(DIWALI_PALETTES), shape = pick(SHAPES)) {
    const flight = rnd(0.9, 1.25) // seconds
    const vy = (ty - groundY) / flight - (0.5 * 140 * flight) // compensate a little gravity
    this.rockets.push({ x, y: groundY, px: x, py: groundY, vx: (tx - x) / flight, vy, ty, palette, shape })
  }

  burst(x: number, y: number, palette = pick(DIWALI_PALETTES), shape: Shape = pick(SHAPES)) {
    const budget = this.maxSparks - this.sparks.length
    if (budget <= 20) return
    const s = this.scale
    const n = Math.min(budget, shape === "willow" ? 70 : shape === "ring" ? 60 : 90)
    const speed = rnd(150, 230) * s

    for (let i = 0; i < n; i++) {
      let angle = (i / n) * Math.PI * 2 + rnd(-0.05, 0.05)
      let v = speed
      if (shape === "peony" || shape === "crossette") v = speed * Math.cbrt(Math.random()) * 1.1
      if (shape === "willow") v = speed * rnd(0.5, 0.9)
      if (shape === "heart") {
        const t = angle
        const hx = 16 * Math.sin(t) ** 3
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        angle = Math.atan2(hy, hx)
        v = (Math.hypot(hx, hy) / 17) * speed
      }
      const willow = shape === "willow"
      this.sparks.push({
        x,
        y,
        px: x,
        py: y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        life: 0,
        max: willow ? rnd(2.2, 3.0) : rnd(1.1, 1.8),
        color: willow ? "#ffcf6b" : pick(palette),
        width: willow ? 1.4 * s : rnd(1.2, 2.2) * s,
        drag: willow ? 0.975 : 0.955,
        gravity: (willow ? 70 : 110) * s,
        glitter: shape === "crossette" || Math.random() < 0.12,
      })
    }
    // bright core flash
    for (let i = 0; i < 14; i++) {
      const a = rnd(0, Math.PI * 2)
      const v = rnd(10, 60) * s
      this.sparks.push({
        x, y, px: x, py: y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        life: 0, max: rnd(0.25, 0.45), color: "#fff6e0",
        width: 3 * s, drag: 0.9, gravity: 0, glitter: false,
      })
    }
  }

  /** A handful of golden sparks, e.g. for a click. */
  sparkle(x: number, y: number, count = 18) {
    for (let i = 0; i < count; i++) {
      const a = rnd(0, Math.PI * 2)
      const v = rnd(40, 140) * this.scale
      this.sparks.push({
        x, y, px: x, py: y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30,
        life: 0, max: rnd(0.5, 0.9), color: pick(["#ffd77a", "#ff9933", "#fff3d6"]),
        width: rnd(1, 2), drag: 0.93, gravity: 160, glitter: true,
      })
    }
  }

  update(dt: number) {
    dt = Math.min(dt, 0.05)
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i]
      r.px = r.x
      r.py = r.y
      r.vy += 140 * dt
      r.x += r.vx * dt
      r.y += r.vy * dt
      // trailing embers
      if (Math.random() < 0.7 && this.sparks.length < this.maxSparks) {
        this.sparks.push({
          x: r.x, y: r.y, px: r.x, py: r.y,
          vx: rnd(-15, 15), vy: rnd(10, 40),
          life: 0, max: rnd(0.3, 0.6), color: "#ffb627",
          width: 1.2, drag: 0.92, gravity: 60, glitter: false,
        })
      }
      if (r.vy >= -20 || r.y <= r.ty) {
        this.rockets.splice(i, 1)
        this.burst(r.x, r.y, r.palette, r.shape)
      }
    }

    const sp = this.sparks
    for (let i = sp.length - 1; i >= 0; i--) {
      const p = sp[i]
      p.life += dt
      if (p.life >= p.max) {
        sp[i] = sp[sp.length - 1]
        sp.pop()
        continue
      }
      p.px = p.x
      p.py = p.y
      const d = Math.pow(p.drag, dt * 60)
      p.vx *= d
      p.vy = p.vy * d + p.gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalCompositeOperation = "lighter"
    ctx.lineCap = "round"

    for (const r of this.rockets) {
      ctx.strokeStyle = "#fff1c9"
      ctx.lineWidth = 2.2
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.moveTo(r.px, r.py + 6)
      ctx.lineTo(r.x, r.y)
      ctx.stroke()
    }

    for (const p of this.sparks) {
      const t = p.life / p.max
      let a = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9
      if (p.glitter && t > 0.45) a *= Math.random() < 0.5 ? 1 : 0.15
      ctx.globalAlpha = Math.max(0, a)
      ctx.strokeStyle = p.color
      ctx.lineWidth = p.width
      ctx.beginPath()
      // stretch the streak a bit for a long-exposure look
      ctx.moveTo(p.x - (p.x - p.px) * 2.2, p.y - (p.y - p.py) * 2.2)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    ctx.restore()
  }
}
