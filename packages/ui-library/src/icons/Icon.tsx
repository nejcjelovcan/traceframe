import { forwardRef, type SVGAttributes } from 'react'

import { ICON_REGISTRY } from './icons.js'
import { LIGHT_STROKE_SIZES, SIZE_MAP, type IconName, type IconSize } from './types.js'
import { cn } from '../utils/cn.js'

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'stroke'> {
  /** Icon name from the registry */
  name: IconName
  /** Size preset or custom pixel value */
  size?: IconSize | number
  /** Stroke width (default: 2, or 1.5 for xl/2xl sizes) */
  stroke?: number
  /** Accessibility label - when provided, removes aria-hidden */
  'aria-label'?: string
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', stroke, className, 'aria-label': ariaLabel, ...props }, ref) => {
    const IconComponent = ICON_REGISTRY[name]

    // Resolve size to pixels
    const sizeValue = typeof size === 'number' ? size : SIZE_MAP[size]

    // Determine stroke width: explicit prop > size-based default
    const resolvedSize = typeof size === 'string' ? size : 'md'
    const strokeValue = stroke ?? (LIGHT_STROKE_SIZES.includes(resolvedSize as IconSize) ? 1.5 : 2)

    // When aria-label is provided, icon is meaningful; otherwise it's decorative
    const isDecorative = !ariaLabel

    return (
      <IconComponent
        ref={ref}
        size={sizeValue}
        stroke={strokeValue}
        className={cn(className)}
        aria-hidden={isDecorative}
        aria-label={ariaLabel}
        role={isDecorative ? undefined : 'img'}
        data-testid="icon"
        {...props}
      />
    )
  }
)

Icon.displayName = 'Icon'
