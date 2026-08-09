'use client'

import { useEffect, useId, useState } from 'react'
import { currentResolvedTheme, subscribeToTheme, type ResolvedTheme } from '@/lib/theme'

/**
 * 图的配色。
 *
 * Mermaid 自带的 default / dark 主题是一套紫灰色，跟站内的绿色色板完全不搭——
 * 图会看起来像从别处贴过来的。所以这里用 theme: 'base' 接管全部变量，
 * 值取自 app/globals.css 里那套 accent 色阶（oklch 转成 hex，因为 mermaid
 * 的颜色解析不认 oklch）与 Tailwind 的 slate。
 *
 * 改主题色时，这两张表要跟着 globals.css 一起改。
 */
const PALETTE = {
  light: {
    background: 'transparent',
    primaryColor: '#eff8f1', // accent-50，节点底
    primaryBorderColor: '#90d4a0', // accent-300
    primaryTextColor: '#334155', // slate-700
    secondaryColor: '#f1f5f9', // slate-100
    secondaryBorderColor: '#cbd5e1',
    secondaryTextColor: '#334155',
    tertiaryColor: '#f8fafc',
    tertiaryBorderColor: '#e2e8f0',
    tertiaryTextColor: '#334155',
    lineColor: '#94a3b8', // slate-400
    textColor: '#334155',
    edgeLabelBackground: '#f1f5f9',
    clusterBkg: '#f8fafc',
    clusterBorder: '#e2e8f0',
    // 时序图
    actorBkg: '#eff8f1',
    actorBorder: '#90d4a0',
    actorTextColor: '#334155',
    actorLineColor: '#cbd5e1',
    signalColor: '#475569',
    signalTextColor: '#334155',
    noteBkgColor: '#f1f5f9',
    noteBorderColor: '#cbd5e1',
    noteTextColor: '#475569',
  },
  dark: {
    background: 'transparent',
    primaryColor: '#00290d', // accent-950
    primaryBorderColor: '#006e33', // accent-700
    primaryTextColor: '#e2e8f0', // slate-200
    secondaryColor: '#1e293b', // slate-800
    secondaryBorderColor: '#334155',
    secondaryTextColor: '#e2e8f0',
    tertiaryColor: '#0f172a',
    tertiaryBorderColor: '#1e293b',
    tertiaryTextColor: '#e2e8f0',
    lineColor: '#64748b', // slate-500
    textColor: '#cbd5e1',
    edgeLabelBackground: '#1e293b',
    clusterBkg: '#0f172a',
    clusterBorder: '#1e293b',
    actorBkg: '#00290d',
    actorBorder: '#006e33',
    actorTextColor: '#e2e8f0',
    actorLineColor: '#334155',
    signalColor: '#94a3b8',
    signalTextColor: '#cbd5e1',
    noteBkgColor: '#1e293b',
    noteBorderColor: '#334155',
    noteTextColor: '#cbd5e1',
  },
} as const

/**
 * Mermaid 渲染器。
 *
 * 几个刻意的选择：
 *
 * - **动态 import**：mermaid 压缩后接近 1MB，只有真的有图的页面才该付这个代价。
 *   放在 effect 里 import，没有图的页面一个字节都不下载。
 * - **主题切换要重渲染**：mermaid 生成的是一次性的 SVG，颜色是写死进去的，
 *   没法像站内其它元素那样靠 CSS 变量跟着 data-theme 走。所以订阅主题变化，
 *   变了就整张图重画。
 * - **SSR 时渲染源码本身**：服务端没有 DOM，画不了图。这时输出图的源码，
 *   既是可读的兜底，也避免了 hydration 前的空白跳动。
 */
export function Mermaid({ chart }: { chart: string }) {
  // useId() 带 React 的特殊字符，清洗成合法的 DOM id
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  // 服务端不知道主题，初始为 null，保证 SSR 与客户端首帧一致
  const [theme, setTheme] = useState<ResolvedTheme | null>(null)

  useEffect(() => {
    setTheme(currentResolvedTheme())
    return subscribeToTheme(setTheme)
  }, [])

  useEffect(() => {
    if (!theme) return

    let cancelled = false

    import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          // 'base' 才会让下面这套 themeVariables 完全生效；
          // default / dark 会覆盖掉其中相当一部分。
          theme: 'base',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Noto Sans SC', sans-serif",
          themeVariables: { ...PALETTE[theme], fontSize: '13px' },
          flowchart: { curve: 'basis', htmlLabels: true, padding: 12 },
          sequence: { useMaxWidth: true, wrap: true },
        })

        const { svg: rendered } = await mermaid.render(id, chart.trim())
        if (!cancelled) setSvg(rendered)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [chart, id, theme])

  if (svg) {
    return (
      <div
        className="mermaid-figure flex justify-center [&_svg]:h-auto [&_svg]:max-w-full"
        // mermaid 的输出是它自己生成的 SVG 字符串，不含用户输入
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }

  // 还没渲染出来（或渲染失败）时，把源码显示出来当兜底
  return (
    <pre className="w-max min-w-full font-mono text-[0.75rem] leading-[1.55] text-slate-500 dark:text-slate-400">
      <code>{failed ? `图渲染失败，以下为源码：\n\n${chart.trim()}` : chart.trim()}</code>
    </pre>
  )
}

export default Mermaid
