/**
 * 单一数据源：章节大纲。
 *
 * 运行 `npm run gen` 会产出：
 *   - lib/toc.ts           侧边栏 / 上下页导航用的章节树
 *   - content/**\/*.mdx     每章一个 MDX（已存在的文件不会被覆盖）
 *   - content/registry.ts  slug -> 动态 import 的映射表（对 bundler 友好）
 *
 * 想「点亮」某一章：直接编辑对应的 content/**.mdx 即可，
 * 再次运行本脚本不会覆盖它。
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * @typedef {object} Lesson
 * @property {string} [num]       章节号，如 "1.2"
 * @property {string} title       标题
 * @property {string} slug        目录内的文件名（不含扩展名）
 * @property {string} summary     一句话简介
 * @property {string[]} outline   学习提纲
 * @property {string} javaNote    与 Java/Android 的关键差异（一句话）
 * @property {string} [official]  官方文档 slug
 * @property {boolean} [deep]     是否已精讲
 * @property {boolean} [star]     是否重点章节
 */

const parts = [
  {
    id: '00-start',
    title: '第 0 部 · 开始',
    lessons: [
      {
        title: '关于本书 / 如何使用本站',
        slug: 'about',
        summary: '这个站是什么、为谁写的、怎么用。',
        outline: ['本站的裁剪原则', '页面构成：精讲 / 骨架', '可运行代码块与练习题怎么用'],
        javaNote: '全站默认你已有 Java 与 Android 基础，只讲差异。',
        deep: true,
      },
      {
        title: 'Kotlin 入门 & 环境',
        slug: 'getting-started',
        summary: 'Android Studio 里的 Kotlin 工具链、版本与 Gradle 配置。',
        outline: [
          'Kotlin 版本与 Android Gradle Plugin 的对应关系',
          'kotlin-android / kotlin-kapt / KSP 的取舍',
          'jvmTarget、语言版本与 API 版本',
          '在 Android Studio 里用 Kotlin REPL / Scratch File 做实验',
        ],
        javaNote: 'Android 项目里 Kotlin 与 Java 可以逐文件共存，迁移不必一次到位。',
        official: 'getting-started',
        deep: true,
      },
      {
        title: 'Kotlin 之旅（精简）',
        slug: 'tour',
        summary: '30 分钟把语法过一遍，建立整体印象。',
        outline: ['Hello World 与 main', '变量、类型与字符串模板', '集合与 lambda 速览', '类与 null 安全速览'],
        javaNote: '先建立「Kotlin 长什么样」的直觉，细节留给后面各章。',
        official: 'kotlin-tour-welcome',
        deep: true,
      },
    ],
  },
  {
    id: '01-basics',
    title: '第 1 部 · 基础语法与思维',
    lessons: [
      {
        num: '1.1',
        title: '基本语法总览',
        slug: 'syntax-overview',
        summary: '包、函数、变量、注释、类型的书写形式。',
        outline: [
          '包声明与 import：目录结构不再强制对应包名',
          '顶层函数与顶层属性：告别 XxxUtils 静态类',
          '分号可省略、表达式优先的语法风格',
          '注释与 KDoc',
        ],
        javaNote: '最直观的差异：类型写在名字后面、没有 new、分号可省。',
        official: 'basic-syntax',
        deep: true,
      },
      {
        num: '1.2',
        title: 'val/var、类型推断、空安全世界观',
        slug: 'val-var-null-safety',
        summary: '从 Java 转 Kotlin 最需要重塑的三件事。',
        outline: ['val vs var', '类型推断与显式类型', '可空类型与安全调用', '智能转换 smart cast'],
        javaNote: 'null 从运行时问题变成编译期问题，这是思维方式的改变。',
        official: 'null-safety',
        deep: true,
      },
      {
        num: '1.3',
        title: '函数 & 单表达式函数',
        slug: 'functions',
        summary: '默认参数、具名实参、单表达式函数。',
        outline: [
          '默认参数 + 具名实参如何干掉方法重载与 Builder',
          '单表达式函数 `fun f() = ...`',
          'Unit 与 Nothing',
          '局部函数与嵌套',
          '@JvmOverloads：给 Java 侧留后门',
        ],
        javaNote: 'Android 自定义 View 的三个构造函数重载，可以用默认参数收敛成一个。',
        official: 'functions',
        deep: true,
      },
      {
        num: '1.4',
        title: '习惯用法（idioms 速查）',
        slug: 'idioms',
        summary: '写得像 Kotlin，而不是「用 Kotlin 语法写 Java」。',
        outline: ['常用 idiom 速查表', 'if/when 作为表达式返回值', '集合链式操作替代 for 循环', 'apply / also 构建对象'],
        javaNote: '判断代码是否「Kotlin 味」的一组参照。',
        official: 'idioms',
        deep: true,
      },
      {
        num: '1.5',
        title: '编码规范',
        slug: 'coding-conventions',
        summary: '官方风格指南与团队落地。',
        outline: ['命名与文件组织', '格式化与 ktlint / detekt', '表达式体 vs 块体的取舍', 'Android 项目里的实践建议'],
        javaNote: '官方规范比 Java 更强调「短、表达式化」。',
        official: 'coding-conventions',
        deep: true,
      },
    ],
  },
  {
    id: '02-types',
    title: '第 2 部 · 类型系统',
    lessons: [
      {
        num: '2.1',
        title: '基本类型 / 数字 / 布尔 / 字符',
        slug: 'basic-types',
        summary: 'Kotlin 里没有 primitive 与 wrapper 的语法区分。',
        outline: [
          'Int/Long/Double… 与 JVM 装箱的实际行为',
          '没有隐式加宽转换：必须显式 toLong()',
          '无符号类型 UInt/ULong',
          '字面量、下划线分隔与位运算 shl/and/or',
          'Char 不再是数字',
        ],
        javaNote: 'Java 的 int 与 Integer 在 Kotlin 里都写作 Int，装箱由编译器根据可空性决定。',
        official: 'basic-types',
        deep: true,
      },
      {
        num: '2.2',
        title: '字符串 & 字符串模板',
        slug: 'strings',
        summary: '模板字符串、原始字符串与常用 API 对照。',
        outline: [
          '字符串模板 `$name` / `${expr}`',
          '原始字符串 """ 与 trimIndent()',
          'Java StringBuilder / String.format 的 Kotlin 写法',
          '常用扩展：isNullOrEmpty、isBlank、substringAfter…',
        ],
        javaNote: '字符串拼接与 String.format 基本可以被模板完全取代。',
        official: 'strings',
        deep: true,
      },
      {
        num: '2.3',
        title: '数组',
        slug: 'arrays',
        summary: 'Array<T> 与 IntArray 的区别，以及为什么日常应该用 List。',
        outline: [
          '`Array<T>` vs `IntArray`/`LongArray`（装箱差异）',
          'arrayOf / IntArray(n) { } 的构造方式',
          'vararg 与展开运算符 `*`',
          '数组不支持型变：`Array<String>` 不是 `Array<Any>`',
        ],
        javaNote: 'Android 里除性能敏感场景外，几乎总应该用 List 而不是数组。',
        official: 'arrays',
        deep: true,
      },
      {
        num: '2.4',
        title: '类型检测与转换（is / as / smart cast）',
        slug: 'type-checks-and-casts',
        summary: 'is / as / as? 与智能转换的边界。',
        outline: [
          'is / !is 与自动的智能转换 smart cast',
          '不安全转换 as 与安全转换 as?',
          'smart cast 失效的场景（var 属性、跨模块的 open 属性）',
          '泛型擦除与 reified 的关系',
        ],
        javaNote: 'instanceof 之后不用再手写一次强转，但 smart cast 有它的前提条件。',
        official: 'typecasts',
        deep: true,
      },
    ],
  },
  {
    id: '03-control-flow',
    title: '第 3 部 · 控制流程',
    lessons: [
      {
        num: '3.1',
        title: '条件与循环（if/when 表达式、for、区间 range）',
        slug: 'conditions-and-loops',
        summary: 'if 和 when 都是表达式，这改变了写法。',
        outline: [
          'if 作为表达式：取代三元运算符',
          'when 的四种形态（值、区间、类型、无参条件链）',
          'when 的穷尽性 exhaustive 与 sealed 的配合',
          'for + 区间 range：until / downTo / step / indices',
          '为什么 Kotlin 没有 C 风格 for',
        ],
        javaNote: 'switch 升级成 when：可匹配类型、区间、任意布尔条件，且有返回值。',
        official: 'control-flow',
        deep: true,
      },
      {
        num: '3.2',
        title: '返回与跳转（label、break/continue）',
        slug: 'returns-and-jumps',
        summary: '标签、限定返回，以及 lambda 里 return 的坑。',
        outline: [
          '三种跳转：return / break / continue',
          '标签 label@ 与限定 break',
          'lambda 中的 return 是「非局部返回」',
          'return@forEach / return@label 的用法',
        ],
        javaNote: 'lambda 里直接 return 会返回外层函数，这是 Java 匿名类没有的行为。',
        official: 'returns',
        deep: true,
      },
      {
        num: '3.3',
        title: '异常',
        slug: 'exceptions',
        summary: 'Kotlin 没有受检异常（checked exception）。',
        outline: [
          'try 是表达式，可以有返回值',
          '没有 checked exception 带来的影响',
          '@Throws 与 Java 互操作',
          'Nothing 类型与 TODO()',
          'runCatching / Result 的取舍',
        ],
        javaNote: '不再被迫 try-catch，但与 Java 库互操作时要主动补 @Throws。',
        official: 'exceptions',
        deep: true,
      },
    ],
  },
  {
    id: '04-classes',
    title: '第 4 部 · 类与对象（Android 高频）',
    lessons: [
      {
        num: '4.1',
        title: '类 & 构造函数',
        slug: 'classes',
        summary: '主构造函数、次构造函数与 init 块。',
        outline: [
          '主构造函数：声明与赋值一步到位',
          'init 块的执行顺序',
          '次构造函数与 this(...) 委托',
          '默认 final：类要显式 open 才能被继承',
          '创建实例不需要 new',
        ],
        javaNote: '类和方法默认 final，这与 Java 默认可继承正好相反。',
        official: 'classes',
        deep: true,
      },
      {
        num: '4.2',
        title: '继承',
        slug: 'inheritance',
        summary: 'open / override 的强制性与 Any。',
        outline: [
          'Any 与 java.lang.Object 的区别',
          'open / override / final override',
          '覆盖属性',
          '派生类初始化顺序的陷阱',
          '接口冲突时的 `super<Base>.method()` 限定',
        ],
        javaNote: 'override 是关键字而非注解，忘写直接编译不过。',
        official: 'inheritance',
        deep: true,
      },
      {
        num: '4.3',
        title: '属性',
        slug: 'properties',
        summary: '属性 = 字段 + getter/setter，Kotlin 只暴露属性。',
        outline: [
          '幕后字段 field 与自定义访问器',
          'lateinit var：Android 里 View / 注入依赖的常用手段',
          '编译期常量 const val',
          '幕后属性模式（私有 MutableLiveData + 公开 LiveData）',
        ],
        javaNote: '不再手写 getter/setter；Android 的 findViewById 场景常配 lateinit。',
        official: 'properties',
        deep: true,
      },
      {
        num: '4.4',
        title: '接口 & 函数式（SAM）接口',
        slug: 'interfaces',
        summary: '接口默认实现，以及 fun interface 与 SAM 转换。',
        outline: [
          '接口可以有默认实现和抽象属性',
          '多接口默认实现冲突的解决',
          'fun interface：Kotlin 侧的单抽象方法接口',
          'SAM 转换：给 Java 接口传 lambda（如 OnClickListener）',
        ],
        javaNote: 'Java 接口能直接传 lambda，但 Kotlin 自己的接口需要声明 fun interface。',
        official: 'interfaces',
        deep: true,
      },
      {
        num: '4.5',
        title: '可见性修饰符',
        slug: 'visibility-modifiers',
        summary: 'public 是默认值，internal 是新东西。',
        outline: [
          '四种可见性：public / internal / protected / private',
          'internal = 模块内可见，对应 Gradle module',
          '顶层声明的 private = 文件内可见',
          '没有 package-private',
        ],
        javaNote: '默认是 public 而不是 package-private；internal 很适合多 module 的 Android 工程。',
        official: 'visibility-modifiers',
        deep: true,
      },
      {
        num: '4.6',
        title: '扩展（扩展函数 / 扩展属性）',
        slug: 'extensions',
        summary: '给不能改的类加方法，Android 里的高频武器。',
        outline: [
          '扩展函数的本质：静态方法 + 接收者参数',
          '静态解析：扩展不参与多态，不能覆盖成员函数',
          '扩展属性没有幕后字段',
          '可空接收者 `T?.` 扩展',
          'Android 实战：View.dp、Context.toast、ViewGroup.inflate',
        ],
        javaNote: 'Utils 静态方法的更好替代品；注意它是编译期静态分派。',
        official: 'extensions',
        deep: true,
      },
      {
        num: '4.7',
        title: '数据类 data class',
        slug: 'data-classes',
        summary: '自动生成 equals/hashCode/toString/copy/componentN。',
        outline: [
          '编译器生成了什么、没生成什么',
          'copy() 与不可变数据建模',
          '解构声明与 componentN',
          '只有主构造函数参数参与 equals 的坑',
          '与 Parcelable（@Parcelize）配合',
        ],
        javaNote: '一行顶掉 Java 的 POJO + Lombok；但要清楚 copy() 是浅拷贝。',
        official: 'data-classes',
        deep: true,
      },
      {
        num: '4.8',
        title: '密封类与密封接口 sealed',
        slug: 'sealed-classes',
        summary: '受限继承层级 + when 穷尽检查，UI State 建模的标准答案。',
        outline: [
          'sealed class / sealed interface 的限制范围',
          '与 when 配合的穷尽性检查',
          'sealed 与 enum 的选择',
          'Android 实战：用 sealed 建模 UiState（Loading/Success/Error）',
          '同一 package + module 的子类限制',
        ],
        javaNote: '比枚举更强：每个分支可以带不同的数据；新增分支时编译器会提醒所有 when。',
        official: 'sealed-classes',
        deep: true,
        star: true,
      },
      {
        num: '4.9',
        title: '泛型：in / out / where',
        slug: 'generics',
        summary: '声明处型变，比 Java 的通配符更好用。',
        outline: [
          '声明处型变 out（协变）/ in（逆变）',
          '与 Java `? extends` / `? super` 的对照',
          '类型投影与星投影 `*`',
          '泛型约束 where',
          'reified 与 inline：绕过类型擦除（如 `startActivity<T>()`）',
        ],
        javaNote: '型变从「每次使用都写通配符」变成「在声明处写一次」。',
        official: 'generics',
        deep: true,
      },
      {
        num: '4.10',
        title: '枚举类',
        slug: 'enum-classes',
        summary: '枚举常量、带属性的枚举与 entries。',
        outline: ['枚举常量与匿名类体', '实现接口的枚举', 'entries 取代 values()', '枚举 vs sealed 的选择'],
        javaNote: '和 Java 枚举很像；Android 上注意枚举的内存开销与 @IntDef 的取舍。',
        official: 'enum-classes',
        deep: true,
      },
      {
        num: '4.11',
        title: '内联类 value class',
        slug: 'value-classes',
        summary: '零成本的类型安全包装。',
        outline: [
          '@JvmInline value class 的语法',
          '运行时被擦除为底层类型',
          '什么时候会被迫装箱',
          '用它区分同为 String 的 UserId / OrderId',
        ],
        javaNote: '给基本类型套上语义又不付出对象开销，Java 没有对应物。',
        official: 'inline-classes',
        deep: true,
      },
      {
        num: '4.12',
        title: '对象表达式与对象声明（object / companion）',
        slug: 'object-declarations',
        summary: 'object 一个关键字承担了匿名内部类、单例和静态成员三件事。',
        outline: [
          '对象表达式 = 匿名内部类',
          '对象声明 object = 线程安全单例',
          'companion object 与「Kotlin 没有 static」',
          '@JvmStatic / @JvmField 的互操作',
          'object 单例与 Android 生命周期/内存泄漏',
        ],
        javaNote: 'static 成员统一由 companion object 承担，必要时用 @JvmStatic 给 Java 侧用。',
        official: 'object-declarations',
        deep: true,
      },
      {
        num: '4.13',
        title: '委托 & 属性委托（by lazy / observable）',
        slug: 'delegation',
        summary: 'by 关键字：类委托与属性委托。',
        outline: [
          '类委托：组合优于继承的语法糖',
          '属性委托的约定（getValue/setValue）',
          'by lazy 的三种线程安全模式',
          'Delegates.observable / vetoable / notNull',
          'Android 实战：by viewModels()、by viewBinding()',
        ],
        javaNote: 'Android 里 by viewModels()、by lazy 极其常用，值得吃透其原理。',
        official: 'delegated-properties',
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: '05-functional',
    title: '第 5 部 · 函数式编程',
    lessons: [
      {
        num: '5.1',
        title: '函数进阶',
        slug: 'functions-advanced',
        summary: '中缀、尾递归、vararg 与函数引用。',
        outline: ['infix 中缀函数', 'tailrec 尾递归优化', 'vararg 与展开', '函数引用 `::foo` 与绑定引用'],
        javaNote: '方法引用比 Java 更强：可以引用顶层函数、构造函数与属性。',
        official: 'functions',
        deep: true,
      },
      {
        num: '5.2',
        title: 'Lambda & 高阶函数',
        slug: 'lambdas',
        summary: '函数类型是一等公民。',
        outline: [
          '函数类型 `(Int) -> String` 与函数类型的可空性',
          'lambda 语法、it、尾随 lambda',
          '带接收者的函数字面量 `T.() -> Unit`（DSL 的基础）',
          '匿名函数与 lambda 的 return 差异',
          '闭包可以修改捕获的变量',
        ],
        javaNote: 'Java lambda 只能捕获 effectively final 变量，Kotlin 没有这个限制。',
        official: 'lambdas',
        deep: true,
      },
      {
        num: '5.3',
        title: '内联函数 inline',
        slug: 'inline-functions',
        summary: '消除 lambda 的对象开销，并解锁非局部返回与 reified。',
        outline: [
          'inline 做了什么、什么时候值得',
          'noinline 与 crossinline',
          '非局部返回的由来',
          'reified 类型参数',
          '滥用 inline 导致的包体积膨胀',
        ],
        javaNote: '这是 Kotlin 标准库大量高阶函数「零开销」的原因，也是 Android 上包体积需要留意的点。',
        official: 'inline-functions',
        deep: true,
      },
      {
        num: '5.4',
        title: '操作符重载',
        slug: 'operator-overloading',
        summary: '约定优于配置：operator 关键字。',
        outline: [
          '常用约定：plus / get / set / invoke / compareTo',
          '解构约定 componentN',
          '委托约定 getValue / setValue',
          '什么时候不该重载',
        ],
        javaNote: 'Java 没有操作符重载；Kotlin 通过固定命名约定实现，克制使用。',
        official: 'operator-overloading',
        deep: true,
      },
    ],
  },
  {
    id: '06-null-safety',
    title: '第 6 部 · 空安全 & 相等性',
    lessons: [
      {
        num: '6.1',
        title: '空安全深入（?. / ?: / !! / let）',
        slug: 'null-safety',
        summary: '把 1.2 的世界观落到每一种具体写法。',
        outline: [
          '安全调用链与 `?.let {}`',
          'Elvis `?:` 与提前返回 `?: return`',
          '`!!` 的合理使用场景（几乎没有）',
          '平台类型 `String!`：来自 Java 的隐患',
          '可空集合的三种含义：`List<T>?` / `List<T?>` / `List<T?>?`',
        ],
        javaNote: 'Android SDK 大量返回平台类型，注解不全时空安全会「漏气」。',
        official: 'null-safety',
        star: true,
        deep: true,
      },
      {
        num: '6.2',
        title: '相等性（== / ===）',
        slug: 'equality',
        summary: 'Kotlin 的 == 就是 equals。',
        outline: [
          '结构相等 == 编译为 equals（含 null 检查）',
          '引用相等 ===',
          '重写 equals 时必须同时重写 hashCode',
          '浮点数相等的特殊规则',
        ],
        javaNote: '和 Java 相反：== 是 equals，=== 才是引用比较。',
        official: 'equality',
        deep: true,
      },
      {
        num: '6.3',
        title: 'this 表达式',
        slug: 'this-expressions',
        summary: '限定 this 与作用域函数里的接收者。',
        outline: ['隐式接收者与作用域', '限定 this@Outer / this@label', '扩展函数中的 this', '嵌套 lambda 中 this 的歧义'],
        javaNote: 'Outer.this 变成 this@Outer；带接收者的 lambda 会引入新的隐式 this。',
        official: 'this-expressions',
        deep: true,
      },
    ],
  },
  {
    id: '07-collections',
    title: '第 7 部 · 集合（Android 每天用）',
    lessons: [
      {
        num: '7.1',
        title: '集合概述 & 构造',
        slug: 'overview',
        summary: '只读接口与可变接口的分离。',
        outline: [
          'List / MutableList 的接口分离（不是不可变，是只读）',
          'listOf / mutableListOf / buildList',
          '集合的型变：`List<out E>`',
          '与 Java 集合互操作时的只读「假象」',
        ],
        javaNote: 'Java 只有一套接口 + UnsupportedOperationException；Kotlin 在类型层面区分读写。',
        official: 'collections-overview',
        deep: true,
      },
      {
        num: '7.2',
        title: '转换 / 过滤 / 映射',
        slug: 'transformations',
        summary: 'map / filter / flatMap 等最常用的一组。',
        outline: [
          'map / mapNotNull / mapIndexed',
          'filter / filterNotNull / filterIsInstance',
          'flatMap / zip / associate',
          '每一步都会产生新集合的代价',
        ],
        javaNote: '不需要 stream()/collect()，集合上直接就有这些扩展函数。',
        official: 'collection-transformations',
        deep: true,
      },
      {
        num: '7.3',
        title: '分组 / 排序 / 聚合',
        slug: 'grouping-sorting-aggregation',
        summary: 'groupBy、sortedBy、fold/reduce。',
        outline: [
          'groupBy / groupingBy / partition',
          'sortedBy / sortedWith / compareBy 链式比较器',
          'fold / reduce / sumOf / maxByOrNull',
          'chunked / windowed',
        ],
        javaNote: 'Collectors.groupingBy 的等价物更短，比较器用 compareBy 组合。',
        official: 'collection-grouping',
        deep: true,
      },
      {
        num: '7.4',
        title: 'List / Set / Map 操作',
        slug: 'list-set-map',
        summary: '各集合类型特有的 API。',
        outline: [
          'List：索引访问、getOrNull、subList、二分查找',
          'Set：交并差 intersect / union / subtract',
          'Map：遍历、getOrElse、getOrPut、解构 (k, v)',
          '可变集合的原地操作 removeAll / retainAll',
        ],
        javaNote: 'Map 遍历可以直接解构成 (key, value)，比 entrySet() 干净很多。',
        official: 'list-operations',
        deep: true,
      },
      {
        num: '7.5',
        title: '序列 Sequence',
        slug: 'sequences',
        summary: '惰性求值，对应 Java Stream。',
        outline: [
          'asSequence() 与惰性求值',
          '中间操作 vs 末端操作',
          '什么时候 Sequence 才真的更快',
          '与 Flow 的关系与区别',
        ],
        javaNote: 'Sequence 对应 Stream，但小集合上直接用 List 操作通常更快。',
        official: 'sequences',
        deep: true,
      },
      {
        num: '7.6',
        title: '作用域函数 let / run / with / apply / also',
        slug: 'scope-functions',
        summary: '五个函数、两个维度，选择有章可循。',
        outline: [
          '两个维度：接收者是 it 还是 this、返回值是自身还是 lambda 结果',
          '五个函数的选择决策表',
          '典型场景：?.let 空安全、apply 配置对象、also 副作用',
          '嵌套滥用导致的可读性灾难',
          'takeIf / takeUnless',
        ],
        javaNote: 'Java 没有对应物；用好它能显著减少中间变量。',
        official: 'scope-functions',
        star: true,
        deep: true,
      },
    ],
  },
  {
    id: '08-coroutines',
    title: '第 8 部 · 协程（重头戏）',
    lessons: [
      {
        num: '8.1',
        title: '异步编程技术概览',
        slug: 'async-overview',
        summary: '从 Thread / Handler / RxJava 到协程。',
        outline: [
          'Android 上异步方案的演进：AsyncTask / Handler / RxJava / 协程',
          '回调地狱与「用同步的写法做异步的事」',
          '协程不是线程：它是可挂起的计算',
          '为什么 Android 官方全面转向协程',
        ],
        javaNote: '协程解决的是 CompletableFuture / RxJava 想解决的同一批问题，但写法是顺序的。',
        official: 'async-programming',
        deep: true,
      },
      {
        num: '8.2',
        title: '协程基础',
        slug: 'basics',
        summary: 'suspend、CoroutineScope、launch 与 async。',
        outline: [
          'suspend 函数的含义与编译后的 CPS 变换',
          'CoroutineScope / CoroutineContext / Job',
          'launch vs async',
          '结构化并发 structured concurrency',
          'Android 实战：viewModelScope / lifecycleScope',
        ],
        javaNote: '协程的核心不是并发原语，而是结构化并发带来的生命周期管理。',
        official: 'coroutines-basics',
        star: true,
        deep: true,
      },
      {
        num: '8.3',
        title: '取消与超时',
        slug: 'cancellation-and-timeouts',
        summary: '协作式取消是最容易踩坑的地方。',
        outline: [
          '取消是协作式的：isActive / ensureActive / yield',
          '不可取消的计算代码块',
          'finally 中的清理与 NonCancellable',
          'withTimeout / withTimeoutOrNull',
          'Android 实战：页面销毁时的自动取消',
        ],
        javaNote: '和 Thread.interrupt 类似是协作式的，但结构化并发让取消可以沿树传播。',
        official: 'cancellation-and-timeouts',
        deep: true,
      },
      {
        num: '8.4',
        title: '组合挂起函数',
        slug: 'composing-suspending-functions',
        summary: '顺序、并发与惰性启动。',
        outline: ['默认顺序执行', 'async 并发与 awaitAll', '惰性启动 CoroutineStart.LAZY', 'async 的结构化并发语义'],
        javaNote: '两个网络请求并发再合并，是 async/await 最典型的收益场景。',
        official: 'composing-suspending-functions',
        deep: true,
      },
      {
        num: '8.5',
        title: '协程上下文与调度器（Android 主线程 / IO）',
        slug: 'context-and-dispatchers',
        summary: 'Dispatchers 决定代码跑在哪个线程。',
        outline: [
          'Dispatchers.Main / IO / Default / Unconfined 的适用场景',
          'withContext 切换线程',
          'CoroutineContext 的元素组合（Job + Dispatcher + Name）',
          '主线程安全 main-safety：谁来负责切线程',
          'Android 实战：Repository 内部 withContext(IO)',
        ],
        javaNote: '取代 Handler/Looper 与线程池的显式管理，但线程模型仍需心里有数。',
        official: 'coroutine-context-and-dispatchers',
        star: true,
        deep: true,
      },
      {
        num: '8.6',
        title: '异步流 Flow',
        slug: 'flow',
        summary: '协程版的响应式流，Android 数据层的主力。',
        outline: [
          'Flow 的冷流特性与 collect 触发',
          '常用操作符：map / filter / transform / flatMapLatest',
          '背压与 buffer / conflate / collectLatest',
          'StateFlow 与 SharedFlow（热流）',
          'Android 实战：Room + Flow + repeatOnLifecycle 收集',
        ],
        javaNote: 'RxJava 的 Observable 对位，但取消与线程切换由协程上下文统一管理。',
        official: 'flow',
        star: true,
        deep: true,
      },
      {
        num: '8.7',
        title: '通道 Channel',
        slug: 'channels',
        summary: '协程之间的通信管道。',
        outline: ['Channel 的容量策略', 'produce / actor', 'Channel 与 Flow 的选择', '扇入扇出'],
        javaNote: '类似 BlockingQueue，但挂起而不阻塞线程。',
        official: 'channels',
        deep: true,
      },
      {
        num: '8.8',
        title: '异常处理',
        slug: 'exception-handling',
        summary: '异常沿协程树传播的规则。',
        outline: [
          'launch 与 async 的异常暴露时机不同',
          'Job vs SupervisorJob',
          'CoroutineExceptionHandler 的生效位置',
          'try/catch 在挂起函数里的正确用法',
          'CancellationException 的特殊性',
        ],
        javaNote: '最反直觉的一章：try/catch 包住 launch 是抓不到异常的。',
        official: 'exception-handling',
        star: true,
        deep: true,
      },
      {
        num: '8.9',
        title: '共享状态与并发',
        slug: 'shared-mutable-state',
        summary: '协程里的线程安全问题依然存在。',
        outline: ['问题复现：多协程修改同一变量', 'Mutex 与 withLock', '限定在单线程上下文中', '原子类与不可变数据的取舍'],
        javaNote: 'synchronized 会阻塞线程，协程里应该用 Mutex。',
        official: 'shared-mutable-state',
        deep: true,
      },
      {
        num: '8.10',
        title: '回调与协程互操作',
        slug: 'callback-interop',
        summary: '把回调式 API 桥接成挂起函数与 Flow。',
        outline: [
          'suspendCancellableCoroutine：一次性回调',
          'invokeOnCancellation 与取消传播',
          'callbackFlow：多次回调，awaitClose 注销监听',
          'trySend 与背压',
          'Android 实战：位置、传感器、TextWatcher',
          '优先使用官方协程适配库',
        ],
        javaNote: 'Android SDK 大量 API 仍是回调式的，这是协程落地的必备桥梁。',
        official: 'flow',
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: '09-advanced',
    title: '第 9 部 · 进阶专题',
    lessons: [
      {
        num: '9.1',
        title: '注解',
        slug: 'annotations',
        summary: '声明注解与使用处目标。',
        outline: [
          '声明注解与元注解',
          '使用处目标 @get: / @field: / @param:',
          '与 kapt / KSP 的关系',
          'Android 常见：@Parcelize、@Keep、@JvmStatic',
        ],
        javaNote: '属性会展开成字段+getter+setter，所以注解必须指明作用在谁身上。',
        official: 'annotations',
        deep: true,
      },
      {
        num: '9.2',
        title: '反射',
        slug: 'reflection',
        summary: 'KClass、属性引用与 Android 上的代价。',
        outline: ['KClass 与 java.lang.Class 的互转', '函数引用与属性引用', 'kotlin-reflect 的体积代价', 'Android 上尽量用 KSP 替代反射'],
        javaNote: 'kotlin-reflect 是独立依赖且不小，Android 上要谨慎引入。',
        official: 'reflection',
        deep: true,
      },
      {
        num: '9.3',
        title: '解构声明',
        slug: 'destructuring',
        summary: 'val (a, b) = pair 背后的 componentN 约定。',
        outline: ['componentN 约定', 'data class 与 Map 遍历中的解构', 'lambda 参数解构', '下划线跳过不需要的分量'],
        javaNote: '按位置而非按名字解构，重排主构造函数参数会静默改变语义。',
        official: 'destructuring-declarations',
        deep: true,
      },
      {
        num: '9.4',
        title: '类型安全构建器（DSL）',
        slug: 'type-safe-builders',
        summary: '带接收者的 lambda 撑起 Kotlin DSL。',
        outline: [
          '带接收者的函数字面量回顾',
          '构建器模式的 Kotlin 写法',
          '@DslMarker 避免作用域串味',
          '实例：Gradle KTS、Jetpack Compose 的写法来源',
        ],
        javaNote: 'Gradle KTS 和 Compose 都建立在这套机制上，理解它才能读懂它们。',
        official: 'type-safe-builders',
        deep: true,
      },
      {
        num: '9.5',
        title: 'context parameters（Kotlin 2.2）',
        slug: 'context-parameters',
        summary: '让依赖不进参数列表，也不绑定到类上。',
        outline: [
          '依赖传递的三种传统方式各自的代价',
          'context(name: Type) 的写法与调用约束',
          '与扩展接收者的语义差异',
          '相比旧 context receivers 的改进：上下文有名字',
          '现阶段该不该用',
        ],
        javaNote: 'Java 没有对应物；目前仍是预览特性，了解为主。',
        official: null,
        deep: true,
      },
    ],
  },
  {
    id: '10-jetpack',
    title: '第 10 部 · 从 Kotlin 看 Jetpack 与 Compose',
    lessons: [
      {
        num: '10.1',
        title: 'Compose 为什么长这样',
        slug: 'compose-foundations',
        summary: '@Composable、嵌套 DSL、默认参数——全是已学过的 Kotlin 特性。',
        outline: [
          '@Composable 与 suspend 是同一类编译器改写',
          '嵌套 UI = 带接收者 lambda + 尾随 lambda',
          'ColumnScope 让 weight 只在对的地方可用',
          '默认参数取代 Builder，modifier 的位置约定',
          '组件即函数带来的后果',
        ],
        javaNote: '组件是函数不是类，Kotlin 的函数特性可以直接复用。',
        deep: true,
        star: true,
      },
      {
        num: '10.2',
        title: '状态、remember 与 Flow',
        slug: 'compose-state',
        summary: 'by remember 就是属性委托，collectAsStateWithLifecycle 就是 repeatOnLifecycle。',
        outline: [
          'by remember 拆成三层：属性委托 + 缓存 + 可观察容器',
          'remember 的 key 依赖 equals',
          'rememberSaveable 与进程重建',
          'collectAsStateWithLifecycle 与后台停止收集',
          '状态提升与单向数据流',
          'LaunchedEffect 是绑定组合期的协程作用域',
        ],
        javaNote: 'Compose 的状态 API 全部建立在属性委托与 Flow 之上。',
        deep: true,
        star: true,
      },
      {
        num: '10.3',
        title: '稳定性、重组与不可变数据',
        slug: 'compose-stability',
        summary: '「明明数据没变却一直重组」的根因全在 Kotlin 侧。',
        outline: [
          '稳定 stable 的三个条件',
          'var 属性与 List 接口为什么不稳定',
          'lambda 捕获导致的重组',
          'LazyColumn 的 key 与 DiffUtil 是同一件事',
          '编译器报告与强跳过模式',
        ],
        javaNote: '不可变性从「风格建议」升级成了「性能要求」。',
        deep: true,
        star: true,
      },
      {
        num: '10.4',
        title: 'Modifier：扩展函数与不可变链',
        slug: 'modifier',
        summary: '为什么顺序会影响结果——它就是一个有序的不可变列表。',
        outline: [
          'companion object 实现自身接口的巧用',
          '扩展函数 + then 构成不可变链',
          '顺序即列表顺序：padding 与 background',
          '自定义 Modifier 扩展与 thenIf',
          'ColumnScope 内的扩展函数（双接收者）',
          'modifier 参数的三条约定',
        ],
        javaNote: '扩展函数 + 不可变构建器的教科书级应用。',
        deep: true,
      },
      {
        num: '10.5',
        title: 'ViewModel、作用域与 Hilt',
        slug: 'viewmodel-and-di',
        summary: 'viewModelScope、by viewModels()、构造函数注入的 Kotlin 机制。',
        outline: [
          'viewModelScope 的三个设计决策',
          'by viewModels() = inline + reified + Lazy',
          '@Inject constructor 为什么不能省 constructor',
          '@Binds 为什么要 abstract class',
          '注入 Dispatcher 与可测试性',
          'SavedStateHandle 与进程重建',
        ],
        javaNote: 'Hilt 的 API 设计大量依赖构造函数注入与属性委托。',
        deep: true,
      },
      {
        num: '10.6',
        title: '数据层：Room / DataStore / Paging 与 Flow',
        slug: 'data-layer',
        summary: 'Jetpack 数据层全部以 Flow 为核心。',
        outline: [
          '单一数据源：UI 只观察数据库',
          'Room 的三种返回类型与为什么 Flow 不加 suspend',
          '分层数据模型与扩展函数映射',
          'kotlinx.serialization 优于 Gson',
          'DataStore 用类型杜绝主线程 I/O',
          'Paging 3 与 cachedIn',
          '用 sealed 建模错误',
        ],
        javaNote: '现代 Jetpack 数据层的 API 全是 suspend 与 Flow。',
        deep: true,
        star: true,
      },
      {
        num: '10.7',
        title: 'Navigation 与类型安全路由',
        slug: 'navigation',
        summary: '字符串路由到 @Serializable data class 的演进。',
        outline: [
          '字符串路由的三个问题',
          '类型安全路由用到的三个 Kotlin 特性',
          '为什么用 kotlinx.serialization 而不是 Parcelable',
          '用 sealed 组织路由获得穷尽性检查',
          'ViewModel 不该持有 NavController',
          '嵌套导航图与共享 ViewModel',
        ],
        javaNote: '类型安全路由把拼错字符串从运行时崩溃变成编译错误。',
        deep: true,
      },
      {
        num: '10.8',
        title: '测试：协程、Flow 与 Compose',
        slug: 'testing',
        summary: '虚拟时间让异步逻辑变成可精确断言的东西。',
        outline: [
          'runTest 与虚拟时钟',
          '注入 Dispatcher 在这里兑现',
          'Standard vs Unconfined TestDispatcher',
          'Dispatchers.setMain 与 ViewModel 测试',
          'Turbine 测试 Flow',
          'Fake 优于 Mock 的四条理由',
          'StateFlow 会跳过中间值',
        ],
        javaNote: '虚拟时间让「防抖 300ms」这类时序逻辑可以被精确断言。',
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: 'appendix',
    title: '附录',
    lessons: [
      {
        title: 'Java → Kotlin 迁移对照',
        slug: 'java-to-kotlin',
        summary: '字符串 / 集合 / 可空性的逐项对照表。',
        outline: ['字符串操作对照', '集合操作对照', '可空性与平台类型', '互操作注解速查（@JvmStatic/@JvmField/@JvmOverloads/@Throws）'],
        javaNote: '迁移时最常查的一页。',
        official: 'java-to-kotlin-interop',
        deep: true,
      },
      {
        title: '扩展参考（仅链回官方）',
        slug: 'further-reading',
        summary: 'KMP / Native / JS / Wasm / Spring 等本站不覆盖的方向。',
        outline: ['本站的裁剪边界', '官方文档入口', '进一步学习的方向'],
        javaNote: '这些方向与 Android 原生学习目标关系不大，只留入口。',
        deep: true,
      },
    ],
  },
]

// ---------------------------------------------------------------------------

const officialUrls = (official) =>
  official
    ? [
        `- 官方中文：[${official}](https://book.kotlincn.net/text/${official}.html)`,
        `- 官方英文：[${official}](https://kotlinlang.org/docs/${official}.html)`,
      ].join('\n')
    : '- 本页无对应的官方章节。'

function skeleton(part, lesson) {
  const heading = lesson.num ? `${lesson.num} ${lesson.title}` : lesson.title
  return `<Callout type="note">
**骨架页**：本页已经列出学习提纲与官方对照入口，精讲内容待点亮。
如果你正在跟着这个站系统过一遍，可以在聊天里说「点亮 ${heading}」，
由 Claude 产出这一章的 MDX 再替换本文件。
</Callout>

## 学习提纲

${lesson.outline.map((o) => `- ${o}`).join('\n')}

## 与 Java / Android 的关键差异

${lesson.javaNote}

## 官方参考

${officialUrls(lesson.official)}
`
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

const q = (s) => JSON.stringify(s)

async function main() {
  const registryLines = []
  const tocParts = []
  let written = 0
  let skipped = 0

  for (const part of parts) {
    const lessonEntries = []
    for (const lesson of part.lessons) {
      const slug = `${part.id}/${lesson.slug}`
      const file = join(ROOT, 'content', `${slug}.mdx`)

      if (await exists(file)) {
        skipped++
      } else {
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, skeleton(part, lesson), 'utf8')
        written++
      }

      registryLines.push(`  ${q(slug)}: () => import(${q(`./${slug}.mdx`)}),`)
      lessonEntries.push(
        `      {\n` +
          `        title: ${q(lesson.title)},\n` +
          (lesson.num ? `        num: ${q(lesson.num)},\n` : '') +
          `        slug: ${q(slug)},\n` +
          `        summary: ${q(lesson.summary)},\n` +
          (lesson.deep ? `        deep: true,\n` : '') +
          (lesson.star ? `        star: true,\n` : '') +
          `      },`,
      )
    }
    tocParts.push(
      `  {\n    id: ${q(part.id)},\n    title: ${q(part.title)},\n    lessons: [\n${lessonEntries.join('\n')}\n    ],\n  },`,
    )
  }

  const tocFile = `// 本文件由 scripts/gen-content.mjs 生成，请勿手工编辑。
// 修改章节大纲请编辑 scripts/gen-content.mjs 后运行 \`npm run gen\`。

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
${tocParts.join('\n')}
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
  return lesson.num ? \`\${lesson.num} \${lesson.title}\` : lesson.title
}

export function neighbours(slug: string): { prev?: Lesson; next?: Lesson } {
  const i = flatLessons.findIndex((l) => l.slug === slug)
  if (i === -1) return {}
  return { prev: flatLessons[i - 1], next: flatLessons[i + 1] }
}
`

  const registryFile = `// 本文件由 scripts/gen-content.mjs 生成，请勿手工编辑。
// 使用静态字符串字面量的动态 import，便于 bundler 做代码分割。
import type { ComponentType } from 'react'

type MdxModule = { default: ComponentType }

export const registry: Record<string, () => Promise<MdxModule>> = {
${registryLines.join('\n')}
}
`

  await writeFile(join(ROOT, 'lib', 'toc.ts'), tocFile, 'utf8')
  await writeFile(join(ROOT, 'content', 'registry.ts'), registryFile, 'utf8')

  console.log(
    `lib/toc.ts + content/registry.ts 已生成；MDX 新建 ${written} 个，跳过已存在 ${skipped} 个（共 ${written + skipped}）。`,
  )
}

main()
