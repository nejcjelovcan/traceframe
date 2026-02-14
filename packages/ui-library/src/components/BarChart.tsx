import { cva, type VariantProps } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip.js'
import { cn } from '../utils/cn.js'

export interface BarChartDataItem {
  label: string
  value: number
}

export interface SemanticThresholds {
  /** Values at or below this show warning color */
  warning: number
  /** Values at or below this show error color */
  error: number
}

const barChartVariants = cva('w-full', {
  variants: {
    orientation: {
      horizontal: 'flex flex-col gap-sm',
      vertical: 'flex items-end gap-sm h-48',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export interface BarChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, VariantProps<typeof barChartVariants> {
  /** Data items to display as bars */
  data: BarChartDataItem[]

  /** Color scheme for bars
   * - 'default': Uses 5 distinct accent colors (accent-1 through accent-5)
   * - 'semantic': Uses success/warning/error based on thresholds
   */
  colorScheme?: 'default' | 'semantic'

  /** Thresholds for semantic coloring (required if colorScheme='semantic') */
  thresholds?: SemanticThresholds

  /** Maximum number of bars to display */
  maxBars?: number

  /** Whether to show value labels next to bars (default: false, shown in tooltip) */
  showValues?: boolean

  /** Custom value formatter for tooltips */
  formatValue?: (value: number) => string

  /** Click handler for bar interaction */
  onBarClick?: (item: BarChartDataItem) => void

  /** Accessible label for the chart */
  ariaLabel?: string
}

/** Default colors: 5 distinct accent semantic tokens */
const defaultColors = ['bg-accent-1', 'bg-accent-2', 'bg-accent-3', 'bg-accent-4', 'bg-accent-5']

function getDefaultColor(index: number): string {
  return defaultColors[index % defaultColors.length] ?? 'bg-accent-1'
}

function getSemanticColor(value: number, thresholds: SemanticThresholds): string {
  if (value <= thresholds.error) return 'bg-status-error'
  if (value <= thresholds.warning) return 'bg-status-warning'
  return 'bg-status-success'
}

function defaultFormatValue(value: number): string {
  return String(value)
}

export function BarChart({
  data,
  orientation = 'horizontal',
  colorScheme = 'default',
  thresholds,
  maxBars,
  showValues = false,
  formatValue = defaultFormatValue,
  onBarClick,
  ariaLabel,
  className,
  ...props
}: BarChartProps) {
  const displayData = maxBars ? data.slice(0, maxBars) : data

  if (displayData.length === 0) {
    return (
      <div
        className={cn(barChartVariants({ orientation, className }))}
        role="figure"
        aria-label={ariaLabel ?? 'Empty chart'}
        {...props}
      >
        <span className="text-sm text-foreground-muted">No data available</span>
      </div>
    )
  }

  const maxValue = Math.max(...displayData.map((d) => d.value))

  function getBarColor(item: BarChartDataItem, index: number): string {
    if (colorScheme === 'semantic' && thresholds) {
      return getSemanticColor(item.value, thresholds)
    }
    return getDefaultColor(index)
  }

  function getPercentage(value: number): number {
    if (maxValue === 0) return 0
    return (value / maxValue) * 100
  }

  const isHorizontal = orientation === 'horizontal'

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(barChartVariants({ orientation, className }))}
        role="figure"
        aria-label={ariaLabel ?? 'Bar chart'}
        {...props}
      >
        {displayData.map((item, index) => (
          <Tooltip key={item.label}>
            {isHorizontal ? (
              <div className="flex items-center gap-md">
                <span className="w-24 shrink-0 truncate text-sm text-foreground">{item.label}</span>
                <div className="relative h-size-xs flex-1 rounded-sm bg-surface-subtle">
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'absolute inset-y-0 left-0 rounded-sm transition-all duration-200',
                        getBarColor(item, index),
                        onBarClick && 'cursor-pointer hover:opacity-80',
                        !onBarClick && 'cursor-default'
                      )}
                      style={{ width: `${getPercentage(item.value)}%` }}
                      onClick={() => onBarClick?.(item)}
                      tabIndex={0}
                      aria-label={`${item.label}: ${formatValue(item.value)}`}
                    />
                  </TooltipTrigger>
                  {showValues && (
                    <span className="absolute right-sm top-1/2 -translate-y-1/2 text-xs text-foreground-muted">
                      {formatValue(item.value)}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-1 flex-col items-center gap-sm">
                <div className="relative h-full w-full rounded-sm bg-surface-subtle">
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'absolute inset-x-0 bottom-0 rounded-sm transition-all duration-200',
                        getBarColor(item, index),
                        onBarClick && 'cursor-pointer hover:opacity-80',
                        !onBarClick && 'cursor-default'
                      )}
                      style={{ height: `${getPercentage(item.value)}%` }}
                      onClick={() => onBarClick?.(item)}
                      tabIndex={0}
                      aria-label={`${item.label}: ${formatValue(item.value)}`}
                    />
                  </TooltipTrigger>
                </div>
                <span className="truncate text-xs text-foreground">{item.label}</span>
                {showValues && (
                  <span className="text-xs text-foreground-muted">{formatValue(item.value)}</span>
                )}
              </div>
            )}
            <TooltipContent>
              <strong>{item.label}</strong>: {formatValue(item.value)}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Screen reader accessible data table */}
      <table className="sr-only">
        <caption>{ariaLabel ?? 'Bar chart data'}</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((item) => (
            <tr key={item.label}>
              <td>{item.label}</td>
              <td>{formatValue(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TooltipProvider>
  )
}

BarChart.displayName = 'BarChart'

export { barChartVariants }
