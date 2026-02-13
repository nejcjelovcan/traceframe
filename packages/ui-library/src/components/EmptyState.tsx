import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const emptyStateVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    size: {
      sm: 'py-lg',
      md: 'py-xl',
      lg: 'py-2xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const iconContainerVariants = cva('mb-base text-foreground-muted', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const titleVariants = cva('font-medium text-foreground', {
  variants: {
    size: {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const descriptionVariants = cva('mt-xs text-foreground-muted', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface EmptyStateProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof emptyStateVariants> {
  /** Main heading text */
  title: string
  /** Supporting description text */
  description?: string
  /** Icon name from ui-library (type-safe) */
  icon?: IconName
  /** Custom icon element (use when IconName doesn't suffice) */
  customIcon?: ReactNode
  /** Action element (button, link) displayed below description */
  action?: ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size, title, description, icon, customIcon, action, ...props }, ref) => {
    const iconSize = size === 'sm' ? 'lg' : '2xl'

    return (
      <div className={cn(emptyStateVariants({ size, className }))} ref={ref} {...props}>
        {(icon || customIcon) && (
          <div className={cn(iconContainerVariants({ size }))}>
            {icon ? <Icon name={icon} size={iconSize} aria-hidden="true" /> : customIcon}
          </div>
        )}
        <h3 className={cn(titleVariants({ size }))}>{title}</h3>
        {description && <p className={cn(descriptionVariants({ size }))}>{description}</p>}
        {action && <div className="mt-base">{action}</div>}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'

export { emptyStateVariants }
