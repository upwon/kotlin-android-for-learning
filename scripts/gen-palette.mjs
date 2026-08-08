/*
  主题色色阶生成器：`npm run palette`，或 `npm run palette -- <色相> [峰值彩度]`。
  例如 `npm run palette -- 205 0.115` 只算墨青那一套。

  做的事：固定 Tailwind v4 那条明度曲线，只换色相 —— 所以换色不会改变
  任何一处的明暗关系，正文链接、按钮、选中态的对比度都留在原来的量级。
  彩度按档位缩放后再按 sRGB 色域二分裁剪（不同色相能撑到的彩度差很多，
  青绿在中等明度下比橙红低不少，直接照抄一组彩度会溢出色域）。

  输出直接粘进 app/globals.css 的 @theme 块，再把 600 的色值同步到 app/icon.svg。
*/

const L = { 50: 0.971, 100: 0.936, 200: 0.885, 300: 0.81, 400: 0.715, 500: 0.625, 600: 0.545, 700: 0.47, 800: 0.405, 900: 0.355, 950: 0.245 }
const CR = { 50: 0.07, 100: 0.16, 200: 0.3, 300: 0.5, 400: 0.75, 500: 0.95, 600: 1.0, 700: 0.9, 800: 0.74, 900: 0.6, 950: 0.4 }

function oklchToRgb(l, c, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ]
  return lin.map((v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055))
}

const inGamut = (rgb) => rgb.every((v) => v >= -0.001 && v <= 1.001)

/** 二分找该 L / 色相下不出色域的最大彩度 */
function maxChroma(l, h) {
  let lo = 0
  let hi = 0.4
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (inGamut(oklchToRgb(l, mid, h))) lo = mid
    else hi = mid
  }
  return lo
}

const relLum = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const x = Math.min(1, Math.max(0, v))
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrast = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

const WHITE = [1, 1, 1]
const SLATE_50 = oklchToRgb(0.984, 0.003, 247.858)
const SLATE_900 = oklchToRgb(0.208, 0.042, 265.755)
const SLATE_950 = oklchToRgb(0.129, 0.042, 264.695)

export function scale(h, peak) {
  const out = {}
  for (const k of Object.keys(L)) {
    const l = L[k]
    const c = Math.min(peak * CR[k], maxChroma(l, h) * 0.96)
    out[k] = { l, c, h, rgb: oklchToRgb(l, c, h) }
  }
  return out
}

const [argHue, argPeak] = process.argv.slice(2)

const CANDIDATES = argHue
  ? { [`hue ${argHue}`]: { h: Number(argHue), peak: Number(argPeak ?? 0.13) } }
  : {
      '墨青 ink-teal': { h: 205, peak: 0.115 },
      '砖红 terracotta': { h: 38, peak: 0.145 },
      '松绿 pine': { h: 158, peak: 0.115 },
      '藏青 ink-navy': { h: 252, peak: 0.13 },
    }

for (const [name, { h, peak }] of Object.entries(CANDIDATES)) {
  const s = scale(h, peak)
  console.log(`\n=== ${name}  (hue ${h}) ===`)
  const lines = Object.entries(s).map(
    ([k, v]) => `  --color-accent-${k}: oklch(${v.l.toFixed(3)} ${v.c.toFixed(3)} ${h});`,
  )
  console.log(lines.join('\n'))
  console.log(
    `  正文链接 600/白底 ${contrast(s[600].rgb, WHITE).toFixed(2)}` +
      ` · 600/slate-50 ${contrast(s[600].rgb, SLATE_50).toFixed(2)}` +
      ` · 400/slate-950 ${contrast(s[400].rgb, SLATE_950).toFixed(2)}` +
      ` · 300/slate-900 ${contrast(s[300].rgb, SLATE_900).toFixed(2)}` +
      ` · 白字/600 底 ${contrast(WHITE, s[600].rgb).toFixed(2)}`,
  )
}

const hex = (rgb) => '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')
console.log('\n--- 600 / 500 色值（favicon 用）---')
for (const [name, { h, peak }] of Object.entries(CANDIDATES)) {
  const s = scale(h, peak)
  console.log(name, '600 =', hex(s[600].rgb), ' 500 =', hex(s[500].rgb), ' 700 =', hex(s[700].rgb))
}
