import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

import { Icon, type IconName, type IconSize } from '../icons/index.js'
import { cn } from '../utils/cn.js'

/**
 * ToggleGroup component built on Radix UI Primitives.
 *
 * Provides accessible toggle button groups with:
 * - Single or multiple selection modes
 * - Multiple visual variants (default, solid, ghost, tabs)
 * - Keyboard navigation (arrow keys, roving tabindex)
 * - WAI-ARIA compliant accessibility
 * - Vertical and horizontal orientations
 * - Icon support via standardized IconName type
 *
 * @example
 * ```tsx
 * // Single selection (default)
 * <ToggleGroup
 *   options={[
 *     { value: 'all', label: 'All', icon: 'components' },
 *     { value: 'external', label: 'External', icon: 'external' },
 *   ]}
 *   value={filter}
 *   onChange={setFilter}
 *   aria-label="Filter items"
 * />
 *
 * // Multiple selection
 * <ToggleGroup
 *   type="multiple"
 *   options={options}
 *   value={selectedValues}
 *   onChange={setSelectedValues}
 *   aria-label="Select options"
 * />
 * ```
 */

const toggleGroupVariants = cva('inline-flex', {
  variants: {
    variant: {
      default: 'gap-0',
      solid: 'gap-0',
      ghost: 'gap-xs',
      tabs: 'gap-0 border-b border-border',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    orientation: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
    orientation: 'horizontal',
  },
})

const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: cn(
          'border border-border bg-surface text-foreground',
          'hover:bg-surface-subtle',
          'data-[state=on]:bg-interactive-primary data-[state=on]:text-foreground-inverse data-[state=on]:border-interactive-primary',
          'data-[state=on]:hover:bg-interactive-primary-hover'
        ),
        solid: cn(
          'bg-surface-muted text-foreground',
          'hover:bg-surface-subtle',
          'data-[state=on]:bg-interactive-primary data-[state=on]:text-foreground-inverse',
          'data-[state=on]:hover:bg-interactive-primary-hover'
        ),
        ghost: cn(
          'bg-transparent text-foreground',
          'hover:bg-surface-subtle',
          'data-[state=on]:bg-surface-subtle data-[state=on]:text-foreground'
        ),
        tabs: cn(
          'bg-transparent text-foreground-muted border-b-2 border-transparent rounded-none',
          'hover:text-foreground',
          'data-[state=on]:text-foreground data-[state=on]:border-interactive-primary'
        ),
      },
      size: {
        sm: 'h-size-sm px-md text-xs',
        md: 'h-size-md px-base text-sm',
        lg: 'h-size-lg px-lg text-base',
      },
      orientation: {
        horizontal: '',
        vertical: 'w-full justify-start',
      },
      attached: {
        true: '',
        false: '',
      },
      indicator: {
        background: '',
        underline: '',
        dot: '',
      },
    },
    compoundVariants: [
      // Attached styling for default and solid variants (horizontal)
      {
        variant: ['default', 'solid'],
        orientation: 'horizontal',
        attached: true,
        className: '-ml-px first:ml-0 rounded-none first:rounded-l last:rounded-r',
      },
      // Attached styling for default and solid variants (vertical)
      {
        variant: ['default', 'solid'],
        orientation: 'vertical',
        attached: true,
        className: '-mt-px first:mt-0 rounded-none first:rounded-t last:rounded-b',
      },
      // Ghost variant rounded corners
      {
        variant: 'ghost',
        className: 'rounded-sm',
      },
      // Tab variant removes most padding
      {
        variant: 'tabs',
        size: 'sm',
        className: 'px-sm pb-sm',
      },
      {
        variant: 'tabs',
        size: 'md',
        className: 'px-md pb-md',
      },
      {
        variant: 'tabs',
        size: 'lg',
        className: 'px-base pb-base',
      },
      // Underline indicator
      {
        indicator: 'underline',
        className:
          'data-[state=on]:shadow-inset-underline data-[state=on]:shadow-interactive-primary',
      },
      // Dot indicator
      {
        indicator: 'dot',
        className:
          'relative data-[state=on]:after:absolute data-[state=on]:after:bottom-1 data-[state=on]:after:left-1/2 data-[state=on]:after:-translate-x-1/2 data-[state=on]:after:h-1 data-[state=on]:after:w-1 data-[state=on]:after:rounded-full data-[state=on]:after:bg-interactive-primary',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'sm',
      orientation: 'horizontal',
      attached: true,
      indicator: 'background',
    },
  }
)

/** Map button size to icon size for toggle items */
const TOGGLE_SIZE_TO_ICON_SIZE: Record<'sm' | 'md' | 'lg', IconSize> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
}

export interface ToggleGroupOption<T extends string> {
  value: T
  label: string
  /** Optional icon name to display instead of or alongside label */
  icon?: IconName
  /** Disable this specific option */
  disabled?: boolean
}

// Single selection props
interface SingleToggleGroupProps<T extends string>
  extends
    VariantProps<typeof toggleGroupVariants>,
    Omit<VariantProps<typeof toggleGroupItemVariants>, 'orientation' | 'attached'> {
  /** Selection mode */
  type?: 'single'
  /** Currently selected value */
  value: T | undefined
  /** Called when selection changes */
  onChange: (value: T | undefined) => void
}

// Multiple selection props
interface MultipleToggleGroupProps<T extends string>
  extends
    VariantProps<typeof toggleGroupVariants>,
    Omit<VariantProps<typeof toggleGroupItemVariants>, 'orientation' | 'attached'> {
  /** Selection mode */
  type: 'multiple'
  /** Currently selected values */
  value: T[]
  /** Called when selection changes */
  onChange: (value: T[]) => void
}

// Common props
interface CommonToggleGroupProps<T extends string> {
  /** Available options */
  options: readonly ToggleGroupOption<T>[]
  /** Accessible label for the group */
  'aria-label': string
  /** Additional className for the container */
  className?: string
  /** Whether the toggle group is disabled */
  disabled?: boolean
  /** Display mode: 'text' shows labels, 'icon' shows only icons (if present) */
  displayMode?: 'text' | 'icon'
  /** Enable keyboard navigation looping */
  loop?: boolean
  /** Enable roving focus for keyboard navigation */
  rovingFocus?: boolean
}

export type ToggleGroupProps<T extends string> = CommonToggleGroupProps<T> &
  (SingleToggleGroupProps<T> | MultipleToggleGroupProps<T>)

// Component implementation with proper type discrimination
function ToggleGroupInner<T extends string>(
  props: ToggleGroupProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    options,
    'aria-label': ariaLabel,
    variant = 'default',
    size = 'sm',
    orientation = 'horizontal',
    indicator = 'background',
    className,
    disabled = false,
    displayMode = 'text',
    loop = false,
    rovingFocus = true,
    type = 'single',
    value,
    onChange,
  } = props

  const iconSize = TOGGLE_SIZE_TO_ICON_SIZE[size ?? 'sm']
  const isAttached = variant === 'default' || variant === 'solid'

  // Type-safe value change handlers
  const handleValueChange =
    type === 'single'
      ? (newValue: string) => {
          // For single selection, allow deselection by passing undefined
          if (newValue) {
            ;(onChange as (value: T) => void)(newValue as T)
          } else {
            ;(onChange as (value: T | undefined) => void)(undefined)
          }
        }
      : (newValue: string[]) => {
          ;(onChange as (value: T[]) => void)(newValue as T[])
        }

  if (type === 'multiple') {
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="multiple"
        value={value as string[]}
        onValueChange={handleValueChange as (value: string[]) => void}
        className={cn(toggleGroupVariants({ variant, size, orientation, className }))}
        aria-label={ariaLabel}
        disabled={disabled}
        orientation={orientation ?? 'horizontal'}
        loop={loop}
        rovingFocus={rovingFocus}
      >
        {options.map((option) => {
          const isIconOnly = displayMode === 'icon' && option.icon

          return (
            <ToggleGroupPrimitive.Item
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                toggleGroupItemVariants({
                  variant,
                  size,
                  orientation,
                  attached: isAttached,
                  indicator,
                }),
                isIconOnly && 'px-sm'
              )}
              title={isIconOnly ? option.label : undefined}
            >
              {isIconOnly && option.icon ? (
                <>
                  <span className="sr-only">{option.label}</span>
                  <Icon name={option.icon} size={iconSize} />
                </>
              ) : (
                <>
                  {option.icon && <Icon name={option.icon} size={iconSize} />}
                  {option.label}
                </>
              )}
            </ToggleGroupPrimitive.Item>
          )
        })}
      </ToggleGroupPrimitive.Root>
    )
  }

  // Single selection mode
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      type="single"
      value={(value as string) || ''}
      onValueChange={handleValueChange as (value: string) => void}
      className={cn(toggleGroupVariants({ variant, size, orientation, className }))}
      aria-label={ariaLabel}
      disabled={disabled}
      orientation={orientation ?? 'horizontal'}
      loop={loop}
      rovingFocus={rovingFocus}
    >
      {options.map((option) => {
        const isIconOnly = displayMode === 'icon' && option.icon

        return (
          <ToggleGroupPrimitive.Item
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={cn(
              toggleGroupItemVariants({
                variant,
                size,
                orientation,
                attached: isAttached,
                indicator,
              }),
              isIconOnly && 'px-sm'
            )}
            title={isIconOnly ? option.label : undefined}
          >
            {isIconOnly && option.icon ? (
              <>
                <span className="sr-only">{option.label}</span>
                <Icon name={option.icon} size={iconSize} />
              </>
            ) : (
              <>
                {option.icon && <Icon name={option.icon} size={iconSize} />}
                {option.label}
              </>
            )}
          </ToggleGroupPrimitive.Item>
        )
      })}
    </ToggleGroupPrimitive.Root>
  )
}

// Export with forwardRef and display name
export const ToggleGroup = forwardRef(ToggleGroupInner) as <T extends string>(
  props: ToggleGroupProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement
// Set display name for debugging
Object.defineProperty(ToggleGroup, 'displayName', {
  value: 'ToggleGroup',
  writable: false,
  enumerable: false,
  configurable: true,
})

export { toggleGroupVariants, toggleGroupItemVariants }
