import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '../utils/cn.js'

const spinnerVariants = cva(
  'inline-block motion-safe:animate-spin rounded-full border-2 border-current border-t-transparent text-interactive-secondary',
  {
    variants: {
      size: {
        sm: 'h-size-xs w-size-xs',
        md: 'h-size-xs w-size-xs',
        lg: 'h-size-sm w-size-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof spinnerVariants> {
  /** Accessible label for screen readers */
  label?: string
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, label = 'Loading', ...props }, ref) => {
    return (
      <div
        className={cn(spinnerVariants({ size, className }))}
        ref={ref}
        role="status"
        aria-label={label}
        {...props}
      />
    )
  }
)

Spinner.displayName = 'Spinner'

export { spinnerVariants }
