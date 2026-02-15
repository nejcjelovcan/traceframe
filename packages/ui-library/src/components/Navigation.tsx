import { Slot, Slottable } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react'

import { Icon } from '../icons/Icon.js'
import { type IconName } from '../icons/types.js'
import { cn } from '../utils/cn.js'

const navigationVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'flex items-center gap-base',
      vertical: 'flex flex-col gap-xs',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

const navItemVariants = cva('rounded-md transition-colors', {
  variants: {
    orientation: {
      horizontal: 'inline-flex items-center gap-xs text-foreground-muted hover:text-foreground',
      vertical:
        'flex items-center gap-sm px-md py-sm text-sm text-foreground-muted hover:bg-surface-subtle',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      active: true,
      className: 'text-foreground font-medium border-b-highlight-interactive-primary-border pb-xs',
    },
    {
      orientation: 'vertical',
      active: true,
      className:
        'bg-surface-muted text-foreground font-medium border-l-highlight-interactive-primary-border -ml-[2px] pl-[calc(0.75rem+2px)]',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    active: false,
  },
})

type Orientation = 'horizontal' | 'vertical'

const NavigationContext = createContext<{ orientation: Orientation }>({ orientation: 'horizontal' })

export interface NavigationProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof navigationVariants> {
  /** Navigation orientation */
  orientation?: Orientation
}

const Navigation = forwardRef<HTMLElement, NavigationProps>(
  ({ className, orientation = 'horizontal', children, ...props }, ref) => {
    return (
      <NavigationContext.Provider value={{ orientation }}>
        <nav ref={ref} className={cn(navigationVariants({ orientation, className }))} {...props}>
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
    const { orientation } = useContext(NavigationContext)
    const Comp = asChild ? Slot : 'a'

    return (
      <Comp
        ref={ref}
        href={asChild ? undefined : href}
        className={cn(navItemVariants({ orientation, active, className }))}
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
