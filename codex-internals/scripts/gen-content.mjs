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
 *
 * 每章都带一份 `sources`：这个站的立场是「所有结论都能当场去源码验证」，
 * 所以骨架页也会先把该读哪几个文件摆出来——即使正文还没写，
 * 这一页对读者也已经是有用的。
 */
import { mkdir, writeFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * @typedef {object} SourceRef
 * @property {string} path  仓库根目录起算的路径
 * @property {string} note  一句话说明这个文件是干什么的
 * @property {boolean} [dir] 是否是目录
 */

/**
 * @typedef {object} Lesson
 * @property {string} [num]        章节号，如 "2.5"
 * @property {string} title        标题
 * @property {string} slug         目录内的文件名（不含扩展名）
 * @property {string} summary      一句话简介
 * @property {string[]} outline    学习提纲
 * @property {string} takeaway     这一章最该记住的一句话
 * @property {SourceRef[]} sources 对应源码
 * @property {boolean} [deep]      是否已精讲
 * @property {boolean} [star]      是否重点章节
 */

const parts = [
  {
    id: '00-start',
    title: '第 0 部 · 开始',
    lessons: [
      {
        title: '关于本站 / 怎么读',
        slug: 'about',
        summary: '这个站是什么、为谁写的、按什么顺序读。',
        outline: [
          '为什么值得读 Codex：它是少见的、生产级 agent 的完整开源实现',
          '本站的裁剪原则：只讲架构与机制，不做 API 手册',
          '页面构成：精讲 / 骨架，以及每章开头的「本章对应源码」',
          '三条推荐路线：想接入的、想改内核的、想学沙箱的',
        ],
        takeaway: '带着「一次对话是怎么走完的」这个问题去读，比按 crate 顺序读快得多。',
        sources: [
          { path: 'README.md', note: '上游 README，先建立产品形态的印象' },
          { path: 'AGENTS.md', note: '仓库写给贡献者（和 agent）的规约，信息密度极高' },
          { path: 'docs', note: '面向用户的文档，读源码前先知道功能长什么样', dir: true },
        ],
        deep: true,
      },
      {
        title: '把 Codex 跑起来、断点打起来',
        slug: 'build-and-run',
        summary: '本地构建、日志、以及 codex debug 这一套自带的观测工具。',
        outline: [
          'cargo 与 bazel 两套构建：日常开发用哪个',
          'RUST_LOG / LOG_FORMAT：把内部事件打出来',
          'codex debug app-server：不写客户端也能手工发 JSON-RPC',
          'codex debug prompt-input：看清楚到底发给模型什么',
          'codex doctor：环境、认证、沙箱的自检',
        ],
        takeaway: '先让 `codex debug` 这几个子命令跑通，再读代码，省一半时间。',
        sources: [
          { path: 'docs/install.md', note: '从源码构建的官方说明' },
          { path: 'justfile', note: '仓库常用命令的入口，等价于 Makefile' },
          { path: 'codex-rs/cli/src/debug_sandbox.rs', note: 'debug 子命令里最有意思的一组' },
          { path: 'codex-rs/cli/src/doctor.rs', note: 'doctor 检查了哪些东西' },
        ],
        deep: true,
      },
      {
        num: '0.3',
        title: '仓库地图：一百多个 crate 怎么分层',
        slug: 'repo-map',
        summary: '把 codex-rs 下的 crate 按职责分成六层，先建立坐标系。',
        outline: [
          '顶层目录：codex-rs / codex-cli / sdk / docs 各自的角色',
          '六层划分：入口 → 前端 → 协议 → 内核 → 执行 → 基础设施',
          '哪些 crate 是「大头」：core、tui、app-server 占了多少代码',
          '命名规律：xxx-protocol / xxx-client / xxx-server 的三件套模式',
          '哪些 crate 可以先跳过：vendor、v8-poc、各种 -mock-',
        ],
        takeaway: '看到一个陌生 crate，先问它在「协议 / 内核 / 执行」哪一层，位置比名字更能说明问题。',
        sources: [
          { path: 'codex-rs/Cargo.toml', note: 'workspace 成员清单，就是这张地图的目录' },
          { path: 'codex-rs', note: '所有 crate 的家', dir: true },
          { path: 'AGENTS.md', note: '「The codex-core crate」一节讲了内核的边界' },
        ],
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: '01-overview',
    title: '第 1 部 · 全景',
    lessons: [
      {
        num: '1.1',
        title: '五个前端，一个内核',
        slug: 'surfaces',
        summary: 'TUI、exec、IDE 扩展、桌面端、SDK 分别是怎么接进来的。',
        outline: [
          '五种形态各自的进程模型：同进程 / 子进程 / 独立守护进程',
          '它们的公共下沿在哪：app-server 而不是 codex-core',
          '为什么内核不直接暴露 Rust API 给前端',
          '一张图看清 codex / codex exec / codex app-server / codex app 的关系',
        ],
        takeaway: 'Codex 的前端不是「调用内核的库」，而是「连接内核的客户端」——这一点决定了后面所有设计。',
        sources: [
          { path: 'codex-rs/cli/src/main.rs', note: '所有形态的分发入口' },
          { path: 'codex-rs/app-server/README.md', note: 'app-server 自己对定位的描述' },
          { path: 'codex-rs/app-server-client/src/lib.rs', note: '前端连内核用的统一门面' },
        ],
        deep: true,
        star: true,
      },
      {
        num: '1.2',
        title: '一次 turn 的端到端生命周期',
        slug: 'turn-lifecycle',
        summary: '从你敲下回车，到 diff 落到工作区，中间经过哪些模块。',
        outline: [
          '第 1 段：前端把输入变成 JSON-RPC 请求',
          '第 2 段：app-server 找到 thread、起一个 turn',
          '第 3 段：core 组装 prompt，调 Responses API，流式拿回事件',
          '第 4 段：工具调用被路由、审批、进沙箱执行',
          '第 5 段：结果回灌上下文，事件推回前端，rollout 落盘',
          '中断、steer、compact 分别插在这条链的哪个位置',
        ],
        takeaway: '这条链读通了，后面每一章都只是在放大其中一段。',
        sources: [
          { path: 'codex-rs/app-server/src/request_processors/turn_processor.rs', note: 'turn 的入口处理器' },
          { path: 'codex-rs/core/src/session/turn.rs', note: 'turn 在内核里的主循环' },
          { path: 'codex-rs/core/src/tools/orchestrator.rs', note: '工具调用的编排' },
          { path: 'codex-rs/core/src/rollout.rs', note: '落盘的那一端' },
        ],
        deep: true,
        star: true,
      },
      {
        num: '1.3',
        title: '三条协议：对内、对外、对模型',
        slug: 'three-protocols',
        summary: 'app-server JSON-RPC、MCP、Responses API 各自管什么，别搞混。',
        outline: [
          'app-server JSON-RPC：前端 ↔ 内核（Codex 自己定义）',
          'MCP：Codex ↔ 外部工具（双向：既当 client 也当 server）',
          'Responses API：Codex ↔ 模型',
          '三者在代码里的落点：app-server-protocol / rmcp-client + mcp-server / core::client',
          '为什么 app-server 没有直接复用 MCP',
        ],
        takeaway: '看到 “protocol” 先问是哪一条，这三条的类型名很像但完全不是一回事。',
        sources: [
          { path: 'codex-rs/app-server-protocol/src', note: '对前端的协议定义', dir: true },
          { path: 'codex-rs/protocol/src/protocol.rs', note: '内核的事件与提交类型' },
          { path: 'codex-rs/core/src/client.rs', note: '对模型那一侧' },
        ],
        deep: true,
        star: true,
      },
    ],
  },
  {
    id: '02-app-server',
    title: '第 2 部 · app-server：所有前端的公共内核',
    lessons: [
      {
        num: '2.1',
        title: '为什么是 JSON-RPC 而不是 MCP',
        slug: 'why-jsonrpc',
        summary: 'app-server 借了 MCP 的形，没借它的神，代价与收益各是什么。',
        outline: [
          'MCP 能表达什么、不能表达什么',
          'app-server 需要的三件 MCP 给不了的东西：反向请求、细粒度事件、有状态的 thread',
          '省掉 "jsonrpc":"2.0" 这一行的取舍',
          '协议演进的门：experimental 前缀与版本化',
        ],
        takeaway: 'agent 前端要的是「双向、有状态、事件密集」，这正好是 MCP 的弱项。',
        sources: [
          { path: 'codex-rs/app-server/README.md', note: '协议一节，从「Protocol」读到「API Overview」' },
          { path: 'codex-rs/app-server-protocol/src/protocol', note: '请求 / 响应 / 通知的类型定义', dir: true },
        ],
        deep: true,
        star: true,
      },
      {
        num: '2.2',
        title: '四种 transport',
        slug: 'transports',
        summary: 'stdio、websocket、unix socket、off——各自服务于哪种前端。',
        outline: [
          'stdio（JSONL）：IDE 扩展与大多数客户端的默认选择',
          'websocket：实验性，附带 /healthz 与 /readyz 探针',
          'unix socket：本地控制面，走 HTTP Upgrade 握手',
          '`--listen off`：只做 in-process，不开任何本地监听',
          'codex app-server proxy 与 stdio-to-uds 这两个中继',
        ],
        takeaway: 'transport 只换「字节怎么进出」，上面的 JSON-RPC 语义一模一样。',
        sources: [
          { path: 'codex-rs/app-server/src/transport.rs', note: 'transport 抽象' },
          { path: 'codex-rs/app-server-transport/src', note: '各 transport 的实现', dir: true },
          { path: 'codex-rs/stdio-to-uds/src', note: '把 stdio 中继到 unix socket', dir: true },
        ],
        deep: true,
      },
      {
        num: '2.3',
        title: '初始化握手与能力协商',
        slug: 'initialize',
        summary: 'initialize / initialized 两步，客户端在这里交代自己是谁。',
        outline: [
          'clientInfo：name / title / version 会一路带到遥测与 UA',
          '能力协商：客户端声明自己能处理哪些反向请求',
          '握手之后服务端才开始发通知',
          'in-process 模式下这一步是自动完成的',
        ],
        takeaway: '很多「服务端不给我发事件」的问题，根因是 initialized 这一步没做。',
        sources: [
          { path: 'codex-rs/app-server/src/request_processors/initialize_processor.rs', note: '握手的处理器' },
          { path: 'codex-rs/app-server/README.md', note: 'Initialization 一节有完整报文样例' },
        ],
        deep: true,
      },
      {
        num: '2.4',
        title: '核心原语：thread / turn / item',
        slug: 'primitives',
        summary: '协议里只有三个名词，先把它们的边界钉死。',
        outline: [
          'thread：一条会话，有 id、有持久化、可 resume / fork / archive',
          'turn：一次「用户说话 → agent 干完活」的完整往返',
          'item：turn 里的最小可展示单元（消息、命令、diff、推理…）',
          '它们和内核里 Session / Turn / ResponseItem 的对应关系',
          '为什么前端应该按 item 增量渲染而不是按 message',
        ],
        takeaway: 'thread 是持久的、turn 是短暂的、item 是可展示的——三者不要混用。',
        sources: [
          { path: 'codex-rs/app-server-protocol/src', note: 'thread / turn / item 的协议类型', dir: true },
          { path: 'codex-rs/protocol/src/items.rs', note: 'item 的内核定义' },
          { path: 'codex-rs/protocol/src/thread_id.rs', note: 'thread id 的类型化处理' },
        ],
        deep: true,
        star: true,
      },
      {
        num: '2.5',
        title: 'MessageProcessor：一条消息的分发路径',
        slug: 'message-processor',
        summary: 'app-server 的中枢，所有请求都从这里分岔。',
        outline: [
          '入站：transport → 反序列化 → ClientRequest 枚举',
          '分发：按 variant 交给对应的 request processor',
          '出站：OutgoingMessage 与写线程',
          '为什么请求处理是「拆成一堆小 processor」而不是一个大 match',
          '连接级状态：connection_rpc_gate 与 connection_cleanup',
        ],
        takeaway: 'ClientRequest 是个巨大的枚举，但每个分支都薄——重逻辑全在 processor 里。',
        sources: [
          { path: 'codex-rs/app-server/src/message_processor.rs', note: '中枢本体' },
          { path: 'codex-rs/app-server/src/outgoing_message.rs', note: '出站消息的封装' },
          { path: 'codex-rs/app-server/src/connection_rpc_gate.rs', note: '连接级的准入控制' },
        ],
        deep: true,
        star: true,
      },
      {
        num: '2.6',
        title: 'request_processors 一览',
        slug: 'request-processors',
        summary: '四十来个处理器，按 thread / turn / config / fs / auth 分门别类。',
        outline: [
          'thread 家族：lifecycle、fork、resume、archive、delete、summary',
          'turn 家族：start、interrupt、steer、review',
          '配置家族：config_processor 与 config_manager 的分工',
          '宿主能力家族：fs、git、process_exec、command_exec、search',
          '账号与模型：account_processor、catalog_processor、models_refresh_worker',
        ],
        takeaway: '想知道某个功能在哪实现，先在 request_processors 里找同名文件，命中率极高。',
        sources: [
          { path: 'codex-rs/app-server/src/request_processors', note: '全部处理器', dir: true },
          { path: 'codex-rs/app-server/src/request_processors/thread_lifecycle.rs', note: 'thread 生命周期' },
          { path: 'codex-rs/app-server/src/request_processors/turn_processor.rs', note: 'turn 的起停' },
        ],
        deep: true,
      },
      {
        num: '2.7',
        title: '事件流：通知与 turn 事件',
        slug: 'events',
        summary: '服务端主动推给前端的那一半协议。',
        outline: [
          '事件的订阅模型：跟着 thread 走，不是全局广播',
          'turn 事件的粒度：item 增删改、token 用量、状态迁移',
          '通知退订（notification opt-out）：前端可以只要自己画得出来的',
          '实验性事件：fuzzy file search、realtime、Windows 沙箱安装',
          '事件丢失时会发生什么（Lagged）',
        ],
        takeaway: '前端的复杂度几乎全在事件这一侧，请求那一侧是简单的。',
        sources: [
          { path: 'codex-rs/app-server/README.md', note: 'Events 一节列了全部事件' },
          { path: 'codex-rs/app-server/src/bespoke_event_handling.rs', note: '需要特殊处理的事件' },
          { path: 'codex-rs/core/src/event_mapping.rs', note: '内核事件 → 协议事件的映射' },
        ],
        deep: true,
        star: true,
      },
      {
        num: '2.8',
        title: '反向请求：审批、elicitation、用户输入',
        slug: 'server-requests',
        summary: '服务端向客户端发起请求——这是 MCP 给不了、而 agent 必须要的能力。',
        outline: [
          '命令执行审批与文件改动审批',
          'request_user_input：模型中途向人要信息',
          'MCP 服务器的 elicitation 如何透传到最终用户',
          '权限请求与动态工具调用（实验性）',
          '客户端不响应会怎样：超时与拒绝的默认语义',
        ],
        takeaway: '审批不是「弹个框」，它是协议里一等的反向 RPC，链路上每一层都要能转发它。',
        sources: [
          { path: 'codex-rs/app-server/README.md', note: 'Approvals 一节' },
          { path: 'codex-rs/protocol/src/approvals.rs', note: '审批类型' },
          { path: 'codex-rs/core/src/elicitation.rs', note: 'elicitation 在内核的实现' },
        ],
        deep: true,
        star: true,
      },
      {
        num: '2.9',
        title: '背压与过载',
        slug: 'backpressure',
        summary: '有界队列、-32001，以及为什么反向请求永远不会被静默丢弃。',
        outline: [
          '三段有界队列：ingress → 处理 → outbound',
          '过载时返回 -32001，客户端应做带抖动的指数退避',
          '事件可以丢，服务端请求不可以丢——两种失败语义',
          'in-process 模式下的 WouldBlock',
        ],
        takeaway: '「事件允许丢、请求必须回」这条不变量，是整个审批链不会挂死的原因。',
        sources: [
          { path: 'codex-rs/app-server/src/in_process.rs', note: '注释里把背压策略讲得最清楚' },
          { path: 'codex-rs/app-server/src/error_code.rs', note: '错误码定义' },
        ],
        deep: true,
      },
      {
        num: '2.10',
        title: 'in-process：TUI 反过来当客户端',
        slug: 'in-process',
        summary: '同一套协议，去掉进程边界——这是 Codex 架构里最值得学的一手。',
        outline: [
          '为什么不让 TUI 直接调 codex-core',
          'InProcessClientHandle：用内存 channel 换掉 stdio',
          '「transport-local but not protocol-free」这句话的含金量',
          'codex-app-server-client 这层门面做了什么',
          '这套设计带来的测试红利',
        ],
        takeaway: '让自家前端走和第三方一样的协议，是保证协议不腐坏的最有效手段。',
        sources: [
          { path: 'codex-rs/app-server/src/in_process.rs', note: '进程内运行时' },
          { path: 'codex-rs/app-server-client/src/lib.rs', note: '给前端用的门面' },
          { path: 'codex-rs/tui/src/app_server_session.rs', note: 'TUI 侧的调用面' },
        ],
        deep: true,
        star: true,
      },
      {
        num: '2.11',
        title: '协议怎么对外发布',
        slug: 'schema-gen',
        summary: 'generate-ts 与 generate-json-schema：schema 是从 Rust 类型生成的。',
        outline: [
          '为什么不手写 TypeScript 类型',
          'generate-ts / generate-json-schema 两个子命令',
          '生成物与二进制版本严格对应意味着什么',
          'TypeScript SDK 如何消费它',
        ],
        takeaway: '协议的唯一真相是 Rust 类型，其它语言的定义全是派生物。',
        sources: [
          { path: 'codex-rs/app-server-protocol/src', note: '带 schema 派生的协议类型', dir: true },
          { path: 'sdk/typescript/src', note: '消费端', dir: true },
        ],
        deep: true,
      },
      {
        num: '2.12',
        title: 'experimental API 的门控',
        slug: 'experimental',
        summary: '实验特性怎么在同一个协议里共存而不污染稳定面。',
        outline: [
          '客户端显式 opt-in 的机制',
          'codex-experimental-api-macros 做了什么',
          '未 opt-in 的客户端会看到什么',
          '这套门控对协议演进的意义',
        ],
        takeaway: '一个长期演进的协议，需要「默认不可见」而不是「文档里写着别用」。',
        sources: [
          { path: 'codex-rs/codex-experimental-api-macros/src', note: '门控用的宏', dir: true },
          { path: 'codex-rs/app-server/README.md', note: 'Experimental API Opt-in 一节' },
        ],
        deep: true,
      },
      {
        num: '2.13',
        title: 'daemon 与 remote control',
        slug: 'daemon',
        summary: 'app-server-daemon：让 app-server 活得比某一个前端更久。',
        outline: [
          'daemon 解决的问题：会话不随终端关闭而消失',
          '控制面 socket 的位置与握手',
          'remote_control_processor 暴露了哪些能力',
          '与 codex app / IDE 的配合',
        ],
        takeaway: 'daemon 不是新内核，它只是把同一个 app-server 的生命周期拉长了。',
        sources: [
          { path: 'codex-rs/app-server-daemon/src', note: 'daemon 实现', dir: true },
          { path: 'codex-rs/cli/src/remote_control_cmd.rs', note: 'CLI 侧入口' },
          { path: 'codex-rs/app-server/src/request_processors/remote_control_processor', note: '远程控制的处理器', dir: true },
        ],
        deep: true,
      },
    ],
  },
  {
    id: '03-core',
    title: '第 3 部 · codex-core：对话内核',
    lessons: [
      {
        num: '3.1',
        title: 'core 的边界与对外 API',
        slug: 'core-map',
        summary: '三十万行的 crate 怎么下手：先分清 core / core-api / codex-api。',
        outline: [
          'codex-core 的职责边界（AGENTS.md 里有明确表述）',
          'core-api 与 codex-api 分别是给谁用的',
          'src 下的目录分组：session / tools / context / state / tasks',
          '哪些模块是「热路径」，哪些是外围',
        ],
        takeaway: '不要从 lib.rs 顺着读，从 session/turn.rs 倒着读。',
        sources: [
          { path: 'codex-rs/core/src/lib.rs', note: '模块清单' },
          { path: 'AGENTS.md', note: 'The codex-core crate 一节' },
          { path: 'codex-rs/core-api/src', note: '对外 API 层', dir: true },
        ],
      },
      {
        num: '3.2',
        title: 'ThreadManager 与 CodexThread',
        slug: 'thread-manager',
        summary: '谁持有会话、谁负责创建与回收。',
        outline: [
          'ThreadManager 的所有权模型',
          'CodexThread 与 app-server 的 thread 的对应关系',
          '加载 / 恢复 / 派生（fork）的路径差异',
          '并发：多个 thread 同时活着时的隔离',
        ],
        takeaway: 'thread 的生命周期归 manager，turn 的生命周期归 thread，别越界。',
        sources: [
          { path: 'codex-rs/core/src/thread_manager.rs', note: 'manager 本体' },
          { path: 'codex-rs/core/src/codex_thread.rs', note: 'thread 本体' },
          { path: 'codex-rs/thread-store/src', note: '持久化那一侧', dir: true },
        ],
      },
      {
        num: '3.3',
        title: 'Session / Turn / TurnContext',
        slug: 'session-turn',
        summary: '内核里真正的主循环在这里。',
        outline: [
          'Session 持有什么：配置、MCP 运行时、世界状态',
          'Turn 的状态机：从 user input 到 completed / interrupted',
          'TurnContext：一个 turn 内不变的那部分环境',
          '输入队列与 steer：turn 进行中还能塞东西进来',
          '中断的传播路径',
        ],
        takeaway: 'TurnContext 是理解「为什么改了配置当前这轮不生效」的钥匙。',
        sources: [
          { path: 'codex-rs/core/src/session/session.rs', note: 'Session' },
          { path: 'codex-rs/core/src/session/turn.rs', note: 'Turn 主循环' },
          { path: 'codex-rs/core/src/session/turn_context.rs', note: 'TurnContext' },
          { path: 'codex-rs/core/src/session/input_queue.rs', note: '输入队列' },
        ],
        star: true,
      },
      {
        num: '3.4',
        title: '上下文管理与 token 预算',
        slug: 'context-manager',
        summary: '什么进上下文、什么被挤出去，规则都在这里。',
        outline: [
          'context_manager 的分层：系统提示 / 环境 / 历史 / 当前输入',
          'context-fragments：可复用的上下文片段',
          'token 预算怎么算，超了先砍谁',
          'context_window 与模型能力的耦合点',
        ],
        takeaway: '上下文不是一个数组，是一个有优先级的预算分配问题。',
        sources: [
          { path: 'codex-rs/core/src/context_manager', note: '上下文管理', dir: true },
          { path: 'codex-rs/core/src/session/context_window.rs', note: '窗口计算' },
          { path: 'codex-rs/core/src/session/token_budget.rs', note: '预算' },
          { path: 'codex-rs/context-fragments/src', note: '上下文片段', dir: true },
        ],
        star: true,
      },
      {
        num: '3.5',
        title: 'compact：上下文压缩',
        slug: 'compact',
        summary: '本地压缩与远端压缩两条路，以及降级策略。',
        outline: [
          '触发时机：主动 / 被动',
          '本地 compact 做了什么',
          'compact_remote 与 v2：把压缩交给服务端',
          '压缩失败的模型降级（compact_model_fallback）',
          '压缩后的历史怎么和 rollout 对齐',
        ],
        takeaway: 'compact 是长会话能不能用下去的分水岭，值得单独读一遍。',
        sources: [
          { path: 'codex-rs/core/src/compact.rs', note: '本地压缩' },
          { path: 'codex-rs/core/src/compact_remote_v2.rs', note: '远端压缩 v2' },
          { path: 'codex-rs/core/src/compact_model_fallback.rs', note: '降级' },
          { path: 'codex-rs/core/src/compact_token_budget.rs', note: '压缩的预算' },
        ],
        star: true,
      },
      {
        num: '3.6',
        title: '与模型说话：client 与 Responses API',
        slug: 'model-client',
        summary: '请求怎么拼、重试怎么做、provider 怎么切。',
        outline: [
          'client.rs / client_common.rs 的分工',
          'Responses API 与 Chat Completions 的差异如何被抹平',
          '重试：responses_retry 的策略',
          'model-provider / model-provider-info：多 provider 的抽象',
          '本地模型：ollama 与 lmstudio 这两个 crate',
        ],
        takeaway: '模型层被隔离得很干净，换 provider 不用动 turn 循环。',
        sources: [
          { path: 'codex-rs/core/src/client.rs', note: '请求组装与流式解析' },
          { path: 'codex-rs/core/src/responses_retry.rs', note: '重试策略' },
          { path: 'codex-rs/model-provider-info/src', note: 'provider 元信息', dir: true },
        ],
        star: true,
      },
      {
        num: '3.7',
        title: '流式事件：从 SSE 到内核事件',
        slug: 'streaming',
        summary: '模型吐字的那一路，怎么变成前端能画的东西。',
        outline: [
          'SSE 分片的解析与重组',
          'stream_events_utils 做的规整工作',
          '推理（reasoning）内容的特殊处理',
          '事件在 event_mapping 里被翻译成协议事件',
        ],
        takeaway: '流式是「解析 → 规整 → 映射」三段，每段的失败语义都不一样。',
        sources: [
          { path: 'codex-rs/core/src/stream_events_utils.rs', note: '流式事件规整' },
          { path: 'codex-rs/core/src/event_mapping.rs', note: '映射到协议事件' },
          { path: 'codex-rs/core/src/client_common.rs', note: '公共的流式结构' },
        ],
      },
      {
        num: '3.8',
        title: 'rollout 与 thread-store：会话怎么落盘',
        slug: 'rollout',
        summary: '可 resume、可 fork、可回放，靠的是这一层。',
        outline: [
          'rollout 的写入时机与格式',
          'rollout_budget：日志不能无限长',
          'thread-store：分页历史与迁移',
          'migrate-rollouts：老格式怎么升上来',
          'rollout-trace：回放与调试',
        ],
        takeaway: '「会话」的真相在磁盘上，内存里的只是缓存。',
        sources: [
          { path: 'codex-rs/core/src/rollout.rs', note: '落盘' },
          { path: 'codex-rs/thread-store/src', note: '分页历史', dir: true },
          { path: 'codex-rs/rollout-trace/src', note: '回放', dir: true },
          { path: 'codex-rs/cli/src/migrate_rollouts.rs', note: '迁移命令' },
        ],
        star: true,
      },
      {
        num: '3.9',
        title: '提示词从哪来：AGENTS.md、prompts、skills',
        slug: 'prompt-assembly',
        summary: '模型看到的第一屏，是由五六个来源拼起来的。',
        outline: [
          '内置 prompts crate：基础指令',
          'AGENTS.md 的发现与合并规则（agents_md_manager）',
          'skills 注入的时机',
          '环境信息：cwd、git 状态、平台、沙箱模式',
          'codex debug prompt-input：把最终结果打出来核对',
        ],
        takeaway: '想知道模型「为什么这么干」，先把 prompt-input 打出来看，别猜。',
        sources: [
          { path: 'codex-rs/prompts', note: '内置提示词', dir: true },
          { path: 'codex-rs/core/src/agents_md_manager.rs', note: 'AGENTS.md 的加载' },
          { path: 'codex-rs/core/src/prompt_debug.rs', note: 'prompt 调试出口' },
          { path: 'docs/agents_md.md', note: '面向用户的说明' },
        ],
        star: true,
      },
      {
        num: '3.10',
        title: 'review、plan 与多智能体',
        slug: 'subagents',
        summary: '内核里那些「再开一个 agent」的路径。',
        outline: [
          'codex review 的实现路径',
          'plan_tool：计划是怎么被当成一等公民的',
          'multi_agents 与 codex_delegate',
          'agent-graph-store：多 agent 的关系怎么存',
        ],
        takeaway: '子 agent 不是新进程，是同一个内核里的另一条 thread。',
        sources: [
          { path: 'codex-rs/core/src/session/review.rs', note: 'review' },
          { path: 'codex-rs/core/src/session/multi_agents.rs', note: '多 agent' },
          { path: 'codex-rs/core/src/codex_delegate.rs', note: '委派' },
          { path: 'codex-rs/agent-graph-store/src', note: 'agent 关系存储', dir: true },
        ],
      },
    ],
  },
  {
    id: '04-tools',
    title: '第 4 部 · 工具层',
    lessons: [
      {
        num: '4.1',
        title: '工具注册表与 router',
        slug: 'registry',
        summary: '模型能看到哪些工具，是运行时算出来的。',
        outline: [
          'registry：工具的登记与可见性',
          'router：一次 tool call 怎么找到 handler',
          'tool_namespaces：命名空间的必要性',
          'hosted_spec：托管工具与本地工具的差别',
          'dynamic_tools：运行时增删工具',
        ],
        takeaway: '工具列表是每个 turn 重新计算的，不是启动时固定的。',
        sources: [
          { path: 'codex-rs/core/src/tools/registry.rs', note: '注册表' },
          { path: 'codex-rs/core/src/tools/router.rs', note: '路由' },
          { path: 'codex-rs/core/src/tools/handlers', note: '各工具的实现', dir: true },
        ],
        star: true,
      },
      {
        num: '4.2',
        title: 'orchestrator 与并行调用',
        slug: 'orchestrator',
        summary: '多个 tool call 同时回来时，谁先跑、谁能并行。',
        outline: [
          'orchestrator 的调度模型',
          'parallel.rs：哪些工具允许并行',
          'lifecycle：调用前后的钩子点',
          'tool_dispatch_trace：排查调度问题的抓手',
        ],
        takeaway: '并行的边界由「有没有副作用」决定，不由模型决定。',
        sources: [
          { path: 'codex-rs/core/src/tools/orchestrator.rs', note: '编排' },
          { path: 'codex-rs/core/src/tools/parallel.rs', note: '并行策略' },
          { path: 'codex-rs/core/src/tools/lifecycle.rs', note: '生命周期钩子' },
        ],
      },
      {
        num: '4.3',
        title: 'shell 与 unified_exec',
        slug: 'shell-exec',
        summary: '最重要也最危险的一个工具，链路最长。',
        outline: [
          'unified_exec：一个工具覆盖前台 / 后台 / 交互式',
          'shell_snapshot：为什么要快照用户的 shell 环境',
          'command_canonicalization：命令归一化与它的安全意义',
          '输出截断与 exec_output 的结构',
          '后台终端的生命周期管理',
        ],
        takeaway: '「跑个命令」在生产 agent 里是十几个模块协作的结果。',
        sources: [
          { path: 'codex-rs/core/src/unified_exec', note: '统一执行', dir: true },
          { path: 'codex-rs/core/src/exec.rs', note: '执行的底座' },
          { path: 'codex-rs/core/src/shell_snapshot.rs', note: 'shell 环境快照' },
          { path: 'codex-rs/core/src/command_canonicalization.rs', note: '命令归一化' },
        ],
        star: true,
      },
      {
        num: '4.4',
        title: 'apply_patch：自定义 diff 格式',
        slug: 'apply-patch',
        summary: '为什么不用 unified diff，以及这个格式怎么解析。',
        outline: [
          'apply_patch 的语法与设计动机',
          '解析与校验：失败要给模型什么反馈',
          '落盘前的审批与沙箱交互',
          'turn_diff_tracker：一个 turn 改了什么的汇总',
        ],
        takeaway: '给模型用的 diff 格式，容错性比紧凑性重要得多。',
        sources: [
          { path: 'codex-rs/apply-patch/src', note: '格式与解析', dir: true },
          { path: 'codex-rs/core/src/apply_patch.rs', note: '内核侧的接入' },
          { path: 'codex-rs/core/src/turn_diff_tracker.rs', note: 'diff 汇总' },
        ],
        star: true,
      },
      {
        num: '4.5',
        title: 'MCP 客户端：外部工具怎么进来',
        slug: 'mcp-client',
        summary: 'Codex 作为 MCP client 的那一侧。',
        outline: [
          'rmcp-client：连接、握手、工具发现',
          '预热（prewarm）与刷新',
          '工具暴露策略：mcp_tool_exposure',
          'MCP 工具的审批模板',
          'elicitation 的透传',
        ],
        takeaway: '外部工具进来之后，和内置工具在 router 眼里是一样的。',
        sources: [
          { path: 'codex-rs/rmcp-client/src', note: 'MCP 客户端', dir: true },
          { path: 'codex-rs/core/src/mcp.rs', note: '内核侧接入' },
          { path: 'codex-rs/core/src/mcp_tool_exposure.rs', note: '暴露策略' },
          { path: 'codex-rs/cli/src/mcp_cmd.rs', note: 'codex mcp 子命令' },
        ],
      },
      {
        num: '4.6',
        title: '其它内置工具',
        slug: 'builtin-tools',
        summary: 'web_search、图片、文件搜索、计划工具。',
        outline: [
          'web_search 的托管形态',
          'file-search：模糊文件搜索',
          '图片输入的准备（image_preparation）',
          'plan_tool 与 goal',
        ],
        takeaway: '内置工具大多很薄，重点看它们如何声明能力与审批要求。',
        sources: [
          { path: 'codex-rs/core/src/web_search.rs', note: 'web search' },
          { path: 'codex-rs/file-search/src', note: '文件搜索', dir: true },
          { path: 'codex-rs/protocol/src/plan_tool.rs', note: '计划工具' },
        ],
      },
      {
        num: '4.7',
        title: 'code-mode：让模型写代码来调工具',
        slug: 'code-mode',
        summary: 'Codex 里最新也最激进的一条工具路径。',
        outline: [
          'code-mode 想解决什么：工具调用的表达力上限',
          'code-mode-protocol / -host / -runtime 三件套的分工',
          '沙箱化的执行环境',
          '远端 code-mode host（wss://）的用途',
          '与传统 function calling 的取舍',
        ],
        takeaway: '当工具组合变复杂时，「写一段代码」比「连发十次 tool call」更省 token 也更准。',
        sources: [
          { path: 'codex-rs/code-mode/src', note: '入口', dir: true },
          { path: 'codex-rs/code-mode-host/src', note: '宿主', dir: true },
          { path: 'codex-rs/code-mode-runtime/src', note: '运行时', dir: true },
          { path: 'codex-rs/core/src/tools/code_mode', note: '内核侧接入', dir: true },
        ],
        star: true,
      },
    ],
  },
  {
    id: '05-sandbox',
    title: '第 5 部 · 沙箱与安全',
    lessons: [
      {
        num: '5.1',
        title: '威胁模型与审批策略',
        slug: 'threat-model',
        summary: '沙箱防谁、不防谁，以及三档 ask-for-approval 的语义。',
        outline: [
          '威胁模型：不可信的是模型输出，不是用户',
          'AskForApproval 的档位与它们的组合语义',
          'SandboxPolicy：只读 / 工作区可写 / 完全放开',
          '「沙箱失败就升级为审批」这条兜底规则',
        ],
        takeaway: '审批与沙箱是两个正交维度，组合起来才是最终策略。',
        sources: [
          { path: 'docs/sandbox.md', note: '面向用户的说明' },
          { path: 'codex-rs/protocol/src/permissions.rs', note: '权限类型' },
          { path: 'codex-rs/core/src/safety.rs', note: '两个维度合流的地方' },
        ],
        star: true,
      },
      {
        num: '5.2',
        title: 'macOS：Seatbelt',
        slug: 'seatbelt',
        summary: '用 .sbpl 策略文件把子进程关起来。',
        outline: [
          'sandbox-exec 与 seatbelt 策略语言',
          'seatbelt_base_policy.sbpl 逐条读',
          '网络策略单独一个文件的原因',
          '可写路径怎么注入到策略里',
        ],
        takeaway: 'Seatbelt 策略是纯文本的，读一遍就知道 Codex 到底允许了什么。',
        sources: [
          { path: 'codex-rs/sandboxing/src/seatbelt.rs', note: '策略组装' },
          { path: 'codex-rs/sandboxing/src/seatbelt_base_policy.sbpl', note: '基础策略' },
          { path: 'codex-rs/sandboxing/src/seatbelt_network_policy.sbpl', note: '网络策略' },
        ],
        star: true,
      },
      {
        num: '5.3',
        title: 'Linux：Landlock 与 bwrap',
        slug: 'landlock',
        summary: '两条并存的路线，各自的能力边界。',
        outline: [
          'Landlock + seccomp：内核原生、无需特权',
          'bwrap（bubblewrap）：更强的隔离，但要额外依赖',
          'codex-linux-sandbox 这个独立二进制的作用',
          '内核版本差异导致的降级',
        ],
        takeaway: 'Linux 上没有一个到处都能用的沙箱，所以这里必须有两套。',
        sources: [
          { path: 'codex-rs/sandboxing/src/landlock.rs', note: 'Landlock' },
          { path: 'codex-rs/sandboxing/src/bwrap.rs', note: 'bwrap' },
          { path: 'codex-rs/linux-sandbox/src', note: '独立沙箱二进制', dir: true },
        ],
        star: true,
      },
      {
        num: '5.4',
        title: 'Windows 沙箱',
        slug: 'windows-sandbox',
        summary: '受限令牌与读授权，Windows 上的等价物。',
        outline: [
          'windows-sandbox-rs 的实现路线',
          '读授权（read grants）为什么要单独一套',
          '安装期事件：为什么 Windows 沙箱要「装」',
          '与 WSL 路径的互操作',
        ],
        takeaway: 'Windows 这一侧的复杂度主要来自路径与权限模型的差异。',
        sources: [
          { path: 'codex-rs/windows-sandbox-rs/src', note: 'Windows 沙箱', dir: true },
          { path: 'codex-rs/core/src/windows_sandbox_read_grants.rs', note: '读授权' },
          { path: 'codex-rs/cli/src/wsl_paths.rs', note: 'WSL 路径' },
        ],
      },
      {
        num: '5.5',
        title: 'execpolicy：Starlark 写的命令策略',
        slug: 'execpolicy',
        summary: '在沙箱之前，先用规则判断这条命令该不该跑。',
        outline: [
          'prefix_rule 的语法与匹配语义',
          'allow / prompt / forbidden 三种判定',
          'match / not_match：规则自带单元测试',
          'host_executable：限定可执行文件的绝对路径',
          '为什么选 Starlark 而不是自造 DSL',
        ],
        takeaway: '把策略写成带自测的声明式规则，比散落在代码里的 if 好维护一个数量级。',
        sources: [
          { path: 'codex-rs/execpolicy/README.md', note: '策略语言说明' },
          { path: 'codex-rs/execpolicy/src', note: '策略引擎', dir: true },
          { path: 'docs/execpolicy.md', note: '面向用户的文档' },
        ],
        star: true,
      },
      {
        num: '5.6',
        title: '网络策略与代理',
        slug: 'network-policy',
        summary: '沙箱里的网络怎么被允许、被观测、被拦。',
        outline: [
          'network_policy_decision 的判定流程',
          'network-proxy：出网代理的角色',
          'responses-api-proxy 是另一回事，别混淆',
          '网络审批的用户体验路径',
        ],
        takeaway: '网络管控是「策略判定 + 代理转发」两段，缺一不可。',
        sources: [
          { path: 'codex-rs/core/src/network_policy_decision.rs', note: '判定' },
          { path: 'codex-rs/network-proxy/src', note: '代理', dir: true },
          { path: 'codex-rs/protocol/src/network_policy.rs', note: '协议类型' },
        ],
      },
      {
        num: '5.7',
        title: 'safety.rs：所有判断合流的地方',
        slug: 'safety',
        summary: '一条命令最终能不能跑，答案在这个文件里。',
        outline: [
          '输入：审批策略、沙箱策略、execpolicy 判定、历史批准',
          '输出：直接跑 / 进沙箱跑 / 问用户 / 拒绝',
          '「记住这次批准」的作用域',
          '升级路径：shell-escalation',
        ],
        takeaway: '读懂这一个文件，等于读懂 Codex 的整个安全模型。',
        sources: [
          { path: 'codex-rs/core/src/safety.rs', note: '决策合流' },
          { path: 'codex-rs/core/src/tools/approvals.rs', note: '审批状态' },
          { path: 'codex-rs/shell-escalation/src', note: '权限升级', dir: true },
        ],
        star: true,
      },
      {
        num: '5.8',
        title: '进程加固与凭据',
        slug: 'hardening',
        summary: '除了沙箱之外的那些防御措施。',
        outline: [
          'process-hardening：禁调试、清环境',
          'keyring-store 与 secrets：凭据存哪',
          'attestation：证明「这确实是 Codex 干的」',
          'workload-identity 与 aws-auth',
        ],
        takeaway: '这些模块平时不显眼，但它们决定了 Codex 能不能进企业环境。',
        sources: [
          { path: 'codex-rs/process-hardening/src', note: '进程加固', dir: true },
          { path: 'codex-rs/keyring-store/src', note: '凭据存储', dir: true },
          { path: 'codex-rs/core/src/attestation.rs', note: '证明' },
        ],
      },
    ],
  },
  {
    id: '06-cli-tui',
    title: '第 6 部 · CLI 与 TUI',
    lessons: [
      {
        num: '6.1',
        title: 'codex 这个二进制',
        slug: 'cli-entry',
        summary: 'clap 子命令树，以及 arg0 多态这一手。',
        outline: [
          '三十来个子命令的分组',
          'arg0：同一个二进制根据启动名切换行为',
          '隐藏子命令都是干什么的',
          '没有子命令时为什么进 TUI',
        ],
        takeaway: 'arg0 多态让 Codex 只发一个二进制，却能扮演沙箱助手、代理、中继等多个角色。',
        sources: [
          { path: 'codex-rs/cli/src/main.rs', note: '子命令定义' },
          { path: 'codex-rs/arg0/src', note: 'arg0 分发', dir: true },
          { path: 'codex-cli/bin/codex.js', note: 'npm 包的入口 shim' },
        ],
        star: true,
      },
      {
        num: '6.2',
        title: 'codex exec：非交互模式',
        slug: 'exec',
        summary: '脚本与 CI 里用的那个形态。',
        outline: [
          'exec 与 TUI 共用哪一层',
          '输出格式：给人看的与给机器看的',
          '退出码语义',
          '审批在非交互下的默认行为',
        ],
        takeaway: 'exec 不是「简化版 TUI」，它是同一个客户端换了一套渲染与审批策略。',
        sources: [
          { path: 'codex-rs/exec/src', note: 'exec 实现', dir: true },
          { path: 'docs/exec.md', note: '用户文档' },
          { path: 'codex-rs/cli/src/exit_status.rs', note: '退出码' },
        ],
      },
      {
        num: '6.3',
        title: 'TUI 架构',
        slug: 'tui-arch',
        summary: 'ratatui、事件循环、ChatWidget 与 history_cell。',
        outline: [
          'App / AppEvent / AppEventSender 的事件循环',
          'ChatWidget：主界面的组织方式',
          'history_cell：把 item 渲染成可回滚的历史',
          'bottom_pane：输入区与各种弹层',
          'AGENTS.md 里的 TUI 代码规约',
        ],
        takeaway: '把 TUI 当成一个「事件驱动的增量渲染器」来读，而不是当成界面代码。',
        sources: [
          { path: 'codex-rs/tui/src/app.rs', note: '事件循环' },
          { path: 'codex-rs/tui/src/chatwidget.rs', note: '主界面' },
          { path: 'codex-rs/tui/src/history_cell', note: '历史渲染', dir: true },
          { path: 'AGENTS.md', note: 'TUI style / code conventions 两节' },
        ],
        star: true,
      },
      {
        num: '6.4',
        title: 'TUI 如何消费 app-server',
        slug: 'tui-app-server',
        summary: '把 2.10 那条线在前端这一侧走完。',
        outline: [
          'app_server_session：TUI 侧的调用门面',
          '历史水合（hydration）与分页',
          '审批事件如何变成界面上的弹窗',
          'legacy_core 这个名字透露了什么',
        ],
        takeaway: 'TUI 里凡是叫 legacy_ 的，都是还没迁完的直连内核路径。',
        sources: [
          { path: 'codex-rs/tui/src/app_server_session.rs', note: '调用门面' },
          { path: 'codex-rs/tui/src/app_server_session/history.rs', note: '历史水合' },
          { path: 'codex-rs/tui/src/app_server_approval_conversions.rs', note: '审批转换' },
        ],
        star: true,
      },
      {
        num: '6.5',
        title: '渲染细节与终端兼容',
        slug: 'tui-render',
        summary: '插入历史、换行、ANSI、终端探测。',
        outline: [
          'insert_history：为什么不能整屏重绘',
          'live_wrap 与 line_truncation',
          'ansi-escape crate 的职责',
          'terminal-detection：不同终端的能力差异',
        ],
        takeaway: '终端里做流式 UI，难点全在「已经打印出去的内容不能改」。',
        sources: [
          { path: 'codex-rs/tui/src/insert_history.rs', note: '历史插入' },
          { path: 'codex-rs/tui/src/live_wrap.rs', note: '实时换行' },
          { path: 'codex-rs/terminal-detection/src', note: '终端探测', dir: true },
        ],
      },
      {
        num: '6.6',
        title: '登录：ChatGPT OAuth 与 API key',
        slug: 'login',
        summary: '两种认证方式的实现与存储。',
        outline: [
          'OAuth 回环流程与本地端口',
          'API key 模式的差异',
          '凭据存哪、怎么刷新',
          'auth_mode 如何影响可用模型与限额',
        ],
        takeaway: '认证模式不只是「怎么登进去」，它一路影响到模型目录与限额显示。',
        sources: [
          { path: 'codex-rs/login/src', note: '登录实现', dir: true },
          { path: 'codex-rs/app-server/src/auth_mode.rs', note: '认证模式' },
          { path: 'docs/authentication.md', note: '用户文档' },
        ],
      },
      {
        num: '6.7',
        title: 'doctor 与 debug 工具箱',
        slug: 'doctor',
        summary: '官方自带的诊断工具，也是最好的源码导览。',
        outline: [
          'doctor 检查的项目清单',
          'debug seatbelt / landlock：单独试沙箱',
          'debug app-server：手工发协议消息',
          'feedback：诊断报告怎么打包',
        ],
        takeaway: '想验证某个子系统能不能单独跑，先看 debug 子命令有没有现成的入口。',
        sources: [
          { path: 'codex-rs/cli/src/doctor', note: 'doctor', dir: true },
          { path: 'codex-rs/cli/src/debug_sandbox.rs', note: '沙箱调试' },
          { path: 'codex-rs/diagnostics/src', note: '诊断数据', dir: true },
        ],
      },
    ],
  },
  {
    id: '07-surfaces',
    title: '第 7 部 · 桌面端、IDE 与远程',
    lessons: [
      {
        num: '7.1',
        title: 'codex app：桌面端',
        slug: 'desktop-app',
        summary: 'CLI 怎么把桌面端拉起来，两者又怎么共享状态。',
        outline: [
          'app_cmd 与 desktop_app 目录做的事',
          '没装的时候：安装器路径',
          '桌面端连的是哪个 app-server',
          '仅 macOS / Windows 的原因',
        ],
        takeaway: '桌面端在这个仓库里只有「启动器」，主体不在开源部分——但接口全在。',
        sources: [
          { path: 'codex-rs/cli/src/app_cmd.rs', note: 'codex app 子命令' },
          { path: 'codex-rs/cli/src/desktop_app', note: '桌面端相关', dir: true },
          { path: 'codex-rs/install-context/src', note: '安装上下文', dir: true },
        ],
        star: true,
      },
      {
        num: '7.2',
        title: 'IDE 扩展的接入面',
        slug: 'ide',
        summary: 'VS Code 扩展需要 app-server 提供什么。',
        outline: [
          'ide_context：编辑器上下文怎么传进来',
          '文件监听与 fs 能力',
          '扩展侧对事件的取舍',
          '为什么 app-server 要提供 git / fs / search 这些「本该编辑器自己做」的能力',
        ],
        takeaway: '把宿主能力也放进协议，是为了让远程场景和本地场景走同一套代码。',
        sources: [
          { path: 'codex-rs/tui/src/ide_context', note: 'IDE 上下文（TUI 侧也用）', dir: true },
          { path: 'codex-rs/app-server/src/request_processors/fs_processor.rs', note: 'fs 能力' },
          { path: 'codex-rs/app-server/src/fs_watch.rs', note: '文件监听' },
        ],
      },
      {
        num: '7.3',
        title: 'remote control',
        slug: 'remote-control',
        summary: '让另一台机器上的 app-server 接受控制。',
        outline: [
          'remote control 的启用方式与安全边界',
          '与 daemon 的关系',
          '暴露的能力子集',
        ],
        takeaway: '远程控制是 daemon 的一个受限视图，不是新协议。',
        sources: [
          { path: 'codex-rs/cli/src/remote_control_cmd.rs', note: 'CLI 入口' },
          { path: 'codex-rs/app-server/src/request_processors/remote_control_processor', note: '处理器', dir: true },
        ],
      },
      {
        num: '7.4',
        title: 'exec-server：把执行搬到远端',
        slug: 'exec-server',
        summary: '让命令与文件操作发生在另一个环境里。',
        outline: [
          '本地 / 远端两套 process 与 file_system 实现',
          '能力发现（capability_discovery）',
          'Noise 协议加密的通道',
          'environment 的注册与引导',
          '与 code-mode host 的关系',
        ],
        takeaway: '把「执行环境」抽象成可替换的东西，云端 agent 与本地 agent 才能共用一套内核。',
        sources: [
          { path: 'codex-rs/exec-server/src', note: 'exec-server', dir: true },
          { path: 'codex-rs/exec-server-protocol/src', note: '协议', dir: true },
          { path: 'codex-rs/exec-server/src/noise_channel.rs', note: '加密通道' },
        ],
        star: true,
      },
      {
        num: '7.5',
        title: 'cloud tasks',
        slug: 'cloud-tasks',
        summary: '与 Codex Web 的衔接：把云端任务拉回本地。',
        outline: [
          'cloud-tasks 与 cloud-tasks-client 的分工',
          '任务列表与 diff 应用',
          'codex apply 这个子命令',
          'mock client 的用途',
        ],
        takeaway: '云端产出的 diff，最终还是走本地的 apply_patch 落地。',
        sources: [
          { path: 'codex-rs/cloud-tasks/src', note: '云任务', dir: true },
          { path: 'codex-rs/cloud-tasks-client/src', note: '客户端', dir: true },
        ],
      },
    ],
  },
  {
    id: '08-extensions',
    title: '第 8 部 · 扩展生态',
    lessons: [
      {
        num: '8.1',
        title: 'Codex 作为 MCP server',
        slug: 'as-mcp-server',
        summary: '反过来，把整个 Codex 暴露成别人的工具。',
        outline: [
          'codex mcp-server 的能力面',
          '与 app-server 的能力差异',
          '典型用法：在别的 agent 里调 Codex',
        ],
        takeaway: 'Codex 在 MCP 上是双向的：既消费工具，也把自己变成工具。',
        sources: [
          { path: 'codex-rs/mcp-server/src', note: 'MCP server', dir: true },
          { path: 'codex-rs/codex-mcp/src', note: '共享的 MCP 实现', dir: true },
        ],
      },
      {
        num: '8.2',
        title: 'plugins',
        slug: 'plugins',
        summary: '插件机制与 core-plugins。',
        outline: [
          'plugin 的加载与生命周期',
          'core-plugins 里都有什么',
          'marketplace 相关的子命令',
          '插件与 skills / hooks 的边界',
        ],
        takeaway: '先分清 plugin / skill / hook 三者的触发时机，再读实现。',
        sources: [
          { path: 'codex-rs/plugin/src', note: '插件框架', dir: true },
          { path: 'codex-rs/core-plugins/src', note: '内置插件', dir: true },
          { path: 'codex-rs/cli/src/plugin_cmd.rs', note: 'CLI 入口' },
        ],
      },
      {
        num: '8.3',
        title: 'skills',
        slug: 'skills',
        summary: 'SKILL.md 怎么被发现、加载、注入。',
        outline: [
          'skill 的目录约定与元数据',
          '发现与热更新（skills_watcher）',
          '注入时机与 token 成本',
          '通过 app-server 暴露给前端',
          'MCP skill 依赖',
        ],
        takeaway: 'skill 的本质是「按需注入的提示词 + 附带资源」，不是代码扩展。',
        sources: [
          { path: 'codex-rs/skills/src', note: 'skills 实现', dir: true },
          { path: 'codex-rs/core/src/skills.rs', note: '内核接入' },
          { path: 'codex-rs/app-server/src/skills_watcher.rs', note: '热更新' },
          { path: 'docs/skills.md', note: '用户文档' },
        ],
        star: true,
      },
      {
        num: '8.4',
        title: 'hooks',
        slug: 'hooks',
        summary: '生命周期钩子：在关键节点插入自定义逻辑。',
        outline: [
          '钩子点的清单',
          'hook_runtime 的执行模型',
          '失败与超时的处理',
          '与 TUI 的 hooks_rpc 配合',
        ],
        takeaway: '钩子跑在内核进程之外，所以它的失败必须是「可降级」的。',
        sources: [
          { path: 'codex-rs/hooks/src', note: 'hooks', dir: true },
          { path: 'codex-rs/core/src/hook_runtime.rs', note: '执行模型' },
          { path: 'codex-rs/core/src/tools/hook_names.rs', note: '钩子点命名' },
        ],
      },
      {
        num: '8.5',
        title: 'connectors 与 apps',
        slug: 'connectors',
        summary: '把外部服务接进对话的两条路径。',
        outline: [
          'connectors 的抽象',
          'apps：可被 turn 直接调用的应用',
          '与 MCP 的关系与区别',
        ],
        takeaway: 'connector 面向「数据源」，app 面向「可交互的东西」。',
        sources: [
          { path: 'codex-rs/connectors/src', note: 'connectors', dir: true },
          { path: 'codex-rs/core/src/apps', note: 'apps', dir: true },
          { path: 'codex-rs/app-server/src/request_processors/apps_processor', note: '协议侧', dir: true },
        ],
      },
      {
        num: '8.6',
        title: 'memories',
        slug: 'memories',
        summary: '跨会话记忆的读写两侧。',
        outline: [
          'memories/read 与 memories/write 为什么拆开',
          '记忆的召回时机',
          'memory_citation：记忆要能被引用与追溯',
        ],
        takeaway: '记忆系统最难的不是存，是「什么时候该拿出来」。',
        sources: [
          { path: 'codex-rs/memories', note: '记忆读写', dir: true },
          { path: 'codex-rs/protocol/src/memory_citation.rs', note: '引用' },
        ],
      },
    ],
  },
  {
    id: '09-sdk',
    title: '第 9 部 · SDK 与自动化',
    lessons: [
      {
        num: '9.1',
        title: 'TypeScript SDK',
        slug: 'ts-sdk',
        summary: '官方 SDK 长什么样，以及它怎么映射到协议。',
        outline: [
          'thread / turn 在 SDK 里的形状',
          '事件流的消费方式',
          '类型从哪来（回到 2.11）',
          'samples 里最值得读的几个',
        ],
        takeaway: '读 SDK 是理解协议最快的方式——它是协议的「用户视角」。',
        sources: [
          { path: 'sdk/typescript/src', note: 'SDK 源码', dir: true },
          { path: 'sdk/typescript/samples', note: '示例', dir: true },
        ],
        star: true,
      },
      {
        num: '9.2',
        title: 'Python SDK',
        slug: 'py-sdk',
        summary: '同一套协议的 Python 表达，以及 python-runtime。',
        outline: [
          '同步 / 异步两套 API',
          '十五个 examples 覆盖的场景',
          'python-runtime 与 code-mode 的关系',
        ],
        takeaway: '两个 SDK 的形状高度一致，差异基本只来自语言习惯。',
        sources: [
          { path: 'sdk/python/src', note: 'SDK 源码', dir: true },
          { path: 'sdk/python/examples', note: '示例', dir: true },
          { path: 'sdk/python-runtime/src', note: 'runtime', dir: true },
        ],
      },
      {
        num: '9.3',
        title: 'npm 包与安装链路',
        slug: 'npm-package',
        summary: '@openai/codex 装下来的到底是什么。',
        outline: [
          'codex-cli 这个包的构成',
          'bin/codex.js 做的平台分发',
          'build_npm_package.py 打了哪些产物',
          '独立安装器与 GitHub Releases 的关系',
        ],
        takeaway: 'npm 包只是个壳，真正的东西是各平台的原生二进制。',
        sources: [
          { path: 'codex-cli/package.json', note: '包定义' },
          { path: 'codex-cli/bin/codex.js', note: '入口 shim' },
          { path: 'codex-cli/scripts/build_npm_package.py', note: '打包脚本' },
        ],
      },
      {
        num: '9.4',
        title: '在 CI 里跑 Codex',
        slug: 'ci',
        summary: 'codex exec + 沙箱 + 审批策略的组合拳。',
        outline: [
          '非交互下的审批与沙箱默认值',
          '容器里跑：run_in_container.sh 与 init_firewall.sh',
          '输出解析与退出码',
          '仓库自己的 .github 工作流怎么用它',
        ],
        takeaway: 'CI 场景的关键不是命令行参数，是先想清楚「出事了谁兜底」。',
        sources: [
          { path: 'codex-cli/scripts/run_in_container.sh', note: '容器脚本' },
          { path: 'codex-cli/scripts/init_firewall.sh', note: '网络限制' },
          { path: '.github/workflows', note: '仓库自己的用法', dir: true },
        ],
      },
    ],
  },
  {
    id: '10-engineering',
    title: '第 10 部 · 工程实践',
    lessons: [
      {
        num: '10.1',
        title: 'Cargo workspace 与 Bazel 双构建',
        slug: 'build-system',
        summary: '一个仓库两套构建系统，为什么值得。',
        outline: [
          'Cargo workspace 的组织与依赖收敛',
          'Bazel 那一套：MODULE.bazel、defs.bzl、rbe',
          '两套怎么保持一致',
          'justfile 把常用命令收口',
        ],
        takeaway: '双构建的代价很实在，换来的是远程缓存与可复现性。',
        sources: [
          { path: 'codex-rs/Cargo.toml', note: 'workspace' },
          { path: 'MODULE.bazel', note: 'Bazel 模块' },
          { path: 'defs.bzl', note: '自定义规则' },
          { path: 'justfile', note: '命令收口' },
        ],
        star: true,
      },
      {
        num: '10.2',
        title: '测试策略',
        slug: 'testing',
        summary: '单测、快照、以及协议级的 test client。',
        outline: [
          'AGENTS.md 里的测试规约',
          '快照测试在 TUI 与 core 里的用法',
          'app-server-test-client：按协议驱动整个服务端',
          'mock provider 与录制回放',
        ],
        takeaway: '有了协议级 test client，前端与内核可以各自独立演进。',
        sources: [
          { path: 'codex-rs/app-server-test-client/src', note: '协议级测试客户端', dir: true },
          { path: 'AGENTS.md', note: 'Tests 一节' },
          { path: 'codex-rs/core/src/test_support.rs', note: '测试辅助' },
        ],
        star: true,
      },
      {
        num: '10.3',
        title: '遥测与可观测性',
        slug: 'telemetry',
        summary: 'otel、analytics、rollout-trace 三条线。',
        outline: [
          'otel 接入与可关闭性',
          'analytics 采什么、不采什么',
          'rollout-trace：本地可回放的完整轨迹',
          'tracing 在 app-server 里的用法',
        ],
        takeaway: '对 agent 来说，「能回放一次失败的对话」比任何指标都值钱。',
        sources: [
          { path: 'codex-rs/otel/src', note: 'OpenTelemetry', dir: true },
          { path: 'codex-rs/analytics/src', note: '分析', dir: true },
          { path: 'codex-rs/rollout-trace/src', note: '轨迹回放', dir: true },
        ],
      },
      {
        num: '10.4',
        title: '发布与分发',
        slug: 'release',
        summary: '多平台产物、安装脚本、版本与更新。',
        outline: [
          '各平台 target 与产物命名',
          '安装脚本的两个下载源与回退',
          'codex update 的实现',
          'features crate 与灰度',
        ],
        takeaway: '一个跨平台 CLI 的发布复杂度，往往和它的核心代码量不成比例。',
        sources: [
          { path: 'README.md', note: '安装方式一览' },
          { path: 'codex-rs/features/src', note: '特性开关', dir: true },
          { path: '.github/workflows', note: '发布流水线', dir: true },
        ],
      },
      {
        num: '10.5',
        title: '读 AGENTS.md',
        slug: 'agents-md',
        summary: '这个仓库写给贡献者和 agent 的两万字规约。',
        outline: [
          'Rust 风格约定里那些非常规的条款',
          'Code Review Rules：他们怎么定义「好的改动」',
          'TUI 约定：为什么要专门写一节',
          'App-server API Development Best Practices',
          '这份文件本身就是 Codex 的输入——自举的一面',
        ],
        takeaway: '这是全仓库信息密度最高的一个文件，值得逐段读。',
        sources: [
          { path: 'AGENTS.md', note: '规约本体' },
          { path: 'docs/contributing.md', note: '贡献指南' },
          { path: '.codex', note: '仓库自己给 Codex 的配置', dir: true },
        ],
        star: true,
      },
    ],
  },
  {
    id: 'appendix',
    title: '附录',
    lessons: [
      {
        title: 'crate 速查表',
        slug: 'crate-index',
        summary: '按字母序列出主要 crate 与一句话职责。',
        outline: ['入口与前端', '协议', '内核', '执行与沙箱', '扩展', '基础设施'],
        takeaway: '遇到不认识的 crate 先查这里。',
        sources: [{ path: 'codex-rs/Cargo.toml', note: 'workspace 成员' }],
      },
      {
        title: '术语表',
        slug: 'glossary',
        summary: 'thread / turn / item / rollout / skill / hook … 一次讲清。',
        outline: ['会话相关', '执行相关', '扩展相关', '容易混淆的几组'],
        takeaway: 'Codex 的术语相当自洽，但和别的 agent 框架不完全对得上。',
        sources: [
          { path: 'codex-rs/protocol/src', note: '术语的权威定义都在类型里', dir: true },
        ],
      },
      {
        title: '调试配方',
        slug: 'debug-recipes',
        summary: '十来个「想看 X 该怎么办」的具体做法。',
        outline: ['看最终 prompt', '看协议报文', '单独试沙箱', '回放一次会话', '定位工具调度'],
        takeaway: '这些配方大多只是一条命令，但知道它存在能省几小时。',
        sources: [{ path: 'codex-rs/cli/src/debug_sandbox.rs', note: 'debug 子命令' }],
      },
      {
        title: '给 Rust 不熟的读者',
        slug: 'rust-primer',
        summary: '读这个仓库真正会挡路的那几个 Rust 概念。',
        outline: [
          '所有权在这里主要以 `Arc<Mutex<…>>` 的形态出现',
          'async / tokio：task、channel、select',
          'trait object 与泛型的取舍',
          'serde 的派生宏怎么读',
          '不用全懂：能顺着类型名找到定义就够了',
        ],
        takeaway: '读懂这个仓库需要的 Rust，比写这个仓库需要的少得多。',
        sources: [{ path: 'codex-rs/rust-toolchain.toml', note: '工具链版本' }],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// 生成
// ---------------------------------------------------------------------------

/** @param {Lesson} lesson */
function label(lesson) {
  return lesson.num ? `${lesson.num} ${lesson.title}` : lesson.title
}

function jsonString(value) {
  return JSON.stringify(value)
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function renderToc() {
  const body = parts
    .map((part) => {
      const lessons = part.lessons
        .map((lesson) => {
          const fields = [
            lesson.num ? `        num: ${jsonString(lesson.num)},` : null,
            `        title: ${jsonString(lesson.title)},`,
            `        slug: ${jsonString(`${part.id}/${lesson.slug}`)},`,
            `        summary: ${jsonString(lesson.summary)},`,
            lesson.deep ? '        deep: true,' : null,
            lesson.star ? '        star: true,' : null,
          ].filter(Boolean)
          return `      {\n${fields.join('\n')}\n      },`
        })
        .join('\n')

      return `  {\n    id: ${jsonString(part.id)},\n    title: ${jsonString(part.title)},\n    lessons: [\n${lessons}\n    ],\n  },`
    })
    .join('\n')

  return `// 本文件由 scripts/gen-content.mjs 生成，请勿手工编辑。
// 修改章节大纲请编辑 scripts/gen-content.mjs 后运行 \`npm run gen\`。

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
${body}
]

export const flatLessons: Lesson[] = toc.flatMap((part) => part.lessons)

export function lessonLabel(lesson: Lesson): string {
  return lesson.num ? \`\${lesson.num} \${lesson.title}\` : lesson.title
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
`
}

function renderRegistry() {
  const entries = parts
    .flatMap((part) =>
      part.lessons.map((lesson) => {
        const slug = `${part.id}/${lesson.slug}`
        return `  ${jsonString(slug)}: () => import(${jsonString(`./${slug}.mdx`)}),`
      }),
    )
    .join('\n')

  return `// 本文件由 scripts/gen-content.mjs 生成，请勿手工编辑。
// 使用静态字符串字面量的动态 import，便于 bundler 做代码分割。
import type { ComponentType } from 'react'

type MdxModule = { default: ComponentType }

export const registry: Record<string, () => Promise<MdxModule>> = {
${entries}
}
`
}

/**
 * 把一段中文说明变成对 MDX 安全的文本。
 *
 * MDX 会把裸的 `<` 当成 JSX 标签开头、把 `{` 当成表达式——大纲里写
 * `Arc<Mutex<…>>` 或 `{ "method": … }` 会直接让整个构建挂掉。
 * 反引号包起来的行内代码本身是安全的，所以只转义代码外的部分。
 */
function mdxSafe(text) {
  return text
    .split(/(`[^`]*`)/)
    .map((chunk, i) => (i % 2 === 1 ? chunk : chunk.replace(/</g, '&lt;').replace(/\{/g, '&#123;')))
    .join('')
}

/** 骨架页：即使正文没写，也先把「该读哪些文件」和提纲摆出来 */
function renderSkeleton(lesson) {
  const sources = lesson.sources
    .map((s) => {
      const dir = s.dir ? ', dir: true' : ''
      return `    { path: ${jsonString(s.path)}, note: ${jsonString(s.note)}${dir} },`
    })
    .join('\n')

  const outline = lesson.outline.map((item) => `- ${mdxSafe(item)}`).join('\n')

  return `<SourceMap
  entries={[
${sources}
  ]}
/>

## 学习提纲

${outline}

<Callout type="note" title="这一章还是骨架">

正文尚未写完。上面的「本章对应源码」已经是可用的：按顺序打开那几个文件，
配合提纲自己读一遍，比等这里写完更快。

</Callout>

## 一句话结论

${mdxSafe(lesson.takeaway)}
`
}

async function main() {
  await mkdir(join(ROOT, 'lib'), { recursive: true })
  await writeFile(join(ROOT, 'lib/toc.ts'), renderToc(), 'utf8')

  await mkdir(join(ROOT, 'content'), { recursive: true })
  await writeFile(join(ROOT, 'content/registry.ts'), renderRegistry(), 'utf8')

  let created = 0
  let kept = 0

  for (const part of parts) {
    const dir = join(ROOT, 'content', part.id)
    await mkdir(dir, { recursive: true })

    for (const lesson of part.lessons) {
      const file = join(dir, `${lesson.slug}.mdx`)
      if (await exists(file)) {
        kept += 1
        continue
      }
      await writeFile(file, renderSkeleton(lesson), 'utf8')
      created += 1
    }
  }

  const total = parts.reduce((n, part) => n + part.lessons.length, 0)
  const deep = parts.reduce((n, part) => n + part.lessons.filter((l) => l.deep).length, 0)

  console.log(`章节共 ${total} 章，其中标记为精讲 ${deep} 章`)
  console.log(`MDX：新建 ${created}，保留 ${kept}`)
  console.log('已写出 lib/toc.ts 与 content/registry.ts')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
