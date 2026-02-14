/** Icon size presets */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** Icon category for organization */
export type IconCategory =
  | 'navigation'
  | 'action'
  | 'status'
  | 'sorting'
  | 'theme'
  | 'entity'
  | 'code'
  | 'data'
  | 'agentic'
  | 'brand'
  | 'developer'

/** All available icon names */
export type IconName =
  // Navigation
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-right'
  | 'chevron-left'
  | 'arrow-left'
  | 'arrow-right'
  // Actions
  | 'search'
  | 'search-off'
  | 'close'
  | 'check'
  | 'copy'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'settings'
  | 'menu'
  | 'filter'
  | 'link'
  | 'upload'
  | 'download'
  | 'eye-off'
  | 'lock'
  | 'help'
  | 'bookmark'
  | 'dots-vertical'
  // Status
  | 'alert-circle'
  | 'info-circle'
  | 'resolved'
  | 'unresolved'
  | 'pending'
  | 'empty'
  | 'success'
  | 'error'
  | 'warning'
  // Sorting
  | 'sort-asc'
  | 'sort-desc'
  | 'sort-none'
  // Theme
  | 'sun'
  | 'moon'
  | 'desktop'
  // Entity
  | 'package'
  | 'component'
  | 'hierarchy'
  | 'file'
  | 'file-code'
  | 'file-search'
  | 'file-description'
  | 'location-code'
  | 'external'
  | 'external-link'
  | 'internal'
  | 'folder'
  | 'hash'
  // Code
  | 'code'
  | 'element'
  | 'brackets'
  | 'dots'
  | 'toggle'
  | 'percentage'
  | 'prop'
  | 'prop-name'
  | 'prop-value'
  | 'string'
  | 'function'
  // Data
  | 'dashboard'
  | 'database'
  | 'chart'
  | 'users'
  | 'components'
  | 'calendar'
  | 'clock'
  | 'history'
  // Agentic
  | 'agent'
  | 'orchestrator'
  | 'write'
  | 'read'
  | 'edit'
  | 'tool'
  | 'text'
  | 'prompt'
  | 'idle'
  | 'waiting'
  | 'implement'
  | 'refine'
  | 'working'
  | 'watching'
  | 'message'
  | 'polling'
  | 'start'
  | 'stop'
  // Brand
  | 'github'
  | 'linear'
  // Developer
  | 'terminal'
  | 'git-branch'
  | 'git-merge'
  | 'git-pull-request'
  | 'bug'
  | 'test-tube'
  | 'rocket'
  | 'sparkles'
  | 'bolt'
  | 'palette'

/** Metadata for a single icon */
export interface IconMeta {
  /** Human-readable description of the icon's purpose */
  description: string
  /** Category for grouping */
  category: IconCategory
  /** Usage guidelines for AI agents and developers */
  usage: string
  /** Optional aliases (for discoverability) */
  aliases?: string[]
}

/** Size to pixel mapping */
export const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

/** Sizes that use lighter stroke */
export const LIGHT_STROKE_SIZES: IconSize[] = ['xl', '2xl']

/** Category labels for display */
export const CATEGORY_LABELS: Record<IconCategory, string> = {
  navigation: 'Navigation',
  action: 'Actions',
  status: 'Status & Feedback',
  sorting: 'Sorting',
  theme: 'Theme',
  entity: 'Entities',
  code: 'Code & Props',
  data: 'Data & Metrics',
  agentic: 'Agentic Workflows',
  brand: 'Brand & Integrations',
  developer: 'Developer Tools',
}
