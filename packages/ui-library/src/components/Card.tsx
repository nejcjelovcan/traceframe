import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const cardVariants = cva('rounded-sm border-line', {
  variants: {
    variant: {
      // Core variants
      outlined: 'bg-surface border-line-border',
      elevated: 'bg-surface border-line-border shadow-md',

      // Status variants with proper semantic token structure
      info: 'bg-status-info-muted text-status-info-foreground border-line-status-info-border',
      success:
        'bg-status-success-muted text-status-success-foreground border-line-status-success-border',
      warning:
        'bg-status-warning-muted text-status-warning-foreground border-line-status-warning-border',
      error: 'bg-status-error-muted text-status-error-foreground border-line-status-error-border',

      // Accent variants for categorization and data visualization (accent 1-5)
      accent1: 'bg-accent-1-muted text-accent-1-foreground border-line-accent-1-border',
      accent2: 'bg-accent-2-muted text-accent-2-foreground border-line-accent-2-border',
      accent3: 'bg-accent-3-muted text-accent-3-foreground border-line-accent-3-border',
      accent4: 'bg-accent-4-muted text-accent-4-foreground border-line-accent-4-border',
      accent5: 'bg-accent-5-muted text-accent-5-foreground border-line-accent-5-border',
    },
    actionable: {
      true: 'cursor-pointer transition-shadow',
      false: '',
    },
    inverted: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    // Actionable variants: interactive shadows
    {
      actionable: true,
      variant: [
        'outlined',
        'elevated',
        'info',
        'success',
        'warning',
        'error',
        'accent1',
        'accent2',
        'accent3',
        'accent4',
        'accent5',
      ],
      class: 'shadow-interactive hover:shadow-interactive-hover active:shadow-interactive-pressed',
    },

    // Core variants: CSS variable override for full semantic token inversion
    {
      variant: 'outlined',
      inverted: true,
      class: 'bg-surface-inverted text-foreground-inverted border-line-border',
    },
    {
      variant: 'elevated',
      inverted: true,
      class: 'bg-surface-inverted text-foreground-inverted border-line-border',
    },

    // Status variants: filled/solid look with emphasis background and inverted text
    {
      variant: 'info',
      inverted: true,
      class: 'bg-status-info-emphasis text-foreground-inverted border-line-status-info',
    },
    {
      variant: 'success',
      inverted: true,
      class: 'bg-status-success-emphasis text-foreground-inverted border-line-status-success',
    },
    {
      variant: 'warning',
      inverted: true,
      class: 'bg-status-warning-emphasis text-foreground-inverted border-line-status-warning',
    },
    {
      variant: 'error',
      inverted: true,
      class: 'bg-status-error-emphasis text-foreground-inverted border-line-status-error',
    },

    // Accent variants: filled/solid look with emphasis background and inverted text
    {
      variant: 'accent1',
      inverted: true,
      class: 'bg-accent-1-emphasis text-foreground-inverted border-line-accent-1',
    },
    {
      variant: 'accent2',
      inverted: true,
      class: 'bg-accent-2-emphasis text-foreground-inverted border-line-accent-2',
    },
    {
      variant: 'accent3',
      inverted: true,
      class: 'bg-accent-3-emphasis text-foreground-inverted border-line-accent-3',
    },
    {
      variant: 'accent4',
      inverted: true,
      class: 'bg-accent-4-emphasis text-foreground-inverted border-line-accent-4',
    },
    {
      variant: 'accent5',
      inverted: true,
      class: 'bg-accent-5-emphasis text-foreground-inverted border-line-accent-5',
    },
  ],
  defaultVariants: {
    variant: 'outlined',
    actionable: false,
    inverted: false,
  },
})

// Card
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Makes the card clickable with interactive shadow states */
  actionable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, actionable, inverted, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, actionable, inverted }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

// CardHeader
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon name from ui-library Icon component */
  icon?: IconName
  /** Icon position relative to header text */
  iconPosition?: 'left' | 'right'
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex items-center gap-sm border-b border-inherit px-base py-md font-medium',
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && <Icon name={icon} size="sm" aria-hidden="true" />}
        {children}
        {icon && iconPosition === 'right' && <Icon name={icon} size="sm" aria-hidden="true" />}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// CardContent
export type CardContentProps = HTMLAttributes<HTMLDivElement>

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div className={cn('px-base py-base', className)} ref={ref} {...props} />
  }
)

CardContent.displayName = 'CardContent'

// CardFooter
export type CardFooterProps = HTMLAttributes<HTMLDivElement>

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('flex justify-end border-t border-inherit px-base py-md', className)}
        ref={ref}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'

export { cardVariants }
