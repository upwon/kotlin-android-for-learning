import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Shell from '@/components/Shell'
import { THEME_INIT_SCRIPT } from '@/lib/theme'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Codex 源码解剖 · 学习站',
    template: '%s · Codex 源码解剖',
  },
  description:
    '按「一次对话怎么走完」的顺序，读透 openai/codex 的内部实现：app-server 协议、codex-core 的 thread/turn 模型、工具与沙箱、CLI / TUI / 桌面端与 IDE 的接入方式。',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme 由下面的内联脚本在客户端写入，服务端渲染时没有这个属性，
    // 因此需要 suppressHydrationWarning
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/*
          在首屏绘制前同步设置 data-theme，避免深色偏好的用户看到白屏闪烁。
          必须是阻塞脚本，不能用 next/script 的 afterInteractive。
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
