/** 5-row pixel glyphs used to "draw" text into a contribution-style heatmap. */
const GLYPHS: Record<string, string[]> = {
  H: ["X.X", "X.X", "XXX", "X.X", "X.X"],
  A: [".X.", "X.X", "XXX", "X.X", "X.X"],
  P: ["XX.", "X.X", "XX.", "X..", "X.."],
  Y: ["X.X", "X.X", ".X.", ".X.", ".X."],
  D: ["XX.", "X.X", "X.X", "X.X", "XX."],
  I: ["XXX", ".X.", ".X.", ".X.", "XXX"],
  W: ["X...X", "X...X", "X.X.X", "X.X.X", ".X.X."],
  L: ["X..", "X..", "X..", "X..", "XXX"],
}

const LETTER_GAP = 1
const WORD_GAP = 3

export function textWidth(text: string) {
  let w = 0
  const chars = [...text]
  chars.forEach((ch, i) => {
    if (ch === " ") w += WORD_GAP - LETTER_GAP
    else w += GLYPHS[ch]?.[0].length ?? 0
    if (i < chars.length - 1 && ch !== " ") w += LETTER_GAP
  })
  return w
}

/**
 * Rasterise `text` into a set of "col,row" keys, centred horizontally inside
 * a grid of `cols` columns, starting at `rowOffset`.
 */
export function rasterize(text: string, cols: number, rowOffset = 1, colOffset = 0) {
  const lit = new Set<string>()
  const start = colOffset + Math.floor((cols - textWidth(text)) / 2)
  let x = start
  for (const ch of text) {
    if (ch === " ") {
      x += WORD_GAP - LETTER_GAP
      continue
    }
    const g = GLYPHS[ch]
    if (!g) continue
    g.forEach((row, r) => {
      ;[...row].forEach((px, c) => {
        if (px === "X") lit.add(`${x + c},${r + rowOffset}`)
      })
    })
    x += g[0].length + LETTER_GAP
  }
  return lit
}
