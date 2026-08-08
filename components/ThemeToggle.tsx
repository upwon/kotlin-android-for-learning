'use client'

import { useEffect, useState } from 'react'
import {
  applyPreference,
  readPreference,
  subscribeToSystemTheme,
  type ThemePreference,
} from '@/lib/theme'

const ORDER: ThemePreference[] = ['system', 'light', 'dark']

const LABELS: Record<ThemePreference, { icon: string; text: string }> = {
  system: { icon: '🖥️', text: '跟随系统' },
  light: { icon: '☀️', text: '浅色' },
  dark: { icon: '🌙', text: '深色' },
}

export function ThemeToggle() {
  // 服务端不知道用户偏好，先渲染占位，挂载后再显示真实状态，避免 hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [preference, setPreference] = useState<ThemePreference>('system')

  useEffect(() => {
    setPreference(readPreference())
    setMounted(true)
  }, [])

  // 偏好为「跟随系统」时，系统设置变化要实时生效
  useEffect(() => {
    if (preference !== 'system') return
    return subscribeToSystemTheme(() => applyPreference('system'))
  }, [preference])

  function cycle() {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]
    setPreference(next)
    applyPreference(next)
  }

  const label = LABELS[preference]

  return (
    <button
      type="button"
      onClick={cycle}
      title={`当前：${label.text}（点击切换）`}
      aria-label={`切换配色，当前为${label.text}`}
      className="flex items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {/* 未挂载时用等宽占位，避免布局跳动 */}
      <span aria-hidden className="w-4 text-center">
        {mounted ? label.icon : ''}
      </span>
      <span className="hidden sm:inline">{mounted ? label.text : ' '}</span>
    </button>
  )
}

export default ThemeToggle
