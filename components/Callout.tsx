import type { ReactNode } from 'react'
import { AlertIcon, BulbIcon, CheckIcon, CoffeeIcon, InfoIcon } from '@/components/icons'

export type CalloutType = 'note' | 'tip' | 'warn' | 'success' | 'java'

/**
 * 提示框。
 *
 * 视觉上刻意克制：全站有 300+ 个提示框，重边框加填充会让页面变得很吵。
 * 这里只用极淡的同色底 + 1px 同色描边，颜色的分量集中在图标和标题上。
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
  /*
    「结论」用主题色本身，不再单独占一个绿。
    主题色现在是松绿，再给结论框配一个 emerald，页面上就会出现两种很近的绿
    ——读者分不清哪个是「站点的强调色」哪个是「一种语义」。
    结论框本来就是全站最该被强调的一类，让它和主题色同源反而更成立。
    换主题色时这里会自动跟着走，不用改。
  */
  success: {
    Icon: CheckIcon,
    label: '结论',
    surface: 'border-accent-200/80 bg-accent-50/50 dark:border-accent-900/60 dark:bg-accent-950/25',
    accent: 'text-accent-600 dark:text-accent-400',
  },
  java: {
    Icon: CoffeeIcon,
    label: 'Java 对照',
    surface: 'border-orange-200/80 bg-orange-50/50 dark:border-orange-900/60 dark:bg-orange-950/25',
    accent: 'text-orange-600 dark:text-orange-400',
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
