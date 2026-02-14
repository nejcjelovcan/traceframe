import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type AnchorHTMLAttributes } from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName, IconSize } from '../icons/types.js'

const linkVariants = cva(
  'inline-flex items-center gap-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm',
  {
    variants: {
      variant: {
        default:
          'text-interactive-accent hover:text-interactive-primary-hover underline underline-offset-2 decoration-interactive-accent/30 hover:decoration-interactive-primary focus:decoration-interactive-primary',
        subtle:
          'text-foreground-muted hover:text-foreground hover:underline hover:underline-offset-2',
        standalone:
          'text-interactive-accent hover:text-interactive-accent-hover hover:outline hover:outline-border px-sm py-xs -mx-sm -my-xs rounded',
        nav: 'text-foreground hover:text-interactive-accent',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  /** Opens link in new tab with security attributes */
  external?: boolean
  /** Icon name from ui-library Icon component */
  icon?: IconName
  /** Icon position relative to text */
  iconPosition?: 'left' | 'right'
  /** Render as child element instead of <a>, merging props onto the child */
  asChild?: boolean
}

const iconSizeMap: Record<'sm' | 'md' | 'lg', IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      external,
      children,
      variant,
      size,
      icon,
      iconPosition = 'right',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    const finalIcon = icon || (external ? 'external-link' : undefined)
    const iconSize = iconSizeMap[size || 'md']

    const iconElement = finalIcon && <Icon name={finalIcon} size={iconSize} />

    const screenReaderText = external && <span className="sr-only">(opens in new tab)</span>

    const Comp = asChild ? Slot : 'a'

    return (
      <Comp
        className={cn(linkVariants({ variant, size }), className)}
        ref={ref}
        {...externalProps}
        {...props}
      >
        {iconPosition === 'left' && iconElement}
        <Slottable>{children}</Slottable>
        {screenReaderText}
        {iconPosition === 'right' && iconElement}
      </Comp>
    )
  }
)

Link.displayName = 'Link'

export { linkVariants }
