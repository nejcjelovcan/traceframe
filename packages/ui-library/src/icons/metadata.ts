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
  plus: {
    description: 'Plus sign for adding',
    category: 'action',
    usage: 'Use for add/create actions, increment, expand',
    aliases: ['add', 'create', 'new', 'increment', 'expand'],
  },
  minus: {
    description: 'Minus sign for removing',
    category: 'action',
    usage: 'Use for remove actions, decrement, collapse',
    aliases: ['remove', 'subtract', 'decrement', 'collapse'],
  },
  trash: {
    description: 'Trash can for deletion',
    category: 'action',
    usage: 'Use for destructive delete actions (distinct from close/dismiss)',
    aliases: ['delete', 'destroy', 'bin', 'garbage', 'discard'],
  },
  settings: {
    description: 'Gear/cog icon for configuration',
    category: 'action',
    usage: 'Use for settings, preferences, configuration panels',
    aliases: ['gear', 'cog', 'preferences', 'config', 'configuration', 'options'],
  },
  menu: {
    description: 'Hamburger menu (three horizontal lines)',
    category: 'action',
    usage: 'Use for mobile navigation menus, sidebar toggles',
    aliases: ['hamburger', 'sidebar', 'navigation', 'nav', 'three-lines'],
  },
  filter: {
    description: 'Funnel filter icon',
    category: 'action',
    usage: 'Use for filtering, faceted search, narrowing results',
    aliases: ['funnel', 'facet', 'narrow', 'refine-results', 'sieve'],
  },
  link: {
    description: 'Chain link icon',
    category: 'action',
    usage: 'Use for hyperlinks, URL references, linking items together',
    aliases: ['url', 'hyperlink', 'chain', 'connect', 'href'],
  },
  upload: {
    description: 'Upload arrow icon',
    category: 'action',
    usage: 'Use for file upload actions, data import',
    aliases: ['import', 'send', 'up', 'attach'],
  },
  download: {
    description: 'Download arrow icon',
    category: 'action',
    usage: 'Use for file download actions, data export',
    aliases: ['export', 'save', 'down', 'receive'],
  },
  'eye-off': {
    description: 'Eye with slash for hidden/invisible',
    category: 'action',
    usage: 'Use for toggling visibility off, hiding content, password fields',
    aliases: ['hidden', 'invisible', 'hide', 'conceal', 'password-hide'],
  },
  lock: {
    description: 'Padlock icon',
    category: 'action',
    usage: 'Use for locked/protected content, security, permissions',
    aliases: ['locked', 'secure', 'protected', 'private', 'restricted', 'security'],
  },
  help: {
    description: 'Question mark in circle',
    category: 'action',
    usage: 'Use for help tooltips, documentation links, contextual help',
    aliases: ['question', 'faq', 'support', 'docs', 'info', 'guide'],
  },
  bookmark: {
    description: 'Bookmark flag icon',
    category: 'action',
    usage: 'Use for saved/favorited items, bookmarked content',
    aliases: ['save', 'favorite', 'star', 'flag', 'pin', 'saved'],
  },
  'dots-vertical': {
    description: 'Vertical three dots (kebab menu)',
    category: 'action',
    usage: 'Use for vertical "more" menus, overflow actions',
    aliases: ['kebab', 'more-vertical', 'overflow', 'options-vertical', 'context-menu'],
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
  success: {
    description: 'Checkmark in circle for success',
    category: 'status',
    usage: 'Use for success states, completed operations, positive outcomes',
    aliases: ['completed', 'done', 'passed', 'ok', 'approved', 'valid'],
  },
  error: {
    description: 'X mark in circle for errors',
    category: 'status',
    usage: 'Use for error states, failed operations, critical problems',
    aliases: ['failed', 'failure', 'critical', 'problem', 'invalid', 'rejected'],
  },
  warning: {
    description: 'Triangle with exclamation mark for warnings',
    category: 'status',
    usage: 'Use for warning states, caution indicators, non-critical issues',
    aliases: ['caution', 'attention', 'alert-triangle', 'danger', 'risk'],
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
  'external-link': {
    description: 'Arrow pointing out of a box',
    category: 'action',
    usage: 'Use for links that open in a new tab or navigate to an external URL',
    aliases: ['open-in-new-tab', 'outbound', 'new-window', 'launch'],
  },
  internal: {
    description: 'Folder with code',
    category: 'entity',
    usage: 'Use for local/internal imports within the project',
    aliases: ['local', 'project', 'workspace', 'relative'],
  },
  folder: {
    description: 'Folder icon',
    category: 'entity',
    usage: 'Use for directories, file system organization, categories',
    aliases: ['directory', 'dir', 'category', 'group', 'collection'],
  },
  hash: {
    description: 'Hash/pound sign',
    category: 'entity',
    usage: 'Use for tags, channels, ID references, numbered items',
    aliases: ['tag', 'channel', 'number', 'pound', 'id', 'anchor'],
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
  calendar: {
    description: 'Calendar icon',
    category: 'data',
    usage: 'Use for date pickers, scheduling, date-based features',
    aliases: ['date', 'schedule', 'event', 'day', 'month', 'datepicker'],
  },
  clock: {
    description: 'Clock face icon',
    category: 'data',
    usage: 'Use for time display, timestamps, duration, time-based features',
    aliases: ['time', 'timestamp', 'duration', 'timer', 'hour', 'schedule'],
  },
  history: {
    description: 'Counter-clockwise arrow for history',
    category: 'data',
    usage: 'Use for version history, undo history, recent items, activity logs',
    aliases: ['undo', 'recent', 'past', 'changelog', 'activity', 'log', 'revert'],
  },

  // ============================================
  // Agentic Workflows
  // ============================================

  agent: {
    description: 'Robot icon for AI agent',
    category: 'agentic',
    usage: 'Use to represent an AI agent or autonomous process',
    aliases: ['robot', 'ai', 'bot', 'assistant', 'autonomous'],
  },
  orchestrator: {
    description: 'Sitemap icon for orchestration',
    category: 'agentic',
    usage: 'Use to represent an orchestrator coordinating multiple agents or workflows',
    aliases: ['coordinator', 'conductor', 'manager', 'sitemap', 'workflow'],
  },

  // -- Actions --
  write: {
    description: 'Pencil icon for writing/composing',
    category: 'agentic',
    usage: 'Use for write actions in agentic workflows (creating new content)',
    aliases: ['compose', 'create', 'author', 'pencil'],
  },
  read: {
    description: 'Open book icon for reading',
    category: 'agentic',
    usage: 'Use for read actions in agentic workflows (reading files, documents)',
    aliases: ['book', 'view', 'inspect'],
  },
  edit: {
    description: 'Pencil-in-square icon for editing',
    category: 'agentic',
    usage: 'Use for edit actions in agentic workflows (modifying existing content)',
    aliases: ['modify', 'update', 'change'],
  },
  tool: {
    description: 'Wrench icon for tool usage',
    category: 'agentic',
    usage: 'Use for tool calls or tool invocations in agentic workflows',
    aliases: ['wrench', 'utility', 'tool-call', 'tool-use'],
  },
  text: {
    description: 'Document with text lines',
    category: 'agentic',
    usage: 'Use for text content or text output in agentic workflows',
    aliases: ['content', 'output', 'document'],
  },
  prompt: {
    description: 'Terminal prompt symbol',
    category: 'agentic',
    usage: 'Use for prompts or command inputs in agentic workflows',
    aliases: ['terminal', 'command', 'input', 'instruction'],
  },

  // -- Status --
  idle: {
    description: 'Coffee cup icon for idle state',
    category: 'agentic',
    usage: 'Use for idle/inactive agent state',
    aliases: ['inactive', 'rest', 'standby', 'coffee'],
  },
  waiting: {
    description: 'Hourglass icon for waiting state',
    category: 'agentic',
    usage: 'Use for waiting/blocked agent state',
    aliases: ['hourglass', 'blocked', 'paused', 'queued'],
  },
  implement: {
    description: 'Hammer icon for implementation',
    category: 'agentic',
    usage: 'Use for implementation/building actions in agentic workflows',
    aliases: ['build', 'construct', 'hammer', 'develop'],
  },
  refine: {
    description: 'Magic wand icon for refinement',
    category: 'agentic',
    usage: 'Use for refining/polishing actions in agentic workflows',
    aliases: ['polish', 'improve', 'enhance', 'wand', 'magic'],
  },
  working: {
    description: 'Spinning loader icon for active work',
    category: 'agentic',
    usage: 'Use for active/in-progress agent state',
    aliases: ['loading', 'processing', 'busy', 'spinner', 'running'],
  },
  watching: {
    description: 'Eye icon for observing/monitoring',
    category: 'agentic',
    usage: 'Use for watching/monitoring state in agentic workflows',
    aliases: ['observe', 'monitor', 'eye', 'supervise'],
  },

  // -- Orchestration --
  message: {
    description: 'Speech bubble icon for messages',
    category: 'agentic',
    usage: 'Use for messages or communication between agents',
    aliases: ['chat', 'speech', 'conversation', 'bubble'],
  },
  polling: {
    description: 'Refresh arrows icon for polling',
    category: 'agentic',
    usage: 'Use for polling or repeated checking actions',
    aliases: ['refresh', 'retry', 'cycle', 'repeat'],
  },
  start: {
    description: 'Play button icon for starting',
    category: 'agentic',
    usage: 'Use for starting workflows or agent processes',
    aliases: ['play', 'begin', 'launch', 'run'],
  },
  stop: {
    description: 'Stop button icon for stopping',
    category: 'agentic',
    usage: 'Use for stopping workflows or agent processes',
    aliases: ['halt', 'terminate', 'end', 'kill'],
  },

  // ============================================
  // Brand & Integrations
  // ============================================
  github: {
    description: 'GitHub octocat logo',
    category: 'brand',
    usage: 'Use for GitHub integrations, repository links, PR references',
    aliases: ['octocat', 'repo', 'repository', 'gh', 'source-control', 'vcs'],
  },
  linear: {
    description: 'Linear project management icon (hexagon with L)',
    category: 'brand',
    usage: 'Use for Linear integrations, issue tracking references',
    aliases: ['issue-tracker', 'project-management', 'tickets', 'issues', 'backlog'],
  },

  // ============================================
  // Developer Tools
  // ============================================
  terminal: {
    description: 'Terminal/console window',
    category: 'developer',
    usage: 'Use for CLI, command execution, console output, shell',
    aliases: ['console', 'cli', 'shell', 'command-line', 'bash', 'cmd', 'prompt-dev'],
  },
  'git-branch': {
    description: 'Git branch fork icon',
    category: 'developer',
    usage: 'Use for branch visualization, version control branches',
    aliases: ['branch', 'fork', 'diverge', 'version-control', 'vcs'],
  },
  'git-merge': {
    description: 'Git merge icon',
    category: 'developer',
    usage: 'Use for merge operations, combining branches',
    aliases: ['merge', 'combine', 'join', 'integrate', 'converge'],
  },
  'git-pull-request': {
    description: 'Git pull request icon',
    category: 'developer',
    usage: 'Use for pull request references, code review',
    aliases: ['pr', 'pull-request', 'review', 'code-review', 'contribution'],
  },
  bug: {
    description: 'Bug/insect icon',
    category: 'developer',
    usage: 'Use for bug reports, issue tracking, debugging',
    aliases: ['debug', 'issue', 'defect', 'problem', 'insect', 'fix'],
  },
  'test-tube': {
    description: 'Test tube / flask icon',
    category: 'developer',
    usage: 'Use for testing, test runs, test results, experiments',
    aliases: ['test', 'testing', 'experiment', 'flask', 'lab', 'spec', 'unit-test'],
  },
  rocket: {
    description: 'Rocket icon for launch/deploy',
    category: 'developer',
    usage: 'Use for deployment, launches, releases, shipping features',
    aliases: ['deploy', 'launch', 'release', 'ship', 'publish', 'go-live'],
  },
  sparkles: {
    description: 'Sparkles/stars icon',
    category: 'developer',
    usage: 'Use for AI features, magic/auto actions, new features, enhancements',
    aliases: ['ai', 'magic', 'auto', 'new-feature', 'enhancement', 'generate', 'smart'],
  },
  bolt: {
    description: 'Lightning bolt icon',
    category: 'developer',
    usage: 'Use for performance, speed, instant actions, power features',
    aliases: ['lightning', 'fast', 'speed', 'instant', 'power', 'quick', 'performance'],
  },
  palette: {
    description: 'Artist palette icon',
    category: 'developer',
    usage: 'Use for design tokens, theming, color configuration, styling',
    aliases: ['colors', 'theme', 'design', 'styling', 'paint', 'appearance', 'customize'],
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
