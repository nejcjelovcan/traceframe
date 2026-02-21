import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { Spinner } from './Spinner.js'
import { Icon, type IconName, type IconSize } from '../icons/index.js'
import { cn } from '../utils/cn.js'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-sm rounded-sm font-medium whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-primary text-foreground-filled text-shadow-dark hover:opacity-90 shadow-interactive hover:shadow-interactive-hover active:shadow-interactive-pressed focus-visible:ring-ring',
        secondary:
          'bg-gradient-secondary text-foreground-filled text-shadow-dark hover:opacity-90 shadow-interactive hover:shadow-interactive-hover active:shadow-interactive-pressed focus-visible:ring-ring',
        outline:
          'border border-border bg-transparent hover:bg-surface-subtle focus-visible:ring-ring',
        ghost: 'hover:bg-interactive-hover focus-visible:ring-ring',
        destructive:
          'bg-gradient-destructive text-foreground-filled hover:opacity-90 shadow-interactive hover:shadow-interactive-hover active:shadow-interactive-pressed focus-visible:ring-ring',
      },
      size: {
        sm: 'h-size-sm px-md text-sm',
        md: 'h-size-md px-base text-base',
        lg: 'h-size-lg px-lg text-lg',
      },
      iconOnly: {
        true: '',
        false: '',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      { iconOnly: true, size: 'sm', class: 'w-size-sm px-0' },
      { iconOnly: true, size: 'md', class: 'w-size-md px-0' },
      { iconOnly: true, size: 'lg', class: 'w-size-lg px-0' },
      // Full width should override icon-only width
      { iconOnly: true, fullWidth: true, size: 'sm', class: 'w-full px-0' },
      { iconOnly: true, fullWidth: true, size: 'md', class: 'w-full px-0' },
      { iconOnly: true, fullWidth: true, size: 'lg', class: 'w-full px-0' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      iconOnly: false,
      fullWidth: false,
    },
  }
)

/** Map button size to icon/spinner size */
const BUTTON_SIZE_TO_ICON_SIZE: Record<
  NonNullable<VariantProps<typeof buttonVariants>['size']>,
  IconSize
> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

/** Larger icon sizes for icon-only buttons where the icon is the sole content */
const BUTTON_SIZE_TO_ICON_ONLY_SIZE: Record<
  NonNullable<VariantProps<typeof buttonVariants>['size']>,
  IconSize
> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

const BUTTON_SIZE_TO_SPINNER_SIZE: Record<
  NonNullable<VariantProps<typeof buttonVariants>['size']>,
  'sm' | 'md' | 'lg'
> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Icon to display before the button text */
  leftIcon?: IconName
  /** Icon to display after the button text */
  rightIcon?: IconName
  /** Show loading spinner instead of children */
  loading?: boolean
  /** Custom loading text (default: "Loading...") */
  loadingText?: string
  /** Render as child element instead of <button>, merging props onto the child */
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'md',
      iconOnly,
      fullWidth,
      leftIcon,
      rightIcon,
      loading = false,
      loadingText = 'Loading...',
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const iconSize = iconOnly
      ? BUTTON_SIZE_TO_ICON_ONLY_SIZE[size ?? 'md']
      : BUTTON_SIZE_TO_ICON_SIZE[size ?? 'md']
    const spinnerSize = BUTTON_SIZE_TO_SPINNER_SIZE[size ?? 'md']
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, iconOnly, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner size={spinnerSize} label={loadingText} />}
        {loading && <span className={iconOnly ? 'sr-only' : ''}>{loadingText}</span>}
        {!loading && leftIcon && <Icon name={leftIcon} size={iconSize} className="shrink-0" />}
        {!loading && iconOnly && (
          <span className="sr-only">
            <Slottable>{children}</Slottable>
          </span>
        )}
        {!loading && !iconOnly && <span className="truncate"><Slottable>{children}</Slottable></span>}
        {!loading && rightIcon && <Icon name={rightIcon} size={iconSize} className="shrink-0" />}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
