import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'

import { Icon } from '../icons/index.js'
import { cn } from '../utils/cn.js'

/**
 * Collapsible component built on Radix UI Primitives.
 *
 * Provides accessible collapsible sections with:
 * - WAI-ARIA compliant accessibility
 * - Keyboard support (Enter/Space to toggle)
 * - Smooth height animations
 * - Controlled and uncontrolled modes
 *
 * @example
 * ```tsx
 * <Collapsible.Root>
 *   <Collapsible.Trigger>Advanced Filters</Collapsible.Trigger>
 *   <Collapsible.Content>
 *     <FilterPanel />
 *   </Collapsible.Content>
 * </Collapsible.Root>
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [open, setOpen] = useState(false)
 * <Collapsible.Root open={open} onOpenChange={setOpen}>
 *   ...
 * </Collapsible.Root>
 * ```
 */

// Re-export Root for state management
export const Collapsible = CollapsiblePrimitive.Root

// Trigger variants
const collapsibleTriggerVariants = cva(
  [
    'flex w-full items-center gap-sm rounded-sm font-medium transition-colors',
    'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'hover:bg-surface-subtle',
        ghost: 'hover:bg-transparent',
        bordered: 'border border-border hover:bg-surface-subtle',
        filled: 'bg-surface-muted hover:bg-surface-subtle',
      },
      accent: {
        none: '',
        1: 'border-l-4 border-l-accent-1-border',
        2: 'border-l-4 border-l-accent-2-border',
        3: 'border-l-4 border-l-accent-3-border',
      },
      size: {
        sm: 'px-sm py-xs text-sm',
        md: 'px-md py-sm text-base',
        lg: 'px-base py-md text-lg',
      },
      indent: {
        none: '',
        sm: 'ml-base',
        md: 'ml-lg',
        lg: 'ml-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      accent: 'none',
      size: 'md',
      indent: 'none',
    },
  }
)

// Icon sizes that match the text size for each variant
const iconSizes = {
  sm: 14,
  md: 16,
  lg: 20,
} as const

export interface CollapsibleTriggerProps
  extends
    ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>,
    VariantProps<typeof collapsibleTriggerVariants> {
  /** Hide the chevron indicator */
  hideChevron?: boolean
}

export const CollapsibleTrigger = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.Trigger>,
  CollapsibleTriggerProps
>(
  (
    { className, variant, accent, size = 'md', indent, hideChevron = false, children, ...props },
    ref
  ) => {
    const iconSize = iconSizes[size ?? 'md']

    return (
      <CollapsiblePrimitive.Trigger
        ref={ref}
        className={cn(collapsibleTriggerVariants({ variant, accent, size, indent, className }))}
        {...props}
      >
        {!hideChevron && (
          <Icon
            name="chevron-right"
            size={iconSize}
            className="shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90"
          />
        )}
        {children}
      </CollapsiblePrimitive.Trigger>
    )
  }
)

CollapsibleTrigger.displayName = 'Collapsible.Trigger'

// Content variants
const collapsibleContentVariants = cva(
  [
    'overflow-hidden',
    'data-[state=open]:animate-collapsible-down',
    'data-[state=closed]:animate-collapsible-up',
    'bg-surface-muted rounded-sm border border-border',
  ],
  {
    variants: {
      size: {
        sm: 'px-md py-sm text-sm',
        md: 'px-base py-sm text-base',
        lg: 'px-base py-md text-lg',
      },
      indent: {
        none: '',
        sm: 'ml-base',
        md: 'ml-lg',
        lg: 'ml-xl',
      },
    },
    defaultVariants: {
      size: 'md',
      indent: 'none',
    },
  }
)

export interface CollapsibleContentProps
  extends
    ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>,
    VariantProps<typeof collapsibleContentVariants> {}

export const CollapsibleContent = forwardRef<
  ComponentRef<typeof CollapsiblePrimitive.Content>,
  CollapsibleContentProps
>(({ className, size, indent, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(collapsibleContentVariants({ size, indent }), className)}
    {...props}
  >
    {children}
  </CollapsiblePrimitive.Content>
))

CollapsibleContent.displayName = 'Collapsible.Content'

// Header component for static non-interactive headers
const collapsibleHeaderVariants = cva(['flex items-center gap-sm font-medium'], {
  variants: {
    size: {
      sm: 'text-sm py-xs',
      md: 'text-base py-sm',
      lg: 'text-lg py-md',
    },
    accent: {
      none: '',
      1: 'border-l-4 border-l-accent-1-border pl-sm',
      2: 'border-l-4 border-l-accent-2-border pl-sm',
      3: 'border-l-4 border-l-accent-3-border pl-sm',
    },
  },
  defaultVariants: {
    size: 'md',
    accent: 'none',
  },
})

export interface CollapsibleHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof collapsibleHeaderVariants> {}

export const CollapsibleHeader = forwardRef<HTMLDivElement, CollapsibleHeaderProps>(
  ({ className, size, accent, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(collapsibleHeaderVariants({ size, accent }), className)}
      {...props}
    >
      {children}
    </div>
  )
)

CollapsibleHeader.displayName = 'Collapsible.Header'

// Named exports for direct imports
export { collapsibleTriggerVariants, collapsibleContentVariants, collapsibleHeaderVariants }
