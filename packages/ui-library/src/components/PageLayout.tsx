import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { Container } from './Container.js'
import {
  PageLayoutContext,
  usePageLayoutContext,
  type PageLayoutVariant,
  type PageLayoutColor,
} from './PageLayoutContext.js'
import { cn } from '../utils/cn.js'

const pageLayoutVariants = cva('flex h-screen flex-col', {
  variants: {},
})

const headerVariants = cva('sticky top-0 z-10 shrink-0 border-b', {
  variants: {
    variant: {
      default: 'border-border bg-surface',
      filled: '',
      subtle: '',
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
    // Filled variant with gradient backgrounds
    {
      variant: 'filled',
      color: 'primary',
      className: 'bg-gradient-primary border-interactive-primary-border',
    },
    {
      variant: 'filled',
      color: 'secondary',
      className: 'bg-gradient-secondary border-interactive-secondary-border',
    },
    {
      variant: 'filled',
      color: 'accent-1',
      className: 'bg-gradient-accent-1 border-accent-1-border',
    },
    {
      variant: 'filled',
      color: 'accent-2',
      className: 'bg-gradient-accent-2 border-accent-2-border',
    },
    {
      variant: 'filled',
      color: 'accent-3',
      className: 'bg-gradient-accent-3 border-accent-3-border',
    },
    {
      variant: 'filled',
      color: 'accent-4',
      className: 'bg-gradient-accent-4 border-accent-4-border',
    },
    {
      variant: 'filled',
      color: 'accent-5',
      className: 'bg-gradient-accent-5 border-accent-5-border',
    },
    // Subtle variant with light gradient backgrounds
    {
      variant: 'subtle',
      color: 'primary',
      className: 'bg-gradient-primary-light border-interactive-primary-border/50',
    },
    {
      variant: 'subtle',
      color: 'secondary',
      className: 'bg-gradient-secondary-light border-interactive-secondary-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-1',
      className: 'bg-gradient-accent-1-light border-accent-1-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      className: 'bg-gradient-accent-2-light border-accent-2-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      className: 'bg-gradient-accent-3-light border-accent-3-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      className: 'bg-gradient-accent-4-light border-accent-4-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      className: 'bg-gradient-accent-5-light border-accent-5-border/50',
    },
  ],
  defaultVariants: {
    variant: 'default',
    color: 'primary',
  },
})

const sidebarVariants = cva('shrink-0 overflow-y-auto', {
  variants: {
    position: {
      left: 'border-r',
      right: 'border-l',
    },
    collapsible: {
      true: 'hidden md:block',
      false: '',
    },
    variant: {
      default: '',
      filled: '',
      subtle: '',
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
    // Default variant
    {
      variant: 'default',
      position: 'left',
      className: 'border-border',
    },
    {
      variant: 'default',
      position: 'right',
      className: 'border-border',
    },
    // Filled variant with gradient backgrounds
    {
      variant: 'filled',
      color: 'primary',
      position: 'left',
      className: 'bg-gradient-primary border-interactive-primary-border',
    },
    {
      variant: 'filled',
      color: 'primary',
      position: 'right',
      className: 'bg-gradient-primary border-interactive-primary-border',
    },
    {
      variant: 'filled',
      color: 'secondary',
      position: 'left',
      className: 'bg-gradient-secondary border-interactive-secondary-border',
    },
    {
      variant: 'filled',
      color: 'secondary',
      position: 'right',
      className: 'bg-gradient-secondary border-interactive-secondary-border',
    },
    {
      variant: 'filled',
      color: 'accent-1',
      position: 'left',
      className: 'bg-gradient-accent-1 border-accent-1-border',
    },
    {
      variant: 'filled',
      color: 'accent-1',
      position: 'right',
      className: 'bg-gradient-accent-1 border-accent-1-border',
    },
    {
      variant: 'filled',
      color: 'accent-2',
      position: 'left',
      className: 'bg-gradient-accent-2 border-accent-2-border',
    },
    {
      variant: 'filled',
      color: 'accent-2',
      position: 'right',
      className: 'bg-gradient-accent-2 border-accent-2-border',
    },
    {
      variant: 'filled',
      color: 'accent-3',
      position: 'left',
      className: 'bg-gradient-accent-3 border-accent-3-border',
    },
    {
      variant: 'filled',
      color: 'accent-3',
      position: 'right',
      className: 'bg-gradient-accent-3 border-accent-3-border',
    },
    {
      variant: 'filled',
      color: 'accent-4',
      position: 'left',
      className: 'bg-gradient-accent-4 border-accent-4-border',
    },
    {
      variant: 'filled',
      color: 'accent-4',
      position: 'right',
      className: 'bg-gradient-accent-4 border-accent-4-border',
    },
    {
      variant: 'filled',
      color: 'accent-5',
      position: 'left',
      className: 'bg-gradient-accent-5 border-accent-5-border',
    },
    {
      variant: 'filled',
      color: 'accent-5',
      position: 'right',
      className: 'bg-gradient-accent-5 border-accent-5-border',
    },
    // Subtle variant with light gradient backgrounds
    {
      variant: 'subtle',
      color: 'primary',
      position: 'left',
      className: 'bg-gradient-primary-light border-interactive-primary-border/50',
    },
    {
      variant: 'subtle',
      color: 'primary',
      position: 'right',
      className: 'bg-gradient-primary-light border-interactive-primary-border/50',
    },
    {
      variant: 'subtle',
      color: 'secondary',
      position: 'left',
      className: 'bg-gradient-secondary-light border-interactive-secondary-border/50',
    },
    {
      variant: 'subtle',
      color: 'secondary',
      position: 'right',
      className: 'bg-gradient-secondary-light border-interactive-secondary-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-1',
      position: 'left',
      className: 'bg-gradient-accent-1-light border-accent-1-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-1',
      position: 'right',
      className: 'bg-gradient-accent-1-light border-accent-1-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      position: 'left',
      className: 'bg-gradient-accent-2-light border-accent-2-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      position: 'right',
      className: 'bg-gradient-accent-2-light border-accent-2-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      position: 'left',
      className: 'bg-gradient-accent-3-light border-accent-3-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      position: 'right',
      className: 'bg-gradient-accent-3-light border-accent-3-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      position: 'left',
      className: 'bg-gradient-accent-4-light border-accent-4-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      position: 'right',
      className: 'bg-gradient-accent-4-light border-accent-4-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      position: 'left',
      className: 'bg-gradient-accent-5-light border-accent-5-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      position: 'right',
      className: 'bg-gradient-accent-5-light border-accent-5-border/50',
    },
  ],
  defaultVariants: {
    position: 'left',
    collapsible: true,
    variant: 'default',
    color: 'primary',
  },
})

export interface PageLayoutProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof pageLayoutVariants> {
  /** Main content */
  children: ReactNode
  /** Top header slot (sticky) */
  header?: ReactNode
  /** Optional left/right sidebar */
  sidebar?: ReactNode
  /** Optional footer slot */
  footer?: ReactNode
  /** Main content width behavior */
  contentWidth?: 'contained' | 'full'
  /** Sidebar placement */
  sidebarPosition?: 'left' | 'right'
  /** Allow sidebar collapse on mobile */
  sidebarCollapsible?: boolean
  /** Text for the skip navigation link. When provided, renders a skip link as the first focusable element. */
  skipLinkText?: string
  /** Visual variant for header and sidebar backgrounds */
  variant?: PageLayoutVariant
  /** Color scheme for filled and subtle variants */
  color?: PageLayoutColor
}

const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  (
    {
      className,
      children,
      header,
      sidebar,
      footer,
      contentWidth = 'contained',
      sidebarPosition = 'left',
      sidebarCollapsible = true,
      skipLinkText,
      variant = 'default',
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const sidebarElement = sidebar && (
      <aside
        className={cn(
          sidebarVariants({
            position: sidebarPosition,
            collapsible: sidebarCollapsible,
            variant,
            color,
          })
        )}
      >
        {sidebar}
      </aside>
    )

    return (
      <PageLayoutContext.Provider value={{ variant, color }}>
        <div className={cn(pageLayoutVariants({ className }))} ref={ref} {...props}>
          {/* Skip link - first focusable element */}
          {skipLinkText && (
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-base focus:top-base focus:z-50 focus:rounded-sm focus:bg-surface focus:px-base focus:py-sm focus:text-sm focus:font-medium focus:shadow-lg focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface"
            >
              {skipLinkText}
            </a>
          )}

          {/* Header - sticky */}
          {header && <header className={cn(headerVariants({ variant, color }))}>{header}</header>}

          {/* Body - flex row with sidebar and main */}
          <div className="flex min-h-0 flex-1">
            {/* Left sidebar */}
            {sidebarPosition === 'left' && sidebarElement}

            {/* Main content - skip link target */}
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 overflow-y-auto focus:outline-hidden"
            >
              {contentWidth === 'contained' ? (
                <Container className="py-lg">{children}</Container>
              ) : (
                children
              )}
            </main>

            {/* Right sidebar */}
            {sidebarPosition === 'right' && sidebarElement}
          </div>

          {/* Footer - optional */}
          {footer && (
            <footer className="shrink-0 border-t border-border bg-surface">{footer}</footer>
          )}
        </div>
      </PageLayoutContext.Provider>
    )
  }
)

PageLayout.displayName = 'PageLayout'

export interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Title text displayed on the left side of the header */
  title: string
  /** Right-aligned content (e.g., navigation) */
  children?: ReactNode
}

const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, children, ...props }, ref) => {
    const { variant } = usePageLayoutContext()

    // Apply appropriate text color based on variant
    const textColorClass = variant === 'filled' ? 'text-foreground-filled' : ''

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-size-xl items-center justify-between px-base',
          textColorClass,
          className
        )}
        {...props}
      >
        <div className="font-semibold">{title}</div>
        {children}
      </div>
    )
  }
)

PageHeader.displayName = 'PageHeader'

export { pageLayoutVariants, sidebarVariants, headerVariants, PageLayout, PageHeader }
