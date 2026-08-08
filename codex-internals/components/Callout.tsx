import type { ReactNode } from 'react'
import { AlertIcon, BulbIcon, CheckIcon, InfoIcon, ScaleIcon } from '@/components/icons'

export type CalloutType = 'note' | 'tip' | 'warn' | 'success' | 'design'

/**
 * 提示框。
 *
 * 视觉上刻意克制：只用极淡的同色底 + 1px 同色描边，
 * 颜色的分量集中在图标和标题上，否则整页会变得很吵。
 *
 * `design` 是这个站特有的一类：Codex 里大量代码是**取舍**的产物
 * （为什么用 JSON-RPC 而不是 MCP、为什么 TUI 反过来当客户端），
 * 这类内容和「技巧」「易错」不是一回事，值得单独一个视觉档位。
 */
const STYLES: Record<
  CalloutType,
  { Icon: typeof InfoIcon; label: string; surface: string; accent: string }
> = {
  note: {
    Icon: InfoIcon,
    label: '说明',
    surface: 'border-slate-200/80 bg-slate-50/60 dark:border-slate-700/60 dark:bg-slate-800/30',
    accent: 'text-slate-500 dark:text-slate-400',
  },
  tip: {
    Icon: BulbIcon,
    label: '技巧',
    surface: 'border-sky-200/80 bg-sky-50/50 dark:border-sky-900/60 dark:bg-sky-950/25',
    accent: 'text-sky-600 dark:text-sky-400',
  },
  warn: {
    Icon: AlertIcon,
    label: '易错',
    surface: 'border-amber-200/80 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/25',
    accent: 'text-amber-600 dark:text-amber-400',
  },
  success: {
    Icon: CheckIcon,
    label: '结论',
    surface:
      'border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/25',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
  design: {
    Icon: ScaleIcon,
    label: '设计取舍',
    surface:
      'border-violet-200/80 bg-violet-50/50 dark:border-violet-900/60 dark:bg-violet-950/25',
    accent: 'text-violet-600 dark:text-violet-400',
  },
}

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children: ReactNode
}) {
  const { Icon, label, surface, accent } = STYLES[type] ?? STYLES.note

  return (
    <div className={`callout my-7 rounded-xl border px-4 py-3.5 ${surface}`}>
      <div className="mb-1.5 flex items-center gap-2">
        <Icon size={15} className={`shrink-0 ${accent}`} />
        <span className="text-[0.8125rem] font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          {title ?? label}
        </span>
      </div>
      <div className="callout-body text-[0.9375rem] leading-[1.85] text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  )
}

export default Callout
