import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'

import { Icon } from '../icons/index.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

/**
 * ActionList component for inline selection from a visible list.
 *
 * Provides accessible list selection with:
 * - WAI-ARIA listbox pattern
 * - Full keyboard navigation (Arrow keys, Enter, Space, Home/End, Type-ahead)
 * - Focus management with roving tabindex
 * - Screen reader announcements
 * - Status indicators and rich content
 * - Single selection state management
 *
 * @example
 * ```tsx
 * <ActionList.Root value={selectedValue} onValueChange={handleChange}>
 *   <ActionList.Group>
 *     <ActionList.Label>Active Sessions</ActionList.Label>
 *     <ActionList.Item value="session-1" status="active">
 *       <ActionList.ItemText>Current Live Session</ActionList.ItemText>
 *       <ActionList.ItemDescription>Started 5 minutes ago</ActionList.ItemDescription>
 *     </ActionList.Item>
 *   </ActionList.Group>
 * </ActionList.Root>
 * ```
 */

// Root container variants
const actionListRootVariants = cva('relative w-full', {
  variants: {
    orientation: {
      vertical: 'flex flex-col',
      horizontal: 'flex flex-row',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

// Item variants
const actionListItemVariants = cva(
  [
    'relative flex cursor-pointer select-none items-start gap-sm',
    'outline-hidden transition-colors',
    'focus:outline-hidden focus:z-10 focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-surface',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-surface text-foreground',
          'hover:brightness-[0.93] dark:hover:brightness-[1.1]',
          'aria-selected:bg-interactive-primary-muted aria-selected:text-foreground',
          'aria-disabled:pointer-events-none aria-disabled:opacity-50',
        ],
        muted: [
          'text-foreground-muted',
          'hover:text-foreground hover:bg-surface-subtle',
          'aria-selected:bg-surface-subtle aria-selected:text-foreground',
          'aria-disabled:pointer-events-none aria-disabled:opacity-50',
        ],
      },
      status: {
        active: '',
        completed: '',
        failed: '',
        pending: 'opacity-75',
      },
      density: {
        compact: 'py-xs pl-xs pr-sm text-sm min-h-size-sm',
        comfortable: 'py-sm pl-sm pr-md text-base min-h-size-md',
        spacious: 'py-md pl-md pr-base text-base min-h-size-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      density: 'comfortable',
    },
    compoundVariants: [],
  }
)

// Context for managing selection state
interface ActionListContextValue {
  value?: string | undefined
  onValueChange?: (value: string) => void
  disabled?: boolean | undefined
  orientation?: 'vertical' | 'horizontal' | undefined
  density?: 'compact' | 'comfortable' | 'spacious' | undefined
  focusedValue?: string | undefined
  setFocusedValue: (value: string) => void
  items: Map<string, HTMLElement>
  registerItem: (value: string, element: HTMLElement) => void
  unregisterItem: (value: string) => void
}

const ActionListContext = createContext<ActionListContextValue | undefined>(undefined)

const useActionListContext = () => {
  const context = useContext(ActionListContext)
  if (!context) {
    throw new Error('ActionList components must be used within ActionList.Root')
  }
  return context
}

// Root component
export interface ActionListRootProps
  extends ComponentPropsWithoutRef<'div'>, VariantProps<typeof actionListRootVariants> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  density?: 'compact' | 'comfortable' | 'spacious'
}

const ActionListRoot = forwardRef<HTMLDivElement, ActionListRootProps>(
  (
    {
      className,
      density,
      orientation = 'vertical',
      value: controlledValue,
      defaultValue,
      onValueChange,
      disabled,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
    const [focusedValue, setFocusedValue] = useState<string>()
    const items = useRef(new Map<string, HTMLElement>())
    const typeaheadRef = useRef('')
    const typeaheadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

    const value = controlledValue ?? uncontrolledValue

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (!disabled) {
          setUncontrolledValue(newValue)
          onValueChange?.(newValue)
        }
      },
      [disabled, onValueChange]
    )

    const registerItem = useCallback((itemValue: string, element: HTMLElement) => {
      items.current.set(itemValue, element)
    }, [])

    const unregisterItem = useCallback((itemValue: string) => {
      items.current.delete(itemValue)
    }, [])

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return

        const itemsArray = Array.from(items.current.entries())

        // Initialize focus if not set
        let currentFocusedValue = focusedValue
        if (!currentFocusedValue && itemsArray.length > 0) {
          currentFocusedValue = itemsArray[0]?.[0]
          if (currentFocusedValue) {
            setFocusedValue(currentFocusedValue)
          }
        }

        const currentIndex = itemsArray.findIndex(([v]) => v === currentFocusedValue)

        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight': {
            e.preventDefault()
            if (orientation === 'vertical' && e.key === 'ArrowRight') return
            if (orientation === 'horizontal' && e.key === 'ArrowDown') return

            const nextIndex = currentIndex < itemsArray.length - 1 ? currentIndex + 1 : 0
            if (itemsArray[nextIndex]) {
              setFocusedValue(itemsArray[nextIndex][0])
              itemsArray[nextIndex][1].focus()
            }
            break
          }

          case 'ArrowUp':
          case 'ArrowLeft': {
            e.preventDefault()
            if (orientation === 'vertical' && e.key === 'ArrowLeft') return
            if (orientation === 'horizontal' && e.key === 'ArrowUp') return

            const prevIndex = currentIndex > 0 ? currentIndex - 1 : itemsArray.length - 1
            if (itemsArray[prevIndex]) {
              setFocusedValue(itemsArray[prevIndex][0])
              itemsArray[prevIndex][1].focus()
            }
            break
          }

          case 'Home':
            e.preventDefault()
            if (itemsArray[0]) {
              setFocusedValue(itemsArray[0][0])
              itemsArray[0][1].focus()
            }
            break

          case 'End': {
            e.preventDefault()
            const lastItem = itemsArray[itemsArray.length - 1]
            if (lastItem) {
              setFocusedValue(lastItem[0])
              lastItem[1].focus()
            }
            break
          }

          case 'Enter':
          case ' ': {
            e.preventDefault()
            // Use the focused item from the document's active element if available
            const activeItem = document.activeElement as HTMLElement
            const activeValue = Array.from(items.current.entries()).find(
              ([, el]) => el === activeItem
            )?.[0]
            if (activeValue) {
              handleValueChange(activeValue)
            } else if (focusedValue) {
              handleValueChange(focusedValue)
            }
            break
          }

          default:
            // Type-ahead search
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
              clearTimeout(typeaheadTimeoutRef.current)

              // Reset typeahead if it's been more than 500ms since last keypress
              typeaheadRef.current = e.key.toLowerCase()

              const matchingItem = itemsArray.find(([, element]) => {
                const text = element.textContent?.toLowerCase() || ''
                return text.startsWith(typeaheadRef.current)
              })

              if (matchingItem) {
                setFocusedValue(matchingItem[0])
                matchingItem[1].focus()
              }

              typeaheadTimeoutRef.current = setTimeout(() => {
                typeaheadRef.current = ''
              }, 500)
            }
        }

        if (onKeyDown) {
          onKeyDown(e)
        }
      },
      [disabled, focusedValue, orientation, handleValueChange, onKeyDown]
    )

    useEffect(() => {
      return () => {
        clearTimeout(typeaheadTimeoutRef.current)
      }
    }, [])

    return (
      <ActionListContext.Provider
        value={{
          value: value,
          onValueChange: handleValueChange,
          disabled: disabled,
          orientation: orientation ?? undefined,
          density: density ?? undefined,
          focusedValue: focusedValue,
          setFocusedValue,
          items: items.current,
          registerItem,
          unregisterItem,
        }}
      >
        <div
          ref={ref}
          role="listbox"
          aria-orientation={orientation ?? undefined}
          aria-disabled={disabled}
          className={cn(actionListRootVariants({ orientation }), className)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </ActionListContext.Provider>
    )
  }
)

ActionListRoot.displayName = 'ActionList.Root'

// Item component
export interface ActionListItemProps
  extends
    Omit<ComponentPropsWithoutRef<'div'>, 'value'>,
    Omit<VariantProps<typeof actionListItemVariants>, 'density'> {
  value: string
  disabled?: boolean
  leftIcon?: IconName
  rightIcon?: IconName
  asChild?: boolean
  /** Show a colored left border stripe matching the status color. Active status always shows a stripe. */
  showStripe?: boolean
}

const ActionListItem = forwardRef<HTMLDivElement, ActionListItemProps>(
  (
    {
      className,
      variant,
      status,
      value: itemValue,
      disabled: itemDisabled,
      leftIcon,
      rightIcon,
      asChild,
      showStripe,
      children,
      onClick,
      onFocus,
      ...props
    },
    ref
  ) => {
    const context = useActionListContext()
    const itemRef = useRef<HTMLDivElement>(null)
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (ref) {
          if (typeof ref === 'function') ref(node)
          else ref.current = node
        }
        itemRef.current = node
      },
      [ref]
    )

    const isSelected = context.value === itemValue
    const isDisabled = itemDisabled || context.disabled
    const isFocused = context.focusedValue === itemValue

    useEffect(() => {
      if (itemRef.current) {
        context.registerItem(itemValue, itemRef.current)
      }
      return () => {
        context.unregisterItem(itemValue)
      }
    }, [itemValue, context])

    const handleClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (!isDisabled) {
          context.onValueChange?.(itemValue)
        }
        onClick?.(e)
      },
      [isDisabled, itemValue, context, onClick]
    )

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        context.setFocusedValue(itemValue)
        onFocus?.(e)
      },
      [itemValue, context, onFocus]
    )

    const Component = asChild ? Slot : 'div'
    const iconSize =
      context.density === 'compact' ? 'xs' : context.density === 'spacious' ? 'md' : 'sm'

    // Get status icon
    const statusIcon: IconName | undefined =
      status === 'active'
        ? 'pending'
        : status === 'completed'
          ? 'success'
          : status === 'failed'
            ? 'error'
            : status === 'pending'
              ? 'empty'
              : undefined

    // Determine if stripe should be shown (active always, others opt-in)
    const hasStripe = status === 'active' || (showStripe && !!status)
    const stripeColor =
      status === 'active'
        ? 'border-status-success'
        : status === 'completed'
          ? 'border-status-info'
          : status === 'failed'
            ? 'border-status-error'
            : status === 'pending'
              ? 'border-border-muted'
              : undefined

    return (
      <Component
        ref={mergedRef}
        role="option"
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        tabIndex={isFocused ? 0 : -1}
        className={cn(
          actionListItemVariants({ variant, status, density: context.density }),
          hasStripe ? `border-l-4 ${stripeColor}` : 'border-l-4 border-transparent',
          className
        )}
        onClick={handleClick}
        onFocus={handleFocus}
        {...props}
      >
        {(statusIcon || leftIcon) && (
          <Icon
            name={statusIcon || leftIcon!}
            size={iconSize}
            className={cn(
              'shrink-0 mt-[0.1875rem]',
              status === 'active' && 'text-status-success-foreground',
              status === 'completed' && 'text-status-info-foreground',
              status === 'failed' && 'text-status-error-foreground',
              status === 'pending' && 'text-foreground-muted',
              !status && 'text-foreground-muted'
            )}
          />
        )}
        <div className="flex-1 min-w-0">{children}</div>
        {isSelected && !rightIcon && (
          <Icon
            name="check"
            size={iconSize}
            className="shrink-0 mt-[0.1875rem] text-status-success-foreground ml-auto"
          />
        )}
        {rightIcon && (
          <Icon
            name={rightIcon}
            size={iconSize}
            className="shrink-0 mt-[0.1875rem] text-foreground-muted ml-auto"
          />
        )}
      </Component>
    )
  }
)

ActionListItem.displayName = 'ActionList.Item'

// ItemText component
const ActionListItemText = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('block truncate text-foreground', className)} {...props} />
  )
)

ActionListItemText.displayName = 'ActionList.ItemText'

// ItemDescription component
const ActionListItemDescription = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn('block truncate text-xs text-foreground-muted mt-2xs', className)}
      {...props}
    />
  )
)

ActionListItemDescription.displayName = 'ActionList.ItemDescription'

// Group component
const ActionListGroup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="group" className={cn(className)} {...props} />
  )
)

ActionListGroup.displayName = 'ActionList.Group'

// Label component
const ActionListLabel = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-md py-xs text-xs font-medium text-foreground-muted uppercase tracking-wider',
        className
      )}
      {...props}
    />
  )
)

ActionListLabel.displayName = 'ActionList.Label'

// Separator component
const ActionListSeparator = forwardRef<HTMLHRElement, ComponentPropsWithoutRef<'hr'>>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cn('my-sm border-none', className)} {...props} />
  )
)

ActionListSeparator.displayName = 'ActionList.Separator'

// Compound component export
export const ActionList = {
  Root: ActionListRoot,
  Item: ActionListItem,
  ItemText: ActionListItemText,
  ItemDescription: ActionListItemDescription,
  Group: ActionListGroup,
  Label: ActionListLabel,
  Separator: ActionListSeparator,
}

// Named exports for direct imports
export { actionListRootVariants, actionListItemVariants }
