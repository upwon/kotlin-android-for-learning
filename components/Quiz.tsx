'use client'

import { useMemo, useState, type ReactNode } from 'react'

export type QuizType = 'single' | 'multi' | 'fill'

type QuizProps = {
  /** 题干 */
  question: ReactNode
  /** single = 单选，multi = 多选，fill = 填空 */
  type?: QuizType
  /** 选择题的选项 */
  options?: string[]
  /**
   * 正确答案：
   * - single / multi 传选项下标，如 `1` 或 `[0, 2]`
   * - fill 传参考答案字符串；传数组表示多个写法都算对
   */
  answer: number | number[] | string | string[]
  /** 可选的题号 */
  index?: number
  /** 解析，写在 children 里，可以包含代码块 */
  children?: ReactNode
}

/** 填空题判分前的归一化：忽略空白与中英文引号差异 */
function normalize(raw: string): string {
  return raw
    .trim()
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, '')
    .replace(/;+$/, '')
}

export function Quiz({ question, type = 'single', options = [], answer, index, children }: QuizProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const correctIndices = useMemo(() => {
    if (type === 'fill') return []
    return Array.isArray(answer) ? (answer as number[]) : [answer as number]
  }, [answer, type])

  const acceptedAnswers = useMemo(() => {
    if (type !== 'fill') return []
    return (Array.isArray(answer) ? answer : [answer]) as string[]
  }, [answer, type])

  const isCorrect = submitted
    ? type === 'fill'
      ? acceptedAnswers.some((a) => normalize(a) === normalize(input))
      : selected.length === correctIndices.length && selected.every((i) => correctIndices.includes(i))
    : false

  const canSubmit = type === 'fill' ? input.trim().length > 0 : selected.length > 0

  function toggle(i: number) {
    if (submitted) return
    setSelected((prev) => {
      if (type === 'single') return [i]
      return prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    })
  }

  function reset() {
    setSubmitted(false)
    setSelected([])
    setInput('')
  }

  return (
    <div
      data-quiz={type}
      data-quiz-state={submitted ? (isCorrect ? 'correct' : 'incorrect') : 'pending'}
      className="not-prose my-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 shrink-0 rounded-md bg-indigo-100 px-2 py-0.5 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {index != null ? `Q${index}` : 'Q'}
        </span>
        <div className="flex-1 text-[0.95rem] font-medium leading-relaxed text-slate-800 dark:text-slate-100">
          {question}
          {type === 'multi' && (
            <span className="ml-2 align-middle text-xs font-normal text-slate-500 dark:text-slate-400">
              （多选）
            </span>
          )}
        </div>
      </div>

      {type === 'fill' ? (
        <div className="mt-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={submitted}
            rows={2}
            spellCheck={false}
            placeholder="在这里写你的答案…"
            className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-[0.85rem] text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-70 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-indigo-900/50"
          />
        </div>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {options.map((option, i) => {
            const picked = selected.includes(i)
            const shouldBePicked = correctIndices.includes(i)

            let tone = 'border-slate-200 dark:border-slate-700'
            if (submitted) {
              if (shouldBePicked) tone = 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40'
              else if (picked) tone = 'border-rose-400 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/40'
            } else if (picked) {
              tone = 'border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-950/40'
            }

            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  disabled={submitted}
                  className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-[0.9rem] leading-relaxed transition-colors ${tone} ${
                    submitted ? 'cursor-default' : 'hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap text-slate-700 dark:text-slate-200">{option}</span>
                  {submitted && shouldBePicked && <span aria-hidden>✅</span>}
                  {submitted && picked && !shouldBePicked && <span aria-hidden>❌</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-3 flex items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!canSubmit}
            className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            提交
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            再试一次
          </button>
        )}
        {submitted && (
          <span
            className={`text-sm font-semibold ${
              isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isCorrect ? '✅ 答对了' : type === 'fill' ? '⚠️ 和参考答案不完全一致' : '❌ 再想想'}
          </span>
        )}
      </div>

      {submitted && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 dark:border-slate-700 dark:bg-slate-950/60">
          {type === 'fill' && (
            <div className="mb-2">
              <div className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">参考答案</div>
              {acceptedAnswers.map((a, i) => (
                <pre
                  key={i}
                  className="overflow-x-auto rounded border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[0.82rem] text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <code>{a}</code>
                </pre>
              ))}
            </div>
          )}
          <div className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">解析</div>
          <div className="quiz-explanation text-[0.9rem] leading-relaxed text-slate-700 dark:text-slate-300">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

export default Quiz
