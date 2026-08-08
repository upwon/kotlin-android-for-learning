import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
}

const withMDX = createMDX({
  options: {
    // GFM：表格、删除线、任务列表、自动链接。
    // Turbopack 要求 loader 选项可序列化，所以插件用字符串名而不是 import 进来的函数。
    remarkPlugins: [['remark-gfm', {}]],
    // 给标题生成 id：页内目录与锚点链接都依赖它
    rehypePlugins: [['rehype-slug', {}]],
  },
})

export default withMDX(nextConfig)
