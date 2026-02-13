import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type InputHTMLAttributes } from 'react'

import { Icon, type IconName, type IconSize } from '../icons/index.js'
import { cn } from '../utils/cn.js'

/** Base styles shared between standalone input and wrapper */
const baseInputStyles =
  'rounded border bg-surface transition-colors placeholder:text-foreground-muted disabled:cursor-not-allowed disabled:opacity-50'

/** Focus styles for standalone input (no icons) */
const focusStyles =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface'

/** Focus-within styles for wrapper (with icons) */
const focusWithinStyles =
  'focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-surface'

/** Variants for standalone input (no icons) */
const inputVariants = cva([baseInputStyles, focusStyles, 'px-md'], {
  variants: {
    variant: {
      default: 'border-border focus-visible:border-interactive-active focus-visible:ring-ring',
      error:
        'border-status-error-border focus-visible:border-status-error-border focus-visible:ring-status-error-border',
      success:
        'border-status-success-border focus-visible:border-status-success-border focus-visible:ring-status-success-border',
    },
    size: {
      sm: 'h-size-sm text-sm',
      md: 'h-size-md text-base',
      lg: 'h-size-lg text-lg',
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    fullWidth: true,
  },
})

/** Variants for wrapper div (when icons are present) */
const inputWrapperVariants = cva(
  [
    baseInputStyles,
    focusWithinStyles,
    'flex items-center gap-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: 'border-border focus-within:border-interactive-active focus-within:ring-ring',
        error:
          'border-status-error-border focus-within:border-status-error-border focus-within:ring-status-error-border',
        success:
          'border-status-success-border focus-within:border-status-success-border focus-within:ring-status-success-border',
      },
      size: {
        sm: 'h-size-sm px-sm text-sm',
        md: 'h-size-md px-md text-base',
        lg: 'h-size-lg px-base text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      fullWidth: true,
    },
  }
)

/** Map input size to icon size */
const INPUT_SIZE_TO_ICON_SIZE: Record<
  NonNullable<VariantProps<typeof inputVariants>['size']>,
  IconSize
> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  /** Icon to display before the input */
  leftIcon?: IconName
  /** Icon to display after the input */
  rightIcon?: IconName
  /** Helper text displayed below the input */
  helperText?: string
  /** Show status icon automatically based on variant (error: alert-circle, success: check) */
  showStatusIcon?: boolean
}

const getHelperTextColor = (variant?: 'default' | 'error' | 'success' | null) => {
  switch (variant) {
    case 'error':
      return 'text-status-error-foreground'
    case 'success':
      return 'text-status-success-foreground'
    default:
      return 'text-foreground-muted'
  }
}

const getStatusIcon = (variant?: 'default' | 'error' | 'success' | null): IconName | undefined => {
  switch (variant) {
    case 'error':
      return 'alert-circle'
    case 'success':
      return 'check'
    default:
      return undefined
  }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size = 'md',
      type = 'text',
      leftIcon,
      rightIcon,
      disabled,
      value,
      helperText,
      showStatusIcon,
      fullWidth = true,
      ...props
    },
    ref
  ) => {
    const iconSize = INPUT_SIZE_TO_ICON_SIZE[size ?? 'md']
    const statusIcon = showStatusIcon ? getStatusIcon(variant) : undefined
    const effectiveRightIcon = statusIcon || rightIcon
    const needsWrapper = leftIcon || effectiveRightIcon

    // Without icons - render input directly (backward compatible)
    if (!needsWrapper) {
      const input = (
        <input
          className={cn(inputVariants({ variant, size, fullWidth, className }))}
          type={type}
          ref={ref}
          disabled={disabled}
          value={value}
          {...props}
        />
      )

      if (helperText) {
        return (
          <div className={cn(fullWidth && 'w-full')}>
            {input}
            <p className={cn('mt-xs text-sm', getHelperTextColor(variant))}>{helperText}</p>
          </div>
        )
      }

      return input
    }

    // With icons - use wrapper
    const inputWithWrapper = (
      <>
        <div
          className={cn(inputWrapperVariants({ variant, size, fullWidth, className }))}
          aria-disabled={disabled || undefined}
        >
          {leftIcon && (
            <Icon name={leftIcon} size={iconSize} className="shrink-0 text-foreground-muted" />
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            value={value}
            className="h-full w-full bg-transparent outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed"
            {...props}
          />
          {effectiveRightIcon && (
            <Icon
              name={effectiveRightIcon}
              size={iconSize}
              className={cn(
                'shrink-0',
                statusIcon && variant === 'error'
                  ? 'text-status-error-foreground'
                  : statusIcon && variant === 'success'
                    ? 'text-status-success-foreground'
                    : 'text-foreground-muted'
              )}
            />
          )}
        </div>
        {helperText && (
          <p className={cn('mt-xs text-sm', getHelperTextColor(variant))}>{helperText}</p>
        )}
      </>
    )

    if (helperText) {
      return <div className={cn(fullWidth && 'w-full')}>{inputWithWrapper}</div>
    }

    return inputWithWrapper
  }
)

Input.displayName = 'Input'

export { inputVariants, inputWrapperVariants }
