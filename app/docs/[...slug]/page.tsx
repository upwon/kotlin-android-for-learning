import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import TableOfContents from '@/components/TableOfContents'
import { ArrowLeftIcon, ArrowRightIcon, StarIcon } from '@/components/icons'
import { registry } from '@/content/registry'
import { findLesson, findPart, flatLessons, lessonLabel, neighbours } from '@/lib/toc'

type PageProps = { params: Promise<{ slug: string[] }> }

const ARTICLE_ID = 'lesson-body'

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
    <div className="mx-auto flex w-full max-w-6xl gap-12">
      <div className="min-w-0 flex-1">
        <header className="mb-10">
          {part && (
            <p className="mb-2 text-[0.8125rem] font-medium text-accent-600 dark:text-accent-400">
              {part.title}
            </p>
          )}
          <h1 className="flex flex-wrap items-center gap-2.5 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-slate-900 dark:text-slate-50">
            {lessonLabel(lesson)}
            {lesson.star && (
              <StarIcon
                size={20}
                className="text-amber-500 dark:text-amber-400"
                aria-label="重点章节"
              />
            )}
          </h1>
          <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-slate-500 dark:text-slate-400">
            {lesson.summary}
          </p>
        </header>

        {/*
          prose-code:before/after 置空：typography 默认会给行内代码加一对字面反引号
        */}
        <article
          id={ARTICLE_ID}
          className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none"
        >
          <Content />
        </article>

        <nav className="mt-16 grid gap-3 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-800">
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="group rounded-xl border border-slate-200 px-4 py-3.5 transition-colors hover:border-accent-400 dark:border-slate-800 dark:hover:border-accent-600"
            >
              <span className="mb-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <ArrowLeftIcon size={13} />
                上一课
              </span>
              <span className="text-sm font-medium text-slate-700 group-hover:text-accent-700 dark:text-slate-200 dark:group-hover:text-accent-300">
                {lessonLabel(prev)}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/docs/${next.slug}`}
              className="group rounded-xl border border-slate-200 px-4 py-3.5 text-right transition-colors hover:border-accent-400 sm:col-start-2 dark:border-slate-800 dark:hover:border-accent-600"
            >
              <span className="mb-1 flex items-center justify-end gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                下一课
                <ArrowRightIcon size={13} />
              </span>
              <span className="text-sm font-medium text-slate-700 group-hover:text-accent-700 dark:text-slate-200 dark:group-hover:text-accent-300">
                {lessonLabel(next)}
              </span>
            </Link>
          )}
        </nav>
      </div>

      {/* 页内目录：只在够宽的视口出现，窄屏靠侧边栏与正文标题导航 */}
      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
          <TableOfContents containerId={ARTICLE_ID} />
        </div>
      </aside>
    </div>
  )
}
