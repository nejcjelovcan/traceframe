import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const cardVariants = cva('rounded border', {
  variants: {
    variant: {
      // Core variants
      outlined: 'bg-surface border-border',
      elevated: 'bg-surface border-border shadow-md',

      // Status variants with proper semantic token structure
      info: 'bg-status-info-muted text-status-info-foreground border-status-info-border',
      success:
        'bg-status-success-muted text-status-success-foreground border-status-success-border',
      warning:
        'bg-status-warning-muted text-status-warning-foreground border-status-warning-border',
      error: 'bg-status-error-muted text-status-error-foreground border-status-error-border',

      // Accent variants for categorization and data visualization (accent 1-5)
      accent1: 'bg-accent-1-muted text-accent-1-foreground border-accent-1-border',
      accent2: 'bg-accent-2-muted text-accent-2-foreground border-accent-2-border',
      accent3: 'bg-accent-3-muted text-accent-3-foreground border-accent-3-border',
      accent4: 'bg-accent-4-muted text-accent-4-foreground border-accent-4-border',
      accent5: 'bg-accent-5-muted text-accent-5-foreground border-accent-5-border',
    },
  },
  defaultVariants: {
    variant: 'outlined',
  },
})

// Card
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => {
    return <div className={cn(cardVariants({ variant, className }))} ref={ref} {...props} />
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
