import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { Container } from './Container.js'
import { cn } from '../utils/cn.js'

const pageLayoutVariants = cva('flex h-screen flex-col', {
  variants: {},
})

const sidebarVariants = cva('shrink-0 overflow-y-auto', {
  variants: {
    position: {
      left: 'border-r border-border',
      right: 'border-l border-border',
    },
    collapsible: {
      true: 'hidden md:block',
      false: '',
    },
  },
  defaultVariants: {
    position: 'left',
    collapsible: true,
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
          })
        )}
      >
        {sidebar}
      </aside>
    )

    return (
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
        {header && (
          <header className="sticky top-0 z-10 shrink-0 border-b border-border bg-surface">
            {header}
          </header>
        )}

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
        {footer && <footer className="shrink-0 border-t border-border bg-surface">{footer}</footer>}
      </div>
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
    return (
      <div
        ref={ref}
        className={cn('flex h-size-xl items-center justify-between px-base', className)}
        {...props}
      >
        <div className="font-semibold">{title}</div>
        {children}
      </div>
    )
  }
)

PageHeader.displayName = 'PageHeader'

export { pageLayoutVariants, sidebarVariants, PageLayout, PageHeader }
