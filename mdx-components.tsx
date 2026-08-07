import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import { isValidElement } from 'react'
import Callout from '@/components/Callout'
import Quiz from '@/components/Quiz'
import { CodeBlock, Runnable } from '@/components/Runnable'

type CodeProps = { className?: string; children?: unknown }

/**
 * MDX 里的围栏代码块会被编译成 <pre><code className="language-xxx">…</code></pre>，
 * 这里把它拆开：
 *   ```kotlin  → Kotlin Playground 可运行代码块
 *   ```kt      → Kotlin 语法高亮，但不可运行
 *   其他语言    → 静态代码块
 *
 * 这样 MDX 作者只需要写普通的围栏代码块，不用手写组件，
 * 也避开了在 JSX 属性里传 Kotlin 字符串模板（`$` 会被 JS 模板字符串吃掉）的坑。
 */
function Pre(props: ComponentPropsWithoutRef<'pre'>) {
  const child = props.children

  if (isValidElement(child)) {
    const { className = '', children } = (child as ReactElement<CodeProps>).props
    const lang = /language-([\w-]+)/.exec(className)?.[1]
    const code = typeof children === 'string' ? children : String(children ?? '')

    if (lang === 'kotlin') return <Runnable code={code} />
    if (lang === 'kt') return <Runnable code={code} highlightOnly />
    return <CodeBlock code={code} lang={lang} />
  }

  return <pre {...props} />
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: Pre,
    // 三个内容组件全局可用，MDX 里不需要 import
    Callout,
    Quiz,
    Runnable,
    ...components,
  }
}
