import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '../utils/cn.js'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

type HeadingSize = NonNullable<VariantProps<typeof headingVariants>['size']>

const LEVEL_SIZE_MAP: Record<HeadingLevel, HeadingSize> = {
  1: '2xl',
  2: 'xl',
  3: 'lg',
  4: 'base',
  5: 'sm',
  6: 'xs',
}

const headingVariants = cva('', {
  variants: {
    size: {
      '4xl': 'text-4xl font-bold',
      '3xl': 'text-3xl font-bold',
      '2xl': 'text-2xl font-bold',
      xl: 'text-xl font-semibold',
      lg: 'text-lg font-semibold',
      base: 'text-base font-medium',
      sm: 'text-sm font-medium',
      xs: 'text-xs font-medium',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-foreground-muted',
    },
    tracking: {
      normal: 'tracking-normal',
      tight: 'tracking-tight',
    },
  },
  defaultVariants: {
    color: 'default',
    tracking: 'normal',
  },
})

export interface HeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>, VariantProps<typeof headingVariants> {
  /** Semantic heading level (1-6), determines which HTML element is rendered */
  level: HeadingLevel
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, size, color, tracking, ...props }, ref) => {
    const Tag = `h${level}` as const
    const resolvedSize = size ?? LEVEL_SIZE_MAP[level]

    return (
      <Tag
        className={cn(headingVariants({ size: resolvedSize, color, tracking, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Heading.displayName = 'Heading'

export { headingVariants }
