import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { Button } from './Button.js'
import { Icon } from '../icons/index.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

export const errorStateVariants = cva('flex flex-col items-center justify-center text-center', {
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

const iconContainerVariants = cva('mb-base text-status-error-foreground', {
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

const errorMessageVariants = cva('mt-xs text-foreground-muted', {
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

export interface ErrorStateProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof errorStateVariants> {
  /** Error heading text */
  title: string
  /** Detailed error message */
  error?: string
  /** Icon name from ui-library (defaults to 'alert-circle') */
  icon?: IconName
  /** Custom icon element (use when IconName doesn't suffice) */
  customIcon?: ReactNode
  /** Callback when retry button is clicked */
  onRetry?: () => void
  /** Custom retry button label (default: 'Try again') */
  retryLabel?: string
  /** Custom action element (takes precedence over onRetry) */
  action?: ReactNode
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      size,
      title,
      error,
      icon = 'alert-circle',
      customIcon,
      onRetry,
      retryLabel = 'Try again',
      action,
      ...props
    },
    ref
  ) => {
    // Determine what action to render: action takes precedence over onRetry
    const actionElement =
      action ??
      (onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ))

    // Determine icon size based on component size
    const iconSize = size === 'sm' ? 'lg' : '2xl'

    // Render either customIcon or Icon component
    const iconElement = customIcon ?? <Icon name={icon} size={iconSize} />

    return (
      <div
        className={cn(errorStateVariants({ size, className }))}
        ref={ref}
        role="alert"
        {...props}
      >
        <div className={iconContainerVariants({ size })} aria-hidden="true">
          {iconElement}
        </div>
        <h3 className={titleVariants({ size })}>{title}</h3>
        {error && <p className={errorMessageVariants({ size })}>{error}</p>}
        {actionElement && <div className="mt-base">{actionElement}</div>}
      </div>
    )
  }
)

ErrorState.displayName = 'ErrorState'
