import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/** shiki 用的语言标识 → 显示给读者的名字 */
const LANG_LABELS: Record<string, string> = {
  rust: 'Rust',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  json: 'JSON',
  jsonc: 'JSON',
  toml: 'TOML',
  yaml: 'YAML',
  bash: 'shell',
  sh: 'shell',
  shell: 'shell',
  console: 'shell',
  python: 'Python',
  py: 'Python',
  starlark: 'Starlark',
  python3: 'Starlark',
  diff: 'diff',
  text: '',
  plaintext: '',
}

/**
 * 代码块外壳。
 *
 * 高亮本身在构建期由 @shikijs/rehype 完成，这里只负责它外面那一层：
 * 语言标签、边框、独立的横向滚动容器。
 *
 * 之所以要**独立**滚动容器：正文有行宽上限（39em），代码没有。
 * 让 <pre> 自己滚动，长的 Rust 签名就不会把整个页面撑出横向滚动条。
 */
export function CodeBlock({
  lang,
  preProps,
  children,
}: {
  lang?: string
  /** shiki 生成的 <pre> 上的属性（className / style 里带着两套主题的颜色变量） */
  preProps?: ComponentPropsWithoutRef<'pre'>
  children: ReactNode
}) {
  const label = lang ? (LANG_LABELS[lang] ?? lang) : ''

  return (
    <div className="not-prose my-6">
      {label && (
        <div className="mb-1.5 text-[0.6875rem] font-medium tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </div>
      )}
      <div className="codeblock overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <pre
          {...preProps}
          className={`${preProps?.className ?? ''} w-max min-w-full p-4 text-[0.82rem] leading-[1.65]`}
        >
          {children}
        </pre>
      </div>
    </div>
  )
}

export default CodeBlock
