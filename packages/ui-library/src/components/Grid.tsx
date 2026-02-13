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

function isResponsiveCols(cols: ColsValue): cols is ResponsiveCols {
  return typeof cols === 'object'
}

function getColsClasses(cols: ColsValue | undefined): string {
  if (cols === undefined) {
    return 'grid-cols-1'
  }

  if (!isResponsiveCols(cols)) {
    return `grid-cols-${cols}`
  }

  const classes: string[] = ['grid-cols-1']
  if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`)
  if (cols.md) classes.push(`md:grid-cols-${cols.md}`)
  if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`)
  if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`)
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
