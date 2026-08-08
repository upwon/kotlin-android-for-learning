'use client'

import { useEffect, useState } from 'react'

type Heading = { id: string; text: string; level: 2 | 3 }

/**
 * 页内目录。
 *
 * 标题的 id 由 rehype-slug 在构建期生成，这里直接从已渲染的 DOM 读取，
 * 不需要另做一套 MDX 解析。滚动高亮用 IntersectionObserver。
 */
export function TableOfContents({ containerId }: { containerId: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    const nodes = Array.from(container.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent?.replace(/#$/, '').trim() ?? '',
        level: node.tagName === 'H2' ? 2 : 3,
      })),
    )

    if (nodes.length === 0) return

    // 只把「上方 20% ~ 下方 65%」这条带子当作阅读区，避免整屏标题同时命中
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [containerId])

  if (headings.length < 2) return null

  return (
    <nav aria-label="页内目录" className="text-[0.8125rem]">
      <p className="mb-2.5 font-semibold tracking-wide text-slate-400 dark:text-slate-500">
        本页内容
      </p>
      <ul className="space-y-0.5 border-l border-slate-200 dark:border-slate-800">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`-ml-px block border-l py-1 leading-snug transition-colors ${
                  heading.level === 3 ? 'pl-6' : 'pl-3'
                } ${
                  active
                    ? 'border-accent-500 text-accent-600 dark:border-accent-400 dark:text-accent-300'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100'
                }`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default TableOfContents
