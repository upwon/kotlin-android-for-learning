/**
 * 上游仓库的坐标。
 *
 * 全站所有指向源码的链接都从这里拼出来，换一次 ref 就能整站跟着走。
 * 刻意钉在一个 **commit** 而不是 main：Codex 主干每天几十个提交，
 * 钉 main 的话文中写的行号过两周就全错了。
 *
 * 升级步骤：
 *   1. 改下面的 CODEX_REF / CODEX_REF_DATE
 *   2. 把正文里引用过行号的地方重新核对一遍（`rg 'lines=' content/`）
 */
export const CODEX_REPO = 'openai/codex'

/** 本站正文全部基于这个提交阅读与写作 */
export const CODEX_REF = '936f5eb3ee223ab34dcb221fa7c5f9943c8092bd'

/** 该提交的日期，正文里标注「快照时间」用 */
export const CODEX_REF_DATE = '2026-08-08'

export const CODEX_REF_SHORT = CODEX_REF.slice(0, 7)

export const CODEX_REPO_URL = `https://github.com/${CODEX_REPO}`

/** 拼出指向某个文件（可带行号区间）的 GitHub 链接 */
export function sourceUrl(path: string, lines?: string): string {
  const base = `${CODEX_REPO_URL}/blob/${CODEX_REF}/${path.replace(/^\/+/, '')}`
  if (!lines) return base

  const [from, to] = lines.split('-')
  const hash = to ? `#L${from}-L${to}` : `#L${from}`
  return base + hash
}

/** 拼出目录树链接 */
export function treeUrl(path: string): string {
  return `${CODEX_REPO_URL}/tree/${CODEX_REF}/${path.replace(/^\/+/, '')}`
}
