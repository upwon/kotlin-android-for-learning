import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactElement } from 'react'
import { isValidElement } from 'react'
import Callout from '@/components/Callout'
import CodeBlock from '@/components/CodeBlock'
import Diagram from '@/components/Diagram'
import Quiz from '@/components/Quiz'
import { Source, SourceMap } from '@/components/Source'

/**
 * MDX 里的围栏代码块，经 @shikijs/rehype 处理后长这样：
 *
 *   <pre class="shiki language-rust" style="--shiki-light:…;--shiki-dark:…" tabindex="0">
 *     <code class="language-rust"><span …>…</span></code>
 *   </pre>
 *
 * 这里把这个 <pre> 原样交给 CodeBlock 当内层，只在外面补一层带语言标签的外壳。
 * 高亮的 className / style 必须原样透传，否则颜色变量就丢了。
 *
 * 注意语言标识只出现在**内层 `<code>`** 上（shiki 的 addLanguageClass 就是这么放的），
 * 外层 `<pre>` 只有 shiki 自己那几个 class，所以要往里看一层才拿得到。
 */
function Pre({ className, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const child = props.children
  const childClass = isValidElement(child)
    ? ((child as ReactElement<{ className?: string }>).props.className ?? '')
    : ''
  const lang = /language-([\w-]+)/.exec(`${className ?? ''} ${childClass}`)?.[1]

  return (
    <CodeBlock lang={lang} preProps={{ ...props, className }}>
      {props.children}
    </CodeBlock>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: Pre,
    // 内容组件全局可用，MDX 里不需要 import
    Callout,
    Quiz,
    Diagram,
    Source,
    SourceMap,
    ...components,
  }
}
