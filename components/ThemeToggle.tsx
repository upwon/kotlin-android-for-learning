'use client'

import { useEffect, useState } from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from '@/components/icons'
import {
  applyPreference,
  readPreference,
  subscribeToSystemTheme,
  type ThemePreference,
} from '@/lib/theme'

const ORDER: ThemePreference[] = ['system', 'light', 'dark']

const LABELS: Record<ThemePreference, { Icon: typeof SunIcon; text: string }> = {
  system: { Icon: MonitorIcon, text: '跟随系统' },
  light: { Icon: SunIcon, text: '浅色' },
  dark: { Icon: MoonIcon, text: '深色' },
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

  const { Icon, text } = LABELS[preference]

  return (
    <button
      type="button"
      onClick={cycle}
      title={`当前：${text}（点击切换）`}
      aria-label={`切换配色，当前为${text}`}
      className="flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      {/* 未挂载时留出等宽占位，避免布局跳动 */}
      <span className="flex w-[15px] justify-center">{mounted && <Icon size={15} />}</span>
      <span className="hidden w-14 text-left sm:inline">{mounted ? text : ''}</span>
    </button>
  )
}

export default ThemeToggle
