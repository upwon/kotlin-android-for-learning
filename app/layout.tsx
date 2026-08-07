import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Shell from '@/components/Shell'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Kotlin for Android · 学习站',
    template: '%s · Kotlin for Android',
  },
  description:
    '为有 Java / Android 背景的工程师裁剪的 Kotlin 学习路线：全章节骨架、可运行代码块与交互练习题。',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
