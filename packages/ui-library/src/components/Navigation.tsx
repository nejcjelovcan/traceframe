import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react'

import { usePageLayoutContext } from './PageLayoutContext.js'
import { Icon } from '../icons/Icon.js'
import { type IconName } from '../icons/types.js'
import { cn } from '../utils/cn.js'

const navigationVariants = cva('transition-colors', {
  variants: {
    orientation: {
      horizontal: 'flex items-center gap-base',
      vertical: 'flex flex-col gap-xs',
    },
    variant: {
      default: '',
      filled: 'rounded-md p-sm',
      subtle: 'rounded-md p-sm',
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
    // Filled variant with solid backgrounds and borders
    {
      variant: 'filled',
      color: 'primary',
      className: 'bg-interactive-primary border-line-interactive-primary-border',
    },
    {
      variant: 'filled',
      color: 'secondary',
      className: 'bg-interactive-secondary border-line-interactive-secondary-border',
    },
    {
      variant: 'filled',
      color: 'accent-1',
      className: 'bg-accent-1-emphasis border-line-accent-1-border',
    },
    {
      variant: 'filled',
      color: 'accent-2',
      className: 'bg-accent-2-emphasis border-line-accent-2-border',
    },
    {
      variant: 'filled',
      color: 'accent-3',
      className: 'bg-accent-3-emphasis border-line-accent-3-border',
    },
    {
      variant: 'filled',
      color: 'accent-4',
      className: 'bg-accent-4-emphasis border-line-accent-4-border',
    },
    {
      variant: 'filled',
      color: 'accent-5',
      className: 'bg-accent-5-emphasis border-line-accent-5-border',
    },
    // Subtle variant with muted backgrounds and subtle borders
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
      className: 'bg-accent-1-muted border-line-accent-1-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      className: 'bg-accent-2-muted border-line-accent-2-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      className: 'bg-accent-3-muted border-line-accent-3-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      className: 'bg-accent-4-muted border-line-accent-4-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      className: 'bg-accent-5-muted border-line-accent-5-border/50',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
    color: 'primary',
  },
})

const navItemVariants = cva('rounded-md transition-colors', {
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
      filled: '',
      subtle: '',
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
      className: 'text-foreground-muted hover:bg-surface-subtle',
    },
    {
      parentVariant: 'default',
      orientation: 'horizontal',
      active: true,
      className: 'text-foreground font-medium border-b-thick-interactive-primary-border pb-xs',
    },
    {
      parentVariant: 'default',
      orientation: 'vertical',
      active: true,
      className:
        'bg-surface-muted text-foreground font-medium border-l-thick-interactive-primary-border -ml-[2px] pl-[calc(0.75rem+2px)]',
    },
    // Filled variant styles
    {
      parentVariant: 'filled',
      orientation: 'horizontal',
      active: false,
      className: 'text-foreground-filled/80 hover:text-foreground-filled',
    },
    {
      parentVariant: 'filled',
      orientation: 'vertical',
      active: false,
      className: 'text-foreground-filled/80 hover:bg-white/10 hover:text-foreground-filled',
    },
    {
      parentVariant: 'filled',
      orientation: 'horizontal',
      active: true,
      className: 'text-foreground-filled font-medium bg-white/20 px-sm',
    },
    {
      parentVariant: 'filled',
      orientation: 'vertical',
      active: true,
      className:
        'bg-white/20 text-foreground-filled font-medium border-l-thick-white/60 -ml-[2px] pl-[calc(0.75rem+2px)]',
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
      className:
        'bg-surface text-foreground font-medium shadow-inset-sm border-l-thick-interactive-primary-border -ml-[2px] pl-[calc(0.75rem+2px)]',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    active: false,
    parentVariant: 'default',
  },
})

type Orientation = 'horizontal' | 'vertical'
type Variant = 'default' | 'filled' | 'subtle'
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
}>({
  orientation: 'horizontal',
  variant: 'default',
})

export interface NavigationProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof navigationVariants> {
  /** Navigation orientation */
  orientation?: Orientation
  /** Visual variant of the navigation */
  variant?: Variant
  /** Color scheme for filled and subtle variants */
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
      <NavigationContext.Provider value={{ orientation, variant: effectiveVariant }}>
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
    const { orientation, variant } = useContext(NavigationContext)
    const Comp = asChild ? Slot : 'a'

    return (
      <Comp
        ref={ref}
        href={asChild ? undefined : href}
        className={cn(navItemVariants({ orientation, active, parentVariant: variant, className }))}
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

export { Navigation, NavItem, navigationVariants, navItemVariants }
