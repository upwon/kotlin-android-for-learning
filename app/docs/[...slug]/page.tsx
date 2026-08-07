import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { registry } from '@/content/registry'
import { findLesson, findPart, flatLessons, lessonLabel, neighbours } from '@/lib/toc'

type PageProps = { params: Promise<{ slug: string[] }> }

/** 章节树是静态的，所有页面在构建期预渲染 */
export function generateStaticParams() {
  return flatLessons.map((lesson) => ({ slug: lesson.slug.split('/') }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const lesson = findLesson(slug.join('/'))
  if (!lesson) return {}
  return { title: lessonLabel(lesson), description: lesson.summary }
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params
  const key = slug.join('/')
  const lesson = findLesson(key)
  const load = registry[key]

  if (!lesson || !load) notFound()

  const { default: Content } = await load()
  const part = findPart(key)
  const { prev, next } = neighbours(key)

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        {part && (
          <p className="mb-2 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
            {part.title}
          </p>
        )}
        <h1 className="flex flex-wrap items-center gap-2 text-3xl font-bold text-slate-900 dark:text-slate-50">
          {lessonLabel(lesson)}
          {lesson.deep ? (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              精讲
            </span>
          ) : (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              骨架
            </span>
          )}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{lesson.summary}</p>
      </header>

      {/* prose-code:before/after 置空：typography 默认会给行内代码加一对字面反引号 */}
      <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none">
        <Content />
      </article>

      <nav className="mt-12 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700"
          >
            <span className="block text-xs text-slate-500 dark:text-slate-400">← 上一课</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {lessonLabel(prev)}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/docs/${next.slug}`}
            className="rounded-lg border border-slate-200 px-4 py-3 text-right transition-colors hover:border-indigo-300 sm:col-start-2 dark:border-slate-800 dark:hover:border-indigo-700"
          >
            <span className="block text-xs text-slate-500 dark:text-slate-400">下一课 →</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
              {lessonLabel(next)}
            </span>
          </Link>
        )}
      </nav>
    </div>
  )
}
