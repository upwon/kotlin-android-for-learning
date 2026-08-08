/**
 * 主题状态：三态偏好（跟随系统 / 浅色 / 深色）。
 *
 * 真相只有一处：<html> 上的 data-theme 属性，它的值永远是**解析后**的
 * 'light' 或 'dark'（不会是 'system'）。CSS 只需要匹配这一个属性，
 * 不用再写 prefers-color-scheme 媒体查询；shiki 的双主题变量也认它。
 *
 * 用户的偏好（可能是 'system'）单独存在 localStorage 里。
 */

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'codex-internals-theme'

/** 在 <head> 里同步执行，避免首屏闪烁。内容需与本文件的逻辑保持一致。 */
export const THEME_INIT_SCRIPT = `(function(){try{
var p=localStorage.getItem('${THEME_STORAGE_KEY}');
var d=(p==='dark')||((p!=='light')&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.dataset.theme=d?'dark':'light';
}catch(e){document.documentElement.dataset.theme='light'}})()`

export function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function readPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

/** 写入偏好并立即把解析结果同步到 <html data-theme>，返回解析后的主题 */
export function applyPreference(preference: ThemePreference): ResolvedTheme {
  const resolved = preference === 'system' ? systemTheme() : preference

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolved
  }
  try {
    if (preference === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    /* 隐私模式下 localStorage 可能不可用，忽略即可 */
  }

  return resolved
}

export function currentResolvedTheme(): ResolvedTheme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/** 偏好为 system 时，跟随系统设置的实时变化 */
export function subscribeToSystemTheme(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}
