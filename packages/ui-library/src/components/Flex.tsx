import { cva } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { isResponsiveValue } from '../types/responsive.js'
import { cn } from '../utils/cn.js'
import { generateResponsiveClasses } from '../utils/responsive.js'

import type { ResponsiveValue } from '../types/responsive.js'

const flexVariants = cva('flex', {
  variants: {
    direction: {
      col: 'flex-col',
      row: 'flex-row',
    },
    gap: {
      none: 'gap-0',
      '2xs': 'gap-2xs',
      xs: 'gap-xs',
      sm: 'gap-sm',
      md: 'gap-md',
      base: 'gap-base',
      lg: 'gap-lg',
      xl: 'gap-xl',
      '2xl': 'gap-2xl',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: '',
    },
  },
  defaultVariants: {
    direction: 'col',
    gap: 'sm',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
})

// Extract variant types for responsive props
type DirectionValue = 'col' | 'row'
type GapValue = 'none' | '2xs' | 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl'
type AlignValue = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type JustifyValue = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
type WrapValue = boolean

// Static lookup maps for responsive classes
const directionClassMap: Record<string, Record<string, string>> = {
  default: {
    col: 'flex-col',
    row: 'flex-row',
  },
  sm: {
    col: 'sm:flex-col',
    row: 'sm:flex-row',
  },
  md: {
    col: 'md:flex-col',
    row: 'md:flex-row',
  },
  lg: {
    col: 'lg:flex-col',
    row: 'lg:flex-row',
  },
  xl: {
    col: 'xl:flex-col',
    row: 'xl:flex-row',
  },
}

const gapClassMap: Record<string, Record<string, string>> = {
  default: {
    none: 'gap-0',
    '2xs': 'gap-2xs',
    xs: 'gap-xs',
    sm: 'gap-sm',
    md: 'gap-md',
    base: 'gap-base',
    lg: 'gap-lg',
    xl: 'gap-xl',
    '2xl': 'gap-2xl',
  },
  sm: {
    none: 'sm:gap-0',
    '2xs': 'sm:gap-2xs',
    xs: 'sm:gap-xs',
    sm: 'sm:gap-sm',
    md: 'sm:gap-md',
    base: 'sm:gap-base',
    lg: 'sm:gap-lg',
    xl: 'sm:gap-xl',
    '2xl': 'sm:gap-2xl',
  },
  md: {
    none: 'md:gap-0',
    '2xs': 'md:gap-2xs',
    xs: 'md:gap-xs',
    sm: 'md:gap-sm',
    md: 'md:gap-md',
    base: 'md:gap-base',
    lg: 'md:gap-lg',
    xl: 'md:gap-xl',
    '2xl': 'md:gap-2xl',
  },
  lg: {
    none: 'lg:gap-0',
    '2xs': 'lg:gap-2xs',
    xs: 'lg:gap-xs',
    sm: 'lg:gap-sm',
    md: 'lg:gap-md',
    base: 'lg:gap-base',
    lg: 'lg:gap-lg',
    xl: 'lg:gap-xl',
    '2xl': 'lg:gap-2xl',
  },
  xl: {
    none: 'xl:gap-0',
    '2xs': 'xl:gap-2xs',
    xs: 'xl:gap-xs',
    sm: 'xl:gap-sm',
    md: 'xl:gap-md',
    base: 'xl:gap-base',
    lg: 'xl:gap-lg',
    xl: 'xl:gap-xl',
    '2xl': 'xl:gap-2xl',
  },
}

const alignClassMap: Record<string, Record<string, string>> = {
  default: {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  },
  sm: {
    start: 'sm:items-start',
    center: 'sm:items-center',
    end: 'sm:items-end',
    stretch: 'sm:items-stretch',
    baseline: 'sm:items-baseline',
  },
  md: {
    start: 'md:items-start',
    center: 'md:items-center',
    end: 'md:items-end',
    stretch: 'md:items-stretch',
    baseline: 'md:items-baseline',
  },
  lg: {
    start: 'lg:items-start',
    center: 'lg:items-center',
    end: 'lg:items-end',
    stretch: 'lg:items-stretch',
    baseline: 'lg:items-baseline',
  },
  xl: {
    start: 'xl:items-start',
    center: 'xl:items-center',
    end: 'xl:items-end',
    stretch: 'xl:items-stretch',
    baseline: 'xl:items-baseline',
  },
}

const justifyClassMap: Record<string, Record<string, string>> = {
  default: {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  },
  sm: {
    start: 'sm:justify-start',
    center: 'sm:justify-center',
    end: 'sm:justify-end',
    between: 'sm:justify-between',
    around: 'sm:justify-around',
    evenly: 'sm:justify-evenly',
  },
  md: {
    start: 'md:justify-start',
    center: 'md:justify-center',
    end: 'md:justify-end',
    between: 'md:justify-between',
    around: 'md:justify-around',
    evenly: 'md:justify-evenly',
  },
  lg: {
    start: 'lg:justify-start',
    center: 'lg:justify-center',
    end: 'lg:justify-end',
    between: 'lg:justify-between',
    around: 'lg:justify-around',
    evenly: 'lg:justify-evenly',
  },
  xl: {
    start: 'xl:justify-start',
    center: 'xl:justify-center',
    end: 'xl:justify-end',
    between: 'xl:justify-between',
    around: 'xl:justify-around',
    evenly: 'xl:justify-evenly',
  },
}

const wrapClassMap: Record<string, Record<string, string>> = {
  default: {
    true: 'flex-wrap',
    false: 'flex-nowrap',
  },
  sm: {
    true: 'sm:flex-wrap',
    false: 'sm:flex-nowrap',
  },
  md: {
    true: 'md:flex-wrap',
    false: 'md:flex-nowrap',
  },
  lg: {
    true: 'lg:flex-wrap',
    false: 'lg:flex-nowrap',
  },
  xl: {
    true: 'xl:flex-wrap',
    false: 'xl:flex-nowrap',
  },
}

function getResponsiveClasses(
  direction?: ResponsiveValue<DirectionValue>,
  gap?: ResponsiveValue<GapValue>,
  align?: ResponsiveValue<AlignValue>,
  justify?: ResponsiveValue<JustifyValue>,
  wrap?: ResponsiveValue<WrapValue>
): string {
  const classes: string[] = []

  // Handle direction
  if (direction !== undefined) {
    if (isResponsiveValue(direction)) {
      classes.push(...generateResponsiveClasses(direction, directionClassMap))
    } else {
      // For static values, use CVA defaults
      classes.push(...generateResponsiveClasses(direction, directionClassMap, 'col'))
    }
  }

  // Handle gap
  if (gap !== undefined) {
    if (isResponsiveValue(gap)) {
      classes.push(...generateResponsiveClasses(gap, gapClassMap))
    } else {
      classes.push(...generateResponsiveClasses(gap, gapClassMap, 'sm'))
    }
  }

  // Handle align
  if (align !== undefined) {
    if (isResponsiveValue(align)) {
      classes.push(...generateResponsiveClasses(align, alignClassMap))
    } else {
      classes.push(...generateResponsiveClasses(align, alignClassMap, 'stretch'))
    }
  }

  // Handle justify
  if (justify !== undefined) {
    if (isResponsiveValue(justify)) {
      classes.push(...generateResponsiveClasses(justify, justifyClassMap))
    } else {
      classes.push(...generateResponsiveClasses(justify, justifyClassMap, 'start'))
    }
  }

  // Handle wrap
  if (wrap !== undefined) {
    if (isResponsiveValue(wrap)) {
      classes.push(...generateResponsiveClasses(wrap, wrapClassMap))
    } else {
      classes.push(...generateResponsiveClasses(wrap, wrapClassMap, false))
    }
  }

  return classes.join(' ')
}

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: ResponsiveValue<DirectionValue>
  gap?: ResponsiveValue<GapValue>
  align?: ResponsiveValue<AlignValue>
  justify?: ResponsiveValue<JustifyValue>
  wrap?: ResponsiveValue<WrapValue>
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, gap, align, justify, wrap, ...props }, ref) => {
    // Check if any responsive props are used
    const hasResponsiveProps =
      (direction !== undefined && isResponsiveValue(direction)) ||
      (gap !== undefined && isResponsiveValue(gap)) ||
      (align !== undefined && isResponsiveValue(align)) ||
      (justify !== undefined && isResponsiveValue(justify)) ||
      (wrap !== undefined && isResponsiveValue(wrap))

    if (hasResponsiveProps) {
      // Use responsive class generation
      const responsiveClasses = getResponsiveClasses(direction, gap, align, justify, wrap)
      return <div className={cn('flex', responsiveClasses, className)} ref={ref} {...props} />
    }

    // Fall back to CVA for static props
    return (
      <div
        className={cn(
          flexVariants({
            direction: !isResponsiveValue(direction) ? direction : undefined,
            gap: !isResponsiveValue(gap) ? gap : undefined,
            align: !isResponsiveValue(align) ? align : undefined,
            justify: !isResponsiveValue(justify) ? justify : undefined,
            wrap: !isResponsiveValue(wrap) ? wrap : undefined,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Flex.displayName = 'Flex'

export { flexVariants }
export type { DirectionValue, GapValue, AlignValue, JustifyValue, WrapValue }
