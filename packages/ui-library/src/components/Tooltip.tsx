import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react'

import { cn } from '../utils/cn.js'

/**
 * Tooltip component built on Radix UI Primitives.
 *
 * Provides accessible tooltips with:
 * - Automatic collision detection and repositioning
 * - WAI-ARIA compliant accessibility
 * - Keyboard support (Escape to dismiss)
 * - Touch device handling
 * - Configurable delay and animations
 *
 * @example
 * ```tsx
 * <Tooltip.Provider>
 *   <Tooltip.Root>
 *     <Tooltip.Trigger asChild>
 *       <Button>Hover me</Button>
 *     </Tooltip.Trigger>
 *     <Tooltip.Content>Tooltip text</Tooltip.Content>
 *   </Tooltip.Root>
 * </Tooltip.Provider>
 * ```
 */

const tooltipContentVariants = cva(
  [
    'z-50 overflow-hidden rounded-sm shadow-md',
    'animate-in fade-in-0 zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      variant: {
        default: 'bg-tooltip text-tooltip-foreground',
        light: 'border border-border bg-surface text-foreground',
        info: 'bg-status-info text-foreground-filled',
        success: 'bg-status-success text-foreground-filled',
        warning: 'bg-status-warning text-foreground-filled',
        error: 'bg-status-error text-foreground-filled',
      },
      size: {
        sm: 'px-xs py-2xs text-xs',
        md: 'px-sm py-xs text-xs',
        lg: 'px-md py-sm text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Re-export Provider for global delay configuration
export const TooltipProvider = TooltipPrimitive.Provider
TooltipProvider.displayName = 'Tooltip.Provider'

// Re-export Root for state management
export const Tooltip = TooltipPrimitive.Root

// Re-export Trigger
export const TooltipTrigger = TooltipPrimitive.Trigger
TooltipTrigger.displayName = 'Tooltip.Trigger'

// Content with styling
export interface TooltipContentProps
  extends
    ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {
  /** Whether to show an arrow pointing to the trigger */
  showArrow?: boolean
}

export const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, size, sideOffset = 4, showArrow = true, children, ...props }, ref) => {
  // Determine arrow color based on variant
  const getArrowColor = () => {
    switch (variant) {
      case 'light':
        return 'text-surface'
      case 'info':
        return 'text-status-info'
      case 'success':
        return 'text-status-success'
      case 'warning':
        return 'text-status-warning'
      case 'error':
        return 'text-status-error'
      default:
        return 'text-tooltip'
    }
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(tooltipContentVariants({ variant, size, className }))}
        {...props}
      >
        {children}
        {showArrow && <TooltipPrimitive.Arrow className={cn('fill-current', getArrowColor())} />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})

TooltipContent.displayName = 'Tooltip.Content'

// Named exports for direct imports
export { tooltipContentVariants }
export type { TooltipContentProps as TooltipProps }
