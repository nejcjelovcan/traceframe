import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const badgeVariants = cva('inline-flex items-center justify-center gap-xs rounded-xl font-medium', {
  variants: {
    variant: {
      // Core semantic variants (filled style)
      default: 'bg-surface-muted text-foreground border-border',
      primary:
        'bg-interactive-primary text-interactive-primary-foreground border-interactive-primary-border',
      secondary: 'bg-surface-subtle text-foreground-muted border-border-muted',

      // Status variants with proper contrast
      info: 'bg-status-info-muted text-status-info-foreground border-status-info-muted-border',
      success:
        'bg-status-success-muted text-status-success-foreground border-status-success-muted-border',
      warning:
        'bg-status-warning-muted text-status-warning-foreground border-status-warning-muted-border',
      error: 'bg-status-error-muted text-status-error-foreground border-status-error-muted-border',

      // Accent variants for categorization and data visualization
      accent1: 'bg-accent-1-muted text-accent-1-foreground border-accent-1-muted-border',
      accent2: 'bg-accent-2-muted text-accent-2-foreground border-accent-2-muted-border',
      accent3: 'bg-accent-3-muted text-accent-3-foreground border-accent-3-muted-border',
      accent4: 'bg-accent-4-muted text-accent-4-foreground border-accent-4-muted-border',
      accent5: 'bg-accent-5-muted text-accent-5-foreground border-accent-5-muted-border',

      // Outline variants (ghost style with surface background for inverse contexts)
      'outline-default': 'bg-surface border-thick-border text-foreground',
      'outline-primary':
        'bg-surface border-thick-interactive-primary-border text-interactive-primary',
      'outline-secondary':
        'bg-surface border-thick-interactive-secondary-border text-interactive-secondary',
      'outline-info': 'bg-surface border-thick-status-info text-status-info',
      'outline-success': 'bg-surface border-thick-status-success text-status-success',
      'outline-warning': 'bg-surface border-thick-status-warning text-status-warning',
      'outline-error': 'bg-surface border-thick-status-error text-status-error',

      // Outline accent variants for categorization with thick borders
      'outline-accent1': 'bg-surface border-thick-accent-1 text-accent-1',
      'outline-accent2': 'bg-surface border-thick-accent-2 text-accent-2',
      'outline-accent3': 'bg-surface border-thick-accent-3 text-accent-3',
      'outline-accent4': 'bg-surface border-thick-accent-4 text-accent-4',
      'outline-accent5': 'bg-surface border-thick-accent-5 text-accent-5',

      // Emphasis variants using gradient backgrounds (no border)
      'emphasis-default': 'bg-gradient-surface text-foreground',
      'emphasis-primary': 'bg-gradient-primary text-foreground-filled',
      'emphasis-secondary': 'bg-gradient-secondary text-foreground-filled',
      'emphasis-info': 'bg-gradient-status-info text-foreground-filled',
      'emphasis-success': 'bg-gradient-status-success text-foreground-filled',
      'emphasis-warning': 'bg-gradient-status-warning text-foreground-filled',
      'emphasis-error': 'bg-gradient-status-error text-foreground-filled',

      // Emphasis accent variants using gradient backgrounds (no border)
      'emphasis-accent1': 'bg-gradient-accent-1 text-foreground-filled',
      'emphasis-accent2': 'bg-gradient-accent-2 text-foreground-filled',
      'emphasis-accent3': 'bg-gradient-accent-3 text-foreground-filled',
      'emphasis-accent4': 'bg-gradient-accent-4 text-foreground-filled',
      'emphasis-accent5': 'bg-gradient-accent-5 text-foreground-filled',
    },
    size: {
      xs: 'px-xs py-2xs text-xs leading-none', // Tight inline badges
      sm: 'px-sm py-2xs text-xs', // Standard small badges
      md: 'px-sm py-xs text-sm', // Default size
      lg: 'px-md py-xs text-sm', // Prominent badges
    },
    compact: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Compact mode with icon: equal padding on all sides
    { compact: true, size: 'xs', className: 'p-2xs px-2xs py-2xs' },
    { compact: true, size: 'sm', className: 'p-2xs px-2xs py-2xs' },
    { compact: true, size: 'md', className: 'p-xs px-xs py-xs' },
    { compact: true, size: 'lg', className: 'p-xs px-xs py-xs' },
  ],
  defaultVariants: {
    variant: 'default',
    size: 'md',
    compact: false,
  },
})

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Icon name from ui-library Icon component */
  icon?: IconName
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right'
  /** Compact mode for icon-only or dot-only display */
  compact?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant, size, icon, iconPosition = 'left', compact = false, children, ...props },
    ref
  ) => {
    const iconSize = size === 'xs' || size === 'sm' ? 'xs' : 'sm'

    // Determine the dot size classes based on badge size
    const dotSizeClasses = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
    }[size || 'md']

    // In compact mode without icon, render a dot
    if (compact && !icon) {
      return (
        <span
          className={cn(
            badgeVariants({ variant, size, compact, className }),
            dotSizeClasses,
            'rounded-full p-0'
          )}
          ref={ref}
          {...props}
          aria-label={props['aria-label'] || 'Status indicator'}
        />
      )
    }

    // In compact mode with icon, only render the icon (no children)
    if (compact && icon) {
      return (
        <span
          className={cn(badgeVariants({ variant, size, compact, className }))}
          ref={ref}
          {...props}
        >
          <Icon name={icon} size={iconSize} aria-hidden="true" />
        </span>
      )
    }

    // Regular mode - render as before
    return (
      <span
        className={cn(badgeVariants({ variant, size, compact, className }))}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && <Icon name={icon} size={iconSize} aria-hidden="true" />}
        {children}
        {icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSize} aria-hidden="true" />
        )}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { badgeVariants }
