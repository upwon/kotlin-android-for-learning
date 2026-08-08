/**
 * ASCII 架构图。
 *
 * 为什么不用 Mermaid / SVG：这个站画的东西几乎都是「盒子 + 箭头 + 一句标注」，
 * ASCII 版本在正文里可以直接和源码里的路径、结构体名对齐，改起来也只是改文本，
 * 不需要额外的运行时。代价是窄屏必须横向滚动——这里给了独立的滚动容器。
 *
 * MDX 里这样写（ASCII 里不含反引号与 ${，模板字符串是安全的）：
 *
 *   <Diagram
 *     caption="一次 turn 的数据流"
 *     art={`
 *   TUI ──▶ app-server ──▶ core
 *     `}
 *   />
 */
export function Diagram({
  art,
  caption,
  label,
}: {
  /** 图本身，多行字符串 */
  art: string
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
        <pre className="w-max min-w-full font-mono text-[0.78rem] leading-[1.55] text-slate-700 dark:text-slate-300">
          <code>{trimBlankEdges(art)}</code>
        </pre>
      </div>
      {caption && (
        <figcaption className="mt-2 text-[0.8125rem] leading-relaxed text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** 去掉模板字符串首尾那两行因为换行产生的空行，但保留内部缩进 */
function trimBlankEdges(raw: string): string {
  return raw.replace(/^\n+/, '').replace(/\s+$/, '')
}

export default Diagram
