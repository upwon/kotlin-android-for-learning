# Kotlin for Android · 学习站

一条为 **Android 原生开发**裁剪的 Kotlin 学习路线。内容基于 Kotlin 官方文档重组，
砍掉 Native / JS / Wasm / Spring / 数据分析等与目标无关的部分，全程拿 Java 与 Android 做对照。

- 全站 **56 章**，内容全部写完
- **302 段可运行代码**——由 [Kotlin Playground](https://github.com/JetBrains/kotlin-playground) 驱动，可以直接改了再跑
- **216 道交互练习题**（单选 / 多选 / 填空 + 详细解析）
- 全程拿 Java / Android 做对照，只讲差异

## 本地开发

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 生产构建（56 章全部静态预渲染）
```

## 目录结构

```
app/
  layout.tsx            全局布局
  page.tsx              首页（学习路线图）
  docs/[...slug]/       动态路由，渲染 content/ 下对应的 MDX
components/
  Shell.tsx             页头 + 侧边栏 + 内容区
  Sidebar.tsx           章节树导航
  Runnable.tsx          Kotlin Playground 可运行代码块 / 静态代码块
  Quiz.tsx              交互练习题
  Callout.tsx           ⚠️ 💡 ✅ ☕ 提示框
content/                MDX 内容，一章一文件
  registry.ts           slug -> 动态 import（由脚本生成）
lib/toc.ts              章节树数据（由脚本生成）
mdx-components.tsx      MDX 组件映射（围栏代码块 -> Runnable）
scripts/gen-content.mjs 章节大纲的单一数据源
```

## 写内容

### 代码块

MDX 里直接写围栏代码块即可，不需要手写组件：

- ` ```kotlin ` → Kotlin Playground **可运行**代码块
- ` ```kt ` → Kotlin 语法高亮，**不可运行**（用于展示不完整的片段）
- 其他语言（`java` / `groovy` / `bash`…） → 静态代码块

这样写的好处是不用在 JSX 属性里传 Kotlin 源码——字符串模板的 `$` 会被 JS 模板字符串吃掉。

### 组件

`Callout`、`Quiz`、`Runnable` 已全局注册，MDX 里不用 import：

```mdx
<Callout type="warn" title="易错点">

`val` 只保证引用不可变。

</Callout>

<Quiz
  index={1}
  question="val 声明的 MutableList 还能 add 吗？"
  options={['能', '不能']}
  answer={0}
>

能。`val` 约束的是引用，不是内容。

</Quiz>
```

`Quiz` 的 `type` 支持 `single`（默认）、`multi`、`fill`。填空题的 `answer` 传字符串或字符串数组
（多种写法都算对），判分时会忽略空白与中英文引号差异，并且无论对错都会展示参考答案。

### 新增 / 修改章节

章节大纲的单一数据源是 `scripts/gen-content.mjs`：

```bash
npm run gen
```

会重新生成 `lib/toc.ts` 和 `content/registry.ts`，并为缺失的章节补上骨架 MDX。
**已存在的 MDX 不会被覆盖**，所以修改某一章只需要直接编辑对应文件。

> ⚠️ 大纲文本里出现 `Array<T>`、`List<out E>` 这类尖括号时要用反引号包起来，
> 否则 MDX 会把它当成 JSX 标签。

## 部署到 Vercel

1. 登录 [vercel.com](https://vercel.com) → **Add New Project** → Import 这个 repo
2. 框架会被识别为 Next.js，其余保持默认，点 **Deploy**

之后每次 push 自动重新部署。或者本地用 CLI：

```bash
npm i -g vercel && vercel
```

### 可选：自托管 Kotlin Playground

默认从 unpkg 加载 playground 脚本。想改成自托管：

```bash
npm i kotlin-playground
cp node_modules/kotlin-playground/dist/playground.min.js public/playground.js
```

然后设置环境变量 `NEXT_PUBLIC_KOTLIN_PLAYGROUND_SRC=/playground.js`。

无论哪种方式，**代码的编译和运行都发生在 JetBrains 的服务器**（`api.kotlinlang.org`），
所以浏览器需要能访问外网。
