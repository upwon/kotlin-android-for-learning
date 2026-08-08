// 本文件由 scripts/gen-content.mjs 生成，请勿手工编辑。
// 修改章节大纲请编辑 scripts/gen-content.mjs 后运行 `npm run gen`。

export type Lesson = {
  /** 章节号，如 "2.5"；第 0 部与附录部分没有编号 */
  num?: string
  title: string
  /** 形如 "02-app-server/transports"，同时是路由与 content 下的文件路径 */
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
        title: "关于本站 / 怎么读",
        slug: "00-start/about",
        summary: "这个站是什么、为谁写的、按什么顺序读。",
        deep: true,
      },
      {
        title: "把 Codex 跑起来、断点打起来",
        slug: "00-start/build-and-run",
        summary: "本地构建、日志、以及 codex debug 这一套自带的观测工具。",
        deep: true,
      },
      {
        num: "0.3",
        title: "仓库地图：一百多个 crate 怎么分层",
        slug: "00-start/repo-map",
        summary: "把 codex-rs 下的 crate 按职责分成六层，先建立坐标系。",
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: "01-overview",
    title: "第 1 部 · 全景",
    lessons: [
      {
        num: "1.1",
        title: "五个前端，一个内核",
        slug: "01-overview/surfaces",
        summary: "TUI、exec、IDE 扩展、桌面端、SDK 分别是怎么接进来的。",
        deep: true,
        star: true,
      },
      {
        num: "1.2",
        title: "一次 turn 的端到端生命周期",
        slug: "01-overview/turn-lifecycle",
        summary: "从你敲下回车，到 diff 落到工作区，中间经过哪些模块。",
        deep: true,
        star: true,
      },
      {
        num: "1.3",
        title: "三条协议：对内、对外、对模型",
        slug: "01-overview/three-protocols",
        summary: "app-server JSON-RPC、MCP、Responses API 各自管什么，别搞混。",
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: "02-app-server",
    title: "第 2 部 · app-server：所有前端的公共内核",
    lessons: [
      {
        num: "2.1",
        title: "为什么是 JSON-RPC 而不是 MCP",
        slug: "02-app-server/why-jsonrpc",
        summary: "app-server 借了 MCP 的形，没借它的神，代价与收益各是什么。",
        deep: true,
        star: true,
      },
      {
        num: "2.2",
        title: "四种 transport",
        slug: "02-app-server/transports",
        summary: "stdio、websocket、unix socket、off——各自服务于哪种前端。",
        deep: true,
      },
      {
        num: "2.3",
        title: "初始化握手与能力协商",
        slug: "02-app-server/initialize",
        summary: "initialize / initialized 两步，客户端在这里交代自己是谁。",
        deep: true,
      },
      {
        num: "2.4",
        title: "核心原语：thread / turn / item",
        slug: "02-app-server/primitives",
        summary: "协议里只有三个名词，先把它们的边界钉死。",
        deep: true,
        star: true,
      },
      {
        num: "2.5",
        title: "MessageProcessor：一条消息的分发路径",
        slug: "02-app-server/message-processor",
        summary: "app-server 的中枢，所有请求都从这里分岔。",
        deep: true,
        star: true,
      },
      {
        num: "2.6",
        title: "request_processors 一览",
        slug: "02-app-server/request-processors",
        summary: "四十来个处理器，按 thread / turn / config / fs / auth 分门别类。",
        deep: true,
      },
      {
        num: "2.7",
        title: "事件流：通知与 turn 事件",
        slug: "02-app-server/events",
        summary: "服务端主动推给前端的那一半协议。",
        deep: true,
        star: true,
      },
      {
        num: "2.8",
        title: "反向请求：审批、elicitation、用户输入",
        slug: "02-app-server/server-requests",
        summary: "服务端向客户端发起请求——这是 MCP 给不了、而 agent 必须要的能力。",
        deep: true,
        star: true,
      },
      {
        num: "2.9",
        title: "背压与过载",
        slug: "02-app-server/backpressure",
        summary: "有界队列、-32001，以及为什么反向请求永远不会被静默丢弃。",
        deep: true,
      },
      {
        num: "2.10",
        title: "in-process：TUI 反过来当客户端",
        slug: "02-app-server/in-process",
        summary: "同一套协议，去掉进程边界——这是 Codex 架构里最值得学的一手。",
        deep: true,
        star: true,
      },
      {
        num: "2.11",
        title: "协议怎么对外发布",
        slug: "02-app-server/schema-gen",
        summary: "generate-ts 与 generate-json-schema：schema 是从 Rust 类型生成的。",
        deep: true,
      },
      {
        num: "2.12",
        title: "experimental API 的门控",
        slug: "02-app-server/experimental",
        summary: "实验特性怎么在同一个协议里共存而不污染稳定面。",
        deep: true,
      },
      {
        num: "2.13",
        title: "daemon 与 remote control",
        slug: "02-app-server/daemon",
        summary: "app-server-daemon：让 app-server 活得比某一个前端更久。",
        deep: true,
      },
    ],
  },
  {
    id: "03-core",
    title: "第 3 部 · codex-core：对话内核",
    lessons: [
      {
        num: "3.1",
        title: "core 的边界与对外 API",
        slug: "03-core/core-map",
        summary: "三十万行的 crate 怎么下手：先分清 core / core-api / codex-api。",
      },
      {
        num: "3.2",
        title: "ThreadManager 与 CodexThread",
        slug: "03-core/thread-manager",
        summary: "谁持有会话、谁负责创建与回收。",
      },
      {
        num: "3.3",
        title: "Session / Turn / TurnContext",
        slug: "03-core/session-turn",
        summary: "内核里真正的主循环在这里。",
        star: true,
      },
      {
        num: "3.4",
        title: "上下文管理与 token 预算",
        slug: "03-core/context-manager",
        summary: "什么进上下文、什么被挤出去，规则都在这里。",
        star: true,
      },
      {
        num: "3.5",
        title: "compact：上下文压缩",
        slug: "03-core/compact",
        summary: "本地压缩与远端压缩两条路，以及降级策略。",
        star: true,
      },
      {
        num: "3.6",
        title: "与模型说话：client 与 Responses API",
        slug: "03-core/model-client",
        summary: "请求怎么拼、重试怎么做、provider 怎么切。",
        star: true,
      },
      {
        num: "3.7",
        title: "流式事件：从 SSE 到内核事件",
        slug: "03-core/streaming",
        summary: "模型吐字的那一路，怎么变成前端能画的东西。",
      },
      {
        num: "3.8",
        title: "rollout 与 thread-store：会话怎么落盘",
        slug: "03-core/rollout",
        summary: "可 resume、可 fork、可回放，靠的是这一层。",
        star: true,
      },
      {
        num: "3.9",
        title: "提示词从哪来：AGENTS.md、prompts、skills",
        slug: "03-core/prompt-assembly",
        summary: "模型看到的第一屏，是由五六个来源拼起来的。",
        star: true,
      },
      {
        num: "3.10",
        title: "review、plan 与多智能体",
        slug: "03-core/subagents",
        summary: "内核里那些「再开一个 agent」的路径。",
      },
    ],
  },
  {
    id: "04-tools",
    title: "第 4 部 · 工具层",
    lessons: [
      {
        num: "4.1",
        title: "工具注册表与 router",
        slug: "04-tools/registry",
        summary: "模型能看到哪些工具，是运行时算出来的。",
        star: true,
      },
      {
        num: "4.2",
        title: "orchestrator 与并行调用",
        slug: "04-tools/orchestrator",
        summary: "多个 tool call 同时回来时，谁先跑、谁能并行。",
      },
      {
        num: "4.3",
        title: "shell 与 unified_exec",
        slug: "04-tools/shell-exec",
        summary: "最重要也最危险的一个工具，链路最长。",
        star: true,
      },
      {
        num: "4.4",
        title: "apply_patch：自定义 diff 格式",
        slug: "04-tools/apply-patch",
        summary: "为什么不用 unified diff，以及这个格式怎么解析。",
        star: true,
      },
      {
        num: "4.5",
        title: "MCP 客户端：外部工具怎么进来",
        slug: "04-tools/mcp-client",
        summary: "Codex 作为 MCP client 的那一侧。",
      },
      {
        num: "4.6",
        title: "其它内置工具",
        slug: "04-tools/builtin-tools",
        summary: "web_search、图片、文件搜索、计划工具。",
      },
      {
        num: "4.7",
        title: "code-mode：让模型写代码来调工具",
        slug: "04-tools/code-mode",
        summary: "Codex 里最新也最激进的一条工具路径。",
        star: true,
      },
    ],
  },
  {
    id: "05-sandbox",
    title: "第 5 部 · 沙箱与安全",
    lessons: [
      {
        num: "5.1",
        title: "威胁模型与审批策略",
        slug: "05-sandbox/threat-model",
        summary: "沙箱防谁、不防谁，以及三档 ask-for-approval 的语义。",
        star: true,
      },
      {
        num: "5.2",
        title: "macOS：Seatbelt",
        slug: "05-sandbox/seatbelt",
        summary: "用 .sbpl 策略文件把子进程关起来。",
        star: true,
      },
      {
        num: "5.3",
        title: "Linux：Landlock 与 bwrap",
        slug: "05-sandbox/landlock",
        summary: "两条并存的路线，各自的能力边界。",
        star: true,
      },
      {
        num: "5.4",
        title: "Windows 沙箱",
        slug: "05-sandbox/windows-sandbox",
        summary: "受限令牌与读授权，Windows 上的等价物。",
      },
      {
        num: "5.5",
        title: "execpolicy：Starlark 写的命令策略",
        slug: "05-sandbox/execpolicy",
        summary: "在沙箱之前，先用规则判断这条命令该不该跑。",
        star: true,
      },
      {
        num: "5.6",
        title: "网络策略与代理",
        slug: "05-sandbox/network-policy",
        summary: "沙箱里的网络怎么被允许、被观测、被拦。",
      },
      {
        num: "5.7",
        title: "safety.rs：所有判断合流的地方",
        slug: "05-sandbox/safety",
        summary: "一条命令最终能不能跑，答案在这个文件里。",
        star: true,
      },
      {
        num: "5.8",
        title: "进程加固与凭据",
        slug: "05-sandbox/hardening",
        summary: "除了沙箱之外的那些防御措施。",
      },
    ],
  },
  {
    id: "06-cli-tui",
    title: "第 6 部 · CLI 与 TUI",
    lessons: [
      {
        num: "6.1",
        title: "codex 这个二进制",
        slug: "06-cli-tui/cli-entry",
        summary: "clap 子命令树，以及 arg0 多态这一手。",
        star: true,
      },
      {
        num: "6.2",
        title: "codex exec：非交互模式",
        slug: "06-cli-tui/exec",
        summary: "脚本与 CI 里用的那个形态。",
      },
      {
        num: "6.3",
        title: "TUI 架构",
        slug: "06-cli-tui/tui-arch",
        summary: "ratatui、事件循环、ChatWidget 与 history_cell。",
        star: true,
      },
      {
        num: "6.4",
        title: "TUI 如何消费 app-server",
        slug: "06-cli-tui/tui-app-server",
        summary: "把 2.10 那条线在前端这一侧走完。",
        star: true,
      },
      {
        num: "6.5",
        title: "渲染细节与终端兼容",
        slug: "06-cli-tui/tui-render",
        summary: "插入历史、换行、ANSI、终端探测。",
      },
      {
        num: "6.6",
        title: "登录：ChatGPT OAuth 与 API key",
        slug: "06-cli-tui/login",
        summary: "两种认证方式的实现与存储。",
      },
      {
        num: "6.7",
        title: "doctor 与 debug 工具箱",
        slug: "06-cli-tui/doctor",
        summary: "官方自带的诊断工具，也是最好的源码导览。",
      },
    ],
  },
  {
    id: "07-surfaces",
    title: "第 7 部 · 桌面端、IDE 与远程",
    lessons: [
      {
        num: "7.1",
        title: "codex app：桌面端",
        slug: "07-surfaces/desktop-app",
        summary: "CLI 怎么把桌面端拉起来，两者又怎么共享状态。",
        star: true,
      },
      {
        num: "7.2",
        title: "IDE 扩展的接入面",
        slug: "07-surfaces/ide",
        summary: "VS Code 扩展需要 app-server 提供什么。",
      },
      {
        num: "7.3",
        title: "remote control",
        slug: "07-surfaces/remote-control",
        summary: "让另一台机器上的 app-server 接受控制。",
      },
      {
        num: "7.4",
        title: "exec-server：把执行搬到远端",
        slug: "07-surfaces/exec-server",
        summary: "让命令与文件操作发生在另一个环境里。",
        star: true,
      },
      {
        num: "7.5",
        title: "cloud tasks",
        slug: "07-surfaces/cloud-tasks",
        summary: "与 Codex Web 的衔接：把云端任务拉回本地。",
      },
    ],
  },
  {
    id: "08-extensions",
    title: "第 8 部 · 扩展生态",
    lessons: [
      {
        num: "8.1",
        title: "Codex 作为 MCP server",
        slug: "08-extensions/as-mcp-server",
        summary: "反过来，把整个 Codex 暴露成别人的工具。",
      },
      {
        num: "8.2",
        title: "plugins",
        slug: "08-extensions/plugins",
        summary: "插件机制与 core-plugins。",
      },
      {
        num: "8.3",
        title: "skills",
        slug: "08-extensions/skills",
        summary: "SKILL.md 怎么被发现、加载、注入。",
        star: true,
      },
      {
        num: "8.4",
        title: "hooks",
        slug: "08-extensions/hooks",
        summary: "生命周期钩子：在关键节点插入自定义逻辑。",
      },
      {
        num: "8.5",
        title: "connectors 与 apps",
        slug: "08-extensions/connectors",
        summary: "把外部服务接进对话的两条路径。",
      },
      {
        num: "8.6",
        title: "memories",
        slug: "08-extensions/memories",
        summary: "跨会话记忆的读写两侧。",
      },
    ],
  },
  {
    id: "09-sdk",
    title: "第 9 部 · SDK 与自动化",
    lessons: [
      {
        num: "9.1",
        title: "TypeScript SDK",
        slug: "09-sdk/ts-sdk",
        summary: "官方 SDK 长什么样，以及它怎么映射到协议。",
        star: true,
      },
      {
        num: "9.2",
        title: "Python SDK",
        slug: "09-sdk/py-sdk",
        summary: "同一套协议的 Python 表达，以及 python-runtime。",
      },
      {
        num: "9.3",
        title: "npm 包与安装链路",
        slug: "09-sdk/npm-package",
        summary: "@openai/codex 装下来的到底是什么。",
      },
      {
        num: "9.4",
        title: "在 CI 里跑 Codex",
        slug: "09-sdk/ci",
        summary: "codex exec + 沙箱 + 审批策略的组合拳。",
      },
    ],
  },
  {
    id: "10-engineering",
    title: "第 10 部 · 工程实践",
    lessons: [
      {
        num: "10.1",
        title: "Cargo workspace 与 Bazel 双构建",
        slug: "10-engineering/build-system",
        summary: "一个仓库两套构建系统，为什么值得。",
        star: true,
      },
      {
        num: "10.2",
        title: "测试策略",
        slug: "10-engineering/testing",
        summary: "单测、快照、以及协议级的 test client。",
        star: true,
      },
      {
        num: "10.3",
        title: "遥测与可观测性",
        slug: "10-engineering/telemetry",
        summary: "otel、analytics、rollout-trace 三条线。",
      },
      {
        num: "10.4",
        title: "发布与分发",
        slug: "10-engineering/release",
        summary: "多平台产物、安装脚本、版本与更新。",
      },
      {
        num: "10.5",
        title: "读 AGENTS.md",
        slug: "10-engineering/agents-md",
        summary: "这个仓库写给贡献者和 agent 的两万字规约。",
        star: true,
      },
    ],
  },
  {
    id: "appendix",
    title: "附录",
    lessons: [
      {
        title: "crate 速查表",
        slug: "appendix/crate-index",
        summary: "按字母序列出主要 crate 与一句话职责。",
      },
      {
        title: "术语表",
        slug: "appendix/glossary",
        summary: "thread / turn / item / rollout / skill / hook … 一次讲清。",
      },
      {
        title: "调试配方",
        slug: "appendix/debug-recipes",
        summary: "十来个「想看 X 该怎么办」的具体做法。",
      },
      {
        title: "给 Rust 不熟的读者",
        slug: "appendix/rust-primer",
        summary: "读这个仓库真正会挡路的那几个 Rust 概念。",
      },
    ],
  },
]

export const flatLessons: Lesson[] = toc.flatMap((part) => part.lessons)

export function lessonLabel(lesson: Lesson): string {
  return lesson.num ? `${lesson.num} ${lesson.title}` : lesson.title
}

export function findLesson(slug: string): Lesson | undefined {
  return flatLessons.find((lesson) => lesson.slug === slug)
}

export function findPart(slug: string): Part | undefined {
  return toc.find((part) => part.lessons.some((lesson) => lesson.slug === slug))
}

export function neighbours(slug: string): { prev?: Lesson; next?: Lesson } {
  const index = flatLessons.findIndex((lesson) => lesson.slug === slug)
  if (index < 0) return {}
  return { prev: flatLessons[index - 1], next: flatLessons[index + 1] }
}
