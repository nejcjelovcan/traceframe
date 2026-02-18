import type { ResponsiveValue } from '../types/responsive.js'
import { isResponsiveValue } from '../types/responsive.js'

/**
 * Breakpoint keys in order of priority (mobile-first)
 */
const BREAKPOINTS = ['default', 'sm', 'md', 'lg', 'xl'] as const

/**
 * Generate responsive Tailwind classes from responsive values
 *
 * @param value - The responsive value to process
 * @param classMap - Mapping of breakpoint -> value -> class name
 * @param defaultValue - Default value to use when no breakpoint is specified
 * @returns Array of Tailwind classes for responsive behavior
 */
export function generateResponsiveClasses<T extends string | number | boolean>(
  value: ResponsiveValue<T> | undefined,
  classMap: Record<string, Record<string, string>>,
  defaultValue?: T
): string[] {
  if (value === undefined) {
    if (defaultValue !== undefined && classMap.default) {
      const defaultClass = classMap.default[String(defaultValue)]
      if (defaultClass) {
        return [defaultClass]
      }
    }
    return []
  }

  // Handle static values
  if (!isResponsiveValue(value)) {
    const staticClass = classMap.default?.[String(value)]
    return staticClass ? [staticClass] : []
  }

  // Handle responsive values
  const classes: string[] = []

  // Process each breakpoint
  for (const breakpoint of BREAKPOINTS) {
    const breakpointValue = value[breakpoint as keyof typeof value]
    if (breakpointValue !== undefined && classMap[breakpoint]) {
      const className = classMap[breakpoint][String(breakpointValue)]
      if (className) {
        classes.push(className)
      }
    }
  }

  // If no default was specified but we have breakpoint values, add the default if provided
  if (!value.default && defaultValue !== undefined && classMap.default) {
    const defaultClass = classMap.default[String(defaultValue)]
    if (defaultClass) {
      classes.unshift(defaultClass)
    }
  }

  return classes
}
