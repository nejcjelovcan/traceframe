import type { IconCategory, IconMeta, IconName } from './types.js'

/** Metadata for all icons including descriptions, categories, and usage guidelines */
export const ICON_METADATA: Record<IconName, IconMeta> = {
  // ============================================
  // Navigation
  // ============================================
  'chevron-down': {
    description: 'Downward chevron arrow',
    category: 'navigation',
    usage: 'Use for dropdowns, expandable sections, or "show more" actions',
    aliases: ['expand', 'dropdown', 'down'],
  },
  'chevron-up': {
    description: 'Upward chevron arrow',
    category: 'navigation',
    usage: 'Use for collapsing sections or "show less" actions',
    aliases: ['collapse', 'up'],
  },
  'chevron-right': {
    description: 'Rightward chevron arrow',
    category: 'navigation',
    usage: 'Use for navigation forward, nested items, or collapsed state',
    aliases: ['next', 'forward', 'right'],
  },
  'chevron-left': {
    description: 'Leftward chevron arrow',
    category: 'navigation',
    usage: 'Use for navigation back or previous items',
    aliases: ['back', 'previous', 'left'],
  },
  'arrow-left': {
    description: 'Left arrow',
    category: 'navigation',
    usage: 'Use for back navigation links (stronger than chevron)',
    aliases: ['back', 'return'],
  },
  'arrow-right': {
    description: 'Right arrow',
    category: 'navigation',
    usage: 'Use for forward navigation or call-to-action buttons',
    aliases: ['next', 'forward', 'proceed'],
  },

  // ============================================
  // Actions
  // ============================================
  search: {
    description: 'Magnifying glass',
    category: 'action',
    usage: 'Use for search inputs and search-related actions',
    aliases: ['find', 'lookup'],
  },
  'search-off': {
    description: 'Magnifying glass with slash',
    category: 'action',
    usage: 'Use for "no results found" empty states',
    aliases: ['no-results', 'not-found'],
  },
  close: {
    description: 'X mark / close',
    category: 'action',
    usage: 'Use for close buttons, dismiss actions, or clear inputs',
    aliases: ['x', 'dismiss', 'clear', 'remove'],
  },
  check: {
    description: 'Checkmark',
    category: 'action',
    usage: 'Use for success states, selected items, or completed actions',
    aliases: ['success', 'done', 'selected', 'confirm'],
  },
  copy: {
    description: 'Copy/duplicate icon',
    category: 'action',
    usage: 'Use for copy-to-clipboard actions',
    aliases: ['clipboard', 'duplicate'],
  },

  // ============================================
  // Status
  // ============================================
  'alert-circle': {
    description: 'Exclamation mark in circle',
    category: 'status',
    usage: 'Use for errors, warnings, or important alerts',
    aliases: ['error', 'warning', 'alert', 'danger'],
  },
  'info-circle': {
    description: 'Information icon in circle',
    category: 'status',
    usage: 'Use for informational tooltips or help text',
    aliases: ['info', 'help', 'hint'],
  },
  resolved: {
    description: 'Eye with checkmark',
    category: 'status',
    usage: 'Use for resolved/verified imports or confirmed references',
    aliases: ['verified', 'confirmed', 'found', 'visible'],
  },
  unresolved: {
    description: 'Eye with X mark',
    category: 'status',
    usage: 'Use for unresolved imports or broken references',
    aliases: ['broken', 'missing', 'not-found', 'error'],
  },
  pending: {
    description: 'Circle with dot',
    category: 'status',
    usage: 'Use for pending/in-progress states',
    aliases: ['in-progress', 'loading', 'processing'],
  },
  empty: {
    description: 'Empty circle',
    category: 'status',
    usage: 'Use for empty/unset/null states',
    aliases: ['null', 'undefined', 'unset', 'blank'],
  },

  // ============================================
  // Sorting
  // ============================================
  'sort-asc': {
    description: 'Sort ascending indicator',
    category: 'sorting',
    usage: 'Use in table headers to indicate ascending sort order',
    aliases: ['sort-up', 'ascending'],
  },
  'sort-desc': {
    description: 'Sort descending indicator',
    category: 'sorting',
    usage: 'Use in table headers to indicate descending sort order',
    aliases: ['sort-down', 'descending'],
  },
  'sort-none': {
    description: 'Unsorted indicator',
    category: 'sorting',
    usage: 'Use in table headers to indicate sortable but unsorted column',
    aliases: ['sortable', 'unsorted'],
  },

  // ============================================
  // Theme
  // ============================================
  sun: {
    description: 'Sun icon',
    category: 'theme',
    usage: 'Use for light theme option in theme switchers',
    aliases: ['light', 'day'],
  },
  moon: {
    description: 'Moon icon',
    category: 'theme',
    usage: 'Use for dark theme option in theme switchers',
    aliases: ['dark', 'night'],
  },
  desktop: {
    description: 'Desktop/monitor icon',
    category: 'theme',
    usage: 'Use for system/auto theme option in theme switchers',
    aliases: ['system', 'auto', 'monitor'],
  },

  // ============================================
  // Entity (Domain-specific)
  // ============================================
  package: {
    description: 'Package/box icon',
    category: 'entity',
    usage: 'Use to represent npm packages or library dependencies',
    aliases: ['npm', 'library', 'dependency', 'module'],
  },
  component: {
    description: 'Puzzle piece icon',
    category: 'entity',
    usage: 'Use to represent React components in the codebase',
    aliases: ['puzzle', 'react-component', 'widget'],
  },
  hierarchy: {
    description: 'Binary tree structure',
    category: 'entity',
    usage: 'Use for component hierarchy or tree structures',
    aliases: ['tree', 'structure', 'parent-child', 'nesting'],
  },
  file: {
    description: 'File/document icon',
    category: 'entity',
    usage: 'Use to represent source files',
    aliases: ['document', 'source'],
  },
  'file-code': {
    description: 'File with code brackets',
    category: 'entity',
    usage: 'Use for source code files (.ts, .tsx, .js)',
    aliases: ['source-file', 'code-file', 'typescript', 'javascript'],
  },
  'file-search': {
    description: 'File with magnifying glass',
    category: 'entity',
    usage: 'Use for "search in files" or file exploration features',
    aliases: ['search-file', 'find-in-files'],
  },
  'file-description': {
    description: 'File with lines/text',
    category: 'entity',
    usage: 'Use for documentation or props/interface definitions',
    aliases: ['docs', 'documentation', 'readme'],
  },
  'location-code': {
    description: 'Location pin with code',
    category: 'entity',
    usage: 'Use for code locations, line numbers, or source positions',
    aliases: ['line-number', 'position', 'source-location'],
  },
  external: {
    description: 'Globe icon',
    category: 'entity',
    usage: 'Use for external dependencies from node_modules or third-party',
    aliases: ['npm', 'node-modules', 'third-party', 'world'],
  },
  internal: {
    description: 'Folder with code',
    category: 'entity',
    usage: 'Use for local/internal imports within the project',
    aliases: ['local', 'project', 'workspace', 'relative'],
  },

  // ============================================
  // Code (Domain-specific)
  // ============================================
  code: {
    description: 'Code brackets < />',
    category: 'code',
    usage: 'Use for literal code values or generic code representation',
    aliases: ['jsx', 'literal', 'markup'],
  },
  element: {
    description: 'Angle brackets < >',
    category: 'code',
    usage: 'Use for JSX elements or component usage/instances',
    aliases: ['jsx-element', 'tag', 'usage', 'instance'],
  },
  brackets: {
    description: 'Square brackets [ ]',
    category: 'code',
    usage: 'Use for arrays or indexed access',
    aliases: ['array', 'index', 'square'],
  },
  dots: {
    description: 'Three dots / ellipsis',
    category: 'code',
    usage: 'Use for spread props ({...props}) or "more" indicators',
    aliases: ['spread', 'ellipsis', 'more'],
  },
  toggle: {
    description: 'Toggle switch icon',
    category: 'code',
    usage: 'Use for boolean props or toggle states',
    aliases: ['boolean', 'switch', 'flag'],
  },
  percentage: {
    description: 'Percentage symbol',
    category: 'code',
    usage: 'Use for percentage metrics or type safety scores',
    aliases: ['percent', 'ratio', 'score'],
  },
  prop: {
    description: 'Key icon',
    category: 'code',
    usage: 'Use for component props or attributes in general',
    aliases: ['attribute', 'property', 'key-value'],
  },
  'prop-name': {
    description: 'Tag/label icon',
    category: 'code',
    usage: 'Use for prop names or identifiers',
    aliases: ['identifier', 'name', 'label', 'tag'],
  },
  'prop-value': {
    description: 'Curly braces { }',
    category: 'code',
    usage: 'Use for prop values or expressions',
    aliases: ['value', 'expression', 'data'],
  },
  string: {
    description: 'Quotation marks',
    category: 'code',
    usage: 'Use for string literal prop values',
    aliases: ['text', 'literal', 'quotes'],
  },
  function: {
    description: 'Function symbol',
    category: 'code',
    usage: 'Use for function props, callbacks, or handlers',
    aliases: ['callback', 'handler', 'method', 'lambda'],
  },

  // ============================================
  // Data (Domain-specific)
  // ============================================
  dashboard: {
    description: 'Dashboard layout with tiles',
    category: 'data',
    usage: 'Use for dashboard/overview pages',
    aliases: ['home', 'overview', 'main'],
  },
  database: {
    description: 'Database icon',
    category: 'data',
    usage: 'Use for data-related features or storage',
    aliases: ['storage', 'data'],
  },
  chart: {
    description: 'Bar chart icon',
    category: 'data',
    usage: 'Use for statistics, metrics, or analytics',
    aliases: ['stats', 'analytics', 'metrics', 'bar-chart'],
  },
  users: {
    description: 'Multiple users icon',
    category: 'data',
    usage: 'Use for user counts or team-related metrics',
    aliases: ['people', 'team', 'contributors'],
  },
  components: {
    description: 'Grid of components',
    category: 'data',
    usage: 'Use for component counts or component lists',
    aliases: ['grid', 'count', 'list'],
  },
}

/** Get icons by category */
export function getIconsByCategory(category: IconCategory): IconName[] {
  return (Object.entries(ICON_METADATA) as [IconName, IconMeta][])
    .filter(([, meta]) => meta.category === category)
    .map(([name]) => name)
}

/** Get all icon names */
export function getAllIconNames(): IconName[] {
  return Object.keys(ICON_METADATA) as IconName[]
}

/** Search icons by name, description, or aliases */
export function searchIcons(query: string): IconName[] {
  const q = query.toLowerCase()
  return (Object.entries(ICON_METADATA) as [IconName, IconMeta][])
    .filter(([name, meta]) => {
      return (
        name.includes(q) ||
        meta.description.toLowerCase().includes(q) ||
        meta.usage.toLowerCase().includes(q) ||
        meta.aliases?.some((alias) => alias.includes(q))
      )
    })
    .map(([name]) => name)
}
