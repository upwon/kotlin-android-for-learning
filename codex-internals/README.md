# Codex 源码解剖 · 学习站

按「一次对话是怎么走完的」把 [openai/codex](https://github.com/openai/codex) 拆开讲：
app-server 协议、codex-core 的 thread / turn 模型、工具与三平台沙箱、CLI / TUI / 桌面端与 IDE 的接入方式。

这是仓库里**第二个**独立站点，和根目录的 Kotlin 学习站互不影响：它有自己的
`package.json`、`node_modules` 与 Next.js 配置。

- 全站 **75 章**，覆盖 11 个部分 + 附录
- 每章开头都有「**本章对应源码**」，链接钉在一个具体 commit 上，可以当场核对
- 交互练习题、ASCII 架构图、构建期语法高亮（shiki 双主题，零运行时）

## 本地开发

```bash
cd codex-internals
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建（75 章全部静态预渲染）
npm run typecheck
```

## 目录结构

```
app/
  layout.tsx            全局布局
  page.tsx              首页（三条阅读路线 + 全书目录）
  docs/[...slug]/       动态路由，渲染 content/ 下对应的 MDX
components/
  Shell.tsx             页头 + 侧边栏 + 内容区
  Sidebar.tsx           章节树导航
  CodeBlock.tsx         代码块外壳（高亮本身在构建期由 shiki 完成）
  Source.tsx            Source / SourceMap：指向上游源码的链接
  Diagram.tsx           ASCII 架构图
  Quiz.tsx              交互练习题
  Callout.tsx           说明 / 技巧 / 易错 / 结论 / 设计取舍
content/                MDX 内容，一章一文件
  registry.ts           slug -> 动态 import（由脚本生成）
lib/
  codex.ts              上游仓库坐标：钉住的 commit、源码链接拼装
  toc.ts                章节树数据（由脚本生成）
scripts/gen-content.mjs 章节大纲的单一数据源
```

## 写内容

### 章节大纲

`scripts/gen-content.mjs` 是**唯一数据源**。改完跑 `npm run gen`：

- 重新生成 `lib/toc.ts` 与 `content/registry.ts`
- 为新章节创建 MDX 骨架（**已存在的文件不会被覆盖**）

骨架页会自动带上「本章对应源码」和「学习提纲」，所以即使正文没写，页面对读者也是有用的。

### 组件

`Callout`、`Quiz`、`Diagram`、`Source`、`SourceMap` 已全局注册，MDX 里不用 import。

```mdx
<SourceMap
  entries={[
    { path: 'codex-rs/app-server/src/message_processor.rs', note: '中枢本体' },
    { path: 'codex-rs/core', note: '内核', dir: true },
  ]}
/>

正文里引用某一段实现：<Source path="codex-rs/core/src/safety.rs" lines="42-98" />

<Diagram
  label="数据流"
  caption="说明文字"
  art={`
TUI ──▶ app-server ──▶ core
  `}
/>
```

代码块直接写围栏即可，`rust` / `ts` / `json` / `bash` / `toml` 都有高亮。

<!-- prettier-ignore -->
> **MDX 注意**：正文里裸写 `<` 或 `{` 会被当成 JSX。
> 用反引号包成行内代码即可（生成器对骨架页已经自动处理）。

## 升级源码快照

正文里的路径与行号都钉在 `lib/codex.ts` 的 `CODEX_REF` 上。升级时：

1. 改 `CODEX_REF` 与 `CODEX_REF_DATE`
2. 把引用过行号的地方重新核对一遍：`rg 'lines=' content/`

架构层面的结论通常比行号活得久，但行号一定会漂。

## 部署

这是一个独立的 Next.js 应用。部署到 Vercel 时，把项目的 **Root Directory 设成
`codex-internals`**，其余用默认配置即可。
