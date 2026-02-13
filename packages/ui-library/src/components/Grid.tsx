import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes } from 'react'

import { cn } from '../utils/cn.js'

const gridVariants = cva('grid', {
  variants: {
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
  },
  defaultVariants: {
    gap: 'base',
  },
})

type ColCount = 1 | 2 | 3 | 4 | 5 | 6

type ResponsiveCols = {
  sm?: ColCount
  md?: ColCount
  lg?: ColCount
  xl?: ColCount
}

type ColsValue = ColCount | ResponsiveCols

// Static lookup maps ensure Tailwind's JIT compiler can detect all class names.
// Dynamic template literals like `grid-cols-${n}` are invisible to the content scanner.
const colsClassMap: Record<ColCount, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}

const responsiveColsClassMap: Record<keyof ResponsiveCols, Record<ColCount, string>> = {
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
  },
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
  },
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  },
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
  },
}

function isResponsiveCols(cols: ColsValue): cols is ResponsiveCols {
  return typeof cols === 'object'
}

function getColsClasses(cols: ColsValue | undefined): string {
  if (cols === undefined) {
    return 'grid-cols-1'
  }

  if (!isResponsiveCols(cols)) {
    return colsClassMap[cols]
  }

  const classes: string[] = ['grid-cols-1']
  if (cols.sm) classes.push(responsiveColsClassMap.sm[cols.sm])
  if (cols.md) classes.push(responsiveColsClassMap.md[cols.md])
  if (cols.lg) classes.push(responsiveColsClassMap.lg[cols.lg])
  if (cols.xl) classes.push(responsiveColsClassMap.xl[cols.xl])
  return classes.join(' ')
}

export interface GridProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof gridVariants> {
  cols?: ColsValue
  rows?: number
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, rows, style, ...props }, ref) => {
    const colsClasses = getColsClasses(cols)
    const rowsStyle = rows ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` } : undefined

    return (
      <div
        className={cn(gridVariants({ gap }), colsClasses, className)}
        ref={ref}
        style={rowsStyle ? { ...rowsStyle, ...style } : style}
        {...props}
      />
    )
  }
)

Grid.displayName = 'Grid'

export { gridVariants }
export type { ColsValue, ResponsiveCols, ColCount }
