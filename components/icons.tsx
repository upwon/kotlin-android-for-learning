import type { SVGProps } from 'react'

/**
 * 站内图标系统。
 *
 * 统一约定：24 视窗、1.75 笔画、round 端点与拐角、currentColor 描边。
 * 不用 emoji——它们在不同平台字形不一，且笔画权重和站内其他元素对不齐。
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Icon({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

/** 说明 / 备注 */
export const InfoIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.6h.01" />
  </Icon>
)

/** 易错点 */
export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.3 4.2 2.6 17.4A2 2 0 0 0 4.3 20.4h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4" />
    <path d="M12 17h.01" />
  </Icon>
)

/** 技巧 */
export const BulbIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 18h6" />
    <path d="M10 21.5h4" />
    <path d="M12 2.5a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2a6.5 6.5 0 0 0-4-11.6Z" />
  </Icon>
)

/** 结论 */
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.4 12.3 2.5 2.4 4.7-4.9" />
  </Icon>
)

/** Java 对照 */
export const CoffeeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8.5h13v6a4.5 4.5 0 0 1-4.5 4.5h-4A4.5 4.5 0 0 1 4 14.5v-6Z" />
    <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M7.5 3v2.5M11 3v2.5M14.5 3v2.5" />
  </Icon>
)

/** 重点章节 */
export const StarIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3.6 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8L12 3.6Z" />
  </Icon>
)

export const ChevronIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </Icon>
)

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Icon>
)

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
)

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Icon>
)

export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </Icon>
)

export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.5 8.5 0 1 0 10.2 10.2Z" />
  </Icon>
)

export const MonitorIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2" />
    <path d="M8.5 20.5h7M12 16.5v4" />
  </Icon>
)

/** 标题锚点 */
export const LinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.6 1.6" />
    <path d="M13.5 10.5a4 4 0 0 0-5.7 0L5 13.3a4 4 0 0 0 5.7 5.7l1.6-1.6" />
  </Icon>
)

export const ExternalIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.5 4.5h6v6" />
    <path d="M19.5 4.5 11 13" />
    <path d="M18 14.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
  </Icon>
)

/** 运行（代码块可运行标记） */
export const PlayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7.5 5.2v13.6l11-6.8-11-6.8Z" />
  </Icon>
)
