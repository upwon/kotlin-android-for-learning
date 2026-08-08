// 本文件由 scripts/gen-content.mjs 生成，请勿手工编辑。
// 修改章节大纲请编辑 scripts/gen-content.mjs 后运行 `npm run gen`。

export type Lesson = {
  /** 章节号，如 "1.2"；第 0 部与附录没有编号 */
  num?: string
  title: string
  /** 形如 "01-basics/functions"，同时是路由与 content 下的文件路径 */
  slug: string
  summary: string
  /** 已精讲 */
  deep?: boolean
  /** 重点章节 */
  star?: boolean
}

export type Part = {
  id: string
  title: string
  lessons: Lesson[]
}

export const toc: Part[] = [
  {
    id: "00-start",
    title: "第 0 部 · 开始",
    lessons: [
      {
        title: "关于本书 / 如何使用本站",
        slug: "00-start/about",
        summary: "这个站是什么、为谁写的、怎么用。",
        deep: true,
      },
      {
        title: "Kotlin 入门 & 环境",
        slug: "00-start/getting-started",
        summary: "Android Studio 里的 Kotlin 工具链、版本与 Gradle 配置。",
        deep: true,
      },
      {
        title: "Kotlin 之旅（精简）",
        slug: "00-start/tour",
        summary: "30 分钟把语法过一遍，建立整体印象。",
        deep: true,
      },
    ],
  },
  {
    id: "01-basics",
    title: "第 1 部 · 基础语法与思维",
    lessons: [
      {
        title: "基本语法总览",
        num: "1.1",
        slug: "01-basics/syntax-overview",
        summary: "包、函数、变量、注释、类型的书写形式。",
        deep: true,
      },
      {
        title: "val/var、类型推断、空安全世界观",
        num: "1.2",
        slug: "01-basics/val-var-null-safety",
        summary: "从 Java 转 Kotlin 最需要重塑的三件事。",
        deep: true,
      },
      {
        title: "函数 & 单表达式函数",
        num: "1.3",
        slug: "01-basics/functions",
        summary: "默认参数、具名实参、单表达式函数。",
        deep: true,
      },
      {
        title: "习惯用法（idioms 速查）",
        num: "1.4",
        slug: "01-basics/idioms",
        summary: "写得像 Kotlin，而不是「用 Kotlin 语法写 Java」。",
        deep: true,
      },
      {
        title: "编码规范",
        num: "1.5",
        slug: "01-basics/coding-conventions",
        summary: "官方风格指南与团队落地。",
        deep: true,
      },
    ],
  },
  {
    id: "02-types",
    title: "第 2 部 · 类型系统",
    lessons: [
      {
        title: "基本类型 / 数字 / 布尔 / 字符",
        num: "2.1",
        slug: "02-types/basic-types",
        summary: "Kotlin 里没有 primitive 与 wrapper 的语法区分。",
        deep: true,
      },
      {
        title: "字符串 & 字符串模板",
        num: "2.2",
        slug: "02-types/strings",
        summary: "模板字符串、原始字符串与常用 API 对照。",
        deep: true,
      },
      {
        title: "数组",
        num: "2.3",
        slug: "02-types/arrays",
        summary: "Array<T> 与 IntArray 的区别，以及为什么日常应该用 List。",
        deep: true,
      },
      {
        title: "类型检测与转换（is / as / smart cast）",
        num: "2.4",
        slug: "02-types/type-checks-and-casts",
        summary: "is / as / as? 与智能转换的边界。",
        deep: true,
      },
    ],
  },
  {
    id: "03-control-flow",
    title: "第 3 部 · 控制流程",
    lessons: [
      {
        title: "条件与循环（if/when 表达式、for、区间 range）",
        num: "3.1",
        slug: "03-control-flow/conditions-and-loops",
        summary: "if 和 when 都是表达式，这改变了写法。",
        deep: true,
      },
      {
        title: "返回与跳转（label、break/continue）",
        num: "3.2",
        slug: "03-control-flow/returns-and-jumps",
        summary: "标签、限定返回，以及 lambda 里 return 的坑。",
        deep: true,
      },
      {
        title: "异常",
        num: "3.3",
        slug: "03-control-flow/exceptions",
        summary: "Kotlin 没有受检异常（checked exception）。",
        deep: true,
      },
    ],
  },
  {
    id: "04-classes",
    title: "第 4 部 · 类与对象（Android 高频）",
    lessons: [
      {
        title: "类 & 构造函数",
        num: "4.1",
        slug: "04-classes/classes",
        summary: "主构造函数、次构造函数与 init 块。",
        deep: true,
      },
      {
        title: "继承",
        num: "4.2",
        slug: "04-classes/inheritance",
        summary: "open / override 的强制性与 Any。",
        deep: true,
      },
      {
        title: "属性",
        num: "4.3",
        slug: "04-classes/properties",
        summary: "属性 = 字段 + getter/setter，Kotlin 只暴露属性。",
        deep: true,
      },
      {
        title: "接口 & 函数式（SAM）接口",
        num: "4.4",
        slug: "04-classes/interfaces",
        summary: "接口默认实现，以及 fun interface 与 SAM 转换。",
        deep: true,
      },
      {
        title: "可见性修饰符",
        num: "4.5",
        slug: "04-classes/visibility-modifiers",
        summary: "public 是默认值，internal 是新东西。",
        deep: true,
      },
      {
        title: "扩展（扩展函数 / 扩展属性）",
        num: "4.6",
        slug: "04-classes/extensions",
        summary: "给不能改的类加方法，Android 里的高频武器。",
        deep: true,
      },
      {
        title: "数据类 data class",
        num: "4.7",
        slug: "04-classes/data-classes",
        summary: "自动生成 equals/hashCode/toString/copy/componentN。",
        deep: true,
      },
      {
        title: "密封类与密封接口 sealed",
        num: "4.8",
        slug: "04-classes/sealed-classes",
        summary: "受限继承层级 + when 穷尽检查，UI State 建模的标准答案。",
        deep: true,
        star: true,
      },
      {
        title: "泛型：in / out / where",
        num: "4.9",
        slug: "04-classes/generics",
        summary: "声明处型变，比 Java 的通配符更好用。",
        deep: true,
      },
      {
        title: "枚举类",
        num: "4.10",
        slug: "04-classes/enum-classes",
        summary: "枚举常量、带属性的枚举与 entries。",
        deep: true,
      },
      {
        title: "内联类 value class",
        num: "4.11",
        slug: "04-classes/value-classes",
        summary: "零成本的类型安全包装。",
        deep: true,
      },
      {
        title: "对象表达式与对象声明（object / companion）",
        num: "4.12",
        slug: "04-classes/object-declarations",
        summary: "object 一个关键字承担了匿名内部类、单例和静态成员三件事。",
        deep: true,
      },
      {
        title: "委托 & 属性委托（by lazy / observable）",
        num: "4.13",
        slug: "04-classes/delegation",
        summary: "by 关键字：类委托与属性委托。",
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: "05-functional",
    title: "第 5 部 · 函数式编程",
    lessons: [
      {
        title: "函数进阶",
        num: "5.1",
        slug: "05-functional/functions-advanced",
        summary: "中缀、尾递归、vararg 与函数引用。",
        deep: true,
      },
      {
        title: "Lambda & 高阶函数",
        num: "5.2",
        slug: "05-functional/lambdas",
        summary: "函数类型是一等公民。",
        deep: true,
      },
      {
        title: "内联函数 inline",
        num: "5.3",
        slug: "05-functional/inline-functions",
        summary: "消除 lambda 的对象开销，并解锁非局部返回与 reified。",
        deep: true,
      },
      {
        title: "操作符重载",
        num: "5.4",
        slug: "05-functional/operator-overloading",
        summary: "约定优于配置：operator 关键字。",
        deep: true,
      },
    ],
  },
  {
    id: "06-null-safety",
    title: "第 6 部 · 空安全 & 相等性",
    lessons: [
      {
        title: "空安全深入（?. / ?: / !! / let）",
        num: "6.1",
        slug: "06-null-safety/null-safety",
        summary: "把 1.2 的世界观落到每一种具体写法。",
        deep: true,
        star: true,
      },
      {
        title: "相等性（== / ===）",
        num: "6.2",
        slug: "06-null-safety/equality",
        summary: "Kotlin 的 == 就是 equals。",
        deep: true,
      },
      {
        title: "this 表达式",
        num: "6.3",
        slug: "06-null-safety/this-expressions",
        summary: "限定 this 与作用域函数里的接收者。",
        deep: true,
      },
    ],
  },
  {
    id: "07-collections",
    title: "第 7 部 · 集合（Android 每天用）",
    lessons: [
      {
        title: "集合概述 & 构造",
        num: "7.1",
        slug: "07-collections/overview",
        summary: "只读接口与可变接口的分离。",
        deep: true,
      },
      {
        title: "转换 / 过滤 / 映射",
        num: "7.2",
        slug: "07-collections/transformations",
        summary: "map / filter / flatMap 等最常用的一组。",
        deep: true,
      },
      {
        title: "分组 / 排序 / 聚合",
        num: "7.3",
        slug: "07-collections/grouping-sorting-aggregation",
        summary: "groupBy、sortedBy、fold/reduce。",
        deep: true,
      },
      {
        title: "List / Set / Map 操作",
        num: "7.4",
        slug: "07-collections/list-set-map",
        summary: "各集合类型特有的 API。",
        deep: true,
      },
      {
        title: "序列 Sequence",
        num: "7.5",
        slug: "07-collections/sequences",
        summary: "惰性求值，对应 Java Stream。",
        deep: true,
      },
      {
        title: "作用域函数 let / run / with / apply / also",
        num: "7.6",
        slug: "07-collections/scope-functions",
        summary: "五个函数、两个维度，选择有章可循。",
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: "08-coroutines",
    title: "第 8 部 · 协程（重头戏）",
    lessons: [
      {
        title: "异步编程技术概览",
        num: "8.1",
        slug: "08-coroutines/async-overview",
        summary: "从 Thread / Handler / RxJava 到协程。",
        deep: true,
      },
      {
        title: "协程基础",
        num: "8.2",
        slug: "08-coroutines/basics",
        summary: "suspend、CoroutineScope、launch 与 async。",
        deep: true,
        star: true,
      },
      {
        title: "取消与超时",
        num: "8.3",
        slug: "08-coroutines/cancellation-and-timeouts",
        summary: "协作式取消是最容易踩坑的地方。",
        deep: true,
      },
      {
        title: "组合挂起函数",
        num: "8.4",
        slug: "08-coroutines/composing-suspending-functions",
        summary: "顺序、并发与惰性启动。",
        deep: true,
      },
      {
        title: "协程上下文与调度器（Android 主线程 / IO）",
        num: "8.5",
        slug: "08-coroutines/context-and-dispatchers",
        summary: "Dispatchers 决定代码跑在哪个线程。",
        deep: true,
        star: true,
      },
      {
        title: "异步流 Flow",
        num: "8.6",
        slug: "08-coroutines/flow",
        summary: "协程版的响应式流，Android 数据层的主力。",
        deep: true,
        star: true,
      },
      {
        title: "通道 Channel",
        num: "8.7",
        slug: "08-coroutines/channels",
        summary: "协程之间的通信管道。",
        deep: true,
      },
      {
        title: "异常处理",
        num: "8.8",
        slug: "08-coroutines/exception-handling",
        summary: "异常沿协程树传播的规则。",
        deep: true,
        star: true,
      },
      {
        title: "共享状态与并发",
        num: "8.9",
        slug: "08-coroutines/shared-mutable-state",
        summary: "协程里的线程安全问题依然存在。",
        deep: true,
      },
    ],
  },
  {
    id: "09-advanced",
    title: "第 9 部 · 进阶专题",
    lessons: [
      {
        title: "注解",
        num: "9.1",
        slug: "09-advanced/annotations",
        summary: "声明注解与使用处目标。",
      },
      {
        title: "反射",
        num: "9.2",
        slug: "09-advanced/reflection",
        summary: "KClass、属性引用与 Android 上的代价。",
      },
      {
        title: "解构声明",
        num: "9.3",
        slug: "09-advanced/destructuring",
        summary: "val (a, b) = pair 背后的 componentN 约定。",
      },
      {
        title: "类型安全构建器（DSL）",
        num: "9.4",
        slug: "09-advanced/type-safe-builders",
        summary: "带接收者的 lambda 撑起 Kotlin DSL。",
      },
    ],
  },
  {
    id: "appendix",
    title: "附录",
    lessons: [
      {
        title: "Java → Kotlin 迁移对照",
        slug: "appendix/java-to-kotlin",
        summary: "字符串 / 集合 / 可空性的逐项对照表。",
      },
      {
        title: "扩展参考（仅链回官方）",
        slug: "appendix/further-reading",
        summary: "KMP / Native / JS / Wasm / Spring 等本站不覆盖的方向。",
      },
    ],
  },
]

/** 扁平化后的课程列表，用于上一页 / 下一页导航 */
export const flatLessons: Lesson[] = toc.flatMap((p) => p.lessons)

export function findLesson(slug: string): Lesson | undefined {
  return flatLessons.find((l) => l.slug === slug)
}

export function findPart(slug: string): Part | undefined {
  return toc.find((p) => p.lessons.some((l) => l.slug === slug))
}

export function lessonLabel(lesson: Lesson): string {
  return lesson.num ? `${lesson.num} ${lesson.title}` : lesson.title
}

export function neighbours(slug: string): { prev?: Lesson; next?: Lesson } {
  const i = flatLessons.findIndex((l) => l.slug === slug)
  if (i === -1) return {}
  return { prev: flatLessons[i - 1], next: flatLessons[i + 1] }
}
