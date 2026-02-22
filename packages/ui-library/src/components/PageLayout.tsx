import * as Dialog from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'

import { Container } from './Container.js'
import {
  PageLayoutContext,
  usePageLayoutContext,
  type PageLayoutVariant,
  type PageLayoutColor,
} from './PageLayoutContext.js'
import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

const pageLayoutVariants = cva('flex h-screen flex-col', {
  variants: {},
})

const headerVariants = cva('sticky top-0 z-10 shrink-0 border-b', {
  variants: {
    variant: {
      default: 'border-border bg-surface',
      colorful: '',
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
    // Colorful variant with solid backgrounds
    {
      variant: 'colorful',
      color: 'primary',
      className: 'bg-interactive-primary border-interactive-primary-border',
    },
    {
      variant: 'colorful',
      color: 'secondary',
      className: 'bg-interactive-secondary border-interactive-secondary-border',
    },
    {
      variant: 'colorful',
      color: 'accent-1',
      className: 'bg-accent-1 border-accent-1-border',
    },
    {
      variant: 'colorful',
      color: 'accent-2',
      className: 'bg-accent-2 border-accent-2-border',
    },
    {
      variant: 'colorful',
      color: 'accent-3',
      className: 'bg-accent-3 border-accent-3-border',
    },
    {
      variant: 'colorful',
      color: 'accent-4',
      className: 'bg-accent-4 border-accent-4-border',
    },
    {
      variant: 'colorful',
      color: 'accent-5',
      className: 'bg-accent-5 border-accent-5-border',
    },
    // Subtle variant with muted backgrounds
    {
      variant: 'subtle',
      color: 'primary',
      className: 'bg-interactive-primary-muted border-interactive-primary-border/50',
    },
    {
      variant: 'subtle',
      color: 'secondary',
      className: 'bg-interactive-secondary-muted border-interactive-secondary-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-1',
      className: 'bg-accent-1-muted border-accent-1-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      className: 'bg-accent-2-muted border-accent-2-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      className: 'bg-accent-3-muted border-accent-3-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      className: 'bg-accent-4-muted border-accent-4-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      className: 'bg-accent-5-muted border-accent-5-border/50',
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
    sticky: {
      true: 'sticky top-0 self-start',
      false: '',
    },
    variant: {
      default: '',
      colorful: '',
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
    // Colorful variant with solid backgrounds
    {
      variant: 'colorful',
      color: 'primary',
      position: 'left',
      className: 'bg-interactive-primary border-interactive-primary-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'primary',
      position: 'right',
      className: 'bg-interactive-primary border-interactive-primary-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'secondary',
      position: 'left',
      className: 'bg-interactive-secondary border-interactive-secondary-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'secondary',
      position: 'right',
      className: 'bg-interactive-secondary border-interactive-secondary-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-1',
      position: 'left',
      className: 'bg-accent-1 border-accent-1-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-1',
      position: 'right',
      className: 'bg-accent-1 border-accent-1-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-2',
      position: 'left',
      className: 'bg-accent-2 border-accent-2-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-2',
      position: 'right',
      className: 'bg-accent-2 border-accent-2-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-3',
      position: 'left',
      className: 'bg-accent-3 border-accent-3-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-3',
      position: 'right',
      className: 'bg-accent-3 border-accent-3-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-4',
      position: 'left',
      className: 'bg-accent-4 border-accent-4-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-4',
      position: 'right',
      className: 'bg-accent-4 border-accent-4-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-5',
      position: 'left',
      className: 'bg-accent-5 border-accent-5-border shadow-lg',
    },
    {
      variant: 'colorful',
      color: 'accent-5',
      position: 'right',
      className: 'bg-accent-5 border-accent-5-border shadow-lg',
    },
    // Subtle variant with muted backgrounds
    {
      variant: 'subtle',
      color: 'primary',
      position: 'left',
      className: 'bg-interactive-primary-muted border-interactive-primary-border/50',
    },
    {
      variant: 'subtle',
      color: 'primary',
      position: 'right',
      className: 'bg-interactive-primary-muted border-interactive-primary-border/50',
    },
    {
      variant: 'subtle',
      color: 'secondary',
      position: 'left',
      className: 'bg-interactive-secondary-muted border-interactive-secondary-border/50',
    },
    {
      variant: 'subtle',
      color: 'secondary',
      position: 'right',
      className: 'bg-interactive-secondary-muted border-interactive-secondary-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-1',
      position: 'left',
      className: 'bg-accent-1-muted border-accent-1-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-1',
      position: 'right',
      className: 'bg-accent-1-muted border-accent-1-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      position: 'left',
      className: 'bg-accent-2-muted border-accent-2-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-2',
      position: 'right',
      className: 'bg-accent-2-muted border-accent-2-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      position: 'left',
      className: 'bg-accent-3-muted border-accent-3-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-3',
      position: 'right',
      className: 'bg-accent-3-muted border-accent-3-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      position: 'left',
      className: 'bg-accent-4-muted border-accent-4-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-4',
      position: 'right',
      className: 'bg-accent-4-muted border-accent-4-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      position: 'left',
      className: 'bg-accent-5-muted border-accent-5-border/50',
    },
    {
      variant: 'subtle',
      color: 'accent-5',
      position: 'right',
      className: 'bg-accent-5-muted border-accent-5-border/50',
    },
  ],
  defaultVariants: {
    position: 'left',
    collapsible: true,
    sticky: false,
    variant: 'default',
    color: 'primary',
  },
})

export type SidebarWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sidebarWidthMap: Record<SidebarWidth, string> = {
  xs: 'w-48',
  sm: 'w-56',
  md: 'w-64',
  lg: 'w-72',
  xl: 'w-80',
}

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
  /** Visual variant for header and sidebar backgrounds. 'colorful' applies strong backgrounds. */
  variant?: PageLayoutVariant
  /** Color scheme for colorful and subtle variants */
  color?: PageLayoutColor
  /** Predefined sidebar width */
  sidebarWidth?: SidebarWidth
  /** Makes sidebar sticky within scroll container */
  sidebarSticky?: boolean
  /** Controlled mobile overlay open state */
  sidebarOpen?: boolean
  /** Callback for mobile overlay state changes */
  onSidebarOpenChange?: (open: boolean) => void
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
      sidebarWidth,
      sidebarSticky = false,
      sidebarOpen: controlledOpen,
      onSidebarOpenChange,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const sidebarOpen = isControlled ? controlledOpen : internalOpen
    const setSidebarOpen = (open: boolean) => {
      if (!isControlled) {
        setInternalOpen(open)
      }
      onSidebarOpenChange?.(open)
    }

    const sidebarElement = sidebar && (
      <aside
        className={cn(
          sidebarVariants({
            position: sidebarPosition,
            collapsible: sidebarCollapsible,
            sticky: sidebarSticky,
            variant,
            color,
          }),
          sidebarWidth && sidebarWidthMap[sidebarWidth],
          sidebarSticky && header && 'max-h-[calc(100vh-theme(size.xl))]'
        )}
      >
        {sidebar}
      </aside>
    )

    const mobileSidebarOverlay = sidebar && sidebarCollapsible && (
      <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/50 md:hidden data-[state=open]:animate-sidebar-overlay-in data-[state=closed]:animate-sidebar-overlay-out" />
          <Dialog.Content
            aria-describedby={undefined}
            className={cn(
              'fixed inset-y-0 z-50 flex flex-col bg-surface md:hidden',
              sidebarPosition === 'left'
                ? 'left-0 data-[state=open]:animate-sidebar-slide-in-left data-[state=closed]:animate-sidebar-slide-out-left'
                : 'right-0 data-[state=open]:animate-sidebar-slide-in-right data-[state=closed]:animate-sidebar-slide-out-right',
              sidebarWidth ? sidebarWidthMap[sidebarWidth] : 'w-64',
              sidebarVariants({
                position: sidebarPosition,
                collapsible: false,
                sticky: false,
                variant,
                color,
              })
            )}
          >
            <Dialog.Title className="sr-only">Sidebar navigation</Dialog.Title>
            <div className="flex items-center justify-end p-sm">
              <Dialog.Close asChild>
                <button
                  className="rounded-sm p-xs hover:bg-interactive-hover"
                  aria-label="Close sidebar"
                >
                  <Icon name="close" size="sm" />
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto">{sidebar}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )

    return (
      <PageLayoutContext.Provider
        value={{
          variant,
          color,
          sidebarOpen,
          setSidebarOpen,
          sidebarCollapsible: sidebarCollapsible && !!sidebar,
        }}
      >
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
          <div className={cn('flex min-h-0 flex-1', sidebarSticky && 'overflow-y-auto')}>
            {/* Left sidebar */}
            {sidebarPosition === 'left' && sidebarElement}

            {/* Main content - skip link target */}
            <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
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

        {/* Mobile sidebar overlay */}
        {mobileSidebarOverlay}
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
    const textColorClass = variant === 'colorful' ? 'text-foreground' : ''

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

export type SidebarToggleProps = ButtonHTMLAttributes<HTMLButtonElement>

const SidebarToggle = forwardRef<HTMLButtonElement, SidebarToggleProps>(
  ({ className, ...props }, ref) => {
    const { sidebarOpen, setSidebarOpen, sidebarCollapsible } = usePageLayoutContext()

    if (!sidebarCollapsible) {
      return null
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn('rounded-sm p-xs hover:bg-interactive-hover md:hidden', className)}
        aria-label="Toggle sidebar"
        aria-expanded={sidebarOpen}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        {...props}
      >
        <Icon name="menu" size="sm" />
      </button>
    )
  }
)

SidebarToggle.displayName = 'SidebarToggle'

export {
  pageLayoutVariants,
  sidebarVariants,
  headerVariants,
  sidebarWidthMap,
  PageLayout,
  PageHeader,
  SidebarToggle,
}
