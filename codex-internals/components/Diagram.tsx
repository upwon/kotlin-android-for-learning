import Mermaid from '@/components/Mermaid'

/**
 * 架构图。
 *
 * 图本身用 Mermaid 描述，这里只负责它外面那一层：小标题、边框、图注，
 * 以及窄屏下的独立横向滚动容器。
 *
 * MDX 里这样写（Mermaid 语法里不会出现反引号或 ${，模板字符串是安全的）：
 *
 *   <Diagram
 *     caption="一次 turn 的数据流"
 *     chart={`
 *   flowchart LR
 *     TUI --> AS[app-server] --> Core[codex-core]
 *     `}
 *   />
 */
export function Diagram({
  chart,
  caption,
  label,
}: {
  /** Mermaid 源码 */
  chart: string
  /** 图下方的说明 */
  caption?: string
  /** 图上方的小标题，默认「示意图」 */
  label?: string
}) {
  return (
    <figure className="not-prose my-8">
      <div className="mb-1.5 text-[0.6875rem] font-medium tracking-wide text-slate-400 dark:text-slate-500">
        {label ?? '示意图'}
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <Mermaid chart={chart} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-[0.8125rem] leading-relaxed text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export default Diagram
