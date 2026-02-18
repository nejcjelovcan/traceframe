/**
 * Generic responsive value type supporting all breakpoints
 * Can be a static value or an object with breakpoint-specific values
 */
export type ResponsiveValue<T> =
  | T
  | {
      default?: T
      sm?: T
      md?: T
      lg?: T
      xl?: T
    }

/**
 * Type guard to check if a value is a responsive object
 */
export function isResponsiveValue<T>(
  value: ResponsiveValue<T>
): value is Exclude<ResponsiveValue<T>, T> {
  return typeof value === 'object' && value !== null
}
