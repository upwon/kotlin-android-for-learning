'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // 路由变化后关掉移动端抽屉
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <header className="sticky top-0 z-50 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="切换章节导航"
          aria-expanded={open}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
        >
          ☰
        </button>

        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-[0.95rem] font-bold text-slate-900 dark:text-slate-100">Kotlin for Android</span>
          <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
            为 Android 原生开发裁剪的 Kotlin 学习路线
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://kotlinlang.org/docs/home.html"
            target="_blank"
            rel="noreferrer"
            className="hidden text-xs text-slate-500 hover:text-slate-800 sm:inline dark:text-slate-400 dark:hover:text-slate-100"
          >
            官方文档 ↗
          </a>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto flex max-w-[100rem]">
        <Sidebar open={open} onNavigate={() => setOpen(false)} />

        {open && (
          <button
            type="button"
            aria-label="关闭章节导航"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          />
        )}

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12">{children}</main>
      </div>
    </div>
  )
}

export default Shell
