'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { lessonLabel, toc } from '@/lib/toc'

function useCurrentSlug(): string | null {
  const pathname = usePathname()
  if (!pathname?.startsWith('/docs/')) return null
  return pathname.slice('/docs/'.length)
}

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const currentSlug = useCurrentSlug()
  const currentPartId = useMemo(
    () => toc.find((p) => p.lessons.some((l) => l.slug === currentSlug))?.id ?? null,
    [currentSlug],
  )

  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  // 进入某一章时自动展开它所在的部
  useEffect(() => {
    if (currentPartId) setCollapsed((prev) => ({ ...prev, [currentPartId]: false }))
  }, [currentPartId])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return toc
    return toc
      .map((part) => ({
        ...part,
        lessons: part.lessons.filter(
          (l) =>
            lessonLabel(l).toLowerCase().includes(q) ||
            l.summary.toLowerCase().includes(q) ||
            l.slug.toLowerCase().includes(q),
        ),
      }))
      .filter((part) => part.lessons.length > 0)
  }, [query])

  const searching = query.trim().length > 0

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 pt-14 transition-transform lg:sticky lg:top-14 lg:z-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:pt-0 dark:border-slate-800 dark:bg-slate-950 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="px-3 py-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="筛选章节…"
          className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/50"
        />

        {filtered.length === 0 && (
          <p className="px-2 py-4 text-sm text-slate-500 dark:text-slate-400">没有匹配的章节。</p>
        )}

        {filtered.map((part) => {
          // 默认全部展开：56 章都应该一眼可见、可点；折叠是用户主动行为。
          // 筛选状态下强制展开，否则筛出来的结果会藏在折叠里。
          const isCollapsed = !searching && (collapsed[part.id] ?? false)
          return (
            <div key={part.id} className="mb-1">
              <button
                type="button"
                onClick={() => setCollapsed((prev) => ({ ...prev, [part.id]: !isCollapsed }))}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[0.8rem] font-semibold tracking-wide text-slate-500 transition-colors hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800/60"
              >
                <span>{part.title}</span>
                <span
                  aria-hidden
                  className={`text-[0.65rem] transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                >
                  ▶
                </span>
              </button>

              {!isCollapsed && (
                <ul className="mt-0.5 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-800">
                  {part.lessons.map((lesson) => {
                    const active = lesson.slug === currentSlug
                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={`/docs/${lesson.slug}`}
                          onClick={onNavigate}
                          className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[0.85rem] leading-snug transition-colors ${
                            active
                              ? 'bg-indigo-100 font-medium text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200'
                              : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <span className="flex-1">{lessonLabel(lesson)}</span>
                          {lesson.star && <span title="重点章节">⭐</span>}
                          {lesson.deep && (
                            <span
                              title="已精讲"
                              className="rounded bg-emerald-100 px-1 text-[0.6rem] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            >
                              精讲
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
