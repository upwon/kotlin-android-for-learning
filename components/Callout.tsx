import type { ReactNode } from 'react'

export type CalloutType = 'note' | 'tip' | 'warn' | 'success' | 'java'

const styles: Record<CalloutType, { icon: string; label: string; className: string }> = {
  note: {
    icon: '📝',
    label: '说明',
    className: 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50',
  },
  tip: {
    icon: '💡',
    label: '技巧',
    className: 'border-sky-300 bg-sky-50 dark:border-sky-800 dark:bg-sky-950/40',
  },
  warn: {
    icon: '⚠️',
    label: '易错',
    className: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
  },
  success: {
    icon: '✅',
    label: '结论',
    className: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
  },
  java: {
    icon: '☕',
    label: 'Java 对照',
    className: 'border-orange-300 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/40',
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
  const style = styles[type] ?? styles.note
  return (
    <div className={`my-6 rounded-lg border px-4 py-3 ${style.className}`}>
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span aria-hidden>{style.icon}</span>
        <span>{title ?? style.label}</span>
      </div>
      <div className="callout-body text-[0.95rem] leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  )
}

export default Callout
