'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { currentResolvedTheme, subscribeToTheme, type ResolvedTheme } from '@/lib/theme'

// JetBrains 官方的 Kotlin Playground。
// 想改成自托管（例如把 node_modules/kotlin-playground/dist/playground.min.js
// 拷到 public/ 下）时，设置 NEXT_PUBLIC_KOTLIN_PLAYGROUND_SRC 即可。
const PLAYGROUND_SRC =
  process.env.NEXT_PUBLIC_KOTLIN_PLAYGROUND_SRC || 'https://unpkg.com/kotlin-playground@1'

declare global {
  interface Window {
    KotlinPlayground?: (
      selector: string | Element,
      eventFunctions?: Record<string, unknown>,
    ) => Promise<unknown>
  }
}

/** 全站只加载一次 kotlin-playground 脚本，多个代码块共享同一个 Promise。 */
let scriptPromise: Promise<void> | null = null

function loadPlayground(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.KotlinPlayground) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-kotlin-playground]')
    const script = existing ?? document.createElement('script')

    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => reject(new Error('kotlin-playground 脚本加载失败')))

    if (!existing) {
      script.src = PLAYGROUND_SRC
      script.async = true
      script.dataset.kotlinPlayground = 'true'
      document.head.appendChild(script)
    }
  })

  // 失败后允许下一次重试
  scriptPromise.catch(() => {
    scriptPromise = null
  })

  return scriptPromise
}

function escapeHtml(raw: string): string {
  return raw.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

type Status = 'idle' | 'ready' | 'error'

export function Runnable({
  code,
  highlightOnly = false,
}: {
  /** Kotlin 源码原文 */
  code: string
  /** true 表示只高亮、不提供运行按钮 */
  highlightOnly?: boolean
}) {
  // useId() 会带上 React 的特殊字符，这里清洗成合法的 class 名
  const instanceClass = `kp-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const hostRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  // 服务端不知道主题，初始为 null，保证 SSR 与客户端首帧一致；
  // 挂载后解析出真实主题并订阅后续变化。
  const [theme, setTheme] = useState<ResolvedTheme | null>(null)

  useEffect(() => {
    setTheme(currentResolvedTheme())
    return subscribeToTheme(setTheme)
  }, [])

  useEffect(() => {
    // 等主题确定再初始化，避免深色用户先以浅色挂载一次再重建
    if (!theme) return

    let cancelled = false
    let instances: unknown

    loadPlayground()
      .then(() => {
        if (cancelled || !hostRef.current || !window.KotlinPlayground) return
        return window.KotlinPlayground(`.${instanceClass}`)
      })
      .then((result) => {
        if (cancelled) return
        instances = result
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      // 卸载时销毁 playground 实例，避免客户端路由切换后残留
      const list = Array.isArray(instances) ? instances : []
      for (const instance of list) {
        try {
          ;(instance as { destroy?: () => void })?.destroy?.()
        } catch {
          /* 实例可能已随 DOM 一起被移除，忽略 */
        }
      }
    }
  }, [instanceClass, theme])

  const attrs = [
    highlightOnly ? ' data-highlight-only="nocursor"' : '',
    theme === 'dark' ? ' theme="darcula"' : '',
  ].join('')
  const html = `<code class="kotlin-code ${instanceClass}"${attrs}>${escapeHtml(code.trimEnd())}</code>`

  return (
    <div className="not-prose my-6">
      <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-mono font-semibold text-slate-600 dark:text-slate-300">Kotlin</span>
        {!highlightOnly && status !== 'error' && <span>· 可以直接改代码并运行 ▶</span>}
        {status === 'error' && <span className="text-amber-600 dark:text-amber-400">· 运行环境加载失败，以下为静态代码</span>}
      </div>
      {/*
        用 dangerouslySetInnerHTML 把这块 DOM「交给」kotlin-playground：
        React 不会 diff 它的子节点，playground 可以放心地就地替换整个 <code>。
        服务端渲染出的内容与客户端首次渲染完全一致，不会有 hydration mismatch。

        key 带上主题：切换配色时 playground 已经把这里的 DOM 换掉了，
        没法就地改主题，只能让 React 丢弃整个容器、用干净的 <code> 重建，
        上面的 effect 随之重新初始化（cleanup 会先销毁旧实例）。
      */}
      <div
        key={theme ?? 'pending'}
        ref={hostRef}
        className="kotlin-runnable overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

/** 非 Kotlin 语言（Java / Gradle / shell 等）的静态代码块 */
export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  return (
    <div className="not-prose my-6">
      {lang && (
        <div className="mb-1.5 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
          {lang}
        </div>
      )}
      <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-[0.85rem] leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        <code>{code.trimEnd()}</code>
      </pre>
    </div>
  )
}

export default Runnable
