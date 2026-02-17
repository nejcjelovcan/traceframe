import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cva, type VariantProps } from 'class-variance-authority'
import { createContext, forwardRef, useContext, useId, type HTMLAttributes } from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const cardVariants = cva('rounded-sm border-line', {
  variants: {
    variant: {
      // Core variants
      outlined: 'bg-surface border-line-border',
      elevated: 'bg-surface border-line-border shadow-md',

      // Status variants with proper semantic token structure
      info: 'bg-status-info-muted text-status-info-foreground border-line-status-info-border',
      success:
        'bg-status-success-muted text-status-success-foreground border-line-status-success-border',
      warning:
        'bg-status-warning-muted text-status-warning-foreground border-line-status-warning-border',
      error: 'bg-status-error-muted text-status-error-foreground border-line-status-error-border',

      // Accent variants for categorization and data visualization (accent 1-5)
      accent1: 'bg-accent-1-muted text-accent-1-foreground border-line-accent-1-border',
      accent2: 'bg-accent-2-muted text-accent-2-foreground border-line-accent-2-border',
      accent3: 'bg-accent-3-muted text-accent-3-foreground border-line-accent-3-border',
      accent4: 'bg-accent-4-muted text-accent-4-foreground border-line-accent-4-border',
      accent5: 'bg-accent-5-muted text-accent-5-foreground border-line-accent-5-border',
    },
    actionable: {
      true: 'cursor-pointer transition-shadow',
      false: '',
    },
  },
  compoundVariants: [
    // Actionable variants: interactive shadows
    {
      actionable: true,
      variant: [
        'outlined',
        'elevated',
        'info',
        'success',
        'warning',
        'error',
        'accent1',
        'accent2',
        'accent3',
        'accent4',
        'accent5',
      ],
      class: 'shadow-interactive hover:shadow-interactive-hover active:shadow-interactive-pressed',
    },

    // Focus ring for actionable cards
    {
      actionable: true,
      class:
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
    },
  ],
  defaultVariants: {
    variant: 'outlined',
    actionable: false,
  },
})

// Context for accordion state
interface CardContextValue {
  isAccordion: boolean
  contentId?: string
}

const CardContext = createContext<CardContextValue>({ isAccordion: false })

// Card
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Makes the card clickable with interactive shadow states */
  actionable?: boolean
  /** Makes the card collapsible with header as trigger */
  accordion?: boolean
  /** Initial open state for uncontrolled accordion */
  defaultOpen?: boolean
  /** Controlled open state for accordion */
  open?: boolean
  /** Callback when accordion open state changes */
  onOpenChange?: (open: boolean) => void
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      actionable,
      accordion,
      defaultOpen = false,
      open,
      onOpenChange,
      children,
      ...props
    },
    ref
  ) => {
    // Check for mutually exclusive props
    if (actionable && accordion) {
      console.error(
        'Card: Cannot be both actionable and accordion. Please use only one of these props.'
      )
    }

    const baseClassName = cn(cardVariants({ variant, actionable }), className)
    const contentId = useId()

    // If not accordion mode, render normal card with proper focus for actionable
    if (!accordion) {
      const cardProps = actionable
        ? {
            ...props,
            tabIndex: props.tabIndex ?? 0,
            role: props.role ?? 'button',
            'aria-pressed': props['aria-pressed'] ?? false,
            onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
              // Handle Enter/Space for activation
              if ((e.key === 'Enter' || e.key === ' ') && props.onClick) {
                e.preventDefault()
                // Create a synthetic React mouse event that works in both browser and test environments
                // We cast the keyboard event to a mouse event since onClick expects it,
                // but the handler should be able to handle both event types
                const syntheticEvent = {
                  ...e,
                  type: 'click',
                  detail: 1,
                  button: 0,
                  buttons: 1,
                  clientX: 0,
                  clientY: 0,
                  pageX: 0,
                  pageY: 0,
                  screenX: 0,
                  screenY: 0,
                  movementX: 0,
                  movementY: 0,
                  offsetX: 0,
                  offsetY: 0,
                  relatedTarget: null,
                  getModifierState: e.getModifierState,
                } as unknown as React.MouseEvent<HTMLDivElement>
                props.onClick(syntheticEvent)
              }
              // Call provided onKeyDown if exists
              props.onKeyDown?.(e)
            },
          }
        : props

      return (
        <CardContext.Provider value={{ isAccordion: false }}>
          <div className={baseClassName} ref={ref} {...cardProps}>
            {children}
          </div>
        </CardContext.Provider>
      )
    }

    // Accordion mode: wrap in Collapsible and provide context
    const collapsibleProps = {
      ...(open !== undefined && { open }),
      ...(onOpenChange !== undefined && { onOpenChange }),
      defaultOpen,
    }

    return (
      <CollapsiblePrimitive.Root {...collapsibleProps}>
        <CardContext.Provider value={{ isAccordion: true, contentId }}>
          <div className={baseClassName} ref={ref} {...props}>
            {children}
          </div>
        </CardContext.Provider>
      </CollapsiblePrimitive.Root>
    )
  }
)

Card.displayName = 'Card'

// CardHeader
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon name from ui-library Icon component */
  icon?: IconName
  /** Icon position relative to header text */
  iconPosition?: 'left' | 'right'
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon, iconPosition = 'left', children, ...props }, ref) => {
    const { isAccordion, contentId } = useContext(CardContext)

    const baseContent = (
      <>
        {icon && iconPosition === 'left' && <Icon name={icon} size="sm" aria-hidden="true" />}
        <span className="flex-1">{children}</span>
        {icon && iconPosition === 'right' && <Icon name={icon} size="sm" aria-hidden="true" />}
        {isAccordion && (
          <Icon
            name="chevron-right"
            size="sm"
            className="shrink-0 transition-transform duration-200 [[data-state=open]>&]:rotate-90"
            aria-hidden="true"
          />
        )}
      </>
    )

    if (isAccordion) {
      // Extract only the props that are valid for button elements
      const { onClick, onKeyDown, onKeyUp, onFocus, onBlur, id } =
        props as React.ButtonHTMLAttributes<HTMLButtonElement>
      const buttonProps = {
        onClick,
        onKeyDown,
        onKeyUp,
        onFocus,
        onBlur,
        id,
      }

      return (
        <CollapsiblePrimitive.Trigger asChild>
          <button
            className={cn(
              'flex w-full items-center gap-sm border-b border-inherit px-base py-md font-medium text-left',
              'hover:bg-surface-subtle transition-colors',
              'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={ref as React.Ref<HTMLButtonElement>}
            aria-controls={contentId}
            {...buttonProps}
          >
            {baseContent}
          </button>
        </CollapsiblePrimitive.Trigger>
      )
    }

    return (
      <div
        className={cn(
          'flex items-center gap-sm border-b border-inherit px-base py-md font-medium',
          className
        )}
        ref={ref}
        {...props}
      >
        {baseContent}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// CardContent
export type CardContentProps = HTMLAttributes<HTMLDivElement>

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isAccordion, contentId } = useContext(CardContext)

    const content = (
      <div className={cn('px-base py-base', className)} ref={ref} {...props}>
        {children}
      </div>
    )

    if (isAccordion) {
      return (
        <CollapsiblePrimitive.Content
          id={contentId}
          className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
        >
          {content}
        </CollapsiblePrimitive.Content>
      )
    }

    return content
  }
)

CardContent.displayName = 'CardContent'

// CardFooter
export type CardFooterProps = HTMLAttributes<HTMLDivElement>

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { isAccordion } = useContext(CardContext)

    const footer = (
      <div
        className={cn('flex justify-end border-t border-inherit px-base py-md', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )

    if (isAccordion) {
      return (
        <CollapsiblePrimitive.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          {footer}
        </CollapsiblePrimitive.Content>
      )
    }

    return footer
  }
)

CardFooter.displayName = 'CardFooter'

export { cardVariants }
