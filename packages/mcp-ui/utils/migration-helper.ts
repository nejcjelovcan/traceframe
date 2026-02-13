/**
 * Migration helper for converting non-semantic color tokens to semantic tokens.
 * Provides context-aware suggestions based on component type and usage patterns.
 */

export interface MigrationContext {
  componentType?: 'button' | 'card' | 'badge' | 'input' | 'alert' | 'link' | 'unknown'
  isInteractive?: boolean
  isDarkMode?: boolean
  hasHoverState?: boolean
  parentElement?: string | undefined
}

export interface MigrationSuggestion {
  original: string
  suggested: string
  confidence: 'high' | 'medium' | 'low'
  reasoning: string
  alternatives?: string[] | undefined
}

// Extended migration map with context-aware rules
const CONTEXT_AWARE_MIGRATIONS: Record<string, (context: MigrationContext) => MigrationSuggestion> =
  {
    // Button backgrounds
    'bg-primary-600': (ctx) => ({
      original: 'bg-primary-600',
      suggested: ctx.componentType === 'button' ? 'bg-interactive-primary' : 'bg-status-info-muted',
      confidence: ctx.componentType === 'button' ? 'high' : 'medium',
      reasoning:
        ctx.componentType === 'button'
          ? 'Primary button background should use interactive-primary token'
          : 'Primary color in non-interactive context suggests informational status',
      alternatives: ctx.componentType === 'button' ? [] : ['bg-interactive-primary'],
    }),

    'bg-primary-500': (ctx) => ({
      original: 'bg-primary-500',
      suggested: ctx.componentType === 'button' ? 'bg-interactive-primary' : 'bg-status-info-muted',
      confidence: ctx.componentType === 'button' ? 'high' : 'medium',
      reasoning:
        ctx.componentType === 'button'
          ? 'Primary button background should use interactive-primary token'
          : 'Primary color suggests informational context',
      alternatives: ctx.componentType === 'button' ? [] : ['bg-interactive-primary'],
    }),

    'bg-primary-700': (ctx) => ({
      original: 'bg-primary-700',
      suggested:
        ctx.componentType === 'button' ? 'bg-interactive-primary-hover' : 'bg-status-info-emphasis',
      confidence: ctx.componentType === 'button' ? 'high' : 'medium',
      reasoning:
        ctx.componentType === 'button'
          ? 'Darker primary button background should use interactive-primary-hover token'
          : 'Darker primary color suggests emphasis variant',
      alternatives: ctx.componentType === 'button' ? [] : ['bg-interactive-primary-hover'],
    }),

    // Hover states
    'hover:bg-neutral-100': (_ctx) => ({
      original: 'hover:bg-neutral-100',
      suggested: 'hover:bg-interactive-hover',
      confidence: 'high',
      reasoning: 'Hover state on neutral background indicates interactive element',
      alternatives: ['hover:bg-surface-subtle'],
    }),

    'hover:bg-neutral-50': (_ctx) => ({
      original: 'hover:bg-neutral-50',
      suggested: 'hover:bg-interactive-hover',
      confidence: 'high',
      reasoning: 'Light hover state for interactive elements',
      alternatives: ['hover:bg-surface-muted'],
    }),

    // Card/Container backgrounds
    'bg-neutral-50': (ctx) => ({
      original: 'bg-neutral-50',
      suggested: ctx.componentType === 'card' ? 'bg-surface-muted' : 'bg-surface-subtle',
      confidence: ctx.componentType === 'card' ? 'high' : 'medium',
      reasoning:
        ctx.componentType === 'card'
          ? 'Card backgrounds typically use surface-muted for subtle differentiation'
          : 'Light neutral background for general surface',
      alternatives: ['bg-surface'],
    }),

    'bg-neutral-100': (ctx) => ({
      original: 'bg-neutral-100',
      suggested: ctx.componentType === 'badge' ? 'bg-surface-subtle' : 'bg-surface-muted',
      confidence: ctx.componentType === 'badge' ? 'high' : 'medium',
      reasoning:
        ctx.componentType === 'badge'
          ? 'Badge backgrounds need subtle contrast'
          : 'Secondary surface background',
      alternatives: ['bg-surface-subtle'],
    }),

    // Status colors for alerts/badges (use -muted for light backgrounds)
    'bg-error-50': (_ctx) => ({
      original: 'bg-error-50',
      suggested: 'bg-status-error-muted',
      confidence: 'high',
      reasoning: 'Error background for status indication uses muted variant',
      alternatives: ['bg-status-error'],
    }),

    'bg-success-50': (_ctx) => ({
      original: 'bg-success-50',
      suggested: 'bg-status-success-muted',
      confidence: 'high',
      reasoning: 'Success background for positive status uses muted variant',
      alternatives: ['bg-status-success'],
    }),

    'bg-warning-50': (_ctx) => ({
      original: 'bg-warning-50',
      suggested: 'bg-status-warning-muted',
      confidence: 'high',
      reasoning: 'Warning background for caution status uses muted variant',
      alternatives: ['bg-status-warning'],
    }),

    'bg-primary-50': (_ctx) => ({
      original: 'bg-primary-50',
      suggested: 'bg-status-info-muted',
      confidence: 'high',
      reasoning: 'Info/primary background for status indication uses muted variant',
      alternatives: ['bg-status-info'],
    }),

    // Text colors with context
    'text-neutral-900': (_ctx) => ({
      original: 'text-neutral-900',
      suggested: 'text-foreground',
      confidence: 'high',
      reasoning: 'Primary text color for main content',
      alternatives: [],
    }),

    'text-neutral-500': (ctx) => ({
      original: 'text-neutral-500',
      suggested: ctx.parentElement === 'label' ? 'text-foreground-muted' : 'text-foreground-muted',
      confidence: 'high',
      reasoning: 'Secondary text for descriptions and labels',
      alternatives: [],
    }),

    'text-primary-600': (ctx) => ({
      original: 'text-primary-600',
      suggested:
        ctx.componentType === 'link' ? 'text-interactive-accent' : 'text-status-info-foreground',
      confidence: ctx.componentType === 'link' ? 'high' : 'medium',
      reasoning:
        ctx.componentType === 'link'
          ? 'Links use interactive-accent token'
          : 'Primary text color for emphasis',
      alternatives: ctx.componentType === 'link' ? [] : ['text-interactive-accent'],
    }),

    // Border colors
    'border-neutral-200': (ctx) => ({
      original: 'border-neutral-200',
      suggested: ctx.componentType === 'input' ? 'border-border' : 'border-border',
      confidence: 'high',
      reasoning: 'Standard border color for inputs and containers',
      alternatives: [],
    }),

    'border-neutral-100': (_ctx) => ({
      original: 'border-neutral-100',
      suggested: 'border-border-muted',
      confidence: 'high',
      reasoning: 'Subtle border for dividers and secondary elements',
      alternatives: ['border-border'],
    }),

    // Focus states
    'focus:border-primary-500': (_ctx) => ({
      original: 'focus:border-primary-500',
      suggested: 'focus:border-ring',
      confidence: 'high',
      reasoning: 'Focus states should use the ring token',
      alternatives: ['focus:border-interactive-active'],
    }),

    'ring-primary-500': (_ctx) => ({
      original: 'ring-primary-500',
      suggested: 'ring-ring',
      confidence: 'high',
      reasoning: 'Focus ring should use the dedicated ring token',
      alternatives: [],
    }),

    // White/Black special cases
    'bg-white': (ctx) => ({
      original: 'bg-white',
      suggested: ctx.isDarkMode ? 'bg-surface' : 'bg-surface',
      confidence: 'high',
      reasoning: 'White background should use theme-aware surface token',
      alternatives: [],
    }),

    'text-white': (ctx) => ({
      original: 'text-white',
      suggested:
        ctx.componentType === 'button' ? 'text-foreground-inverted' : 'text-foreground-inverted',
      confidence: 'medium',
      reasoning: 'White text should use theme-aware foreground token',
      alternatives: ['text-foreground-inverted', 'text-foreground-inverted-muted'],
    }),
  }

// Simple mapping for classes without complex context needs
const SIMPLE_MIGRATIONS: Record<string, string> = {
  // Dark mode specific
  'dark:bg-neutral-950': 'bg-surface',
  'dark:bg-neutral-900': 'bg-surface-muted',
  'dark:text-neutral-50': 'text-foreground',

  // Gradient colors
  'from-primary-500': 'from-interactive-primary',
  'to-primary-600': 'to-interactive-primary-hover',
  'via-primary-500': 'via-interactive-primary',

  // Shadow colors
  'shadow-neutral-200': 'shadow-border',
  'shadow-neutral-100': 'shadow-border-muted',

  // Divide colors
  'divide-neutral-200': 'divide-border',
  'divide-neutral-100': 'divide-border-muted',

  // Placeholder colors
  'placeholder-neutral-400': 'placeholder-foreground-muted',
  'placeholder-neutral-500': 'placeholder-foreground-muted',

  // Disabled states
  'disabled:bg-neutral-100': 'disabled:bg-disabled',
  'disabled:text-neutral-400': 'disabled:text-disabled-foreground',
  'disabled:text-neutral-500': 'disabled:text-disabled-foreground',
  'disabled:cursor-not-allowed': 'disabled:cursor-not-allowed',

  // Status borders
  'border-error-200': 'border-status-error-border',
  'border-success-200': 'border-status-success-border',
  'border-warning-200': 'border-status-warning-border',
  'border-primary-200': 'border-status-info-border',
}

/**
 * Analyzes the context of a className usage to provide better migration suggestions
 */
export function analyzeContext(
  className: string,
  surroundingClasses: string[],
  elementType?: string
): MigrationContext {
  const context: MigrationContext = {
    componentType: 'unknown',
    isInteractive: false,
    isDarkMode: false,
    hasHoverState: false,
    parentElement: elementType,
  }

  // Detect component type from surrounding classes
  if (surroundingClasses.some((c) => c.includes('btn') || c.includes('button'))) {
    context.componentType = 'button'
  } else if (surroundingClasses.some((c) => c.includes('card'))) {
    context.componentType = 'card'
  } else if (surroundingClasses.some((c) => c.includes('badge'))) {
    context.componentType = 'badge'
  } else if (surroundingClasses.some((c) => c.includes('input') || c.includes('form'))) {
    context.componentType = 'input'
  } else if (surroundingClasses.some((c) => c.includes('alert') || c.includes('notification'))) {
    context.componentType = 'alert'
  } else if (elementType === 'a' || surroundingClasses.some((c) => c.includes('link'))) {
    context.componentType = 'link'
  }

  // Check for interactive states
  context.isInteractive = surroundingClasses.some(
    (c) =>
      c.includes('hover:') ||
      c.includes('focus:') ||
      c.includes('active:') ||
      c.includes('cursor-pointer')
  )

  // Check for dark mode
  context.isDarkMode =
    className.startsWith('dark:') || surroundingClasses.some((c) => c.startsWith('dark:'))

  // Check for hover state
  context.hasHoverState = surroundingClasses.some((c) => c.includes('hover:'))

  return context
}

/**
 * Get migration suggestion for a given className with context
 */
export function getMigrationSuggestion(
  className: string,
  context: MigrationContext = {}
): MigrationSuggestion | undefined {
  // Check context-aware migrations first
  if (CONTEXT_AWARE_MIGRATIONS[className]) {
    return CONTEXT_AWARE_MIGRATIONS[className](context)
  }

  // Check simple migrations
  if (SIMPLE_MIGRATIONS[className]) {
    return {
      original: className,
      suggested: SIMPLE_MIGRATIONS[className],
      confidence: 'high',
      reasoning: 'Direct mapping to semantic token',
      alternatives: [],
    }
  }

  // Try without modifiers
  const withoutModifiers = className.replace(
    /^(dark:|hover:|focus:|active:|disabled:|group-hover:)/,
    ''
  )

  const modifier = className.substring(0, className.length - withoutModifiers.length)

  if (CONTEXT_AWARE_MIGRATIONS[withoutModifiers]) {
    const baseSuggestion = CONTEXT_AWARE_MIGRATIONS[withoutModifiers](context)
    return {
      ...baseSuggestion,
      original: className,
      suggested: modifier + baseSuggestion.suggested,
      ...(baseSuggestion.alternatives
        ? { alternatives: baseSuggestion.alternatives.map((alt) => modifier + alt) }
        : {}),
    }
  }

  if (SIMPLE_MIGRATIONS[withoutModifiers]) {
    return {
      original: className,
      suggested: modifier + SIMPLE_MIGRATIONS[withoutModifiers],
      confidence: 'high',
      reasoning: 'Direct mapping with modifier preserved',
      alternatives: [],
    }
  }

  // Generic pattern-based suggestions
  if (className.includes('bg-neutral-')) {
    const shadeMatch = className.match(/-(\d+)/)
    if (shadeMatch && shadeMatch[1]) {
      const shade = parseInt(shadeMatch[1])
      if (shade <= 200) {
        return {
          original: className,
          suggested: className.replace(/bg-neutral-\d+/, 'bg-surface-muted'),
          confidence: 'low',
          reasoning: 'Light neutral background, likely a surface variant',
          alternatives: ['bg-surface-subtle', 'bg-surface'],
        }
      } else if (shade >= 900) {
        return {
          original: className,
          suggested: className.replace(/bg-neutral-\d+/, 'bg-surface'),
          confidence: 'low',
          reasoning: 'Dark neutral background, likely main surface in dark mode',
          alternatives: ['bg-surface-muted'],
        }
      }
    }
  }

  return undefined
}

/**
 * Batch migrate multiple classNames with shared context
 */
export function batchMigrate(
  classNames: string[],
  elementType?: string
): Map<string, MigrationSuggestion> {
  const context = analyzeContext('', classNames, elementType)
  const results = new Map<string, MigrationSuggestion>()

  for (const className of classNames) {
    const suggestion = getMigrationSuggestion(className, context)
    if (suggestion) {
      results.set(className, suggestion)
    }
  }

  return results
}
