import { ImageResponse } from "next/og"
import { site } from "@/lib/data"

export const alt = site.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const FIRE = ["#ff9933", "#ffb627", "#ffd77a", "#ff3d81"]

export default function OgImage() {
  // a deterministic "activity heatmap" strip
  const cells = Array.from({ length: 7 * 40 }, (_, i) => {
    const v = (Math.sin(i * 12.9898) * 43758.5453) % 1
    const r = Math.abs(v)
    return r < 0.45 ? "rgba(255,255,255,0.06)" : FIRE[Math.floor(r * 10) % FIRE.length]
  })
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 0%, #2a1640 0%, #06050c 55%)",
          color: "#f6efe4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#ffb627", letterSpacing: 6, textTransform: "uppercase" }}>Portfolio</div>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, marginTop: 18, letterSpacing: -3 }}>{site.name}</div>
          <div style={{ fontSize: 34, color: "#b3abc2", marginTop: 22 }}>Compilers · Cloud · Quantum · Aerospace</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 40 * 26, gap: 6 }}>
          {cells.map((c, i) => (
            <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: c }} />
          ))}
        </div>
      </div>
    ),
    size,
  )
}
