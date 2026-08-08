import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // 仓库根目录还有另一个 Next 应用（Kotlin 学习站），两份 lockfile 会让
  // Turbopack 把工作区根推断到上一层去。这里钉死成本目录。
  turbopack: { root: import.meta.dirname },
}

const withMDX = createMDX({
  options: {
    // GFM：表格、删除线、任务列表、自动链接。
    // Turbopack 要求 loader 选项可序列化，所以插件用字符串名而不是 import 进来的函数。
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [
      // 给标题生成 id：页内目录与锚点链接都依赖它
      ['rehype-slug', {}],
      // 构建期做语法高亮。这个站几乎每页都在读 Rust，
      // 没有高亮的 `impl<'a> Trait for T` 是不可读的。
      //
      // 双主题模式：shiki 把两套颜色写成 --shiki-light / --shiki-dark 两个内联
      // CSS 变量，运行时由 globals.css 里的 [data-theme] 规则挑一个用，
      // 不需要往客户端发任何 JS。
      [
        '@shikijs/rehype',
        {
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
          // 让 <pre> / <code> 保留 language-xxx，mdx-components.tsx 靠它渲染语言标签
          addLanguageClass: true,
          defaultLanguage: 'text',
          fallbackLanguage: 'text',
        },
      ],
    ],
  },
})

export default withMDX(nextConfig)
