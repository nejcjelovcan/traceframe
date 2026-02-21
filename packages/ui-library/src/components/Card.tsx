import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react'

import { Icon } from '../icons/Icon.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const cardVariants = cva('rounded-sm border-line', {
  variants: {
    variant: {
      // Core variants
      outlined: 'bg-surface border-line-border',
      gradient: 'bg-gradient-surface-light border-line-border',
      elevated: 'bg-surface border-line-border shadow-md',

      // Primary/secondary variants with light gradient backgrounds
      primary: 'bg-gradient-primary-light text-foreground border-line-interactive-primary-border',
      secondary:
        'bg-gradient-secondary-light text-foreground border-line-interactive-secondary-border',

      // Status variants with light gradient backgrounds
      info: 'bg-gradient-status-info-light text-status-info-foreground border-line-status-info-border',
      success:
        'bg-gradient-status-success-light text-status-success-foreground border-line-status-success-border',
      warning:
        'bg-gradient-status-warning-light text-status-warning-foreground border-line-status-warning-border',
      error:
        'bg-gradient-status-error-light text-status-error-foreground border-line-status-error-border',

      // Accent variants with light gradient backgrounds
      accent1: 'bg-gradient-accent-1-light text-accent-1-foreground border-line-accent-1-border',
      accent2: 'bg-gradient-accent-2-light text-accent-2-foreground border-line-accent-2-border',
      accent3: 'bg-gradient-accent-3-light text-accent-3-foreground border-line-accent-3-border',
      accent4: 'bg-gradient-accent-4-light text-accent-4-foreground border-line-accent-4-border',
      accent5: 'bg-gradient-accent-5-light text-accent-5-foreground border-line-accent-5-border',
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
        'gradient',
        'elevated',
        'primary',
        'secondary',
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

type CardSize = 'default' | 'sm'

// Context for accordion state and size
interface CardContextValue {
  isAccordion: boolean
  contentId?: string
  size: CardSize
}

const CardContext = createContext<CardContextValue>({ isAccordion: false, size: 'default' })

// Card
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  /** Makes the card clickable with interactive shadow states */
  actionable?: boolean
  /** Makes the card collapsible with header as trigger */
  accordion?: boolean
  /** Card size - 'sm' uses smaller padding and header font */
  size?: CardSize
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
      size = 'default',
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

    const resolvedVariant = variant ?? (actionable ? 'gradient' : undefined)
    const baseClassName = cn(cardVariants({ variant: resolvedVariant, actionable }), className)
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
        <CardContext.Provider value={{ isAccordion: false, size }}>
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
        <CardContext.Provider value={{ isAccordion: true, contentId, size }}>
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
  /** Content to display on the right side of the header */
  rightContent?: ReactNode
  /** Whether to truncate the main text when space is limited (default: true) */
  truncate?: boolean
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { className, icon, iconPosition = 'left', rightContent, truncate = true, children, ...props },
    ref
  ) => {
    const { isAccordion, contentId, size } = useContext(CardContext)
    const isSmall = size === 'sm'
    const titleText = typeof children === 'string' ? children : undefined

    const baseContent = (
      <>
        {icon && iconPosition === 'left' && (
          <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />
        )}
        <span
          className={cn('flex-1 min-w-0', truncate && 'truncate')}
          {...(truncate && titleText ? { title: titleText } : {})}
        >
          {children}
        </span>
        {icon && iconPosition === 'right' && (
          <Icon name={icon} size="sm" className="shrink-0" aria-hidden="true" />
        )}
        {rightContent && <div className="shrink-0">{rightContent}</div>}
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
              'flex w-full items-center gap-sm font-medium text-left',
              isSmall ? 'px-sm py-xs text-sm' : 'px-base py-md',
              'rounded-t-sm last:rounded-b-sm',
              'hover:bg-foreground/5 transition-colors',
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
          'flex items-center gap-sm font-medium',
          isSmall ? 'px-sm py-xs text-sm' : 'px-base py-md',
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
    const { isAccordion, contentId, size } = useContext(CardContext)
    const padding = size === 'sm' ? 'px-sm py-xs' : 'px-base py-base'

    if (isAccordion) {
      return (
        <CollapsiblePrimitive.Content
          id={contentId}
          className="overflow-hidden border-t border-inherit data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
        >
          <div className={cn(padding, 'text-foreground', className)} ref={ref} {...props}>
            {children}
          </div>
        </CollapsiblePrimitive.Content>
      )
    }

    return (
      <div
        className={cn(
          'border-t border-inherit first:border-t-0',
          padding,
          'text-foreground',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// CardFooter
export type CardFooterProps = HTMLAttributes<HTMLDivElement>

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { isAccordion, size } = useContext(CardContext)
    const padding = size === 'sm' ? 'px-sm py-xs' : 'px-base py-md'

    if (isAccordion) {
      return (
        <CollapsiblePrimitive.Content className="overflow-hidden border-t border-inherit data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <div className={cn('flex justify-end', padding, className)} ref={ref} {...props}>
            {children}
          </div>
        </CollapsiblePrimitive.Content>
      )
    }

    return (
      <div
        className={cn('flex justify-end border-t border-inherit', padding, className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export { cardVariants, type CardSize }
