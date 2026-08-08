'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ChevronIcon, SearchIcon, StarIcon } from '@/components/icons'
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

  // 背景必须是不透明色：窄屏下这是一块浮在正文之上的抽屉，
  // 任何透明度都会让正文的字透上来，章节名直接糊掉。
  // 浅色用 slate-50、深色用 slate-900，比正文底色差一档，
  // 既能和正文区分开，又不牺牲可读性。
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[17rem] shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50 pt-14 shadow-xl transition-transform lg:sticky lg:top-14 lg:z-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:pt-0 lg:shadow-none dark:border-slate-800 dark:bg-slate-900 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="px-3 py-4">
        <div className="relative mb-4">
          <SearchIcon
            size={14}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="筛选章节"
            aria-label="筛选章节"
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-[0.8125rem] text-slate-800 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>

        {filtered.length === 0 && (
          <p className="px-2 py-4 text-[0.8125rem] text-slate-500 dark:text-slate-400">
            没有匹配的章节。
          </p>
        )}

        {filtered.map((part) => {
          // 默认全部展开：66 章都应该一眼可见、可点；折叠是用户主动行为。
          // 筛选状态下强制展开，否则筛出来的结果会藏在折叠里。
          const isCollapsed = !searching && (collapsed[part.id] ?? false)
          return (
            <div key={part.id} className="mb-1.5">
              <button
                type="button"
                onClick={() => setCollapsed((prev) => ({ ...prev, [part.id]: !isCollapsed }))}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[0.75rem] font-semibold tracking-wide text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <ChevronIcon
                  size={12}
                  className={`shrink-0 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                />
                <span>{part.title}</span>
              </button>

              {!isCollapsed && (
                <ul className="mt-0.5 ml-[0.9rem] space-y-px border-l border-slate-200 dark:border-slate-800">
                  {part.lessons.map((lesson) => {
                    const active = lesson.slug === currentSlug
                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={`/docs/${lesson.slug}`}
                          onClick={onNavigate}
                          aria-current={active ? 'page' : undefined}
                          className={`-ml-px flex items-center gap-1.5 border-l py-1.5 pl-3 pr-2 text-[0.8125rem] leading-snug transition-colors ${
                            active
                              ? 'border-accent-500 font-medium text-accent-700 dark:border-accent-400 dark:text-accent-300'
                              : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-100'
                          }`}
                        >
                          <span className="flex-1">{lessonLabel(lesson)}</span>
                          {lesson.star && (
                            <StarIcon
                              size={12}
                              className="shrink-0 text-amber-500 dark:text-amber-400"
                              aria-label="重点章节"
                            />
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
