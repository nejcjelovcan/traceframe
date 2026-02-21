import * as SelectPrimitive from '@radix-ui/react-select'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'

import { Badge } from './Badge.js'
import { Icon } from '../icons/index.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

/**
 * Select component built on Radix UI Primitives.
 *
 * Provides accessible dropdown selection with:
 * - WAI-ARIA listbox pattern
 * - Full keyboard navigation (Arrow keys, Enter, Escape, Type-ahead)
 * - Focus management
 * - Screen reader announcements
 * - Touch device support
 * - Enhanced variants with semantic tokens
 * - Icon support for trigger and items
 * - Loading and empty states
 *
 * @example
 * ```tsx
 * <Select.Root>
 *   <Select.Trigger variant="secondary" leftIcon="package">
 *     <Select.Value placeholder="Select a package..." />
 *   </Select.Trigger>
 *   <Select.Content>
 *     <Select.Item value="all" leftIcon="package">All packages</Select.Item>
 *     <Select.Item value="radix">@radix-ui/react</Select.Item>
 *     <Select.Item value="lodash">lodash</Select.Item>
 *   </Select.Content>
 * </Select.Root>
 * ```
 */

// Trigger variants
const selectTriggerVariants = cva(
  [
    'inline-flex items-center justify-between gap-sm rounded-md border transition-colors',
    'bg-surface text-foreground',
    'focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-surface',
    'disabled:cursor-not-allowed disabled:opacity-50',
    '[&>span]:truncate',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-border',
          'hover:border-interactive-hover',
          'focus:border-interactive-active',
        ],
        secondary: [
          'border-interactive-secondary-border',
          'hover:border-interactive-secondary-hover',
          'focus:border-interactive-active',
        ],
        error: [
          'border-status-error-border',
          'text-status-error-foreground',
          'hover:border-status-error',
          'focus:border-status-error',
        ],
        success: [
          'border-status-success-border',
          'text-status-success-foreground',
          'hover:border-status-success',
          'focus:border-status-success',
        ],
        ghost: ['border-transparent', 'hover:bg-surface-subtle', 'focus:bg-surface-subtle'],
      },
      size: {
        xs: 'h-size-xs px-sm text-xs gap-xs',
        sm: 'h-size-sm px-sm text-sm gap-xs',
        md: 'h-size-md px-md text-base gap-sm',
        lg: 'h-size-lg px-base text-lg gap-md',
      },
      density: {
        compact: 'py-2xs',
        comfortable: 'py-xs',
        spacious: 'py-sm',
      },
      width: {
        auto: 'w-auto min-w-[120px]',
        full: 'w-full',
        fit: 'w-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      width: 'auto',
    },
  }
)

// Content variants
const selectContentVariants = cva(
  [
    'relative z-50 overflow-hidden',
    'rounded-md border border-border bg-surface shadow-md',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      density: {
        compact: 'p-2xs',
        comfortable: 'p-xs',
        spacious: 'p-sm',
      },
      maxHeight: {
        sm: 'max-h-48',
        md: 'max-h-60',
        lg: 'max-h-72',
        full: 'max-h-[80vh]',
      },
    },
    defaultVariants: {
      density: 'comfortable',
      maxHeight: 'md',
    },
  }
)

// Item variants
const selectItemVariants = cva(
  [
    'relative flex cursor-default select-none items-center gap-sm',
    'rounded-xs outline-hidden transition-colors',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: ['text-foreground', 'data-[highlighted]:bg-interactive-hover'],
        muted: [
          'text-foreground-muted',
          'data-[highlighted]:text-foreground',
          'data-[highlighted]:bg-surface-subtle',
        ],
        secondary: [
          'data-[highlighted]:bg-interactive-secondary',
          'data-[highlighted]:text-interactive-secondary-foreground',
        ],
        success: ['text-status-success-foreground', 'data-[highlighted]:bg-status-success-muted'],
        warning: ['text-status-warning-foreground', 'data-[highlighted]:bg-status-warning-muted'],
        error: ['text-status-error-foreground', 'data-[highlighted]:bg-status-error-muted'],
      },
      density: {
        compact: 'py-xs px-sm text-xs',
        comfortable: 'py-sm px-md text-sm',
        spacious: 'py-sm px-base text-base',
      },
      hasIcon: {
        true: 'pl-lg',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      density: 'comfortable',
      hasIcon: false,
    },
  }
)

// Re-export Root for state management
const SelectRoot = SelectPrimitive.Root

// Re-export Value for displaying selected value
const SelectValue = SelectPrimitive.Value
SelectValue.displayName = 'Select.Value'

// Re-export Group for grouping items
const SelectGroup = SelectPrimitive.Group
SelectGroup.displayName = 'Select.Group'

// Trigger with styling
export interface SelectTriggerProps
  extends
    ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  leftIcon?: IconName
  rightIcon?: IconName
}

const SelectTrigger = forwardRef<ComponentRef<typeof SelectPrimitive.Trigger>, SelectTriggerProps>(
  ({ className, variant, size, density, width, leftIcon, rightIcon, children, ...props }, ref) => {
    const iconSize = size === 'xs' || size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(selectTriggerVariants({ variant, size, density, width, className }))}
        {...props}
      >
        {leftIcon && (
          <Icon name={leftIcon} size={iconSize} className="shrink-0 text-foreground-muted" />
        )}
        {children}
        <SelectPrimitive.Icon asChild>
          <Icon
            name={rightIcon || 'chevron-down'}
            size={iconSize}
            className="shrink-0 text-foreground-muted ml-auto"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    )
  }
)

SelectTrigger.displayName = 'Select.Trigger'

// Scroll up button for long lists
const SelectScrollUpButton = forwardRef<
  ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-xs', className)}
    {...props}
  >
    <Icon name="chevron-up" size="sm" className="text-foreground-muted" />
  </SelectPrimitive.ScrollUpButton>
))

SelectScrollUpButton.displayName = 'Select.ScrollUpButton'

// Scroll down button for long lists
const SelectScrollDownButton = forwardRef<
  ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-xs', className)}
    {...props}
  >
    <Icon name="chevron-down" size="sm" className="text-foreground-muted" />
  </SelectPrimitive.ScrollDownButton>
))

SelectScrollDownButton.displayName = 'Select.ScrollDownButton'

// Content with styling
export interface SelectContentProps
  extends
    ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
    VariantProps<typeof selectContentVariants> {
  isLoading?: boolean
  loadingText?: string
  isEmpty?: boolean
  emptyIcon?: IconName
  emptyText?: string
}

const SelectContent = forwardRef<ComponentRef<typeof SelectPrimitive.Content>, SelectContentProps>(
  (
    {
      className,
      children,
      position = 'popper',
      density,
      maxHeight,
      isLoading,
      loadingText = 'Loading...',
      isEmpty,
      emptyIcon = 'search-off',
      emptyText = 'No options available',
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          selectContentVariants({ density, maxHeight }),
          position === 'popper' &&
            'data-[side=bottom]:translate-y-xs data-[side=left]:-translate-x-xs data-[side=right]:translate-x-xs data-[side=top]:-translate-y-xs',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          {isLoading ? (
            <SelectLoading text={loadingText} />
          ) : isEmpty ? (
            <SelectEmpty icon={emptyIcon} text={emptyText} />
          ) : (
            children
          )}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
)

SelectContent.displayName = 'Select.Content'

// Label for item groups
const SelectLabel = forwardRef<
  ComponentRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-md py-sm text-xs font-medium text-foreground-muted', className)}
    {...props}
  />
))

SelectLabel.displayName = 'Select.Label'

// Item with styling
export interface SelectItemProps
  extends
    ComponentPropsWithoutRef<typeof SelectPrimitive.Item>,
    VariantProps<typeof selectItemVariants> {
  leftIcon?: IconName
  rightIcon?: IconName
  description?: string
  showIndicator?: boolean
  indicatorIcon?: IconName
  badge?: string
  badgeVariant?: ComponentPropsWithoutRef<typeof Badge>['variant']
}

const SelectItem = forwardRef<ComponentRef<typeof SelectPrimitive.Item>, SelectItemProps>(
  (
    {
      className,
      children,
      variant,
      density,
      leftIcon,
      rightIcon,
      description,
      showIndicator = true,
      indicatorIcon = 'check',
      badge,
      badgeVariant = 'default',
      ...props
    },
    ref
  ) => {
    const hasIcon = !!leftIcon || showIndicator

    return (
      <SelectPrimitive.Item
        ref={ref}
        className={cn(selectItemVariants({ variant, density, hasIcon, className }))}
        {...props}
      >
        {showIndicator && (
          <span className="absolute left-sm flex h-size-xs w-size-xs items-center justify-center">
            <SelectPrimitive.ItemIndicator>
              <Icon name={indicatorIcon} size="xs" className="text-status-success-foreground" />
            </SelectPrimitive.ItemIndicator>
          </span>
        )}
        {leftIcon && !showIndicator && (
          <Icon name={leftIcon} size="sm" className="shrink-0 text-foreground-muted" />
        )}
        <div className="flex-1 flex flex-col">
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
          {description && <SelectItemDescription>{description}</SelectItemDescription>}
        </div>
        {badge && (
          <Badge variant={badgeVariant} size="xs">
            {badge}
          </Badge>
        )}
        {rightIcon && (
          <Icon name={rightIcon} size="sm" className="shrink-0 text-foreground-muted ml-auto" />
        )}
      </SelectPrimitive.Item>
    )
  }
)

SelectItem.displayName = 'Select.Item'

// Separator for dividing items
const SelectSeparator = forwardRef<
  ComponentRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-xs my-xs h-px bg-border', className)}
    {...props}
  />
))

SelectSeparator.displayName = 'Select.Separator'

// Loading state component
interface SelectLoadingProps {
  text?: string
}

const SelectLoading = ({ text = 'Loading...' }: SelectLoadingProps) => (
  <div className="flex flex-col items-center justify-center py-lg text-foreground-muted">
    <Icon name="dots" size="lg" className="animate-pulse" />
    <span className="mt-sm text-sm">{text}</span>
  </div>
)

SelectLoading.displayName = 'Select.Loading'

// Empty state component
interface SelectEmptyProps {
  icon?: IconName
  text?: string
}

const SelectEmpty = ({ icon = 'search-off', text = 'No options available' }: SelectEmptyProps) => (
  <div className="flex flex-col items-center justify-center py-lg text-foreground-muted">
    <Icon name={icon} size="xl" className="opacity-50" />
    <span className="mt-sm text-sm">{text}</span>
  </div>
)

SelectEmpty.displayName = 'Select.Empty'

// Item description component
const SelectItemDescription = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('text-xs text-foreground-muted', className)} {...props} />
  )
)

SelectItemDescription.displayName = 'Select.ItemDescription'

// Item icon wrapper component
interface SelectItemIconProps {
  name: IconName
  className?: string
}

const SelectItemIcon = ({ name, className }: SelectItemIconProps) => (
  <Icon name={name} size="sm" className={cn('shrink-0 text-foreground-muted', className)} />
)

SelectItemIcon.displayName = 'Select.ItemIcon'

// Compound component export
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
  Loading: SelectLoading,
  Empty: SelectEmpty,
  ItemDescription: SelectItemDescription,
  ItemIcon: SelectItemIcon,
}

// Named exports for direct imports
export { selectTriggerVariants, selectContentVariants, selectItemVariants }
