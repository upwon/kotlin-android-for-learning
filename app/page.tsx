import Link from 'next/link'
import { flatLessons, lessonLabel, toc } from '@/lib/toc'

export default function Home() {
  const total = flatLessons.length
  const deep = flatLessons.filter((l) => l.deep).length

  return (
    <div className="mx-auto max-w-4xl">
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Kotlin for Android
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          一条为 <strong className="font-semibold text-slate-800 dark:text-slate-100">Android 原生开发</strong>{' '}
          裁剪的 Kotlin 学习路线。内容基于 Kotlin 官方文档重组，砍掉 Native / JS / Wasm / Spring
          等与目标无关的部分，全程拿 Java 与 Android 做对照。
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/docs/01-basics/val-var-null-safety"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            从 1.2 精讲课开始 →
          </Link>
          <Link
            href="/docs/00-start/about"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            先看怎么用这个站
          </Link>
        </div>

        <dl className="mt-6 flex flex-wrap gap-6 text-sm">
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
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-50">学习路线图</h2>
        <div className="space-y-6">
          {toc.map((part) => (
            <div key={part.id}>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
                {part.title}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {part.lessons.map((lesson) => (
                  <li key={lesson.slug}>
                    <Link
                      href={`/docs/${lesson.slug}`}
                      className="block h-full rounded-lg border border-slate-200 px-3.5 py-2.5 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/20"
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
