import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'

import { Card, CardContent, type CardProps } from './Card.js'
import { Icon } from '../icons/index.js'
import { cn } from '../utils/cn.js'

import type { IconName } from '../icons/types.js'

const statCardValueVariants = cva('font-semibold', {
  variants: {
    size: {
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const statCardLabelVariants = cva('text-foreground-muted', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const statCardVariants = cva('', {
  variants: {
    loading: {
      true: 'animate-pulse',
    },
    compact: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    compact: false,
  },
})

const statCardContentVariants = cva('', {
  variants: {
    compact: {
      true: 'px-md py-sm',
      false: 'px-base py-base',
    },
  },
  defaultVariants: {
    compact: false,
  },
})

function getTrendInfo(
  trend: string,
  trendVariant: 'positive' | 'negative' | 'neutral' | 'auto' = 'auto'
): {
  color: string
  icon: 'chevron-up' | 'chevron-down' | null
  ariaLabel: string
} {
  // Manual control
  if (trendVariant !== 'auto') {
    if (trendVariant === 'positive') {
      return {
        color: 'text-status-success-foreground',
        icon: 'chevron-up',
        ariaLabel: trend.startsWith('+') ? `increased by ${trend.slice(1)}` : `increased ${trend}`,
      }
    }
    if (trendVariant === 'negative') {
      return {
        color: 'text-status-error-foreground',
        icon: 'chevron-down',
        ariaLabel: trend.startsWith('-') ? `decreased by ${trend.slice(1)}` : `decreased ${trend}`,
      }
    }
    return {
      color: 'text-foreground-muted',
      icon: null,
      ariaLabel: trend,
    }
  }

  // Auto detection based on prefix
  if (trend.startsWith('+')) {
    return {
      color: 'text-status-success-foreground',
      icon: 'chevron-up',
      ariaLabel: `increased by ${trend.slice(1)}`,
    }
  }
  if (trend.startsWith('-')) {
    return {
      color: 'text-status-error-foreground',
      icon: 'chevron-down',
      ariaLabel: `decreased by ${trend.slice(1)}`,
    }
  }
  return {
    color: 'text-foreground-muted',
    icon: null,
    ariaLabel: trend,
  }
}

export interface StatCardProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
    Pick<CardProps, 'variant'>,
    VariantProps<typeof statCardValueVariants>,
    VariantProps<typeof statCardVariants> {
  /** Primary label for the statistic */
  label: string
  /** The main statistic value */
  value: number | string
  /** Optional trend indicator (e.g., "+12%", "-5", "stable") */
  trend?: string
  /** Manual control for trend color/icon */
  trendVariant?: 'positive' | 'negative' | 'neutral' | 'auto'
  /** Type-safe icon name from ui-library */
  icon?: IconName
  /** Custom icon element when IconName doesn't suffice */
  customIcon?: ReactNode
  /** Icon position relative to value */
  iconPosition?: 'left' | 'right'
  /** Show arrow icons for trends */
  showTrendIcon?: boolean
  /** Optional secondary label below main label */
  subtitle?: string
  /** Optional longer description below value */
  description?: string
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      compact,
      label,
      subtitle,
      value,
      description,
      trend,
      trendVariant = 'auto',
      icon,
      customIcon,
      iconPosition = 'left',
      showTrendIcon = true,
      ...props
    },
    ref
  ) => {
    const trendInfo = trend ? getTrendInfo(trend, trendVariant) : null
    const iconSize = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'
    const iconElement =
      customIcon || (icon && <Icon name={icon} size={iconSize} aria-hidden="true" />)

    return (
      <Card
        variant={variant}
        className={cn(statCardVariants({ loading, compact }), className)}
        ref={ref}
        {...props}
      >
        <CardContent className={statCardContentVariants({ compact })}>
          {loading ? (
            <>
              <div className="h-size-xs w-20 bg-surface-muted rounded animate-pulse" />
              {!compact && (
                <div className="mt-xs h-3 w-size-xl bg-surface-muted rounded animate-pulse" />
              )}
              <div className="mt-sm h-size-sm w-32 bg-surface-muted rounded animate-pulse" />
            </>
          ) : (
            <>
              <div>
                <p className={statCardLabelVariants({ size })}>{label}</p>
                {subtitle && (
                  <p className={cn('text-xs text-foreground-muted mt-2xs', compact && 'hidden')}>
                    {subtitle}
                  </p>
                )}
              </div>
              <div className="mt-xs flex items-center gap-sm">
                {iconElement && iconPosition === 'left' && (
                  <span className="text-foreground-muted">{iconElement}</span>
                )}
                <span className={statCardValueVariants({ size })}>{value}</span>
                {iconElement && iconPosition === 'right' && (
                  <span className="text-foreground-muted">{iconElement}</span>
                )}
                {trend && trendInfo && (
                  <span
                    className={cn('flex items-center gap-2xs text-sm', trendInfo.color)}
                    aria-label={trendInfo.ariaLabel}
                  >
                    {showTrendIcon && trendInfo.icon && (
                      <Icon name={trendInfo.icon} size="xs" aria-hidden="true" />
                    )}
                    {trend}
                  </span>
                )}
              </div>
              {description && (
                <p className={cn('text-xs text-foreground-muted mt-sm', compact && 'hidden')}>
                  {description}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }
)

StatCard.displayName = 'StatCard'
