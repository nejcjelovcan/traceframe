import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const badgeVariants = cva('inline-flex items-center gap-xs rounded-xl font-medium', {
  variants: {
    variant: {
      // Core semantic variants (filled style)
      default: 'bg-surface-muted text-foreground border-border',
      secondary: 'bg-surface-subtle text-foreground-muted border-border-muted',

      // Status variants with proper contrast
      info: 'bg-status-info-muted text-status-info-foreground border-status-info-border',
      success:
        'bg-status-success-muted text-status-success-foreground border-status-success-border',
      warning:
        'bg-status-warning-muted text-status-warning-foreground border-status-warning-border',
      error: 'bg-status-error-muted text-status-error-foreground border-status-error-border',

      // Accent variants for categorization and data visualization
      accent1: 'bg-accent-1-muted text-accent-1-foreground border-accent-1-border',
      accent2: 'bg-accent-2-muted text-accent-2-foreground border-accent-2-border',
      accent3: 'bg-accent-3-muted text-accent-3-foreground border-accent-3-border',
      accent4: 'bg-accent-4-muted text-accent-4-foreground border-accent-4-border',
      accent5: 'bg-accent-5-muted text-accent-5-foreground border-accent-5-border',

      // Outline variants (ghost style with surface background for inverted contexts)
      'outline-default': 'bg-surface border border-border text-foreground',
      'outline-info': 'bg-surface border border-status-info text-status-info-foreground',
      'outline-success': 'bg-surface border border-status-success text-status-success-foreground',
      'outline-warning': 'bg-surface border border-status-warning text-status-warning-foreground',
      'outline-error': 'bg-surface border border-status-error text-status-error-foreground',
    },
    size: {
      xs: 'px-xs py-2xs text-xs leading-none', // Tight inline badges
      sm: 'px-sm py-2xs text-xs', // Standard small badges
      md: 'px-sm py-xs text-sm', // Default size
      lg: 'px-md py-xs text-sm', // Prominent badges
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Icon name from ui-library Icon component */
  icon?: IconName
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, icon, iconPosition = 'left', children, ...props }, ref) => {
    const iconSize = size === 'xs' || size === 'sm' ? 'xs' : 'sm'

    return (
      <span className={cn(badgeVariants({ variant, size, className }))} ref={ref} {...props}>
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
