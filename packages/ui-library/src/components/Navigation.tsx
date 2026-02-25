import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react'

import { Heading, type HeadingProps } from './Heading.js'
import { usePageLayoutContext } from './PageLayoutContext.js'
import { Icon } from '../icons/Icon.js'
import { type IconName } from '../icons/types.js'
import { cn } from '../utils/cn.js'

const navigationVariants = cva('transition-colors', {
  variants: {
    orientation: {
      horizontal: 'flex items-center',
      vertical: 'flex flex-col',
    },
    variant: {
      default: '',
      colorful: 'rounded-md p-sm',
      subtle: 'rounded-md p-sm',
      transparent: 'rounded-lg p-sm',
    },
    color: {
      primary: '',
      secondary: '',
      'accent-1': '',
      'accent-2': '',
      'accent-3': '',
      'accent-4': '',
      'accent-5': '',
    },
  },
  compoundVariants: [
    // Transparent variant with semi-transparent backgrounds and backdrop blur
    {
      variant: 'transparent',
      color: 'primary',
      className:
        'bg-surface/40 backdrop-blur-md border-line-interactive-primary-border shadow-inset-sm',
    },
    {
      variant: 'transparent',
      color: 'secondary',
      className:
        'bg-surface/40 backdrop-blur-md border-line-interactive-secondary-border shadow-inset-sm',
    },
    {
      variant: 'transparent',
      color: 'accent-1',
      className: 'bg-surface/40 backdrop-blur-md border-line-accent-1-border shadow-inset-sm',
    },
    {
      variant: 'transparent',
      color: 'accent-2',
      className: 'bg-surface/40 backdrop-blur-md border-line-accent-2-border shadow-inset-sm',
    },
    {
      variant: 'transparent',
      color: 'accent-3',
      className: 'bg-surface/40 backdrop-blur-md border-line-accent-3-border shadow-inset-sm',
    },
    {
      variant: 'transparent',
      color: 'accent-4',
      className: 'bg-surface/40 backdrop-blur-md border-line-accent-4-border shadow-inset-sm',
    },
    {
      variant: 'transparent',
      color: 'accent-5',
      className: 'bg-surface/40 backdrop-blur-md border-line-accent-5-border shadow-inset-sm',
    },
    // Colorful variant with solid backgrounds and borders
    {
      variant: 'colorful',
      color: 'primary',
      className: 'bg-interactive-primary border-line-interactive-primary-border',
    },
    {
      variant: 'colorful',
      color: 'secondary',
      className: 'bg-interactive-secondary border-line-interactive-secondary-border',
    },
    {
      variant: 'colorful',
      color: 'accent-1',
      className: 'bg-accent-1 border-line-accent-1-border',
    },
    {
      variant: 'colorful',
      color: 'accent-2',
      className: 'bg-accent-2 border-line-accent-2-border',
    },
    {
      variant: 'colorful',
      color: 'accent-3',
      className: 'bg-accent-3 border-line-accent-3-border',
    },
    {
      variant: 'colorful',
      color: 'accent-4',
      className: 'bg-accent-4 border-line-accent-4-border',
    },
    {
      variant: 'colorful',
      color: 'accent-5',
      className: 'bg-accent-5 border-line-accent-5-border',
    },
    // Subtle variant with muted backgrounds and muted borders
    {
      variant: 'subtle',
      color: 'primary',
      className: 'bg-interactive-primary-muted border-line-interactive-primary-border/50',
    },
    {
      variant: 'subtle',
      color: 'secondary',
      className: 'bg-interactive-secondary-muted border-line-interactive-secondary-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-1',
      className: 'bg-accent-1-muted border-line-accent-1-muted-border',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      className: 'bg-accent-2-muted border-line-accent-2-muted-border',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      className: 'bg-accent-3-muted border-line-accent-3-muted-border',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      className: 'bg-accent-4-muted border-line-accent-4-muted-border',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      className: 'bg-accent-5-muted border-line-accent-5-muted-border',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
    color: 'primary',
  },
})

const navItemVariants = cva('rounded-md transition-colors relative', {
  variants: {
    orientation: {
      horizontal: 'inline-flex items-center gap-xs',
      vertical: 'flex items-center gap-sm px-md py-sm text-sm',
    },
    active: {
      true: '',
      false: '',
    },
    parentVariant: {
      default: '',
      colorful: '',
      subtle: '',
      transparent: '',
    },
    parentColor: {
      primary: '',
      secondary: '',
      'accent-1': '',
      'accent-2': '',
      'accent-3': '',
      'accent-4': '',
      'accent-5': '',
    },
  },
  compoundVariants: [
    // Default variant styles
    {
      parentVariant: 'default',
      orientation: 'horizontal',
      active: false,
      className: 'text-foreground-muted hover:text-foreground',
    },
    {
      parentVariant: 'default',
      orientation: 'vertical',
      active: false,
      className: 'text-foreground-muted hover:bg-surface-subtle hover:text-foreground',
    },
    {
      parentVariant: 'default',
      orientation: 'horizontal',
      active: true,
      className: 'text-foreground font-medium',
    },
    {
      parentVariant: 'default',
      orientation: 'vertical',
      active: true,
      className: 'bg-surface-muted text-foreground font-medium',
    },
    // Colorful variant styles
    {
      parentVariant: 'colorful',
      orientation: 'horizontal',
      active: false,
      className: 'text-foreground text-shadow-light',
    },
    {
      parentVariant: 'colorful',
      orientation: 'vertical',
      active: false,
      className: 'text-foreground text-shadow-light hover:bg-surface/20',
    },
    {
      parentVariant: 'colorful',
      orientation: 'horizontal',
      active: true,
      className: 'text-foreground text-shadow-light font-medium bg-surface/40 px-sm',
    },
    {
      parentVariant: 'colorful',
      orientation: 'vertical',
      active: true,
      className: 'bg-surface/40 text-foreground text-shadow-light font-medium',
    },
    // Transparent variant styles (edge-to-edge NavItems) with separators
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      active: false,
      className:
        'text-foreground text-shadow-light hover:text-foreground first:before:hidden before:absolute before:left-0 before:inset-y-0 before:w-px',
    },
    // Separator colors for each color variant in transparent horizontal mode
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      parentColor: 'primary',
      className: 'before:bg-primary-500/30',
    },
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      parentColor: 'secondary',
      className: 'before:bg-secondary-500/30',
    },
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      parentColor: 'accent-1',
      className: 'before:bg-accent-1-500/30',
    },
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      parentColor: 'accent-2',
      className: 'before:bg-accent-2-500/30',
    },
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      parentColor: 'accent-3',
      className: 'before:bg-accent-3-500/30',
    },
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      parentColor: 'accent-4',
      className: 'before:bg-accent-4-500/30',
    },
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      parentColor: 'accent-5',
      className: 'before:bg-accent-5-500/30',
    },
    {
      parentVariant: 'transparent',
      orientation: 'vertical',
      active: false,
      className: '-mx-sm px-md rounded-none text-foreground hover:bg-surface/20',
    },
    {
      parentVariant: 'transparent',
      orientation: 'horizontal',
      active: true,
      className:
        'text-foreground text-shadow-light font-medium bg-surface/40 px-sm first:before:hidden before:absolute before:left-0 before:inset-y-0 before:w-px',
    },
    {
      parentVariant: 'transparent',
      orientation: 'vertical',
      active: true,
      className: '-mx-sm px-md rounded-none bg-surface/40 text-foreground font-medium',
    },
    // Subtle variant styles
    {
      parentVariant: 'subtle',
      orientation: 'horizontal',
      active: false,
      className: 'text-foreground-muted hover:text-foreground',
    },
    {
      parentVariant: 'subtle',
      orientation: 'vertical',
      active: false,
      className: 'text-foreground-muted hover:bg-surface hover:text-foreground',
    },
    {
      parentVariant: 'subtle',
      orientation: 'horizontal',
      active: true,
      className: 'text-foreground font-medium bg-surface px-sm shadow-inset-sm',
    },
    {
      parentVariant: 'subtle',
      orientation: 'vertical',
      active: true,
      className: 'bg-surface text-foreground font-medium shadow-inset-sm',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    active: false,
    parentVariant: 'default',
    parentColor: 'primary',
  },
})

type Orientation = 'horizontal' | 'vertical'
type Variant = 'default' | 'colorful' | 'subtle' | 'transparent'
type Color =
  | 'primary'
  | 'secondary'
  | 'accent-1'
  | 'accent-2'
  | 'accent-3'
  | 'accent-4'
  | 'accent-5'

const NavigationContext = createContext<{
  orientation: Orientation
  variant: Variant
  color: Color
}>({
  orientation: 'horizontal',
  variant: 'default',
  color: 'primary',
})

export interface NavigationProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof navigationVariants> {
  /** Navigation orientation */
  orientation?: Orientation
  /** Visual variant of the navigation */
  variant?: Variant
  /** Color scheme for colorful and subtle variants */
  color?: Color
}

const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ className, orientation = 'horizontal', variant, color, children, ...props }, ref) => {
    const pageLayoutContext = usePageLayoutContext()

    // Use explicit props if provided, otherwise inherit from PageLayout context
    const effectiveVariant = variant ?? pageLayoutContext.variant ?? 'default'
    const effectiveColor = color ?? pageLayoutContext.color ?? 'primary'

    // When inheriting variant from context (filled/subtle), don't apply background to Navigation itself
    const shouldApplyBackground = variant !== undefined || !pageLayoutContext.variant

    const navClassName = shouldApplyBackground
      ? navigationVariants({
          orientation,
          variant: effectiveVariant,
          color: effectiveColor,
          className,
        })
      : navigationVariants({ orientation, variant: 'default', className })

    return (
      <NavigationContext.Provider
        value={{ orientation, variant: effectiveVariant, color: effectiveColor }}
      >
        <nav ref={ref} className={cn(navClassName)} {...props}>
          {children}
        </nav>
      </NavigationContext.Provider>
    )
  }
)

Navigation.displayName = 'Navigation'

export interface NavItemProps extends HTMLAttributes<HTMLAnchorElement> {
  /** URL the nav item links to (optional when asChild is true) */
  href?: string
  /** Whether this item is currently active */
  active?: boolean
  /** Optional icon to display before the label */
  icon?: IconName
  /** Render as child element instead of <a>, merging props onto the child */
  asChild?: boolean
  /** Nav item label */
  children: ReactNode
}

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, href, active = false, icon, asChild = false, children, ...props }, ref) => {
    const { orientation, variant, color } = useContext(NavigationContext)
    const Comp = asChild ? Slot : 'a'

    return (
      <Comp
        ref={ref}
        href={asChild ? undefined : href}
        className={cn(
          navItemVariants({
            orientation,
            active,
            parentVariant: variant,
            parentColor: color,
            className,
          })
        )}
        aria-current={active ? 'page' : undefined}
        {...props}
      >
        {icon && <Icon name={icon} size="sm" />}
        <Slottable>{children}</Slottable>
      </Comp>
    )
  }
)

NavItem.displayName = 'Navigation.Item'

export interface NavHeadingProps extends Omit<HeadingProps, 'level' | 'size' | 'color'> {
  /** Semantic heading level (defaults to 3) */
  level?: HeadingProps['level']
  /** Text size (defaults to "sm") */
  size?: HeadingProps['size']
}

const NavHeading = forwardRef<HTMLHeadingElement, NavHeadingProps>(
  ({ className, level = 3, size = 'sm', ...props }, ref) => {
    return (
      <Heading
        ref={ref}
        level={level}
        size={size}
        className={cn('uppercase tracking-wider font-bold mb-sm', className)}
        {...props}
      />
    )
  }
)

NavHeading.displayName = 'Navigation.Heading'

export { Navigation, NavItem, NavHeading, navigationVariants, navItemVariants }
