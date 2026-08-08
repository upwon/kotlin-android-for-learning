import Link from 'next/link'
import { CODEX_REF_DATE, CODEX_REF_SHORT, CODEX_REPO_URL } from '@/lib/codex'
import { flatLessons, lessonLabel, toc } from '@/lib/toc'

/** 三条推荐路线：来这个站的人，目的通常是这三种之一 */
const TRACKS = [
  {
    title: '我要接入 Codex',
    detail: '写 IDE 插件、做自己的前端、或者用 SDK 把它嵌进流水线',
    entry: '02-app-server/why-jsonrpc',
    entryLabel: '从 2.1 开始',
  },
  {
    title: '我要改内核',
    detail: '看懂 thread / turn / 工具调用这条主链，再决定往哪下手',
    entry: '01-overview/turn-lifecycle',
    entryLabel: '从 1.2 开始',
  },
  {
    title: '我为沙箱而来',
    detail: 'Seatbelt、Landlock、execpolicy——三个平台的真实实现摆在一起',
    entry: '05-sandbox/threat-model',
    entryLabel: '从 5.1 开始',
  },
]

export default function Home() {
  const total = flatLessons.length
  const deep = flatLessons.filter((l) => l.deep).length

  return (
    <div className="mx-auto max-w-4xl">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Codex 源码解剖
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          <a
            href={CODEX_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[0.95em] text-accent-600 hover:underline dark:text-accent-400"
          >
            openai/codex
          </a>{' '}
          是目前少见的、把一个<strong className="font-semibold text-slate-800 dark:text-slate-100">生产级编码 agent</strong>
          完整开源的仓库——协议、内核、工具层、三个平台的沙箱、终端 UI、SDK
          全在里面。这个站按「一次对话是怎么走完的」把它拆开讲。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/docs/01-overview/turn-lifecycle"
            className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-700"
          >
            从「一次 turn 的生命周期」开始 →
          </Link>
          <Link
            href="/docs/00-start/about"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            先看怎么用这个站
          </Link>
        </div>

        <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">章节总数</dt>
            <dd className="text-2xl font-bold text-slate-800 dark:text-slate-100">{total}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">已精讲</dt>
            <dd className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{deep}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">待点亮</dt>
            <dd className="text-2xl font-bold text-slate-400 dark:text-slate-500">{total - deep}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">源码快照</dt>
            <dd className="pt-1.5 font-mono text-sm text-slate-700 dark:text-slate-200">
              {CODEX_REF_SHORT}
              <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500">
                {CODEX_REF_DATE}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">你是哪一种读者</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {TRACKS.map((track) => (
            <Link
              key={track.entry}
              href={`/docs/${track.entry}`}
              className="group flex flex-col rounded-xl border border-slate-200 p-4 transition-colors hover:border-accent-300 hover:bg-accent-50/40 dark:border-slate-800 dark:hover:border-accent-700 dark:hover:bg-accent-950/20"
            >
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {track.title}
              </span>
              <span className="mt-1 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {track.detail}
              </span>
              <span className="mt-3 text-xs font-medium text-accent-600 dark:text-accent-400">
                {track.entryLabel} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">全书目录</h2>
        <div className="space-y-6">
          {toc.map((part) => (
            <div key={part.id}>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-accent-600 dark:text-accent-400">
                {part.title}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {part.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/docs/${lesson.slug}`}
                      className="block h-full rounded-lg border border-slate-200 px-3.5 py-2.5 transition-colors hover:border-accent-300 hover:bg-accent-50/40 dark:border-slate-800 dark:hover:border-accent-700 dark:hover:bg-accent-950/20"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {lessonLabel(lesson)}
                        </span>
                        {lesson.star && <span title="重点章节">⭐</span>}
                        {lesson.deep && (
                          <span className="rounded bg-emerald-100 px-1 text-[0.6rem] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            精讲
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {lesson.summary}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
