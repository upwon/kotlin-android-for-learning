import { ExternalIcon, FileCodeIcon, FolderIcon } from '@/components/icons'
import { CODEX_REF_SHORT, sourceUrl, treeUrl } from '@/lib/codex'

/**
 * 指向上游源码的链接。
 *
 * 这个站的每一句结论都应该能被读者当场验证，所以正文里凡是提到某段实现，
 * 都跟一个 <Source>，直接跳到钉住的那个 commit 上的对应文件（可带行号）。
 *
 *   <Source path="codex-rs/app-server/src/message_processor.rs" lines="120-168" />
 *   <Source path="codex-rs/core" dir>codex-core 这个 crate</Source>
 */
export function Source({
  path,
  lines,
  dir = false,
  children,
}: {
  /** 仓库根目录起算的相对路径 */
  path: string
  /** 行号或行号区间，如 "42" / "42-98"；dir 模式下忽略 */
  lines?: string
  /** 指向目录树而不是单个文件 */
  dir?: boolean
  /** 自定义显示文本，默认显示路径本身 */
  children?: React.ReactNode
}) {
  const href = dir ? treeUrl(path) : sourceUrl(path, lines)
  const label = children ?? (lines ? `${path}:${lines}` : path)
  const Icon = dir ? FolderIcon : FileCodeIcon

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={`在 GitHub 上打开（已钉在 ${CODEX_REF_SHORT}）`}
      className="not-prose mx-0.5 inline-flex max-w-full items-baseline gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-[0.1rem] align-baseline font-mono text-[0.78em] leading-normal text-slate-600 no-underline transition-colors hover:border-accent-300 hover:bg-accent-50/60 hover:text-accent-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-accent-700 dark:hover:bg-accent-950/40 dark:hover:text-accent-300"
    >
      <Icon size={11} className="shrink-0 translate-y-[0.1em] opacity-60" />
      <span className="min-w-0 break-all">{label}</span>
      <ExternalIcon size={9} className="shrink-0 translate-y-[0.05em] opacity-40" />
    </a>
  )
}

/**
 * 章节开头的「本章对应源码」区块。
 * 读者可以先把这些文件在编辑器里打开，再回来读正文。
 */
export function SourceMap({
  entries,
}: {
  entries: { path: string; note: string; dir?: boolean }[]
}) {
  return (
    <div className="not-prose my-7 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mb-2.5 flex items-center gap-2">
        <FileCodeIcon size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />
        <span className="text-[0.8125rem] font-semibold tracking-wide text-slate-700 dark:text-slate-200">
          本章对应源码
        </span>
        <span className="ml-auto font-mono text-[0.7rem] text-slate-400 dark:text-slate-500">
          @{CODEX_REF_SHORT}
        </span>
      </div>
      <ul className="space-y-1.5">
        {entries.map((entry) => (
          <li key={entry.path} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
            <Source path={entry.path} dir={entry.dir} />
            <span className="text-[0.8125rem] leading-relaxed text-slate-500 dark:text-slate-400">
              {entry.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Source
