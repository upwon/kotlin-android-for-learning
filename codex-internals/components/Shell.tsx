'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'
import { CloseIcon, ExternalIcon, MenuIcon } from '@/components/icons'
import { CODEX_REF_SHORT, CODEX_REPO_URL } from '@/lib/codex'

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
          className="-ml-1 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {open ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
        </button>

        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-[0.95rem] font-bold text-slate-900 dark:text-slate-100">
            Codex 源码解剖
          </span>
          <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">
            从 app-server 到 CLI / TUI / 桌面端，一层层读懂 openai/codex
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={CODEX_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-900 sm:flex dark:text-slate-400 dark:hover:text-slate-100"
          >
            <span className="font-mono">openai/codex</span>
            <span className="font-mono text-slate-400 dark:text-slate-500">@{CODEX_REF_SHORT}</span>
            <ExternalIcon size={12} />
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
